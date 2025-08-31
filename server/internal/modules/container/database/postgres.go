package database

import (
	"fmt"
	"syscall"
	"time"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container/config"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container/logger"
	_ "github.com/jackc/pgx/v5/stdlib" // Import the pgx driver
	"github.com/jmoiron/sqlx"
)

const driverName = "pgx"

type Postgres struct {
	Db     *sqlx.DB
	logger logger.Logger
}

func NewPostgres(config *config.Config, logger logger.Logger) *Postgres {
	newPostgres := &Postgres{
		logger: logger,
	}

	logger.Info("Postgres config: %v", "config", config.Postgres)
	dbURL := newPostgres.GetConnectionString(config)

	sqlx, _ := newPostgres.connect(dbURL)
	newPostgres.Db = sqlx
	return newPostgres
}

/*
DB url ex. "user=postgres password=postgres dbname=postgres sslmode=disable"
*/
func (p *Postgres) connect(dbUrl string) (*sqlx.DB, error) {
	dbx, err := sqlx.Open(
		driverName,
		dbUrl,
	)

	if err != nil {
		p.logger.Error("Failed to connect to database: %v", "error", err)
		syscall.Kill(syscall.Getpid(), syscall.SIGINT)
		return nil, err
	}

	// Note: this block uses time.Sleep, make sure to add "time" to the imports.
	maxRetries := 3
	backoff := 15 * time.Second

	for attempt := 1; attempt <= maxRetries; attempt++ {
		err = dbx.Ping()
		if err == nil {
			p.logger.Info("Connected to database")
			return dbx, nil
		}

		p.logger.Error("Failed to ping database (attempt %d/%d): %v", "attempt", attempt, "max", maxRetries, "error", err)

		if attempt < maxRetries {
			time.Sleep(backoff)
			backoff *= 2
			continue
		}

		// final failure: kill the server
		p.logger.Fatal("Failed to ping database after %d attempts: %v", "attempts", maxRetries, "error", err)
		syscall.Kill(syscall.Getpid(), syscall.SIGINT)
		return nil, err
	}

	return nil, err
}

func (p *Postgres) Close() *sqlx.DB {
	err := p.Db.Close()
	if err != nil {
		p.logger.Error("Failed to close database connection: %v", "error", err)
	}
	p.logger.Info("Database connection closed")
	return p.Db
}

func (p *Postgres) GetConnectionString(config *config.Config) string {
	dbURL := fmt.Sprintf(
		"postgres://%s:%s@%s:%d/%s?sslmode=disable",
		config.Postgres.User,
		config.Postgres.Password,
		config.Postgres.Host,
		config.Postgres.Port,
		config.Postgres.DBName,
	)
	return dbURL
}

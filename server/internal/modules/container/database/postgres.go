package database

import (
	"fmt"

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
		return nil, err
	}

	err = dbx.Ping()

	if err != nil {
		p.logger.Fatal("Failed to ping database: %v", "error", err)
		return nil, err
	}

	/* defer func(db *sqlx.DB) {
		err := db.Close()
		if err != nil {
			p.logger.Error("Failed to close database connection: %v", "error", err)
		}
		p.logger.Info("Database connection closed")
	}(dbx) */

	fmt.Println("Connected to database")

	return dbx, nil
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

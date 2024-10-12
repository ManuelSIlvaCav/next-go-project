package database

import (
	"context"
	"fmt"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container/config"
	_ "github.com/jackc/pgx/stdlib"
	"github.com/jmoiron/sqlx"
)

const driverName = "pgx"

type Postgres struct {
	Db *sqlx.DB
}

func NewPostgres(config *config.Config) *Postgres {
	newPostgres := &Postgres{}

	fmt.Printf("Postgres config: %v", config.Postgres)
	dbURL := newPostgres.GetConnectionString(config)

	sqlx, _ := newPostgres.connect(context.Background(), dbURL)
	newPostgres.Db = sqlx
	return newPostgres
}

/* DB url ex. "user=postgres password=postgres dbname=postgres sslmode=disable" */
func (p *Postgres) connect(ctx context.Context, dbUrl string) (*sqlx.DB, error) {
	dbx, err := sqlx.ConnectContext(
		ctx,
		driverName,
		dbUrl,
	)

	fmt.Printf("Connecting to database: %s", dbUrl)

	if err != nil {
		fmt.Printf("Failed to connect to database: %v", err)
		return nil, err
	}

	fmt.Println("Connected to database")

	return dbx, nil
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

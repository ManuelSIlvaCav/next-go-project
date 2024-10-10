package container

import (
	"server/internal/container/config"
	"server/internal/container/database"
	"server/internal/container/logger"

	"github.com/jmoiron/sqlx"
)

type Container struct {
	logger logger.Logger
	config *config.Config
	db     *database.Postgres
}

func NewContainer() *Container {
	config := config.NewConfig()
	logger := logger.NewLogger()

	pg := database.NewPostgres(config)

	return &Container{
		logger: logger,
		config: config,
		db:     pg,
	}
}

func (c *Container) Logger() logger.Logger {
	return c.logger
}

func (c *Container) Config() *config.Config {
	return c.config
}

func (c *Container) DB() *sqlx.DB {
	return c.db.Db
}

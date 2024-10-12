package container

import (
	"fmt"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container/config"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container/database"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container/logger"
	"github.com/hibiken/asynq"
)

type Container struct {
	logger    logger.Logger
	config    *config.Config
	db        *database.Postgres
	jobClient *asynq.Client
}

func NewContainer() *Container {
	config := config.NewConfig()
	logger := logger.NewLogger()

	pg := database.NewPostgres(config)

	jobClient := asynq.NewClient(asynq.RedisClientOpt{
		Addr: fmt.Sprintf("%s:%d", config.Redis.Host, config.Redis.Port),
		//Username: config.Redis.Username,
		Password: config.Redis.Password,
	})

	return &Container{
		logger:    logger,
		config:    config,
		db:        pg,
		jobClient: jobClient,
	}
}

func (c *Container) Logger() logger.Logger {
	return c.logger
}

func (c *Container) Config() *config.Config {
	return c.config
}

func (c *Container) DB() *database.Postgres {
	return c.db
}

func (c *Container) JobClient() *asynq.Client {
	return c.jobClient
}

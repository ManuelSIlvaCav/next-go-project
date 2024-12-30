package container

import (
	"fmt"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container/aws_utils"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container/config"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container/database"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container/logger"
	"github.com/hibiken/asynq"
	"go.uber.org/fx"
)

type Container struct {
	logger    logger.Logger
	config    *config.Config
	db        *database.Postgres
	awsConfig *aws_utils.AwsUtils
	jobClient *asynq.Client
}

func NewContainer() *Container {
	config := config.NewConfig()
	logger := logger.NewLogger()

	pg := database.NewPostgres(config, logger)
	awsConfig := aws_utils.NewAwsUtils(config, logger)

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
		awsConfig: awsConfig,
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

func (c *Container) AwsConfig() *aws_utils.AwsUtils {
	return c.awsConfig
}

var Module = fx.Options(fx.Provide(NewContainer))

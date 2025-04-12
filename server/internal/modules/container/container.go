package container

import (
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container/aws_utils"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container/config"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container/database"
	jobtasker "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container/job_tasker"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container/logger"
	"github.com/hibiken/asynq"
	"go.uber.org/fx"
)

type Container struct {
	logger    logger.Logger
	config    *config.Config
	db        *database.Postgres
	awsConfig *aws_utils.AwsUtils
	jobtasker *jobtasker.JobTasker
}

func NewContainer() *Container {
	config := config.NewConfig()
	logger := logger.NewLogger()

	pg := database.NewPostgres(config, logger)
	awsConfig := aws_utils.NewAwsUtils(config, logger)

	jobTasker := jobtasker.NewJobTasker(config.Redis.Host, config.Redis.Port, config.Redis.Password)

	return &Container{
		logger:    logger,
		config:    config,
		db:        pg,
		awsConfig: awsConfig,
		jobtasker: jobTasker,
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

func (c *Container) JobTasker() *jobtasker.JobTasker {
	return c.jobtasker
}

func (c *Container) EnqueueTask(task *asynq.Task) error {
	client := c.jobtasker.JobClient()

	info, err := client.Enqueue(task)
	if err != nil {
		c.logger.Error("could not enqueue task", "error", err)
		return err
	}
	c.logger.Info("Task enqueued", "taskId", info.ID, "type", info.Type, "queue", info.Queue)
	return nil
}

func (c *Container) AwsConfig() *aws_utils.AwsUtils {
	return c.awsConfig
}

var Module = fx.Options(fx.Provide(NewContainer))

package aws_utils

import (
	"context"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container/config"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container/logger"
	"github.com/aws/aws-sdk-go-v2/aws"
	awsConfig "github.com/aws/aws-sdk-go-v2/config"
)

type AwsUtils struct {
	Config aws.Config
}

func NewAwsUtils(config *config.Config, logger logger.Logger) *AwsUtils {
	cfg, err := awsConfig.LoadDefaultConfig(
		context.TODO(),
	)
	logger.Info("Loading AWS SDK config", "config", cfg.Credentials)
	if err != nil {
		logger.Error("unable to load SDK config, %v", err)
		return nil
	}
	return &AwsUtils{
		Config: cfg,
	}
}

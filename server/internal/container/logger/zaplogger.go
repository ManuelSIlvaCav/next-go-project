package logger

import "go.uber.org/zap"

func NewZap() *zap.SugaredLogger {
	logger, _ := zap.NewProduction()
	defer logger.Sync()

	sugar := logger.Sugar()

	sugar.Infof("Zap logger is ready")

	return sugar
}

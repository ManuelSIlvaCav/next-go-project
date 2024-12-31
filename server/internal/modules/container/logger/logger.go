package logger

import "go.uber.org/zap"

type Logger interface {
	Info(msg string, data ...interface{})
	Warn(msg string, data ...interface{})
	Error(msg string, data ...interface{})
	Fatal(msg string, data ...interface{})
}

type logger struct {
	Zap *zap.SugaredLogger
}

func NewLogger() Logger {
	zap := NewZap()

	return &logger{
		Zap: zap,
	}
}

// Info implements Logger.
func (log *logger) Info(msg string, data ...interface{}) {
	log.Zap.Infow(msg, append([]interface{}{}, data...)...)
}

// Warn implements Logger.
func (log *logger) Warn(msg string, data ...interface{}) {
	log.Zap.Warnw(msg, append([]interface{}{}, data...)...)
}

// Error implements Logger.
func (log *logger) Error(msg string, data ...interface{}) {
	log.Zap.Errorw(msg, append([]interface{}{}, data...)...)
}

// Fatal implements Logger.
func (log *logger) Fatal(msg string, data ...interface{}) {
	log.Zap.Fatalw(msg, append([]interface{}{}, data...)...)
}

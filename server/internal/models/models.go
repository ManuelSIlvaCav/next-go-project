package internal_models

import (
	"github.com/hibiken/asynq"
	"github.com/labstack/echo/v4"
)

type Route struct {
	Method        string
	Handler       echo.HandlerFunc
	Path          string
	Description   string
	Authenticated bool
}

type Task struct {
	Pattern string
	Handler asynq.Handler
}

type ScheduledJob struct {
	Key        string
	Handler    asynq.Handler
	Type       string // Type of scheduled Job (recurrent, one-time)
	Expression string // Cron expression <minute> <hour> <day> <month> <weekday>
}

type IModule interface {
	GetDomain() string
	GetHandlers() []Route
	GetTasks() []Task
	GetScheduledJobs() []ScheduledJob
}

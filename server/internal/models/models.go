package internal_models

import (
	"errors"
	"fmt"

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

const (
	AdminNotFound    = 3001
	MagicLinkExpired = 3002
)

var ErrorCodesMessage = map[int]string{
	3001: "Admin not found",
	3002: "Login code has expired",
}

type HandlerError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	error
}

func NewErrorWithCode(code int) *HandlerError {
	message := ErrorCodesMessage[code]
	return &HandlerError{
		Code:    code,
		Message: message,
		error:   errors.New(fmt.Sprintf("%d: %s", code, message)),
	}

}

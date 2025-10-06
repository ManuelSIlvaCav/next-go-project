package internal_models

import (
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
	AdminNotFoundError      = 3001
	MagicLinkExpiredError   = 3002
	InvalidCredentialsError = 3003
	PolicyFormatError       = 4000
	UserNotFoundError       = 5001
	UserAlreadyExistsError  = 5002
	UserCreationError       = 5003
	BusinessForeignKeyError = 6001
	BusinessCreateError     = 6002
	ErrSellerAlreadyExists  = 7001
	ErrSellerNotFound       = 7002
	ErrPetCreation          = 8001
)

var ErrorCodesMessage = map[int]string{
	3001: "Admin not found",
	3002: "Login code has expired",
	3003: "Invalid credentials",
	4000: "Invalid policy format",
	5001: "User not found",
	5002: "User already exists",
	5003: "Error creating user",
	6001: "Business not found",
	6002: "Error creating business",
	7001: "Seller already exists with the provided email",
	7002: "Seller not found",
}

type HandlerError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Err     error  `json:"-"`
}

func (he *HandlerError) Error() string {
	return fmt.Sprintf("ErrorCode: %d, Message: %s", he.Code, he.Message)
}

func (he *HandlerError) Unwrap() error {
	return he.Err
}

func NewErrorWithCode(code int) *HandlerError {
	message := ErrorCodesMessage[code]
	return &HandlerError{
		Code:    code,
		Message: message,
		Err:     fmt.Errorf("%d: %s", code, message),
	}

}

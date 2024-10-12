package internal_models

import "github.com/labstack/echo/v4"

type Route struct {
	Method        string
	Handler       echo.HandlerFunc
	Path          string
	Description   string
	Authenticated bool
}

type IModule interface {
	GetDomain() string
	GetHandlers() []Route
}

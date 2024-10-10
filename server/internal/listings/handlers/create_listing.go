package listings

import (
	"server/internal/container"

	"github.com/labstack/echo/v4"
)

func CreateListing(container *container.Container) echo.HandlerFunc {
	return func(c echo.Context) error {
		return c.String(200, "Hello, World!")
	}
}

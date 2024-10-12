package listings

import (
	"fmt"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	listings "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/listings/models"
	"github.com/labstack/echo/v4"
)

func CreateListing(container *container.Container) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		logger.Info(
			"Create listing handler", "path", c.Path(), "method",
			c.Request().Method)

		listing := listings.Listing{
			Title:       "Listing",
			Description: "Description",
			Price:       5990,
			PriceUnit:   "CLP",
			Address:     "Address",
			UserID:      123,
		}

		if err := c.Bind(&listing); err != nil {
			logger.Error("Failed to bind listing", "error", err)
			return c.String(400, "Failed to bind listing")
		}

		if _, err := container.DB().Db.NamedExecContext(
			c.Request().Context(),
			"INSERT INTO listings (title, description, price, price_unit, user_id ) VALUES (:title, :description, :price, :price_unit, :user_id)",
			listing,
		); err != nil {
			logger.Error("Failed to insert listing", "error", err)
			return c.String(500, fmt.Sprintf("Failed to insert listing: %s", err))
		}

		logger.Info("Listing created", "listing", listing)

		return c.String(200, "Hello, World!")
	}
}

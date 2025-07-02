package listings_handlers

import (
	"net/http"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	listings_repositories "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/listings/repositories"
	listing_services "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/listings/services"
	"github.com/labstack/echo/v4"
)

func CreateListing(
	container *container.Container,
	listingService listing_services.ListingServiceInterface) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		logger.Info(
			"Create listing handler", "path", c.Path(), "method",
			c.Request().Method)

		params := listings_repositories.CreateListingParams{}

		if err := c.Bind(&params); err != nil {
			logger.Error("Failed to bind create listing", "error", err)
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Bad Request - Invalid parameters"})
		}

		listing, err := listingService.CreateListing(c.Request().Context(), &params)

		if err != nil {
			logger.Error("Failed to create listing", "error", err)
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Internal Server Error"})
		}

		logger.Info("Listing created", "listing", "listing")

		return c.JSON(http.StatusCreated, echo.Map{"data": listing})
	}
}

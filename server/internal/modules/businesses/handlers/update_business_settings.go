package businesses_handlers

import (
	"net/http"

	businesses_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/businesses/models"
	businesses "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/businesses/repositories"
	businesses_services "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/businesses/services"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/labstack/echo/v4"
)

func UpdateBusinessSettingsHandler(container *container.Container,
	businessRepository *businesses.BusinessRepository,
	domainService *businesses_services.DomainService) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		logger.Info("Update business settings handler")

		params := businesses_models.UpdateBusinessSettingsParams{}

		if err := c.Bind(&params); err != nil {
			logger.Error("Failed to bind create business user", "error", err)
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Bad Request - Invalid parameters"})
		}

		/* TODO */
		/* Add domain into the database for the business */

		res, err := domainService.AddDomainToVercel(params.Subdomain)

		if err != nil {
			logger.Error("Failed to add domain to vercel", "error", err)
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Internal Server Error"})
		}

		logger.Info("Domain added to vercel", "response", res)

		return c.JSON(http.StatusCreated, echo.Map{
			"message": "Business users created",
			"data":    nil},
		)

	}
}

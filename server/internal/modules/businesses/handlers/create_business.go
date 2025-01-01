package businesses_handlers

import (
	"net/http"

	businesses_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/businesses/models"
	businesses "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/businesses/repositories"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/labstack/echo/v4"
)

func CreateBusinessHandler(container *container.Container, businessRepository *businesses.BusinessRepository) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		params := businesses_models.CreateBusinessParams{}

		if err := c.Bind(&params); err != nil {
			logger.Error("Failed to bind create business params", "error", err)
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Bad Request - Invalid parameters"})
		}

		newBusiness, err := businessRepository.CreateBusiness(c.Request().Context(), &params)

		if err != nil {
			logger.Error("Failed to create business", "error", err)
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Internal Server Error"})
		}

		return c.JSON(http.StatusCreated, echo.Map{"message": "Business created", "data": newBusiness})

	}
}

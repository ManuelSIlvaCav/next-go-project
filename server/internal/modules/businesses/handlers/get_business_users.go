package businesses_handlers

import (
	"net/http"

	businesses_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/businesses/models"
	businesses_repositories "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/businesses/repositories"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/labstack/echo/v4"
)

func GetBusinessUsersHandler(container *container.Container, businessRepository *businesses_repositories.BusinessRepository) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		params := businesses_models.GetBusinessUsersParams{}

		if err := c.Bind(&params); err != nil {
			logger.Error("Failed to bind get business users params", "error", err)
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Bad Request - Invalid parameters"})
		}

		businessUsers, err := businessRepository.GetBusinessUsers(c.Request().Context(), &params)

		if err != nil {
			logger.Error("Failed to get business users", "error", err)
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Internal Server Error"})
		}

		return c.JSON(http.StatusOK, echo.Map{"message": "Business users retrieved", "data": businessUsers})

	}
}

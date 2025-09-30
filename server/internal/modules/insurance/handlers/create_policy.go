package insurance_handlers

import (
	"net/http"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	insurance_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/insurance/models"
	insurance_repository "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/insurance/repositories"
	"github.com/labstack/echo/v4"
)

func CreatePolicyHandler(container *container.Container, policyRepository *insurance_repository.PolicyRepository) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		params := insurance_models.PolicyCreateParams{}

		if err := c.Bind(&params); err != nil {
			logger.Error("Failed to bind create policy", "error", err)
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Bad Request - Invalid parameters"})
		}

		policy, err := policyRepository.CreatePolicy(c.Request().Context(), &params)

		if err != nil {
			return c.JSON(http.StatusBadRequest, echo.Map{
				"code":  err.Code,
				"error": err.Message,
			})
		}

		return c.JSON(http.StatusCreated, echo.Map{"message": "Policy created", "data": policy})

	}
}

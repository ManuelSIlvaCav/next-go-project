package insurance_handlers

import (
	"net/http"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	insurance_repository "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/insurance/repositories"
	"github.com/labstack/echo/v4"
)

func GetPoliciesHandler(container *container.Container, policyRepository *insurance_repository.PolicyRepository) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		policies, err := policyRepository.GetPolicies(c.Request().Context())

		if err != nil {
			logger.Error("Failed to get policies", "error", err)
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Internal Server Error"})
		}

		return c.JSON(http.StatusOK, echo.Map{"message": "Policies retrieved successfully", "data": policies})
	}
}

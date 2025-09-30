package insurance_handlers

import (
	"net/http"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	insurance_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/insurance/models"
	insurance_repository "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/insurance/repositories"
	"github.com/labstack/echo/v4"
)

func CreatePolicyVariantHandler(container *container.Container, policyRepository *insurance_repository.PolicyRepository) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		params := insurance_models.PolicyVariantCreateParams{}

		if err := c.Bind(&params); err != nil {
			logger.Error("Failed to bind create policy variant", "error", err)
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Bad Request - Invalid parameters"})
		}

		policyVariant, err := policyRepository.CreatePolicyVariant(c.Request().Context(), &params)

		if err != nil {
			logger.Error("Failed to create policy variant", "error", err)
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Internal Server Error"})
		}

		return c.JSON(http.StatusCreated, echo.Map{"message": "Policy variant created", "data": policyVariant})

	}
}

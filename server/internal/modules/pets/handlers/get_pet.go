package pets_handlers

import (
	"net/http"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	pets_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/pets/models"
	pets_services "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/pets/services"
	"github.com/labstack/echo/v4"
)

func GetPetHandler(container *container.Container, petService *pets_services.PetService) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		petID := c.Param("id")
		if petID == "" {
			logger.Error("Pet ID parameter is missing")
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Pet ID is required"})
		}

		// Extract business ID from the context (set by auth middleware)
		businessID := c.Get("business_id")
		if businessID == nil {
			logger.Error("Business ID not found in context")
			return c.JSON(http.StatusUnauthorized, echo.Map{"error": "Unauthorized - Missing business context"})
		}

		params := &pets_models.GetPetParams{
			ID:         petID,
			BusinessID: businessID.(int),
		}

		pet, err := petService.GetPet(c.Request().Context(), params)
		if err != nil {
			logger.Error("Failed to get pet", "error", err, "petID", petID)
			return c.JSON(http.StatusNotFound, echo.Map{"error": "Pet not found"})
		}

		return c.JSON(http.StatusOK, echo.Map{"data": pet})
	}
}

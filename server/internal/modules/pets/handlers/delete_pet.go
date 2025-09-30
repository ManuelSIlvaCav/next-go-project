package pets_handlers

import (
	"net/http"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	pets_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/pets/models"
	pets_services "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/pets/services"
	"github.com/labstack/echo/v4"
)

func DeletePetHandler(container *container.Container, petService *pets_services.PetService) echo.HandlerFunc {
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

		// Ensure the pet belongs to the business (ownership validation)
		isOwner, err := petService.ValidatePetOwnership(c.Request().Context(), petID, businessID.(int))
		if err != nil || !isOwner {
			logger.Error("Pet ownership validation failed", "error", err, "petID", petID, "businessID", businessID)
			return c.JSON(http.StatusNotFound, echo.Map{"error": "Pet not found"})
		}

		params := &pets_models.DeletePetParams{
			ID:         petID,
			BusinessID: businessID.(int),
		}

		handlerErr := petService.DeletePet(c.Request().Context(), params)
		if handlerErr != nil {
			logger.Error("Failed to delete pet", "error", handlerErr)
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": handlerErr.Error()})
		}

		return c.JSON(http.StatusOK, echo.Map{"message": "Pet deleted successfully"})
	}
}

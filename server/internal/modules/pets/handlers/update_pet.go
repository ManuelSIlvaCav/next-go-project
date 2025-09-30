package pets_handlers

import (
	"net/http"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	pets_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/pets/models"
	pets_services "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/pets/services"
	"github.com/labstack/echo/v4"
)

func UpdatePetHandler(container *container.Container, petService *pets_services.PetService) echo.HandlerFunc {
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

		params := pets_models.UpdatePetParams{
			ID: petID,
		}

		if err := c.Bind(&params); err != nil {
			logger.Error("Failed to bind update pet params", "error", err)
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Bad Request - Invalid parameters"})
		}

		// Ensure the pet belongs to the business (ownership validation)
		isOwner, err := petService.ValidatePetOwnership(c.Request().Context(), petID, businessID.(int))
		if err != nil || !isOwner {
			logger.Error("Pet ownership validation failed", "error", err, "petID", petID, "businessID", businessID)
			return c.JSON(http.StatusNotFound, echo.Map{"error": "Pet not found"})
		}

		updatedPet, handlerErr := petService.UpdatePet(c.Request().Context(), &params)
		if handlerErr != nil {
			logger.Error("Failed to update pet", "error", handlerErr)
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": handlerErr.Message, "code": handlerErr.Code})
		}

		return c.JSON(http.StatusOK, echo.Map{"message": "Pet updated successfully", "data": updatedPet})
	}
}

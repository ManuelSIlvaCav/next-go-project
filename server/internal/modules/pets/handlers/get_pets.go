package pets_handlers

import (
	"net/http"
	"strconv"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	pets_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/pets/models"
	pets_services "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/pets/services"
	"github.com/labstack/echo/v4"
)

func GetPetsHandler(container *container.Container, petService *pets_services.PetService) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		// Parse business_id parameter
		businessIDStr := c.QueryParam("business_id")
		var businessID int
		if businessIDStr != "" {
			var err error
			businessID, err = strconv.Atoi(businessIDStr)
			if err != nil {
				logger.Error("Invalid business_id parameter", "error", err, "business_id", businessIDStr)
				return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid business_id parameter"})
			}
		}

		params := &pets_models.GetPetsParams{
			BusinessID: businessID,
			ClientID:   c.QueryParam("client_id"),
			PetType:    c.QueryParam("pet_type"),
			Cursor:     c.QueryParam("cursor"),
		}

		// Parse limit parameter
		limitStr := c.QueryParam("limit")
		if limitStr != "" {
			limit, err := strconv.Atoi(limitStr)
			if err != nil {
				logger.Error("Invalid limit parameter", "error", err, "limit", limitStr)
				return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid limit parameter"})
			}
			params.Limit = limit
		}

		pets, err := petService.GetPets(c.Request().Context(), params)
		if err != nil {
			logger.Error("Failed to get pets", "error", err, "params", params)
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to retrieve pets"})
		}

		return c.JSON(http.StatusOK, echo.Map{"data": pets, "count": len(pets)})
	}
}

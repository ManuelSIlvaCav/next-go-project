package pets_handlers

import (
	"net/http"

	auth_jwt "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/jwt"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	pets_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/pets/models"
	pets_services "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/pets/services"
	"github.com/labstack/echo/v4"
)

func CreatePetHandler(container *container.Container, petService *pets_services.PetService) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		params := pets_models.CreatePetParams{}

		if err := c.Bind(&params); err != nil {
			logger.Error("Failed to bind create pet params", "error", err)
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Bad Request - Invalid parameters"})
		}

		claims := auth_jwt.GetJWTData(c)
		logger.Info("Creating pet", "params", params, "claims", claims)

		params.BusinessID = int(claims.BusinessID)
		params.ClientID = claims.ClientID

		newPet, err := petService.CreatePet(c.Request().Context(), &params)
		if err != nil {
			logger.Error("Failed to create pet", "error", err)
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Message, "code": err.Code})
		}

		return c.JSON(http.StatusCreated, echo.Map{"message": "Pet created successfully", "data": newPet})
	}
}

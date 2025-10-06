package pets_handlers

import (
	"errors"
	"net/http"

	internal_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/models"
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

		if params.ClientID == "" {
			logger.Error("Client ID is required to create a pet")
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Client ID is required to create a pet"})
		}

		newPet, err := petService.CreatePet(c.Request().Context(), &params)

		if err != nil {
			logger.Error("Failed to create pet", "error", err)
			var handlerErr *internal_models.HandlerError
			if ok := errors.As(err, &handlerErr); ok {
				if handlerErr.Code == internal_models.ErrPetCreation {
					return c.JSON(http.StatusBadRequest, echo.Map{"error": handlerErr.Message, "code": handlerErr.Code})
				}
				return c.JSON(http.StatusInternalServerError, echo.Map{"error": handlerErr.Message, "code": handlerErr.Code})
			}
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error(), "code": 5000})
		}

		return c.JSON(http.StatusCreated, echo.Map{"message": "Pet created successfully", "data": newPet})
	}
}

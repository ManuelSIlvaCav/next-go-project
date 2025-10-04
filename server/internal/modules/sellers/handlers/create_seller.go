package sellers_handlers

import (
	"errors"
	"net/http"

	internal_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/models"
	auth_jwt "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/jwt"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	sellers_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/sellers/models"
	sellers_services "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/sellers/services"
	"github.com/labstack/echo/v4"
)

func CreateSellerHandler(container *container.Container, sellerService *sellers_services.SellerService) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		params := sellers_models.CreateSellerParams{}

		if err := c.Bind(&params); err != nil {
			logger.Error("Failed to bind create seller params", "error", err)
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Bad Request - Invalid parameters"})
		}

		// Validate params
		if err := params.Validate(); err != nil {
			logger.Error("Validation failed for create seller params", "error", err)
			return c.JSON(http.StatusBadRequest, echo.Map{"error": err.Error()})
		}

		newSeller, err := sellerService.CreateSeller(c.Request().Context(), &params)
		if err != nil {
			logger.Error("Failed to create seller", "error", err)
			var handlerErr *internal_models.HandlerError
			if errors.As(err, &handlerErr) {
				if handlerErr.Code == internal_models.ErrSellerAlreadyExists {
					return c.JSON(http.StatusConflict, echo.Map{"error": err.Error(), "code": handlerErr.Code})
				}
				return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error(), "code": handlerErr.Code})
			}
		}

		// Create JWT token for the seller
		jwtResponse, jwtErr := auth_jwt.CreateSellerJWTResponse(auth_jwt.CreateSellerJWTResponseParams{
			SellerID:   newSeller.ID,
			BusinessID: newSeller.BusinessID,
			Email:      newSeller.Email,
			Name:       newSeller.Name,
			FirstName:  newSeller.FirstName,
			LastName:   newSeller.LastName,
		})

		if jwtErr != nil {
			logger.Error("Error creating JWT token", "error", jwtErr)
			return c.JSON(http.StatusInternalServerError, echo.Map{
				"error": "Seller created but could not generate access token",
			})
		}

		return c.JSON(http.StatusCreated, jwtResponse)
	}
}

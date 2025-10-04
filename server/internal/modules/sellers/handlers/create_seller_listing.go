package sellers_handlers

import (
	"net/http"

	auth_jwt "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/jwt"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	sellers_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/sellers/models"
	sellers_services "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/sellers/services"
	"github.com/labstack/echo/v4"
)

func CreateSellerListingHandler(
	container *container.Container,
	sellerListingService *sellers_services.SellerListingService,
) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		params := sellers_models.CreateSellerListingParams{}

		if err := c.Bind(&params); err != nil {
			logger.Error("Failed to bind create seller listing params", "error", err)
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Bad Request - Invalid parameters"})
		}

		// Validate params
		if err := params.Validate(); err != nil {
			logger.Error("Validation failed for create seller listing params", "error", err)
			return c.JSON(http.StatusBadRequest, echo.Map{"error": err.Error()})
		}

		// Validate each price
		for i, price := range params.Prices {
			if err := price.Validate(); err != nil {
				logger.Error("Validation failed for price", "error", err, "index", i)
				return c.JSON(http.StatusBadRequest, echo.Map{"error": err.Error()})
			}
		}

		// Get seller ID from JWT claims
		claims := auth_jwt.GetJWTData(c)
		if claims.SellerID == "" {
			logger.Error("Seller ID not found in JWT claims")
			return c.JSON(http.StatusUnauthorized, echo.Map{"error": "Unauthorized - Not a seller"})
		}

		params.SellerID = claims.SellerID

		logger.Info("Creating seller listing", "params", params, "seller_id", params.SellerID)

		newListing, err := sellerListingService.CreateSellerListing(c.Request().Context(), &params)
		if err != nil {
			logger.Error("Failed to create seller listing", "error", err)
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
		}

		return c.JSON(http.StatusCreated, echo.Map{"message": "Seller listing created successfully", "data": newListing})
	}
}

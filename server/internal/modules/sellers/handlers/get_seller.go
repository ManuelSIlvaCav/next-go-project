package sellers_handlers

import (
	"net/http"

	auth_jwt "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/jwt"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	sellers_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/sellers/models"
	sellers_services "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/sellers/services"
	"github.com/labstack/echo/v4"
)

func GetSellerHandler(container *container.Container, sellerService *sellers_services.SellerService) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		sellerID := c.Param("id")
		if sellerID == "" {
			logger.Error("Seller ID parameter is missing")
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Seller ID is required"})
		}

		// Get business ID from JWT claims
		claims := auth_jwt.GetJWTData(c)

		params := &sellers_models.GetSellerParams{
			ID:         sellerID,
			BusinessID: claims.BusinessID,
		}

		seller, err := sellerService.GetSeller(c.Request().Context(), params)
		if err != nil {
			logger.Error("Failed to get seller", "error", err, "sellerID", sellerID)
			return c.JSON(http.StatusNotFound, echo.Map{"error": "Seller not found"})
		}

		return c.JSON(http.StatusOK, echo.Map{"data": seller})
	}
}

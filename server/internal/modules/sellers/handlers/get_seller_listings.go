package sellers_handlers

import (
	"net/http"
	"strconv"

	auth_jwt "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/jwt"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	sellers_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/sellers/models"
	sellers_services "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/sellers/services"
	"github.com/labstack/echo/v4"
)

func GetSellerListingsHandler(
	container *container.Container,
	sellerListingService *sellers_services.SellerListingService,
) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		// Get seller ID from JWT claims
		claims := auth_jwt.GetJWTData(c)
		if claims.SellerID == "" {
			logger.Error("Seller ID not found in JWT claims")
			return c.JSON(http.StatusUnauthorized, echo.Map{"error": "Unauthorized - Not a seller"})
		}

		// Parse query parameters
		limit, _ := strconv.Atoi(c.QueryParam("limit"))
		offset, _ := strconv.Atoi(c.QueryParam("offset"))
		typeID, _ := strconv.Atoi(c.QueryParam("type_id"))
		categoryID, _ := strconv.Atoi(c.QueryParam("category_id"))

		params := &sellers_models.GetSellerListingsParams{
			SellerID:   claims.SellerID,
			TypeID:     typeID,
			CategoryID: categoryID,
			Limit:      limit,
			Offset:     offset,
		}

		logger.Info("Getting seller listings", "params", params)

		response, err := sellerListingService.GetSellerListings(c.Request().Context(), params)
		if err != nil {
			logger.Error("Failed to get seller listings", "error", err)
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
		}

		return c.JSON(http.StatusOK, response)
	}
}

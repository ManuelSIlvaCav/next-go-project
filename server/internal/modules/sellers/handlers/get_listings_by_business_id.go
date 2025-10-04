package sellers_handlers

import (
	"net/http"
	"strconv"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	sellers_services "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/sellers/services"
	"github.com/labstack/echo/v4"
)

func GetListingsByBusinessIDHandler(
	container *container.Container,
	sellerListingService *sellers_services.SellerListingService,
) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		// Get business_id from path parameter
		businessIDStr := c.Param("business_id")
		businessID, err := strconv.ParseInt(businessIDStr, 10, 64)
		if err != nil {
			logger.Error("Invalid business_id", "business_id", businessIDStr, "error", err)
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid business_id"})
		}

		// Parse query parameters
		limit, _ := strconv.Atoi(c.QueryParam("limit"))
		offset, _ := strconv.Atoi(c.QueryParam("offset"))
		typeID, _ := strconv.Atoi(c.QueryParam("type_id"))
		categoryID, _ := strconv.Atoi(c.QueryParam("category_id"))

		logger.Info("Getting listings by business_id", "business_id", businessID, "limit", limit, "offset", offset)

		response, err := sellerListingService.GetSellerListingsByBusinessID(
			c.Request().Context(),
			businessID,
			typeID,
			categoryID,
			limit,
			offset,
		)
		if err != nil {
			logger.Error("Failed to get listings by business_id", "error", err)
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
		}

		return c.JSON(http.StatusOK, response)
	}
}

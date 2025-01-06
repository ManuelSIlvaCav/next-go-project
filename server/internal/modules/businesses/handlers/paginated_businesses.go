package businesses_handlers

import (
	"net/http"
	"strconv"

	businesses "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/businesses/repositories"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/labstack/echo/v4"
)

type PaginatedBusinessesParams struct {
	Limit  string `json:"limit" query:"limit"`
	Cursor string `json:"cursor" query:"cursor"`
}

func PaginatedBusinesses(container *container.Container, businessRepository *businesses.BusinessRepository) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()
		logger.Info("Loggin jwt data", "data", c.Get("jwt"))

		params := PaginatedBusinessesParams{}

		if err := c.Bind(&params); err != nil {
			logger.Error("Failed to bind projects params", "error", err)
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Bad Request - Limit or Cursor not provided"})
		}

		limit, _ := strconv.Atoi(params.Limit)
		cursor, _ := strconv.Atoi(params.Cursor)

		businesses, err := businessRepository.BasePagination(c.Request().Context(), "businesses", limit, cursor)

		if err != nil {
			logger.Error("Failed to get projects", "error", err)
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to get projects"})
		}

		return c.JSON(http.StatusOK, echo.Map{"data": businesses})
	}
}

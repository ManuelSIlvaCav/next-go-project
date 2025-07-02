package listings_handlers

import (
	"net/http"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	listings_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/listings/models"
	listings_repositories "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/listings/repositories"
	"github.com/labstack/echo/v4"
)

func GetCategories(
	container *container.Container,
	categoryRepository listings_repositories.CategoryRepositoryInterface) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		logger.Info(
			"Create category handler", "path", c.Path(), "method",
			c.Request().Method)

		params := listings_models.GetCategoriesParams{}

		if err := c.Bind(&params); err != nil {
			logger.Error("Failed to bind create category", "error", err)
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Bad Request - Invalid parameters"})
		}

		categories, err := categoryRepository.GetCategories(c.Request().Context(), &params)

		if err != nil {
			logger.Error("Failed to get categories", "error", err)
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Internal Server Error"})
		}

		if len(categories) == 0 {
			logger.Info("No categories found")
			return c.JSON(http.StatusNotFound, echo.Map{"error": "No categories found"})
		}

		categoriesDTO := make([]listings_models.CategoryDTO, len(categories))
		for i, category := range categories {
			categoriesDTO[i] = listings_models.CategoryDTO{
				ID:          category.ID,
				Name:        category.Name,
				Description: category.Description.String,
				CreatedAt:   category.CreatedAt,
				UpdatedAt:   category.UpdatedAt,
				DeletedAt:   nil,
				ParentID:    category.ParentID.String,
				Parent:      nil,
				ChildrenID:  nil,
				Children:    nil,
			}
			if category.DeletedAt.Valid {
				categoriesDTO[i].DeletedAt = &category.DeletedAt.Time
			}
		}
		logger.Info("Categories found", "categories", categoriesDTO)
		return c.JSON(http.StatusOK, echo.Map{"data": categoriesDTO})

	}
}

package listings_handlers

import (
	"net/http"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	listings_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/listings/models"
	listings_repositories "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/listings/repositories"
	"github.com/labstack/echo/v4"
)

func CreateCategory(
	container *container.Container,
	categoryRepository listings_repositories.CategoryRepositoryInterface) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		params := listings_models.CreateCategoryParams{}

		if err := c.Bind(&params); err != nil {
			logger.Error("Failed to bind create category", "error", err)
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Bad Request - Invalid parameters"})
		}

		category, err := categoryRepository.CreateCategory(c.Request().Context(), &params)

		newCategoryDTO := listings_models.CategoryDTO{
			ID:          category.ID,
			Name:        category.Name,
			Slug:        category.Slug,
			Description: category.Description.String,
			CreatedAt:   category.CreatedAt,
			UpdatedAt:   category.UpdatedAt,
			DeletedAt:   nil,
			ParentID:    category.ParentID.String,
			Parent:      nil,
			ChildrenIDs: nil,
			Children:    nil,
		}

		if category.DeletedAt.Valid {
			newCategoryDTO.DeletedAt = &category.DeletedAt.Time
		}

		if err != nil {
			logger.Error("Failed to create category", "error", err)
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Internal Server Error"})
		}

		logger.Info("Category created", "category", newCategoryDTO)

		return c.JSON(http.StatusCreated, echo.Map{"data": newCategoryDTO})
	}
}

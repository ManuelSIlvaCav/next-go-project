package listings_handlers

import (
	"net/http"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	listings_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/listings/models"
	listings_repositories "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/listings/repositories"
	"github.com/labstack/echo/v4"
)

func UpdateCategory(
	container *container.Container,
	categoryRepository listings_repositories.CategoryRepositoryInterface) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		params := listings_models.UpdateCategoryParams{}

		// Get ID from URL parameter
		params.ID = c.Param("id")
		if params.ID == "" {
			logger.Error("Category ID is required")
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Bad Request - Category ID is required"})
		}

		// Bind the request body to get the fields to update
		if err := c.Bind(&params); err != nil {
			logger.Error("Failed to bind update category", "error", err)
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Bad Request - Invalid parameters"})
		}

		category, err := categoryRepository.UpdateCategory(c.Request().Context(), &params)
		if err != nil {
			logger.Error("Failed to update category", "error", err)
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Internal Server Error"})
		}

		// Convert to DTO
		updatedCategoryDTO := listings_models.CategoryDTO{
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
			updatedCategoryDTO.DeletedAt = &category.DeletedAt.Time
		}

		logger.Info("Category updated", "category", updatedCategoryDTO)

		return c.JSON(http.StatusOK, echo.Map{"data": updatedCategoryDTO})
	}
}

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

		logger.Info("Categories found", "categories", categories)

		categoriesDTO := BuildCategoryTree(categories)

		logger.Info("Categories found", "categories", categoriesDTO)
		return c.JSON(http.StatusOK, echo.Map{"data": categoriesDTO})
	}
}

func BuildCategoryTree(categories []*listings_models.Category) []listings_models.CategoryDTO {
	categoryMap := make(map[string]*listings_models.CategoryDTO)

	// Initialize the map with all categories
	for _, cat := range categories {
		categoryMap[cat.ID] = &listings_models.CategoryDTO{
			ID:          cat.ID,
			Name:        cat.Name,
			Slug:        cat.Slug,
			Description: cat.Description.String,
			CreatedAt:   cat.CreatedAt,
			UpdatedAt:   cat.UpdatedAt,
			DeletedAt:   nil,
			ParentID:    cat.ParentID.String,
			Parent:      nil,
			ChildrenIDs: []string{},
			Children:    []listings_models.CategoryDTO{},
		}
		if cat.DeletedAt.Valid {
			categoryMap[cat.ID].DeletedAt = &cat.DeletedAt.Time
		}
	}

	// Build parent-child relationships
	for _, cat := range categories {
		if cat.ParentID.Valid {
			parent := categoryMap[cat.ParentID.String]
			child := categoryMap[cat.ID]
			if parent != nil && child != nil {
				parent.ChildrenIDs = append(parent.ChildrenIDs, cat.ID)
			}
		}
	}

	// Build the nested structure for children
	var buildChildren func(categoryID string) []listings_models.CategoryDTO
	buildChildren = func(categoryID string) []listings_models.CategoryDTO {
		category := categoryMap[categoryID]
		if category == nil {
			return []listings_models.CategoryDTO{}
		}

		children := make([]listings_models.CategoryDTO, 0, len(category.ChildrenIDs))
		for _, childID := range category.ChildrenIDs {
			child := categoryMap[childID]
			if child != nil {
				// Recursively build children
				child.Children = buildChildren(childID)
				children = append(children, *child)
			}
		}
		return children
	}

	// Collect root categories and build their children recursively
	var roots []listings_models.CategoryDTO
	for _, cat := range categories {
		if !cat.ParentID.Valid {
			rootCategory := categoryMap[cat.ID]
			if rootCategory != nil {
				rootCategory.Children = buildChildren(cat.ID)
				roots = append(roots, *rootCategory)
			}
		}
	}

	return roots
}

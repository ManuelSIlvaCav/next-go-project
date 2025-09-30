package listings_repositories

import (
	"context"
	"database/sql"
	"fmt"
	"strings"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	listings_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/listings/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/utils"
)

type CategoryRepository struct {
	container *container.Container
	utils.BaseRepository[listings_models.Category]
}

type CategoryRepositoryInterface interface {
	CreateCategory(ctx context.Context, params *listings_models.CreateCategoryParams) (*listings_models.Category, error)
	UpdateCategory(ctx context.Context, params *listings_models.UpdateCategoryParams) (*listings_models.Category, error)
	GetCategories(ctx context.Context, params *listings_models.GetCategoriesParams) ([]*listings_models.Category, error)
}

func NewCategoryRepository(container *container.Container) *CategoryRepository {
	return &CategoryRepository{
		container: container,
	}
}

func (r *CategoryRepository) CreateCategory(ctx context.Context, params *listings_models.CreateCategoryParams) (*listings_models.Category, error) {
	logger := r.container.Logger()

	newCategory := &listings_models.Category{
		Name: params.Name,
		Description: sql.NullString{
			String: params.Description,
			Valid:  params.Description != "",
		},
		ParentID: sql.NullString{
			String: params.ParentID,
			Valid:  params.ParentID != "",
		},
	}

	query := `INSERT INTO categories (name, description, parent_id, slug) VALUES ($1, $2, $3, $4) RETURNING id, created_at, updated_at, deleted_at, parent_id`

	if err := r.container.DB().Db.QueryRowContext(ctx, query,
		newCategory.Name,
		newCategory.Description,
		newCategory.ParentID,
		newCategory.Slug,
	).Scan(&newCategory.ID, &newCategory.CreatedAt, &newCategory.UpdatedAt, &newCategory.DeletedAt, &newCategory.ParentID); err != nil {
		logger.Error("Error creating category", "error", err)
		return nil, err
	}

	return newCategory, nil
}

func (r *CategoryRepository) UpdateCategory(ctx context.Context, params *listings_models.UpdateCategoryParams) (*listings_models.Category, error) {
	logger := r.container.Logger()

	// First get the existing category
	existingCategory, err := r.GetCategory(ctx, &listings_models.GetCategoryParams{ID: params.ID})
	if err != nil {
		logger.Error("Error getting existing category for update", "error", err)
		return nil, err
	}

	// Build dynamic query based on provided fields
	setParts := []string{}
	args := []interface{}{}
	argIndex := 1

	if params.Name != "" {
		setParts = append(setParts, "name = $"+fmt.Sprintf("%d", argIndex))
		args = append(args, params.Name)
		argIndex++
	}

	if params.Slug != "" {
		setParts = append(setParts, "slug = $"+fmt.Sprintf("%d", argIndex))
		args = append(args, params.Slug)
		argIndex++
	}

	if params.ParentID != "" {
		setParts = append(setParts, "parent_id = $"+fmt.Sprintf("%d", argIndex))
		args = append(args, sql.NullString{String: params.ParentID, Valid: true})
		argIndex++
	}

	// Add updated_at field
	setParts = append(setParts, "updated_at = NOW()")

	if len(setParts) == 1 { // Only updated_at was added, no actual changes
		logger.Info("No fields to update for category", "categoryID", params.ID)
		return existingCategory, nil
	}

	// Build the final query
	query := "UPDATE categories SET " + strings.Join(setParts, ", ") + " WHERE id = $" + fmt.Sprintf("%d", argIndex) + " RETURNING id, name, description, created_at, updated_at, deleted_at, parent_id, slug"
	args = append(args, params.ID)

	updatedCategory := &listings_models.Category{}
	if err := r.container.DB().Db.QueryRowContext(ctx, query, args...).Scan(
		&updatedCategory.ID,
		&updatedCategory.Name,
		&updatedCategory.Description,
		&updatedCategory.CreatedAt,
		&updatedCategory.UpdatedAt,
		&updatedCategory.DeletedAt,
		&updatedCategory.ParentID,
		&updatedCategory.Slug,
	); err != nil {
		logger.Error("Error updating category", "error", err)
		return nil, err
	}

	return updatedCategory, nil
}

func (r *CategoryRepository) GetCategory(ctx context.Context, params *listings_models.GetCategoryParams) (*listings_models.Category, error) {
	logger := r.container.Logger()

	category := &listings_models.Category{}

	query := `SELECT id, name, description, created_at, updated_at, deleted_at, parent_id FROM categories WHERE id = $1`

	if err := r.container.DB().Db.QueryRowContext(ctx, query, params.ID).Scan(
		&category.ID,
		&category.Name,
		&category.Description,
		&category.CreatedAt,
		&category.UpdatedAt,
		&category.DeletedAt,
		&category.ParentID,
	); err != nil {
		logger.Error("Error getting category", "error", err)
		return nil, err
	}

	return category, nil
}

func (r *CategoryRepository) GetCategories(ctx context.Context, params *listings_models.GetCategoriesParams) ([]*listings_models.Category, error) {
	logger := r.container.Logger()

	categories := []*listings_models.Category{}

	query := `
	with recursive heir (id, parent_id, name, root_path, lev, cat_level, slug) as
    ( select  id, parent_id, name, (name)::text, 1, 'root_category', slug
        from categories 
       where parent_id is null
      union all 
      select c.id, c.parent_id, c.name, root_path || '>'||(c.name)::text, lev+1    
           , category_sub_or_leaf(c.id), c.slug
        from categories c
        join heir h on c.parent_id = h.id
    ) --select * from heir;                                                              
	select id, parent_id, name, root_path, lev, cat_level, slug
		from heir
	order by root_path,lev;`

	rows, err := r.container.DB().Db.QueryContext(ctx, query)
	if err != nil {
		logger.Error("Error getting categories", "error", err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		category := &listings_models.Category{}
		if err := rows.Scan(
			&category.ID,
			&category.ParentID,
			&category.Name,
			&category.RootPath,
			&category.Level,
			&category.CategoryLevel,
			&category.Slug,
		); err != nil {
			logger.Error("Error scanning category", "error", err)
			return nil, err
		}
		categories = append(categories, category)
	}

	return categories, nil
}

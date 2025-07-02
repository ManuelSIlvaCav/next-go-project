package listings_models

import (
	"database/sql"
	"time"
)

type CreateCategoryParams struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	ParentID    string `json:"parent_id"`
}

type GetCategoryParams struct {
	ID string `json:"id"`
}

type GetCategoriesParams struct {
}

type Category struct {
	ID          string         `json:"id" db:"id"`
	Name        string         `json:"name" db:"name"`
	Description sql.NullString `json:"description" db:"description"`
	CreatedAt   *time.Time     `json:"created_at" db:"created_at"`
	UpdatedAt   *time.Time     `json:"updated_at" db:"updated_at"`
	DeletedAt   sql.NullTime   `json:"deleted_at" db:"deleted_at"`
	ParentID    sql.NullString `json:"parent_id" db:"parent_id"`
	Slug        string         `json:"slug" db:"slug"`

	Level         int    `json:"level" db:"level"`
	RootPath      string `json:"root_path" db:"root_path"`
	CategoryLevel string `json:"category_level" db:"category_level"`
}

type CategoryDTO struct {
	ID          string        `json:"id"`
	Name        string        `json:"name"`
	Description string        `json:"description"`
	CreatedAt   *time.Time    `json:"created_at"`
	UpdatedAt   *time.Time    `json:"updated_at"`
	DeletedAt   *time.Time    `json:"deleted_at"`
	ParentID    string        `json:"parent_id"`
	Parent      *CategoryDTO  `json:"parent"`
	ChildrenID  []string      `json:"children_id"`
	Children    []CategoryDTO `json:"children"`
}

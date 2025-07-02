package scrapper_models

import "time"

type SourceListing struct {
	ID          string    `json:"id" db:"id"`
	Title       string    `json:"title" db:"title"`
	Description string    `json:"description" db:"description"`
	Price       int       `json:"price" db:"price"`
	PriceUnit   string    `json:"price_unit" db:"price_unit"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
	CategoryID  string    `json:"category_id" db:"category_id"`
}

type SourceCategory struct {
	ID        string    `json:"id" db:"id"`
	Name      string    `json:"name" db:"name"`
	Slug      string    `json:"slug" db:"slug"`
	ParentID  string    `json:"parent" db:"parent"`
	Level     int       `json:"level" db:"level"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

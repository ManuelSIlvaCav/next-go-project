package listings_models

import (
	"database/sql"
	"encoding/json"
	"time"
)

// Price object to handle listing price and discounts
type Price struct {
	ListingPrice    float64 `json:"listing_price" db:"listing_price"`
	DiscountAmount  float64 `json:"discount_amount" db:"discount_amount"`
	DiscountPercent float64 `json:"discount_percent" db:"discount_percent"`
	FinalPrice      float64 `json:"final_price" db:"final_price"`
	Currency        string  `json:"currency" db:"currency"`
}

// ShoppingCart represents the main shopping cart
type ShoppingCart struct {
	ID        string     `json:"id" db:"id"`
	ClientID  string     `json:"client_id" db:"client_id"`
	Status    string     `json:"status" db:"status"` // active, abandoned, completed
	CreatedAt *time.Time `json:"created_at" db:"created_at"`
	UpdatedAt *time.Time `json:"updated_at" db:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at" db:"deleted_at"`
}

// ShoppingCartItem represents individual items in the cart
type ShoppingCartItem struct {
	ID        string          `json:"id" db:"id"`
	CartID    string          `json:"cart_id" db:"cart_id"`
	ListingID string          `json:"listing_id" db:"listing_id"`
	Quantity  int             `json:"quantity" db:"quantity"`
	PriceData json.RawMessage `json:"price_data" db:"price_data"` // JSON field for Price object
	Metadata  json.RawMessage `json:"metadata" db:"metadata"`     // JSON field for additional product info
	CreatedAt *time.Time      `json:"created_at" db:"created_at"`
	UpdatedAt *time.Time      `json:"updated_at" db:"updated_at"`
	DeletedAt sql.NullTime    `json:"deleted_at" db:"deleted_at"`
}

// DTOs for API responses
type ShoppingCartDTO struct {
	ID         string                `json:"id"`
	ClientID   string                `json:"client_id"`
	Status     string                `json:"status"`
	Items      []ShoppingCartItemDTO `json:"items"`
	TotalItems int                   `json:"total_items"`
	TotalPrice float64               `json:"total_price"`
	CreatedAt  *time.Time            `json:"created_at"`
	UpdatedAt  *time.Time            `json:"updated_at"`
}

type ShoppingCartItemDTO struct {
	ID        string                 `json:"id"`
	CartID    string                 `json:"cart_id"`
	ListingID string                 `json:"listing_id"`
	Quantity  int                    `json:"quantity"`
	Price     Price                  `json:"price"`
	Metadata  map[string]interface{} `json:"metadata"`
	CreatedAt *time.Time             `json:"created_at"`
	UpdatedAt *time.Time             `json:"updated_at"`
}

// Request/Response models for handlers
type CreateCartParams struct {
	ClientID string `json:"client_id" validate:"required" errormgs:"client_id is required"`
}

type AddToCartParams struct {
	CartID    string                 `json:"cart_id" validate:"required" errormgs:"cart_id is required"`
	ListingID string                 `json:"listing_id" validate:"required" errormgs:"listing_id is required"`
	Quantity  int                    `json:"quantity" validate:"required,min=1" errormgs:"quantity is required and must be at least 1"`
	Price     Price                  `json:"price" validate:"required" errormgs:"price is required"`
	Metadata  map[string]interface{} `json:"metadata"`
}

type UpdateCartItemParams struct {
	CartID   string                 `json:"cart_id" validate:"required" errormgs:"cart_id is required"`
	ItemID   string                 `json:"item_id" param:"item_id" validate:"required" errormgs:"item_id is required"`
	Quantity *int                   `json:"quantity" validate:"omitempty,min=1" errormgs:"quantity must be at least 1"`
	Price    *Price                 `json:"price"`
	Metadata map[string]interface{} `json:"metadata"`
}

type RemoveFromCartParams struct {
	CartID string `json:"cart_id" validate:"required" errormgs:"cart_id is required"`
	ItemID string `json:"item_id" param:"item_id" validate:"required" errormgs:"item_id is required"`
}

type GetCartParams struct {
	CartID   string `json:"cart_id" param:"cart_id"`
	ClientID string `json:"client_id" query:"client_id"`
}

type CartResponse struct {
	Cart ShoppingCartDTO `json:"cart"`
}

type CartItemResponse struct {
	Item ShoppingCartItemDTO `json:"item"`
}

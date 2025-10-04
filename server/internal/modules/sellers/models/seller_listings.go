package sellers_models

import (
	"time"

	validation "github.com/go-ozzo/ozzo-validation/v4"
	"github.com/google/uuid"
)

type SellerListingType struct {
	ID   int    `json:"id" db:"id"`
	Name string `json:"name" db:"name"`
}

type SellerListing struct {
	ID         string    `json:"id" db:"id"`
	SellerID   string    `json:"seller_id" db:"seller_id"`
	BusinessID int64     `json:"business_id" db:"business_id"`
	TypeID     int       `json:"type_id" db:"type_id"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
	UpdatedAt  time.Time `json:"updated_at" db:"updated_at"`
}

type SellerListingDetails struct {
	ID              int            `json:"id" db:"id"`
	SellerListingID string         `json:"seller_listing_id" db:"seller_listing_id"`
	Title           string         `json:"title" db:"title"`
	Description     string         `json:"description" db:"description"`
	Currency        string         `json:"currency" db:"currency"`
	Metadata        map[string]any `json:"metadata" db:"metadata"`
}

type SellerListingPrice struct {
	ID              int       `json:"id" db:"id"`
	SellerListingID string    `json:"seller_listing_id" db:"seller_listing_id"`
	Amount          float64   `json:"amount" db:"amount"`
	Currency        string    `json:"currency" db:"currency"`
	Interval        string    `json:"interval" db:"interval"` // one-time, daily, weekly, monthly, yearly
	CreatedAt       time.Time `json:"created_at" db:"created_at"`
	UpdatedAt       time.Time `json:"updated_at" db:"updated_at"`
}

type SellerListingCategory struct {
	ID              int    `json:"id" db:"id"`
	SellerListingID string `json:"seller_listing_id" db:"seller_listing_id"`
	CategoryID      int    `json:"category_id" db:"category_id"`
}

// DTO for complete listing information
type SellerListingDTO struct {
	ID          string               `json:"id"`
	SellerID    string               `json:"seller_id"`
	BusinessID  int64                `json:"business_id"`
	Type        string               `json:"type"`
	TypeID      int                  `json:"type_id"`
	Title       string               `json:"title"`
	Description string               `json:"description"`
	Currency    string               `json:"currency"`
	Metadata    map[string]any       `json:"metadata,omitempty"`
	Prices      []SellerListingPrice `json:"prices,omitempty"`
	Categories  []int                `json:"categories,omitempty"`
	CreatedAt   time.Time            `json:"created_at"`
	UpdatedAt   time.Time            `json:"updated_at"`
}

// Price input for creating/updating listings
type PriceInput struct {
	Amount   float64 `json:"amount"`
	Currency string  `json:"currency"`
	Interval string  `json:"interval"`
}

func (p PriceInput) Validate() error {
	return validation.ValidateStruct(&p,
		validation.Field(&p.Amount, validation.Required.Error("amount is required"), validation.Min(0.01).Error("amount must be greater than 0")),
		validation.Field(&p.Currency, validation.Required.Error("currency is required"), validation.Length(3, 10)),
		validation.Field(&p.Interval, validation.Required.Error("interval is required"), validation.In("one-time", "daily", "weekly", "monthly", "yearly").Error("interval must be one of: one-time, daily, weekly, monthly, yearly")),
	)
}

type CreateSellerListingParams struct {
	SellerID    string         `json:"seller_id"`
	TypeID      int            `json:"type_id"`
	Title       string         `json:"title"`
	Description string         `json:"description"`
	Currency    string         `json:"currency"`
	Metadata    map[string]any `json:"metadata"`
	Prices      []PriceInput   `json:"prices"`
	Categories  []int          `json:"categories"`
}

func (params CreateSellerListingParams) Validate() error {
	return validation.ValidateStruct(&params,
		validation.Field(&params.TypeID, validation.Required.Error("type_id is required"), validation.In(1, 2).Error("type_id must be 1 (service) or 2 (product)")),
		validation.Field(&params.Title, validation.Required.Error("title is required"), validation.Length(1, 255)),
		validation.Field(&params.Description, validation.Length(0, 5000)),
		validation.Field(&params.Currency, validation.Required.Error("currency is required"), validation.Length(3, 10)),
		validation.Field(&params.Prices, validation.Required.Error("at least one price is required"), validation.Length(1, 10)),
	)
}

type GetSellerListingsParams struct {
	SellerID   string `json:"seller_id,omitempty"`
	BusinessID int64  `json:"business_id,omitempty"`
	TypeID     int    `json:"type_id,omitempty"`
	CategoryID int    `json:"category_id,omitempty"`
	Limit      int    `json:"limit"`
	Offset     int    `json:"offset"`
}

type PaginatedSellerListingsResponse struct {
	Listings []SellerListingDTO `json:"listings"`
	Total    int                `json:"total"`
	Limit    int                `json:"limit"`
	Offset   int                `json:"offset"`
	HasMore  bool               `json:"has_more"`
}

// Helper function to generate new UUID for seller listings
func GenerateSellerListingID() string {
	return uuid.New().String()
}

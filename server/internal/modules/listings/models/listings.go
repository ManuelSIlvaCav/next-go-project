package listings_models

import (
	"time"
)

type ListingDetails struct {
	ListingID   string `json:"listing_id" db:"listing_id"`
	WebsiteURL  string `json:"website_url" db:"website_url"`
	PhoneNumber string `json:"phone_number" db:"phone_number"`
	Email       string `json:"email" db:"email"`
}

type Listing struct {
	ID             string         `json:"id" db:"id"`
	Title          string         `json:"title" db:"title"`
	Description    string         `json:"description" db:"description"`
	Price          int            `json:"price" db:"price"`
	PriceUnit      string         `json:"price_unit" db:"price_unit"`
	CreatedAt      time.Time      `json:"created_at" db:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at" db:"updated_at"`
	CategoryID     string         `json:"category_id" db:"category_id"`
	ListingDetails ListingDetails `json:"details"`
}

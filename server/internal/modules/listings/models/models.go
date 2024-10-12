package listings

import (
	"time"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/users"
)

type ListingDetails struct {
	ListingID        int    `json:"listing_id"`
	Bedrooms         int    `json:"bedrooms"`
	Bathrooms        int    `json:"bathrooms"`
	SurfaceTotal     int    `json:"surface"`
	SurfaceLiving    int    `json:"surface_living"`
	SurfaceScale     string `json:"surface_scale"`
	HasGarage        bool   `json:"has_garage"`
	GarageIdentifier string `json:"garage_identifier"`
	HasParking       bool   `json:"has_parking"`
}

type Listing struct {
	ID             string         `json:"id" db:"id"`
	Title          string         `json:"title" db:"title"`
	Description    string         `json:"description" db:"description"`
	Price          int            `json:"price" db:"price"`
	PriceUnit      string         `json:"price_unit" db:"price_unit"`
	Address        string         `json:"address" db:"address"`
	UserID         int            `json:"user_id" db:"user_id"`
	User           *users.User    `json:"user"`
	ListingDetails ListingDetails `json:"details"`
	CreatedAt      time.Time      `json:"created_at" db:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at" db:"updated_at"`
}

type NewListingState struct {
	Email   string  `json:"email"`
	Phone   string  `json:"phone"`
	State   string  `json:"state"`
	Listing Listing `json:"listing"`
}

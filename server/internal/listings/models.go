package listings

import "server/internal/users"

type ListingDetails struct {
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
	ID             string         `json:"id"`
	Title          string         `json:"title"`
	Description    string         `json:"description"`
	Price          int            `json:"price"`
	PriceUnit      string         `json:"price_unit"`
	Address        string         `json:"address"`
	UserID         string         `json:"user_id"`
	User           *users.User    `json:"user"`
	ListingDetails ListingDetails `json:"details"`
}

type NewListingState struct {
	Email   string  `json:"email"`
	Listing Listing `json:"listing"`
}

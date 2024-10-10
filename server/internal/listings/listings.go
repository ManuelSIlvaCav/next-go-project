package listings

import (
	"server/internal/container"
	listings "server/internal/listings/handlers"
	r "server/internal/router"
)

type ListingModule struct {
}

func NewListingModule(container *container.Container, router *r.Router) *ListingModule {

	routes := []r.Route{}

	routes = append(routes,
		router.BuildRoute("POST", "", listings.CreateListing(container)),
	)

	router.SetRoutes("/listings", routes)

	return &ListingModule{}
}

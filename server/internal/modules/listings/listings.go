package listings

import (
	internal_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	listings "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/listings/handlers"
)

type ListingModule struct {
	container *container.Container
}

func NewListingModule(
	container *container.Container) *ListingModule {
	return &ListingModule{
		container: container,
	}
}

func (l *ListingModule) GetDomain() string {
	return "/listings"
}

func (l *ListingModule) GetHandlers() []internal_models.Route {
	routes := []internal_models.Route{}

	routes = append(routes,
		internal_models.Route{
			Method:        "POST",
			Path:          "",
			Handler:       listings.CreateListing(l.container),
			Description:   "Create a listing",
			Authenticated: true,
		},
	)
	return routes
}

func (l *ListingModule) GetTasks() []internal_models.Task {
	tasks := []internal_models.Task{}
	return tasks
}

func (l *ListingModule) GetScheduledJobs() []internal_models.ScheduledJob {
	jobs := []internal_models.ScheduledJob{}
	return jobs
}

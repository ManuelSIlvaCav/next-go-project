package businesses

import (
	internal_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/models"
	businesses_handlers "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/businesses/handlers"
	businesses "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/businesses/repositories"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"go.uber.org/fx"
)

type BusinessesModule struct {
	BusinessesRepository *businesses.BusinessRepository
	container            *container.Container
}

func NewBusinessesModule(container *container.Container) *BusinessesModule {
	businessesRepository := businesses.NewBusinessRepository(container)
	return &BusinessesModule{
		BusinessesRepository: businessesRepository,
		container:            container,
	}
}

func (l *BusinessesModule) GetDomain() string {
	return "/businesses"
}

func (l *BusinessesModule) GetHandlers() []internal_models.Route {
	routes := []internal_models.Route{}

	routes = append(routes,
		internal_models.Route{
			Method: "GET",
			Path:   "",
			Handler: businesses_handlers.PaginatedBusinesses(l.container,
				l.BusinessesRepository),
			Description:   "Get all businesses",
			Authenticated: true,
		},
		internal_models.Route{
			Method: "POST",
			Path:   "",
			Handler: businesses_handlers.CreateBusinessHandler(l.container,
				l.BusinessesRepository),
			Description:   "Create a new business",
			Authenticated: true,
		},
	)

	return routes
}

func (l *BusinessesModule) GetTasks() []internal_models.Task {

	tasks := []internal_models.Task{}
	return tasks
}

func (l *BusinessesModule) GetScheduledJobs() []internal_models.ScheduledJob {
	scheduledJobs := []internal_models.ScheduledJob{}
	return scheduledJobs
}

var Module = fx.Module("businessesModule", fx.Provide(NewBusinessesModule))

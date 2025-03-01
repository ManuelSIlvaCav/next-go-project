package businesses

import (
	internal_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/models"
	businesses_handlers "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/businesses/handlers"
	businesses "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/businesses/repositories"
	businesses_services "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/businesses/services"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"go.uber.org/fx"
)

type BusinessesModule struct {
	BusinessesRepository *businesses.BusinessRepository
	container            *container.Container
	DomainService        *businesses_services.DomainService
}

func NewBusinessesModule(container *container.Container) *BusinessesModule {
	businessesRepository := businesses.NewBusinessRepository(container)
	domainService := businesses_services.NewDomainService(container)

	return &BusinessesModule{
		BusinessesRepository: businessesRepository,
		container:            container,
		DomainService:        domainService,
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
		internal_models.Route{
			Method: "GET",
			Path:   "/:id/users",
			Handler: businesses_handlers.GetBusinessUsersHandler(
				l.container,
				l.BusinessesRepository),
			Description:   "Get all users by user",
			Authenticated: true,
		},
		internal_models.Route{
			Method: "POST",
			Path:   "/:id/users",
			Handler: businesses_handlers.CreateBusinessUserHandler(
				l.container,
				l.BusinessesRepository),
			Description:   "Create a new user",
			Authenticated: true,
		},
		internal_models.Route{
			Method: "POST",
			Path:   "/:id/settings",
			Handler: businesses_handlers.UpdateBusinessSettingsHandler(
				l.container,
				l.BusinessesRepository,
				l.DomainService),
			Description:   "Create a new user",
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

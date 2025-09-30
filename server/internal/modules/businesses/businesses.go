package businesses

import (
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/interfaces"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth"
	businesses_handlers "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/businesses/handlers"
	businesses "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/businesses/repositories"
	businesses_services "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/businesses/services"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/router"
	"go.uber.org/fx"
)

type BusinessesModule struct {
	BusinessesRepository *businesses.BusinessRepository
	container            *container.Container
	DomainService        *businesses_services.DomainService
	router               *router.Router
	authModule           auth.IAuthModule
}

type BusinessModuleParams struct {
	fx.In
	Container            *container.Container
	BusinessesRepository *businesses.BusinessRepository
	DomainService        *businesses_services.DomainService
	Router               *router.Router
	AuthModule           auth.IAuthModule
}

func NewBusinessesModule(params BusinessModuleParams) *BusinessesModule {
	container := params.Container
	businessesRepository := params.BusinessesRepository
	domainService := params.DomainService

	businessModule := &BusinessesModule{
		BusinessesRepository: businessesRepository,
		container:            container,
		DomainService:        domainService,
		router:               params.Router,
		authModule:           params.AuthModule,
	}

	businessModule.SetRoutes()
	return businessModule
}

func (l *BusinessesModule) GetDomain() string {
	return "/businesses"
}

func (l *BusinessesModule) SetRoutes() {
	group := l.router.MainGroup.Group(l.GetDomain())

	group.Use(l.authModule.AuthMiddleware())

	group.Add("GET", "", businesses_handlers.PaginatedBusinesses(l.container,
		l.BusinessesRepository))
	group.Add("POST", "", businesses_handlers.CreateBusinessHandler(l.container,
		l.BusinessesRepository))
	group.Add("GET", "/:id/users", businesses_handlers.GetBusinessUsersHandler(
		l.container,
		l.BusinessesRepository))
	group.Add("POST", "/:id/users", businesses_handlers.CreateBusinessUserHandler(
		l.container,
		l.BusinessesRepository))
	group.Add("POST", "/:id/settings", businesses_handlers.UpdateBusinessSettingsHandler(
		l.container,
		l.BusinessesRepository,
		l.DomainService))
}

func (l *BusinessesModule) GetBusinessRepository() *businesses.BusinessRepository {
	return l.BusinessesRepository
}

var Module = fx.Module("businessesfx",
	fx.Provide(businesses.NewBusinessRepository),
	fx.Provide(businesses_services.NewDomainService),
	fx.Provide(
		fx.Annotate(
			NewBusinessesModule,
			fx.As(new(interfaces.BusinessModule)),
		),
	),
)

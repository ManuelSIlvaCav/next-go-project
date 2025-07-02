package listings

import (
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/interfaces"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	listings_handlers "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/listings/handlers"
	listings_repositories "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/listings/repositories"
	listing_services "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/listings/services"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/router"
	"go.uber.org/fx"
)

type ListingModule struct {
	container          *container.Container
	router             *router.Router
	authModule         interfaces.AuthModule
	listingService     listing_services.ListingServiceInterface
	categoryRepository listings_repositories.CategoryRepositoryInterface
}

type ListingModuleParams struct {
	fx.In
	Container  *container.Container
	Router     *router.Router
	AuthModule interfaces.AuthModule
}

func NewListingModule(
	params ListingModuleParams) *ListingModule {
	module := &ListingModule{
		container:          params.Container,
		router:             params.Router,
		listingService:     listing_services.NewListingService(params.Container),
		authModule:         params.AuthModule,
		categoryRepository: listings_repositories.NewCategoryRepository(params.Container),
	}

	module.SetRoutes()
	module.SetCategoryRoutes()

	return module
}

func (l *ListingModule) GetDomain() string {
	return "/listings"
}

func (l *ListingModule) SetRoutes() {
	group := l.router.MainGroup.Group(l.GetDomain())

	//group.Use(l.authModule.AuthMiddleware())

	group.Add("POST", "", listings_handlers.CreateListing(
		l.container, l.listingService))

}

func (l *ListingModule) SetCategoryRoutes() {
	group := l.router.MainGroup.Group("/categories")

	//group.Use(l.authModule.AuthMiddleware())

	group.Add("POST", "", listings_handlers.CreateCategory(
		l.container, l.categoryRepository))

	/* group.Add("GET", "", listings_handlers.GetCategories(
		l.container, l.listingService))

	group.Add("GET", "/:id", listings_handlers.GetCategory(
		l.container, l.listingService))

	group.Add("PUT", "/:id", listings_handlers.UpdateCategory(
		l.container, l.listingService))

	group.Add("DELETE", "/:id", listings_handlers.DeleteCategory(
		l.container, l.listingService)) */
}

var Module = fx.Module("listingsfx",
	fx.Provide(
		fx.Annotate(
			NewListingModule,
			fx.As(new(interfaces.ListingsModule)),
		),
	),
)

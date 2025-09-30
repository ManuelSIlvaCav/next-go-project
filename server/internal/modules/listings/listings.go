package listings

import (
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/interfaces"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth"
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
	authModule         auth.IAuthModule
	listingService     listing_services.ListingServiceInterface
	categoryRepository listings_repositories.CategoryRepositoryInterface
	cartRepository     listings_repositories.ShoppingCartRepositoryInterface
}

type ListingModuleParams struct {
	fx.In
	Container  *container.Container
	Router     *router.Router
	AuthModule auth.IAuthModule
}

func NewListingModule(
	params ListingModuleParams) *ListingModule {
	module := &ListingModule{
		container:          params.Container,
		router:             params.Router,
		listingService:     listing_services.NewListingService(params.Container),
		authModule:         params.AuthModule,
		categoryRepository: listings_repositories.NewCategoryRepository(params.Container),
		cartRepository:     listings_repositories.NewShoppingCartRepository(params.Container),
	}

	module.SetRoutes()
	module.SetCategoryRoutes()
	module.SetCartRoutes()

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

	group.Add("PUT", "/:id", listings_handlers.UpdateCategory(
		l.container, l.categoryRepository))

	group.Add("GET", "", listings_handlers.GetCategories(
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

func (l *ListingModule) SetCartRoutes() {
	group := l.router.MainGroup.Group("/cart")

	//group.Use(l.authModule.AuthMiddleware())

	// Create a new cart
	group.Add("POST", "", listings_handlers.CreateCart(
		l.container, l.cartRepository))

	// Get cart by ID or client ID
	group.Add("GET", "/:cart_id", listings_handlers.GetCart(
		l.container, l.cartRepository))

	// Get cart by client ID (query parameter)
	group.Add("GET", "", listings_handlers.GetCart(
		l.container, l.cartRepository))

	// Add item to cart
	group.Add("POST", "/items", listings_handlers.AddToCart(
		l.container, l.cartRepository))

	// Update cart item
	group.Add("PUT", "/items/:item_id", listings_handlers.UpdateCartItem(
		l.container, l.cartRepository))

	// Remove item from cart
	group.Add("DELETE", "/items/:item_id", listings_handlers.RemoveFromCart(
		l.container, l.cartRepository))
}

var Module = fx.Module("listingsfx",
	fx.Provide(
		fx.Annotate(
			NewListingModule,
			fx.As(new(interfaces.ListingsModule)),
		),
	),
)

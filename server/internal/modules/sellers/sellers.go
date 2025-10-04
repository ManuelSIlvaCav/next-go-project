package sellers

import (
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/interfaces"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	sellers_handlers "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/sellers/handlers"
	sellers_repositories "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/sellers/repositories"
	sellers_services "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/sellers/services"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/router"
	"go.uber.org/fx"
)

type SellersModule struct {
	sellerRepository        *sellers_repositories.SellerRepository
	sellerService           *sellers_services.SellerService
	sellerListingRepository *sellers_repositories.SellerListingRepository
	sellerListingService    *sellers_services.SellerListingService
	container               *container.Container
	router                  *router.Router
	authModule              auth.IAuthModule
}

type SellersModuleParams struct {
	fx.In
	Container               *container.Container
	Router                  *router.Router
	AuthModule              auth.IAuthModule
	SellerRepository        *sellers_repositories.SellerRepository
	SellerService           *sellers_services.SellerService
	SellerListingRepository *sellers_repositories.SellerListingRepository
	SellerListingService    *sellers_services.SellerListingService
}

func NewSellersModule(params SellersModuleParams) *SellersModule {
	sellersModule := &SellersModule{
		sellerRepository:        params.SellerRepository,
		sellerService:           params.SellerService,
		sellerListingRepository: params.SellerListingRepository,
		sellerListingService:    params.SellerListingService,
		container:               params.Container,
		router:                  params.Router,
		authModule:              params.AuthModule,
	}

	sellersModule.SetRoutes()
	return sellersModule
}

func (s *SellersModule) GetDomain() string {
	return "/sellers"
}

func (s *SellersModule) SetRoutes() {
	group := s.router.MainGroup.Group(s.GetDomain())

	// Seller routes
	group.Add("POST", "", sellers_handlers.CreateSellerHandler(s.container, s.sellerService))
	group.Add("GET", "/:id", sellers_handlers.GetSellerHandler(s.container, s.sellerService), s.authModule.AuthMiddleware())

	// Seller listing routes (protected - require seller authentication)
	group.Add("POST", "/listings", sellers_handlers.CreateSellerListingHandler(s.container, s.sellerListingService), s.authModule.AuthMiddleware())
	group.Add("GET", "/listings", sellers_handlers.GetSellerListingsHandler(s.container, s.sellerListingService), s.authModule.AuthMiddleware())

	// Public listing routes (no authentication required)
	group.Add("GET", "/listings/business/:business_id", sellers_handlers.GetListingsByBusinessIDHandler(s.container, s.sellerListingService))
}

func (s *SellersModule) SetTasks() {
	// No background tasks needed for sellers module currently
}

func (s *SellersModule) GetSellerRepository() *sellers_repositories.SellerRepository {
	return s.sellerRepository
}

func (s *SellersModule) GetSellerService() *sellers_services.SellerService {
	return s.sellerService
}

// FX Module definition
var Module = fx.Module("sellersfx",
	fx.Provide(sellers_repositories.NewSellerRepository),
	fx.Provide(sellers_services.NewSellerService),
	fx.Provide(sellers_repositories.NewSellerListingRepository),
	fx.Provide(sellers_services.NewSellerListingService),
	fx.Provide(
		fx.Annotate(
			NewSellersModule,
			fx.As(new(interfaces.SellersModule)),
		),
	),
)

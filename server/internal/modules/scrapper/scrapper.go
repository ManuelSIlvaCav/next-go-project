package scrapper

import (
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/interfaces"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	services_pet_vet "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/scrapper/services/pet_vet"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/router"
	"github.com/labstack/echo/v4"
	"go.uber.org/fx"
)

type ScrapperModule struct {
	container  *container.Container
	router     *router.Router
	authModule auth.IAuthModule
}

type ScrapperModuleParams struct {
	fx.In
	Container  *container.Container
	Router     *router.Router
	AuthModule auth.IAuthModule
}

func NewScrapperModule(
	params ScrapperModuleParams) *ScrapperModule {
	module := &ScrapperModule{
		container:  params.Container,
		router:     params.Router,
		authModule: params.AuthModule,
	}

	module.SetRoutes()

	return module
}

func (l *ScrapperModule) GetDomain() string {
	return "/scrapper"
}

func (l *ScrapperModule) SetRoutes() {
	group := l.router.MainGroup.Group(l.GetDomain())

	//group.Use(l.authModule.AuthMiddleware())

	group.Add("GET", "",
		func(c echo.Context) error {
			scrapperService := services_pet_vet.NewPetVetService()
			if err := scrapperService.Scrape(); err != nil {
				return c.JSON(500, echo.Map{"error": "Failed to scrape data"})
			}
			return c.JSON(200, echo.Map{"message": "Scraping completed successfully"})

		})

}

var Module = fx.Module("scrapperfx",
	fx.Provide(
		fx.Annotate(
			NewScrapperModule,
			fx.As(new(interfaces.ScrapperModule)),
		),
	),
)

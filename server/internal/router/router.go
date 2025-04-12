package router

import (
	"fmt"
	"net/http"

	internal_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"go.uber.org/fx"
)

type Router struct {
	MainGroup *echo.Group
	//authModule *auth.AuthModule
}

func NewRouter(
	e *echo.Echo,
	//authModule *auth.AuthModule,
	container *container.Container,
	//internalModules *modules.InternalModule,
) *Router {
	router := &Router{}
	router.initializeRouter(e)

	logger := container.Logger()
	logger.Info("Router initialized")

	/* modules := internalModule.Modules

	for _, module := range modules {
		domain := module.GetDomain()
		handlers := module.GetHandlers()

		logger.Info("Registering module", "domain", domain)

		router.RegisterRoutes(domain, handlers)
	} */

	return router
}

func setCORSConfig(e *echo.Echo) {
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowCredentials:                         true,
		UnsafeWildcardOriginWithAllowCredentials: true,
		AllowOrigins:                             []string{"*"},
		AllowHeaders:                             []string{"*"},
		AllowMethods: []string{
			http.MethodGet,
			http.MethodPost,
			http.MethodPut,
			http.MethodDelete,
			http.MethodOptions,
		},
		MaxAge: 86400,
	}))
}

// We register the domain in the group and then we register the routes for that module
// @param domain string
// @param routes map[string][]*interfaces.Route
// @return void
func (r *Router) RegisterRoutes(
	domain string,
	routes []internal_models.Route) {
	fmt.Println("Registering routes for domain", domain)
	//Set the group for the domain
	group := r.MainGroup.Group(domain)

	//group.Use(r.authModule.AuthMiddleware())

	//Register the routes
	for _, route := range routes {
		group.Add(route.Method, route.Path, route.Handler)
	}
}

func (r *Router) initializeRouter(
	e *echo.Echo,
) {
	setCORSConfig(e)
	//setErrorController(e, container)
	//setHealthController(e, container)
	//Set the main group

	r.MainGroup = e.Group("/api/v1")
}

var Module = fx.Options(fx.Provide(NewRouter))

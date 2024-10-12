package router

import (
	"fmt"

	internal_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/labstack/echo/v4"
)

type Router struct {
	mainGroup *echo.Group
}

func NewRouter(
	e *echo.Echo,
	internalModule *modules.InternalModule,
) *Router {
	router := &Router{}

	container := internalModule.Container
	router.initializeRouter(e, container)

	logger := container.Logger()
	logger.Info("Router initialized")

	modules := internalModule.Modules

	for _, module := range modules {
		domain := module.GetDomain()
		handlers := module.GetHandlers()

		logger.Info("Registering module", "domain", domain)

		router.RegisterRoutes(domain, handlers)
	}

	return router
}

// We register the domain in the group and then we register the routes for that module
// @param domain string
// @param routes map[string][]*interfaces.Route
// @return void
func (r *Router) RegisterRoutes(domain string, routes []internal_models.Route) {
	fmt.Println("Registering routes for domain", domain)
	//Set the group for the domain
	group := r.mainGroup.Group(domain)

	//Register the routes
	for _, route := range routes {
		group.Add(route.Method, route.Path, route.Handler)
	}
}

func (r *Router) SetRoutes(path string, routes []internal_models.Route) error {
	r.RegisterRoutes(path, routes)
	return nil
}

func (r *Router) BuildRoute(
	method string, path string, handler echo.HandlerFunc) Route {
	return Route{
		Method:  method,
		Path:    path,
		Handler: handler,
	}
}

func (r *Router) initializeRouter(
	e *echo.Echo,
	container *container.Container) {
	//setCORSConfig(e, container)
	//setErrorController(e, container)
	//setHealthController(e, container)
	//setJWTConfig(e, container)
	//Set the main group

	r.mainGroup = e.Group("/api/v1")
}

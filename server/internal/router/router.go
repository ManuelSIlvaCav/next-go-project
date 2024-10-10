package router

import (
	"fmt"
	"server/internal/container"

	"github.com/labstack/echo/v4"
)

type Router struct {
	mainGroup *echo.Group
}

func NewRouter(e *echo.Echo, container *container.Container) *Router {
	router := &Router{}
	logger := container.Logger()

	logger.Info("Router initialized")
	router.initializeRouter(e, container)

	return router
}

// We register the domain in the group and then we register the routes for that module
// @param domain string
// @param routes map[string][]*interfaces.Route
// @return void
func (r *Router) RegisterRoutes(domain string, routes []Route) {
	fmt.Println("Registering routes for domain", domain)
	//Set the group for the domain
	group := r.mainGroup.Group(domain)

	//Register the routes
	for _, route := range routes {

		group.Add(route.Method, route.Path, route.Handler)
	}
}

func (r *Router) SetRoutes(path string, routes []Route) error {
	r.RegisterRoutes(path, routes)
	return nil
}

func (r *Router) BuildRoute(method string, path string, handler echo.HandlerFunc) Route {
	return Route{
		Method:  method,
		Path:    path,
		Handler: handler,
	}
}

func (r *Router) initializeRouter(e *echo.Echo, container *container.Container) {
	//setCORSConfig(e, container)
	//setErrorController(e, container)
	//setHealthController(e, container)
	//setJWTConfig(e, container)
	//Set the main group

	r.mainGroup = e.Group("/api/v1")
}

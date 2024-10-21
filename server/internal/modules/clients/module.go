package clients

import (
	internal_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/models"
	clients "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/clients/handlers"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/files"
	"go.uber.org/fx"
)

type ClientModule struct {
	container *container.Container
	routes    []internal_models.Route
}

func NewClientModule(container *container.Container, filesModule *files.FilesModule) *ClientModule {
	routes := []internal_models.Route{}

	routes = append(routes,
		internal_models.Route{
			Method:        "POST",
			Path:          "/upload_csv",
			Handler:       clients.UploadClients(container, filesModule),
			Description:   "Upload a csv file with clients",
			Authenticated: true,
		},
	)

	return &ClientModule{container: container, routes: routes}
}

func (c *ClientModule) GetDomain() string {
	return "/clients"
}

func (c *ClientModule) GetHandlers() []internal_models.Route {
	return c.routes
}

var Module = fx.Options(fx.Provide(NewClientModule))

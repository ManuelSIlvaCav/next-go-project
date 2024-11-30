package clients

import (
	internal_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/models"
	clients "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/clients/handlers"
	client_tasks "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/clients/tasks"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/files"
	"go.uber.org/fx"
)

type ClientModule struct {
	container   *container.Container
	routes      []internal_models.Route
	filesModule *files.FilesModule
}

func NewClientModule(container *container.Container,
	filesModule *files.FilesModule) *ClientModule {
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

	return &ClientModule{container: container, routes: routes, filesModule: filesModule}
}

func (c *ClientModule) GetDomain() string {
	return "/clients"
}

func (c *ClientModule) GetHandlers() []internal_models.Route {
	return c.routes
}

func (c *ClientModule) GetTasks() []internal_models.Task {
	tasks := []internal_models.Task{}
	tasks = append(tasks,
		internal_models.Task{
			Pattern: client_tasks.TypeUploadClients,
			Handler: client_tasks.NewUploadClientsProcessor(c.container,
				c.filesModule),
		},
	)
	return tasks
}

func (c *ClientModule) GetScheduledJobs() []internal_models.ScheduledJob {
	jobs := []internal_models.ScheduledJob{}
	return jobs
}

var Module = fx.Options(fx.Provide(NewClientModule))

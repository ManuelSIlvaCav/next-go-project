package clients

import (
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/interfaces"
	internal_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/models"
	client_jobs "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/clients/jobs"
	clients_repositories "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/clients/repositories"
	client_tasks "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/clients/tasks"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/files"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/router"
	"go.uber.org/fx"
)

type ClientModule struct {
	container        *container.Container
	router           *router.Router
	filesModule      *files.FilesModule
	clientRepository *clients_repositories.ClientRepository
}

type ClientsModuleParams struct {
	fx.In
	Container   *container.Container
	Router      *router.Router
	AuthModule  interfaces.AuthModule
	FilesModule *files.FilesModule
}

func NewClientModule(params ClientsModuleParams) *ClientModule {
	/* routes := []internal_models.Route{}

	routes = append(routes,
		internal_models.Route{
			Method:        "POST",
			Path:          "/upload_csv",
			Handler:       clients.UploadClients(container, filesModule),
			Description:   "Upload a csv file with clients",
			Authenticated: true,
		},
	) */

	clientsModule := &ClientModule{
		container:   params.Container,
		filesModule: params.FilesModule,
		router:      params.Router,
	}

	return clientsModule
}

func (c *ClientModule) GetDomain() string {
	return "/clients"
}

func (c *ClientModule) GetClientRepository() *clients_repositories.ClientRepository {
	return c.clientRepository
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
	jobs = append(jobs, client_jobs.NewHelloWorldJob(c.container))
	return jobs
}

//var Module = fx.Options(fx.Provide(NewClientModule))

var Module = fx.Module("clientsfx",
	fx.Provide(clients_repositories.NewClientRepository),
	fx.Provide(
		fx.Annotate(
			NewClientModule,
			fx.As(new(interfaces.ClientsModule)),
		),
	),
)

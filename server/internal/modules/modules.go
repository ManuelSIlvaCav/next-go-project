package modules

import (
	"fmt"

	internal_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/businesses"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/clients"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/emails"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/files"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/listings"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/projects"
	"go.uber.org/fx"
)

type InternalModule struct {
	Container *container.Container
	Modules   []internal_models.IModule
}

func NewInternalModule(
	container *container.Container,
	filesModule *files.FilesModule,
	listingModule *listings.ListingModule,
	clientsModule *clients.ClientModule,
	emailsModule *emails.EmailsModule,
	projectsModule *projects.ProjectsModule,
	businessesModule *businesses.BusinessesModule,
) *InternalModule {
	modules := []internal_models.IModule{
		filesModule,
		listingModule,
		clientsModule,
		emailsModule,
		projectsModule,
		businessesModule,
	}
	return &InternalModule{Container: container, Modules: modules}
}

func (m *InternalModule) Tasks() []internal_models.Task {
	fmt.Printf("Tasks")
	tasks := []internal_models.Task{}
	//Access the pointers of the modules

	for _, module := range m.Modules {
		tasks = append(tasks, module.GetTasks()...)
	}

	return tasks
}

func (m *InternalModule) SetupScheduledJobs() []internal_models.ScheduledJob {
	jobs := []internal_models.ScheduledJob{}
	for _, module := range m.Modules {
		jobs = append(jobs, module.GetScheduledJobs()...)
	}
	return jobs
}

var Module = fx.Options(
	container.Module,
	files.Module,
	listings.Module,
	clients.Module,
	emails.Module,
	projects.Module,
	businesses.Module,
	fx.Provide(NewInternalModule),
)

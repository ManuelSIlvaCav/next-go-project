package projects

import (
	internal_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	projects "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/projects/handlers"
	projects_repositories "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/projects/repositories"
	"go.uber.org/fx"
)

type ProjectsModule struct {
	// Add your fields here
	projectsRepository *projects_repositories.ProjectsRepository
	container          *container.Container
}

func NewProjectsModule(container *container.Container) *ProjectsModule {
	projectRepository := projects_repositories.NewProjectsRepository(container)
	return &ProjectsModule{
		projectsRepository: projectRepository,
		container:          container,
	}
}

func (l *ProjectsModule) GetDomain() string {
	return "/projects"
}

func (l *ProjectsModule) GetHandlers() []internal_models.Route {
	routes := []internal_models.Route{}

	routes = append(routes,

		internal_models.Route{
			Method: "GET",
			Path:   "",
			Handler: projects.GetProjects(l.container,
				l.projectsRepository),
			Description:   "Get all email templates",
			Authenticated: true,
		},
		internal_models.Route{
			Method: "POST",
			Path:   "",
			Handler: projects.CreateProject(l.container,
				l.projectsRepository),
			Description:   "Create a new email template",
			Authenticated: true,
		},
	)

	return routes
}

func (l *ProjectsModule) GetTasks() []internal_models.Task {
	tasks := []internal_models.Task{}
	return tasks
}

func (l *ProjectsModule) GetScheduledJobs() []internal_models.ScheduledJob {
	jobs := []internal_models.ScheduledJob{}
	return jobs
}

var Module = fx.Options(fx.Provide(NewProjectsModule))

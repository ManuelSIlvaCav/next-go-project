package workflows

import (
	internal_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"go.uber.org/fx"
)

type WorkflowsModule struct {
	container *container.Container
}

func NewWorkflowsModule(container *container.Container) *WorkflowsModule {
	return &WorkflowsModule{
		container: container,
	}
}

func (l *WorkflowsModule) GetTasks() []internal_models.Task {
	tasks := []internal_models.Task{}
	return tasks
}

func (l *WorkflowsModule) GetScheduledJobs() []internal_models.ScheduledJob {
	scheduledJobs := []internal_models.ScheduledJob{}
	return scheduledJobs
}

var Module = fx.Module("workflowModule", fx.Provide(NewWorkflowsModule))

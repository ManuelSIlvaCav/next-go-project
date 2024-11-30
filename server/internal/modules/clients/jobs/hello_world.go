package clients

import (
	internal_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/models"
	clients "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/clients/tasks"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
)

func NewHelloWorldJob(container *container.Container) internal_models.ScheduledJob {
	return internal_models.ScheduledJob{
		Key: clients.TypeUploadClients,
		Handler: clients.NewHelloWorldRecrrentProcessor(
			container,
		),
		Type:       "recurrent",
		Expression: "* * * * *",
	}
}

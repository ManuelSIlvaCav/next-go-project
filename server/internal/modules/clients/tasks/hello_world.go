package clients

import (
	"context"
	"encoding/json"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/utils"
	"github.com/hibiken/asynq"
)

/* We save the csv file previously on a storage so we pass the url to the task */
type HelloWorldRecurrentPayload struct {
	FileName string `json:"file_name"`
}

func NewHelloWorldRecurrent(fileURL string) (*asynq.Task, error) {
	payload, err := json.Marshal(UploadClientsPayload{
		FileName: fileURL,
	})
	if err != nil {
		return nil, err
	}
	return asynq.NewTask(TypeUploadClients, payload), nil
}

type HelloWorldRecrrentProcessor struct {
	Container *container.Container
}

func NewHelloWorldRecrrentProcessor(container *container.Container,
) *UploadClientsProcessor {
	return &UploadClientsProcessor{Container: container}
}

/* Process task for uploading client */
func (p *HelloWorldRecrrentProcessor) ProcessTask(ctx context.Context, t *asynq.Task) error {
	defer utils.Timer("UploadClientsProcessor")()
	logger := p.Container.Logger()
	logger.Info("Hello World")
	return nil
}

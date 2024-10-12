package tasks

import (
	"context"
	"encoding/json"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/hibiken/asynq"
)

type HelloWorldPayload struct {
	Message string `json:"message"`
}

func NewHelloWorldTask(message string) (*asynq.Task, error) {
	payload, err := json.Marshal(HelloWorldPayload{Message: message})
	if err != nil {
		return nil, err
	}
	return asynq.NewTask(TypeHelloWorld, payload), nil
}

type HelloWorldProcessor struct {
	Container *container.Container
}

func NewHelloWorldProcessor(container *container.Container) *HelloWorldProcessor {
	return &HelloWorldProcessor{Container: container}
}

func (p *HelloWorldProcessor) ProcessTask(ctx context.Context, t *asynq.Task) error {
	var payload HelloWorldPayload
	if err := json.Unmarshal(t.Payload(), &payload); err != nil {
		return err
	}
	logger := p.Container.Logger()
	logger.Info("Hello, World! from the job handler", "message", payload.Message)
	return nil
}

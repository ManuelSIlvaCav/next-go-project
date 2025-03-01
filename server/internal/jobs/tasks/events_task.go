package tasks

import (
	"context"
	"encoding/json"

	tasks_events "github.com/ManuelSIlvaCav/next-go-project/server/internal/jobs/tasks/events"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/emails"
	"github.com/hibiken/asynq"
)

type EventsPayload struct {
	Type     string      `json:"type"` //The event type ex. user_created, project_created, others
	Metadata interface{} `json:"meta_data"`
}

func NewEventsTask(eventType string, metaData interface{}) (*asynq.Task, error) {
	payload, err := json.Marshal(EventsPayload{
		Type:     eventType,
		Metadata: metaData,
	})

	if err != nil {
		return nil, err
	}

	return asynq.NewTask(TypeEvent, payload), nil
}

type EventProcessor struct {
	Container    *container.Container
	EmailsModule *emails.EmailsModule
}

func NewEventProcessor(container *container.Container, emailsModule *emails.EmailsModule,
) *EventProcessor {
	return &EventProcessor{Container: container, EmailsModule: emailsModule}
}

func (p *EventProcessor) ProcessTask(ctx context.Context, t *asynq.Task) error {
	var payload EventsPayload

	logger := p.Container.Logger()
	logger.Info("Event from handler Event", "payload", payload)

	if err := json.Unmarshal(t.Payload(), &payload); err != nil {
		return err
	}

	switch payload.Type {
	case "user_created":
		params := tasks_events.CreateUserParams{
			Email: payload.Metadata.(map[string]interface{})["email"].(string),
		}

		tasks_events.CreateUser(ctx, p.Container, p.EmailsModule, params)
	}

	return nil
}

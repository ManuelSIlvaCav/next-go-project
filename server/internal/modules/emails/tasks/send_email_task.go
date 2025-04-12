package emails_tasks

import (
	"context"
	"encoding/json"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/interfaces"
	"github.com/hibiken/asynq"
)

type SendEmailPayload struct {
	To string `json:"email"`
}

func NewSendEmailTask(email string) (*asynq.Task, error) {
	payload, err := json.Marshal(SendEmailPayload{
		To: email,
	})
	if err != nil {
		return nil, err
	}
	return asynq.NewTask(TypeSendEmail, payload), nil
}

type SendEmailProcessor struct {
	EmailModule interfaces.EmailModule
}

func NewSendEmailProcessor(emailModule interfaces.EmailModule) *SendEmailProcessor {
	return &SendEmailProcessor{EmailModule: emailModule}
}

func (p *SendEmailProcessor) ProcessTask(ctx context.Context, t *asynq.Task) error {

	var payload SendEmailPayload

	if err := json.Unmarshal(t.Payload(), &payload); err != nil {
		return err
	}

	emailService := p.EmailModule.GetEmailService()

	if err := emailService.SendNewUserEmail(ctx, payload.To); err != nil {
		return err
	}

	return nil
}

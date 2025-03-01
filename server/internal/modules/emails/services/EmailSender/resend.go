package emails_emailsender

import (
	"context"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/resend/resend-go/v2"
)

/* Implementation for the service of https://resend.com/ */
type ResendEmailSender struct {
	Container *container.Container
	client    *resend.Client
}

func NewResendEmailSender(container *container.Container) *ResendEmailSender {
	apiKey := container.Config().Resend.ApiKey

	client := resend.NewClient(apiKey)

	return &ResendEmailSender{
		Container: container,
		client:    client,
	}
}

func (s *ResendEmailSender) SendEmail(ctx context.Context, email *Email) error {
	logger := s.Container.Logger()

	params := &resend.SendEmailRequest{
		From:    email.From,
		To:      []string{email.To},
		Subject: email.Subject,
		Html:    email.Html,
	}

	sent, err := s.client.Emails.Send(params)

	if err != nil {
		logger.Error("Failed to send email", "error", err, "email", email)
		return err
	}

	logger.Info("Email sent: ", "sent", sent)
	return nil
}

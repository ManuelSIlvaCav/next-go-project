package tasks_events

import (
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	emails_service "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/emails/services"
	"golang.org/x/net/context"
)

type CreateUserParams struct {
	Email string `json:"email"`
}

func CreateUser(ctx context.Context, container *container.Container, emailService *emails_service.EmailService, params CreateUserParams) {
	/* Send an email */
	redirectURL := "http://localhost:3001/internal/login/redirect"
	err := emailService.SendNewUserEmail(ctx, params.Email, redirectURL)

	if err != nil {
		container.Logger().Error("Failed to send email", "error", err)
		return
	}

	container.Logger().Info("Email sent successfully", "email", params.Email)

}

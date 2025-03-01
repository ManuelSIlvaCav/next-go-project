package tasks_events

import (
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/emails"
	"golang.org/x/net/context"
)

type CreateUserParams struct {
	Email string `json:"email"`
}

func CreateUser(ctx context.Context, container *container.Container, emailModule *emails.EmailsModule, params CreateUserParams) {
	/* Send an email */
	err := emailModule.EmailService.SendNewUserEmail(ctx, params.Email)

	if err != nil {
		container.Logger().Error("Failed to send email", "error", err)
		return
	}

	container.Logger().Info("Email sent successfully", "email", params.Email)

}

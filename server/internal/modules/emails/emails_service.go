package emails

import "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"

type EmailService interface {
	SendEmail(to string, from string, subject string, body string) error
}

/* Implementation for the service of https://resend.com/ */
type ResendService struct {
	Container *container.Container
}

func NewResendService(container *container.Container) *ResendService {
	return &ResendService{
		Container: container,
	}
}

func (r *ResendService) SendEmail(to string, from string, subject string, body string) error {
	return nil
}

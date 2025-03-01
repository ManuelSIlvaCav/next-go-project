package emails_emailsender

import "context"

type Email struct {
	To      string
	Subject string
	Html    string
	From    string
}

type EmailSender interface {
	SendEmail(ctx context.Context, email *Email) error
}

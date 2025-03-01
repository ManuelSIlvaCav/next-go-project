package emails_service

import (
	"context"
	"strings"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	emails "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/emails/repositories"
	emails_emailsender "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/emails/services/EmailSender"
	"github.com/antchfx/htmlquery"
	"golang.org/x/net/html"
)

/* Implementation for the service of https://resend.com/ */
type EmailService struct {
	Container   *container.Container
	EmailSender emails_emailsender.EmailSender
	Repository  *emails.EmailTemplateRepository
}

func NewEmailService(container *container.Container, repository *emails.EmailTemplateRepository) *EmailService {
	return &EmailService{
		Container:   container,
		EmailSender: emails_emailsender.NewResendEmailSender(container),
		Repository:  repository,
	}
}

func (r *EmailService) SendEmail(ctx context.Context,
	to string, from string, subject string, html string) error {
	newEmail := &emails_emailsender.Email{
		To:      to,
		From:    from,
		Subject: subject,
		Html:    html,
	}
	r.EmailSender.SendEmail(ctx, newEmail)
	return nil
}

func (r *EmailService) SendNewUserEmail(ctx context.Context,
	to string) error {
	/* Get the default email for new user */
	emailTemplate, err := r.Repository.GetTemplateEmail(ctx, "user_created")

	if err != nil {
		return err
	}

	/* Send the email */
	r.EmailSender.SendEmail(ctx, &emails_emailsender.Email{
		To:      to,
		From:    "JobSprings <no-reply@jobspring.co.uk>",
		Subject: emailTemplate.Subject,
		Html:    emailTemplate.HTML,
	})

	return nil
}

type MagicLoginParams struct {
	Email string
	Token string
	UI    string
}

/* Important function to modify the html of the current email, useful while sending */
func (e *EmailService) addLoginMagicLink(ctx context.Context, s string, magicLoginParams MagicLoginParams) {

	/* http://localhost:3001/internal/login/redirect?em=manuel@gmail.com&tk=3a2ef644-95eb-4be4-9317-b1c0c4d9487c&ui=admin */

	/* <domain>/internal/login/redirect?em&tk&ui */

	logger := e.Container.Logger()

	doc, err := htmlquery.Parse(strings.NewReader(s))

	if err != nil {
		logger.Error("Failed to parse html", "error", err)
		return
	}

	list2 := htmlquery.Find(doc, "//*[contains(text(),'{{login}}')]")

	for _, n := range list2 {
		logger.Info("loggin inside", "inner", htmlquery.InnerText(n)) // output @href value

		parent := htmlquery.FindOne(n, "ancestor::a[1]")

		if parent != nil {

			parent.Attr = append(parent.Attr, html.Attribute{Key: "href", Val: "newHref"})

			logger.Info("Updated href", "new_href", parent.Attr)
		}
	}

}

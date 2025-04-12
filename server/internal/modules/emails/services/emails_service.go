package emails_service

import (
	"context"
	"strings"

	auth_repository "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/repository"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	emails_repository "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/emails/repositories"
	emails_emailsender "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/emails/services/EmailSender"
	"github.com/antchfx/htmlquery"
	"go.uber.org/fx"
	"golang.org/x/net/html"
)

/* Implementation for the service of https://resend.com/ */
type EmailService struct {
	Container      *container.Container
	EmailSender    emails_emailsender.EmailSender
	Repository     *emails_repository.EmailTemplateRepository
	AuthRepository *auth_repository.AuthRepository
}

type EmailServiceParams struct {
	fx.In
	Container      *container.Container
	EmailSender    *emails_emailsender.ResendEmailSender
	Repository     *emails_repository.EmailTemplateRepository
	AuthRepository *auth_repository.AuthRepository
}

func NewEmailService(params EmailServiceParams) *EmailService {
	return &EmailService{
		Container:      params.Container,
		EmailSender:    params.EmailSender,
		Repository:     params.Repository,
		AuthRepository: params.AuthRepository,
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
	emailTemplate, err := r.Repository.GetTemplateEmail(ctx, "user_created")

	if err != nil {
		return err
	}

	/* Create the login token */
	userLogin, err := r.AuthRepository.CreateUserMagicEmail(ctx, to)

	if err != nil {
		return err
	}

	/* Add the login link to the email */
	newHtml, err := r.addLoginMagicLink(ctx, emailTemplate.HTML, MagicLoginParams{
		Email: to,
		Token: userLogin.AuthenticationToken,
		UI:    "admin",
	})

	if err != nil {
		return err
	}

	/* Send the email */
	r.EmailSender.SendEmail(ctx, &emails_emailsender.Email{
		To:      to,
		From:    "Oikoflow <no-reply@oikoflow.com>",
		Subject: emailTemplate.Subject,
		Html:    newHtml,
	})

	return nil
}

type MagicLoginParams struct {
	Email string
	Token string
	UI    string
}

/* Important function to modify the html of the current email, useful while sending */
func (e *EmailService) addLoginMagicLink(ctx context.Context, s string, magicLoginParams MagicLoginParams) (string, error) {

	/* http://localhost:3001/internal/login/redirect?em=manuel@gmail.com&tk=3a2ef644-95eb-4be4-9317-b1c0c4d9487c&ui=admin */

	/* <domain>/internal/login/redirect?em&tk&ui */

	domain := "http://localhost:3001/internal/login/redirect"
	// domain := "https://jobspring.co.uk/internal/login/redirect"
	em := magicLoginParams.Email
	tk := magicLoginParams.Token
	ui := magicLoginParams.UI

	// ui := magicLoginParams.UI
	finalStringUrl := domain + "?em=" + em + "&tk=" + tk + "&ui=" + ui

	logger := e.Container.Logger()

	doc, err := htmlquery.Parse(strings.NewReader(s))

	if err != nil {
		logger.Error("Failed to parse html", "error", err)
		return "", err
	}

	n := htmlquery.FindOne(doc, "//*[contains(text(),'{{login}}')]")

	parent := htmlquery.FindOne(n, "ancestor::a[1]")

	if parent != nil {
		parent.Attr = append(parent.Attr, html.Attribute{Key: "href", Val: finalStringUrl})
		logger.Info("Updated href", "new_href", finalStringUrl, "attr", parent.Attr)
	}

	logger.Info("Login redirect url", "url", finalStringUrl)

	/* Replace the string for Login */
	n.FirstChild.Data = "Login"
	n.Data = "Login"

	return htmlquery.OutputHTML(doc, true), nil
}

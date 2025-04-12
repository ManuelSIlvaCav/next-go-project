package emails

import (
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/interfaces"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	emails "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/emails/handlers"
	emails_repositories "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/emails/repositories"
	emails_service "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/emails/services"
	emails_tasks "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/emails/tasks"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/router"

	emails_emailsender "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/emails/services/EmailSender"
	"go.uber.org/fx"
)

type EmailsModule struct {
	EmailService            *emails_service.EmailService
	EmailTemplateRepository *emails_repositories.EmailTemplateRepository
	container               *container.Container
	router                  *router.Router
	authModule              interfaces.AuthModule
}

type EmailsModuleParams struct {
	fx.In
	Container               *container.Container
	EmailService            *emails_service.EmailService
	EmailTemplateRepository *emails_repositories.EmailTemplateRepository
	Router                  *router.Router
	AuthModule              interfaces.AuthModule
}

func NewEmailsModule(params EmailsModuleParams) *EmailsModule {
	emailsModule := EmailsModule{
		EmailService:            params.EmailService,
		container:               params.Container,
		EmailTemplateRepository: params.EmailTemplateRepository,
		router:                  params.Router,
		authModule:              params.AuthModule,
	}

	emailsModule.SetRoutes()
	emailsModule.SetTasks()

	return &emailsModule
}

func (l *EmailsModule) GetDomain() string {
	return "/email_templates"
}

func (l *EmailsModule) SetRoutes() {
	group := l.router.MainGroup.Group(l.GetDomain())

	group.Use(l.authModule.AuthMiddleware())

	group.Add("POST", "", emails.CreateEmailTemplate(l.container,
		l.EmailTemplateRepository))
	group.Add("GET", "", emails.GetEmailTemplates(l.container,
		l.EmailTemplateRepository))
	group.Add("GET", "/:email_template_id", emails.GetEmailTemplate(l.container,
		l.EmailTemplateRepository))
}

func (l *EmailsModule) SetTasks() {
	mux := l.container.JobTasker().Mux()
	mux.Handle(emails_tasks.TypeSendEmail, emails_tasks.NewSendEmailProcessor(l))
}

func (l *EmailsModule) GetEmailService() *emails_service.EmailService {
	return l.EmailService
}

var Module = fx.Module("emailsfx",
	fx.Provide(emails_emailsender.NewResendEmailSender),
	fx.Provide(emails_service.NewEmailService),
	fx.Provide(emails_repositories.NewEmailTemplateRepository),
	fx.Provide(
		fx.Annotate(
			NewEmailsModule,
			fx.As(new(interfaces.EmailModule)),
		),
	),
)

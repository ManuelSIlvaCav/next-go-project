package emails

import (
	internal_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	emails "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/emails/handlers"
	emails_repositories "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/emails/repositories"
	emails_service "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/emails/services"
	"go.uber.org/fx"
)

type EmailsModule struct {
	EmailService            *emails_service.EmailService
	EmailTemplateRepository *emails_repositories.EmailTemplateRepository
	container               *container.Container
}

func NewEmailsModule(container *container.Container) *EmailsModule {

	emailTemplateRepository := emails_repositories.NewEmailTemplateRepository(container)

	return &EmailsModule{
		EmailService:            emails_service.NewEmailService(container, emailTemplateRepository),
		container:               container,
		EmailTemplateRepository: emailTemplateRepository,
	}
}

func (l *EmailsModule) GetDomain() string {
	return "/email_templates"
}

func (l *EmailsModule) GetHandlers() []internal_models.Route {
	routes := []internal_models.Route{}

	routes = append(routes,
		internal_models.Route{
			Method: "POST",
			Path:   "",
			Handler: emails.CreateEmailTemplate(l.container,
				l.EmailTemplateRepository),
			Description:   "Create an email template",
			Authenticated: true,
		},
		internal_models.Route{
			Method: "GET",
			Path:   "",
			Handler: emails.GetEmailTemplates(l.container,
				l.EmailTemplateRepository),
			Description:   "Get all email templates",
			Authenticated: true,
		},
		internal_models.Route{
			Method: "GET",
			Path:   "/:email_template_id",
			Handler: emails.GetEmailTemplate(l.container,
				l.EmailTemplateRepository),
			Description:   "Get template email",
			Authenticated: true,
		},
	)

	return routes
}

func (l *EmailsModule) GetTasks() []internal_models.Task {
	tasks := []internal_models.Task{}
	return tasks
}

func (l *EmailsModule) GetScheduledJobs() []internal_models.ScheduledJob {
	jobs := []internal_models.ScheduledJob{}
	return jobs
}

var Module = fx.Options(fx.Provide(NewEmailsModule))

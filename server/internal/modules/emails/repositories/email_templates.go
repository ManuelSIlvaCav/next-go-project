package emails

import (
	"context"
	"time"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	emails_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/emails/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/utils"
)

/* type CreateEmailTemplateParams struct {
	Name    string `json:"name" form:"name"`
	Subject string `json:"subject" form:"subject"`
	Body    string `json:"body" form:"body"`
	Design  string `json:"design" form:"design"`
	HTML    string `json:"html" form:"html"`
} */

type EmailTemplateRepository struct {
	container *container.Container
	utils.BaseRepository[emails_models.EmailTemplate]
}

func NewEmailTemplateRepository(container *container.Container) *EmailTemplateRepository {
	return &EmailTemplateRepository{
		container:      container,
		BaseRepository: *utils.NewBaseRepository[emails_models.EmailTemplate](container),
	}
}

func (e *EmailTemplateRepository) GetEmailTemplates(ctx context.Context, limit int, cursor int) ([]emails_models.EmailTemplate, error) {
	return e.BasePagination(ctx, "email_templates", limit, cursor)
}

func (e *EmailTemplateRepository) GetEmailTemplateByID(id string) (*emails_models.EmailTemplate, error) {
	logger := e.container.Logger()

	emailTemplate := &emails_models.EmailTemplate{}

	if err := e.container.DB().Db.QueryRow(
		"SELECT et.id, et.name, et.type, et.subject, et.created_at, et.updated_at, etd.design, etd.html FROM email_templates et INNER JOIN email_templates_data etd ON et.id = etd.id  WHERE et.id = $1",
		id,
	).Scan(
		&emailTemplate.ID,
		&emailTemplate.Name,
		&emailTemplate.Type,
		&emailTemplate.Subject,
		&emailTemplate.CreatedAt,
		&emailTemplate.UpdatedAt,
		&emailTemplate.Design,
		&emailTemplate.HTML,
	); err != nil {
		logger.Error("Failed to get email template by id", "error", err)
		return nil, err
	}

	return emailTemplate, nil
}

func (e *EmailTemplateRepository) CreateEmailTemplate(
	ctx context.Context, params emails_models.CreateEmailTemplateParams,
) (*emails_models.EmailTemplate, error) {
	logger := e.container.Logger()

	newEmailTemplate := &emails_models.EmailTemplate{
		Type:      params.Type,
		Name:      params.Name,
		Subject:   params.Subject,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	logger.Info("Creating email template", "email_template", newEmailTemplate)

	if err := e.container.DB().Db.QueryRowContext(
		ctx,
		"INSERT INTO email_templates (name, type, subject, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING id",
		newEmailTemplate.Name,
		newEmailTemplate.Type,
		newEmailTemplate.Subject,
		newEmailTemplate.CreatedAt,
		newEmailTemplate.UpdatedAt,
	).Scan(&newEmailTemplate.ID); err != nil {
		logger.Error("Failed to insert email_template", "error", err)
		return &emails_models.EmailTemplate{}, err
	}

	newEmailTemplateData := &emails_models.EmailTemplateData{}

	if err := e.container.DB().Db.QueryRowContext(
		ctx,
		"INSERT INTO email_templates_data (email_template_id, design, html) VALUES ($1, $2, $3) RETURNING id",
		newEmailTemplate.ID,
		params.Design,
		params.HTML,
	).Scan(&newEmailTemplateData.ID); err != nil {
		logger.Error("Failed to insert email_template_data", "error", err)
		return &emails_models.EmailTemplate{}, err
	}
	return newEmailTemplate, nil
}

func (e *EmailTemplateRepository) CreateBusinessTemplateEmail(ctx context.Context, params emails_models.CreateBusinessTemplateEmailParams,
) (*emails_models.BusinessEmailTemplate, error) {
	logger := e.container.Logger()

	newEmailTemplate := &emails_models.BusinessEmailTemplate{
		EmailTemplate: emails_models.EmailTemplate{
			Name:      params.Name,
			Subject:   params.Subject,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		BusinessID: params.BusinessID,
	}

	logger.Info("Creating email template", "email_template", newEmailTemplate)

	if err := e.container.DB().Db.QueryRowContext(
		ctx,
		"INSERT INTO businesses_email_templates (business_id, name, subject, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING id",
		newEmailTemplate.BusinessID,
		newEmailTemplate.Name,
		newEmailTemplate.Subject,
		newEmailTemplate.CreatedAt,
		newEmailTemplate.UpdatedAt,
	).Scan(&newEmailTemplate.ID); err != nil {
		logger.Error("Failed to insert email_template", "error", err)
		return &emails_models.BusinessEmailTemplate{}, err
	}

	newEmailTemplateData := &emails_models.EmailTemplateData{}

	if err := e.container.DB().Db.QueryRowContext(
		ctx,
		"INSERT INTO email_templates_data (email_template_id, design, html) VALUES ($1, $2, $3) RETURNING id",
		newEmailTemplate.ID,
		params.Design,
		params.HTML,
	).Scan(&newEmailTemplateData.ID); err != nil {
		logger.Error("Failed to insert email_template_data", "error", err)
		return &emails_models.BusinessEmailTemplate{}, err
	}
	return newEmailTemplate, nil
}

/* Gets the first email template for the category */
func (e *EmailTemplateRepository) GetTemplateEmail(ctx context.Context, emailType string) (*emails_models.EmailTemplate, error) {
	logger := e.container.Logger()

	logger.Info("Getting email template", "email_type", emailType)

	emailTemplate := &emails_models.EmailTemplate{}

	if err := e.container.DB().Db.QueryRowContext(
		ctx,
		"SELECT et.id, et.name, et.type, et.subject, et.created_at, et.updated_at, etd.design, etd.html FROM email_templates et INNER JOIN email_templates_data etd ON et.id = etd.id  WHERE et.type = $1 ORDER BY et.id LIMIT 1",
		emailType,
	).Scan(
		&emailTemplate.ID,
		&emailTemplate.Name,
		&emailTemplate.Type,
		&emailTemplate.Subject,
		&emailTemplate.CreatedAt,
		&emailTemplate.UpdatedAt,
		&emailTemplate.Design,
		&emailTemplate.HTML,
	); err != nil {
		logger.Error("Failed to get email template by id", "error", err)
		return nil, err
	}

	return emailTemplate, nil

}

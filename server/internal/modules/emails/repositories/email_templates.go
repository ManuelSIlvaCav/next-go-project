package emails

import (
	"context"
	"encoding/json"
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
	/* logger := e.container.Logger()

	emailTemplates := []emails_models.EmailTemplate{}

	queryLimit := limit
	if queryLimit == 0 {
		queryLimit = 10 // default value
	}

	var rows *sql.Rows
	var err error

	if cursor == 0 {
		rows, err = e.container.DB().Db.QueryContext(ctx, "SELECT id, name, created_at FROM email_templates ORDER BY id DESC LIMIT $1", queryLimit)
	} else {
		rows, err = e.container.DB().Db.QueryContext(ctx, "SELECT id, name, created_at FROM email_templates WHERE id < $1 ORDER BY id DESC LIMIT $2", cursor, queryLimit)

	}

	if err != nil {
		logger.Error("Failed to get email_template pagination", "error", err)
		return nil, err

	}

	defer rows.Close()

	for rows.Next() {
		emailTemplate := emails_models.EmailTemplate{}
		err := rows.Scan(&emailTemplate.ID, &emailTemplate.Name, &emailTemplate.CreatedAt)

		if err != nil {
			logger.Error("Failed to scan email_template", "error", err)
			return nil, err
		}
		emailTemplates = append(emailTemplates, emailTemplate)
	}

	return emailTemplates, nil */
}

func (e *EmailTemplateRepository) GetEmailTemplateByID(id string) (*emails_models.EmailTemplate, error) {
	return nil, nil
}

func (e *EmailTemplateRepository) CreateEmailTemplate(ctx context.Context, params emails_models.CreateEmailTemplateParams,
) (*emails_models.EmailTemplate, error) {
	logger := e.container.Logger()

	newEmailTemplate := &emails_models.EmailTemplate{
		Name:    params.Name,
		Subject: params.Subject,
		MetaData: emails_models.EmailTemplateMetadata{
			Design:  params.Design,
			HTML:    params.HTML,
			Type:    "Unlayer",
			Version: "1",
		},
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	logger.Info("Creating email template", "email_template", newEmailTemplate)

	meta_data, _ := json.Marshal(newEmailTemplate.MetaData)

	if err := e.container.DB().Db.QueryRowContext(
		ctx,
		"INSERT INTO email_templates (name, subject, created_at, updated_at, meta_data) VALUES ($1, $2, $3, $4, $5) RETURNING id",
		newEmailTemplate.Name,
		newEmailTemplate.Subject,
		newEmailTemplate.CreatedAt,
		newEmailTemplate.UpdatedAt,
		meta_data,
	).Scan(&newEmailTemplate.ID); err != nil {
		logger.Error("Failed to insert email_template", "error", err)
		return &emails_models.EmailTemplate{}, err
	}

	return newEmailTemplate, nil
}

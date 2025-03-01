package emails_models

import (
	"time"
)

type CreateBusinessTemplateEmailParams struct {
	BusinessID string `json:"business_id" params:"business_id"`
	CreateEmailTemplateParams
}

type CreateEmailTemplateParams struct {
	/* BusinessID string `json:"business_id"` */
	Name    string `json:"name"`
	Type    string `json:"type" validate:"required,oneof=user_created userlogin" errormgs:"type is required"`
	Subject string `json:"subject"`
	Body    string `json:"body"`
	Design  string `json:"design"`
	HTML    string `json:"html"`
}

type BusinessEmailTemplate struct {
	EmailTemplate
	BusinessID string `json:"business_id" db:"business_id"`
}

type EmailTemplate struct {
	ID      string `json:"id" db:"id"`
	Type    string `json:"type" db:"type"`
	Name    string `json:"name" db:"name"`
	Subject string `json:"subject" db:"subject"`

	Design string `json:"design" db:"design"`
	HTML   string `json:"html" db:"html"`

	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

type EmailTemplateData struct {
	ID              string      `json:"id" db:"id"`
	EmailTemplateID string      `json:"email_template_id" db:"email_template_id"`
	Design          interface{} `json:"design" db:"design"`
	HTML            string      `json:"html" db:"html"`
	/* Type            string      `json:"type" db:"type"` // in case we swap to other providers
	Version         string      `json:"version" db:"version"` */
}

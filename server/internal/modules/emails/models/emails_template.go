package emails_models

import (
	"encoding/json"
	"time"
)

type CreateEmailTemplateParams struct {
	/* BusinessID string `json:"business_id"` */
	Name    string `json:"name"`
	Subject string `json:"subject"`
	Body    string `json:"body"`
	Design  string `json:"design"`
	HTML    string `json:"html"`
}

type EmailTemplate struct {
	ID string `json:"id" db:"id"`
	/* BusinessID string                `json:"business_id" db:"business_id"` */
	Name      string                `json:"name" db:"name"`
	Subject   string                `json:"subject" db:"subject"`
	MetaData  EmailTemplateMetadata `json:"meta_data" db:"meta_data"`
	CreatedAt time.Time             `json:"created_at" db:"created_at"`
	UpdatedAt time.Time             `json:"updated_at" db:"updated_at"`
}

type EmailTemplateMetadata struct {
	Design  interface{} `json:"design" db:"design"`
	HTML    string      `json:"html" db:"html"`
	Type    string      `json:"type" db:"type"` // in case we swap to other providers
	Version string      `json:"version" db:"version"`
}

func (meta *EmailTemplateMetadata) Scan(value interface{}) error {
	return json.Unmarshal(value.([]byte), meta)
}

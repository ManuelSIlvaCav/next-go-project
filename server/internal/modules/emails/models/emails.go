package emails_models

import "time"

type Email struct {
	ID         string `json:"id" db:"id"`
	To         string `json:"to" db:"to"`
	From       string `json:"from" db:"from"`
	Subject    string `json:"subject" db:"subject"`
	Body       string `json:"body" db:"body"`
	Status     string `json:"status" db:"status"`
	TemplateID string `json:"template_id" db:"template_id"`
}

type EmailEvent struct {
	ID      string `json:"id" db:"id"`
	EmailID string `json:"email_id" db:"email_id"`
	To      string `json:"to" db:"to"`
	From    string `json:"from" db:"from"`
	/* Possible types are
	sent, delivered, delivered_delayed, opened, clicked, bounced, complained,
	*/
	Type string `json:"type" db:"type"`

	CreatedAt time.Time `json:"created_at" db:"created_at"`
	EventDate time.Time `json:"event_date" db:"event_date"`
}

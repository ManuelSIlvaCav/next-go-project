package workflow_models

import "time"

type WorkFlow struct {
	ID       int64     `json:"id" db:"id"`
	Name     string    `json:"name" db:"name"`
	Triggers []Trigger `json:"triggers" db:"triggers"`
}

type WorkflowState struct {
	ID         int64     `json:"id" db:"id"`
	WorkflowID string    `json:"workflow_id" db:"workflow_id"`
	Name       string    `json:"name" db:"name"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
}

type Trigger struct {
	ID        int64   `json:"id" db:"id"`
	Name      string  `json:"name" db:"name"`
	Type      string  `json:"type" db:"type"` //Event trigger, Value
	Condition string  `json:"condition" db:"condition"`
	Action    *Action `json:"action"`
}

type Action struct {
	ID   string `json:"id" db:"id"`
	Type string `json:"type" db:"type"` //Email, SMS, Webhook
}

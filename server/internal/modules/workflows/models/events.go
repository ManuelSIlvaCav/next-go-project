package workflow_models

import "time"

/* Each action will emit an event */
type Event struct {
	ID        string      `json:"id" db:"id"`
	Name      string      `json:"name" db:"name"`
	Metadata  interface{} `json:"metadata" db:"meta_data"`
	CreatedAt time.Time   `json:"created_at" db:"created_at"`
}

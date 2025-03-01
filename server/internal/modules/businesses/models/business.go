package businesses_models

import "time"

type CreateBusinessParams struct {
	Name       string `json:"name"`
	Identifier string `json:"identifier"`
	LegalName  string `json:"legal_name"`
	IsActive   bool   `json:"is_active"`
	IsAdmin    bool   `json:"is_admin"`
}

type Business struct {
	ID         string    `json:"id" db:"id"`
	Name       string    `json:"name" db:"name"`
	Identifier string    `json:"identifier" db:"identifier"`
	LegalName  string    `json:"legal_name" db:"legal_name"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
	IsActive   bool      `json:"is_active" db:"is_active"`
	IsAdmin    bool      `json:"is_admin" db:"is_admin"` /* Only applies for the main organization to handle the dashboard admin*/
}

type BusinessConfiguration struct {
	BusinessID string `json:"business_id" db:"business_id"`
	Domain     string `json:"domain" db:"domain"`
}

package clients

import (
	"time"
)

type Contact struct {
	ID        int64     `json:"id" db:"id"`
	ClientID  string    `json:"client_id" db:"client_id"`
	Phone     string    `json:"phone,omitempty" db:"phone"`
	Email     string    `json:"email" db:"email"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type Identification struct {
	ClientID             int    `json:"client_id"`
	IdentificationType   string `json:"identification_type"`
	IdentificationNumber string `json:"identification_number"`
}

type Client struct {
	ID           string    `json:"id" db:"id"`
	BusinessID   int64     `json:"business_id" db:"business_id"`
	FirstName    string    `json:"first_name" db:"first_name"`
	MiddleName   string    `json:"middle_name,omitempty" db:"middle_name"`
	LastName     string    `json:"last_name" db:"last_name"`
	Email        string    `json:"email" db:"email"`
	PasswordHash string    `json:"-" db:"password_hash"` // Don't include in JSON responses
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
}

// DTOs for client operations
type CreateClientParams struct {
	BusinessID   int64  `json:"business_id" validate:"required"`
	FirstName    string `json:"first_name" validate:"required,min=1,max=255"`
	MiddleName   string `json:"middle_name,omitempty" validate:"omitempty,max=255"`
	LastName     string `json:"last_name" validate:"required,min=1,max=255"`
	Email        string `json:"email" validate:"required,email"`
	Phone        string `json:"phone,omitempty" validate:"omitempty,max=255"`
	PasswordHash string `json:"-"` // Password hash, not included in JSON
}

type UpdateClientParams struct {
	ID         string  `json:"id" validate:"required"`
	FirstName  *string `json:"first_name,omitempty" validate:"omitempty,min=1,max=255"`
	MiddleName *string `json:"middle_name,omitempty" validate:"omitempty,max=255"`
	LastName   *string `json:"last_name,omitempty" validate:"omitempty,min=1,max=255"`
	Email      *string `json:"email,omitempty" validate:"omitempty,email"`
}

type GetClientParams struct {
	ID         string `json:"id" validate:"required"`
	BusinessID string `json:"business_id" validate:"required"`
}

type GetClientsParams struct {
	BusinessID string `json:"business_id" validate:"required"`
	Limit      int    `json:"limit,omitempty"`
	Cursor     string `json:"cursor,omitempty"`
	Email      string `json:"email,omitempty"`
}

type ClientWithContact struct {
	Client
	Contact *Contact `json:"contact,omitempty"`
}

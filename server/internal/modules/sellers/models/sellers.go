package sellers_models

import (
	"time"

	validation "github.com/go-ozzo/ozzo-validation/v4"
	"github.com/go-ozzo/ozzo-validation/v4/is"
	"github.com/google/uuid"
)

type Seller struct {
	ID           string    `json:"id" db:"id"`
	BusinessID   int64     `json:"business_id" db:"business_id"`
	Email        string    `json:"email" db:"email"`
	PasswordHash string    `json:"-" db:"password_hash"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time `json:"updated_at" db:"updated_at"`
}

type SellerData struct {
	ID        int       `json:"id" db:"id"`
	SellerID  string    `json:"seller_id" db:"seller_id"`
	FirstName string    `json:"first_name" db:"first_name"`
	LastName  string    `json:"last_name" db:"last_name"`
	Phone     string    `json:"phone" db:"phone"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

// DTO for complete seller information
type SellerDTO struct {
	ID         string    `json:"id"`
	BusinessID int64     `json:"business_id"`
	Name       string    `json:"name"`
	Email      string    `json:"email"`
	FirstName  string    `json:"first_name,omitempty"`
	LastName   string    `json:"last_name,omitempty"`
	Phone      string    `json:"phone,omitempty"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

type CreateSellerParams struct {
	BusinessID      int64  `json:"business_id"`
	Email           string `json:"email"`
	Password        string `json:"password"`
	ConfirmPassword string `json:"confirm_password"`
	FirstName       string `json:"first_name"`
	LastName        string `json:"last_name"`
	Phone           string `json:"phone"`
}

func (params CreateSellerParams) Validate() error {
	return validation.ValidateStruct(&params,
		validation.Field(&params.BusinessID, validation.Required.Error("business_id is required"), validation.Min(1).Error("business_id must be greater than 0")),
		validation.Field(&params.Email, validation.Required.Error("email is required"), is.Email),
		validation.Field(&params.Password, validation.Required.Error("password is required"), validation.Length(6, 0)),
		validation.Field(&params.ConfirmPassword, validation.Required.Error("confirm_password is required"), validation.By(func(value interface{}) error {
			if value != params.Password {
				return validation.NewError("validation_confirm_password", "confirm_password must match password")
			}
			return nil
		})),
		validation.Field(&params.FirstName, validation.Length(0, 255), validation.Required.Error("first_name is required")),
		validation.Field(&params.LastName, validation.Length(0, 255), validation.Required.Error("last_name is required")),
		validation.Field(&params.Phone, validation.Length(0, 50)),
	)
}

type GetSellerParams struct {
	ID         string `json:"id" validate:"required"`
	BusinessID int64  `json:"business_id"`
}

// Helper function to generate new UUID for sellers
func GenerateSellerID() string {
	return uuid.New().String()
}

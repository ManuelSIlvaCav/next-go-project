package accounting_models

import "time"

type EntityType struct {
	EntityTypeCode string `json:"entity_type_code" `
	EntityTypeName string `json:"entity_type_name" `
}

type AccountTypesExt struct {
	EntityTypeCode string `json:"entity_type_code" `
	EntityTypeName string `json:"entity_type_name" `
}

type CreateAccountParams struct {
	AccountNumber string `json:"account_number" db:"account_number"`
	AccountName   string `json:"account_name" db:"account_name"`
}

type Account struct {
	ID            string    `json:"id" db:"id"`
	AccountNumber string    `json:"account_number" db:"account_number"`
	AccountName   string    `json:"account_name" db:"account_name"`
	CreatedAt     time.Time `json:"created_at" db:"created_at"`
	UpdatedAt     time.Time `json:"updated_at" db:"updated_at"`
}

type AccountDefaultNumber string

const (
	CustomerGeneralAccount AccountDefaultNumber = "1000"
)

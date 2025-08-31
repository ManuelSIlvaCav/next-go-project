package insurance_modules

import "time"

type Policy struct {
	ID           string    `json:"id" db:"id"`
	PolicyNumber string    `json:"policy_number" db:"policy_number"`
	DisplayName  string    `json:"display_name" db:"display_name"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time `json:"updated_at" db:"updated_at"`
}

type PolicyCreateParams struct {
	DisplayName string `json:"display_name"`
}

type PolicyVariant struct {
	ID          string    `json:"id" db:"id"`
	PolicyID    string    `json:"policy_id" db:"policy_id"`
	DisplayName string    `json:"display_name" db:"display_name"`
	Excess      float64   `json:"excess" db:"excess"`
	Copay       float64   `json:"copay" db:"copay"`
	PayoutLimit float64   `json:"payout_limit" db:"payout_limit"`
	Currency    string    `json:"currency" db:"currency"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}

type PolicyVariantCreateParams struct {
	PolicyID    string  `json:"policy_id" param:"id"`
	DisplayName string  `json:"display_name"`
	Excess      float64 `json:"excess"`
	Copay       float64 `json:"copay"`
	PayoutLimit float64 `json:"payout_limit"`
	Currency    string  `json:"currency"`
}

type GetPolicyDTO struct {
	Policy         *Policy          `json:"policy"`
	PolicyVariants []*PolicyVariant `json:"policy_variants"`
}

type GetPoliciesDTO struct {
	Policies []*GetPolicyDTO `json:"policies"`
}

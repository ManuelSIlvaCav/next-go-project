package accounting_models

import "time"

type TransactionTypeCode string

const (
	TransactionCreditType TransactionTypeCode = "CR"
	TransactionDebitType  TransactionTypeCode = "DR"
)

/* Transaction types for internal movements between ledgers */
type TransactionType struct {
	XActTypeCode TransactionTypeCode `json:"code" db:"xact_type_code"`
	XActTypeName string              `json:"name" db:"xact_type_name"`
}

type TransactionTypeExtCode string

type TransactionTypeExt struct {
	XActTypeCodeExt TransactionTypeExtCode `json:"code" db:"xact_type_code_ext"`
	XActTypeNameExt string                 `json:"name" db:"xact_type_name_ext"`
}

const (
	SalesOrder     = "SO"
	MerchantFee    = "MF"
	MerchantPayout = "MP"
	Refund         = "RF"
)

type LedgerTransaction struct {
	ID         string    `json:"id" db:"id"`
	LedgerIDCR int       `json:"ledger_id_cr" db:"ledger_id_cr"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
	LedgerIDDR int       `json:"ledger_id_dr" db:"ledger_id_dr"`
	Amount     float64   `json:"amount" db:"amount"`
}

type AccountTransactionCreateParams struct {
	AccountID string  `json:"account_id"`
	Amount    float64 `json:"amount"`
}

type AccountTransaction struct {
	LedgerNumber       LedgerNumbers `json:"ledger_number" db:"ledger_number"`
	AccountTypeCode    string        `json:"account_type_code" db:"account_type_code"`
	AccountTypeCodeExt string        `json:"account_type_code_ext" db:"account_type_code_ext"`
	AccountNumber      string        `json:"account_number" db:"account_number"`
	Amount             float64       `json:"amount" db:"amount"`
}

type AccountTransactionDTO struct {
	ID                 string        `json:"id" db:"id"`
	LedgerNumber       LedgerNumbers `json:"ledger_number" db:"ledger_number"`
	CreatedAt          time.Time     `json:"created_at" db:"created_at"`
	AccountTypeCode    string        `json:"account_type_code" db:"account_type_code"`
	AccountTypeCodeExt string        `json:"account_type_code_ext" db:"account_type_code_ext"`
	AccountNumber      string        `json:"account_number" db:"account_number"`
	Amount             float64       `json:"amount" db:"amount"`
}

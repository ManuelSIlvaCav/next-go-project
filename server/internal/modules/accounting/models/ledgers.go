package accounting_models

import "time"

type LedgerTypes string

const (
	AccountTypeAsset     LedgerTypes = "AA"
	AccountTypeLiability LedgerTypes = "AL"
	AccountTypeRevenue   LedgerTypes = "RR"
	AccountTypeExpense   LedgerTypes = "EE"
)

type AccountTypes struct {
	AccountTypeCode LedgerTypes `json:"account_type_code" db:"account_type_code"`
	AccountTypeName string      `json:"account_type_name" db:"account_type_name"`
}

type LedgerNumbers string

const (
	LedgerMainRevenue     LedgerNumbers = "600"
	LedgerMainExpense     LedgerNumbers = "700"
	LedgerMainAssets      LedgerNumbers = "800"
	LedgerMainLiabilities LedgerNumbers = "900"
)

type Ledger struct {
	ID              string      `json:"id" db:"id"`
	LedgerNumber    string      `json:"ledger_number" db:"ledger_number"`
	AccountTypeCode LedgerTypes `json:"account_type_code" db:"account_type_code"`
	LedgerName      string      `json:"ledger_name" db:"ledger_name"`
	CreatedAt       time.Time   `json:"created_at" db:"created_at"`
}

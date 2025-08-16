package accounting_repositories

import (
	"context"

	accounting_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/accounting/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container/database"
)

type TransactionsRepository struct {
	container  *container.Container
	transactor *database.Transactor
	dbTxGetter database.DBGetter
}

func NewTransactionsRepository(container *container.Container) *TransactionsRepository {
	transactor, dbTxGetter := database.NewTransactor(
		container.DB().Db,
		database.NestedTransactionsSavepoints,
	)

	return &TransactionsRepository{
		container:  container,
		transactor: transactor,
		dbTxGetter: dbTxGetter,
	}
}

func (r *TransactionsRepository) CreateAccountingTransactionWithinTransactor(ctx context.Context, callback func(ctx context.Context) error) error {
	return r.transactor.WithinTransaction(
		ctx,
		callback,
	)
}

/* This method accepts the context to be a tx.  */
func (r *TransactionsRepository) CreateAccountTransaction(
	ctx context.Context,
	params *accounting_models.AccountTransaction) (*accounting_models.AccountTransactionDTO, error) {
	newTransaction := &accounting_models.AccountTransactionDTO{
		LedgerNumber:       params.LedgerNumber,
		AccountTypeCode:    params.AccountTypeCode,
		AccountTypeCodeExt: params.AccountTypeCodeExt,
		AccountNumber:      params.AccountNumber,
		Amount:             params.Amount,
	}

	query := `
		INSERT INTO acc_account_transactions (ledger_number, account_type_code, account_type_code_ext, account_number, amount)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id
	`

	db := r.dbTxGetter(ctx)

	if err := db.QueryRow(query, newTransaction.LedgerNumber, newTransaction.AccountTypeCode, newTransaction.AccountTypeCodeExt, newTransaction.AccountNumber, newTransaction.Amount).Scan(&newTransaction.ID); err != nil {
		return nil, err
	}

	return newTransaction, nil
}

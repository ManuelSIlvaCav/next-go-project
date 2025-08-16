package accounting_repositories

import (
	"context"

	accounting_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/accounting/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
)

type AccountsRepository struct {
	container *container.Container
}

func NewAccountsRepository(container *container.Container) *AccountsRepository {
	return &AccountsRepository{
		container: container,
	}
}

func (r *AccountsRepository) CreateAccount(ctx context.Context, params accounting_models.CreateAccountParams) *accounting_models.Account {
	newAccount := &accounting_models.Account{
		AccountNumber: params.AccountNumber,
		AccountName:   params.AccountName,
	}

	query := `
		INSERT INTO acc_accounts (account_number, account_name)
		VALUES ($1, $2)
		RETURNING id, created_at, updated_at
	`

	if err := r.container.DB().Db.QueryRowContext(ctx, query, newAccount.AccountNumber, newAccount.AccountName).Scan(&newAccount.ID, &newAccount.CreatedAt, &newAccount.UpdatedAt); err != nil {
		return nil
	}
	return newAccount
}

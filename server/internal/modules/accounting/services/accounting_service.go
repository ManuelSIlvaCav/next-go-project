package accounting_services

import (
	"context"
	"fmt"

	accounting_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/accounting/models"
	accounting_repositories "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/accounting/repositories"
)

type AccountingService struct {
	TransactionRepository *accounting_repositories.TransactionsRepository
	AccountingRepository  *accounting_repositories.AccountsRepository
}

func NewAccountingService(transactionRepository *accounting_repositories.TransactionsRepository, accountingRepository *accounting_repositories.AccountsRepository) *AccountingService {
	return &AccountingService{
		TransactionRepository: transactionRepository,
		AccountingRepository:  accountingRepository,
	}
}

func (s *AccountingService) CreateOrderTransactions(
	ctx context.Context,
	merchantAccountNumber string,
	amount float64,
) {
	// When and Order is created
	// 1. Credit on main Revenue (and Debit CustomerGeneralAccount)
	// 2. Debit on main Liabilities (and Credit MerchantPayout)
	callbackFunction := func(callbackCtx context.Context) error {
		feePercentage := 0.02 // Example fee percentage
		feeAmount := amount * feePercentage
		totalMinusFee := amount - feeAmount

		accountTransaction1, err := s.TransactionRepository.CreateAccountTransaction(
			callbackCtx,
			&accounting_models.AccountTransaction{
				LedgerNumber:       accounting_models.LedgerMainRevenue,
				AccountTypeCode:    string(accounting_models.TransactionCreditType),
				AccountTypeCodeExt: accounting_models.SalesOrder,
				AccountNumber:      string(accounting_models.CustomerGeneralAccount),
				Amount:             amount,
			},
		)

		if err != nil {
			return err
		}

		fmt.Printf("Created transaction1: %+v\n", accountTransaction1)

		accountTransaction2, err := s.TransactionRepository.CreateAccountTransaction(
			callbackCtx,
			&accounting_models.AccountTransaction{
				LedgerNumber:       accounting_models.LedgerMainLiabilities,
				AccountTypeCode:    string(accounting_models.TransactionDebitType),
				AccountTypeCodeExt: accounting_models.MerchantPayout,
				AccountNumber:      merchantAccountNumber,
				Amount:             totalMinusFee,
			},
		)

		if err != nil {
			return err
		}

		fmt.Printf("Created transaction2: %+v\n", accountTransaction2)

		return nil
	}

	s.TransactionRepository.CreateAccountingTransactionWithinTransactor(ctx, callbackFunction)
}

package accounting

import (
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/interfaces"
	accounting_handlers "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/accounting/handlers"
	accounting_repositories "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/accounting/repositories"
	accounting_services "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/accounting/services"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/router"
	"go.uber.org/fx"
)

type AccountingModule struct {
	container         *container.Container
	router            *router.Router
	authModule        auth.IAuthModule
	accountingService *accounting_services.AccountingService
}

func NewAccountingModule(container *container.Container,
	router *router.Router,
	authModule auth.IAuthModule) *AccountingModule {

	accountingService := accounting_services.NewAccountingService(
		accounting_repositories.NewTransactionsRepository(container),
		accounting_repositories.NewAccountsRepository(container),
	)

	module := &AccountingModule{
		container:         container,
		router:            router,
		authModule:        authModule,
		accountingService: accountingService,
	}

	module.SetRoutes()
	return module
}

func (m *AccountingModule) GetDomain() string {
	return "/accounting"
}

func (m *AccountingModule) SetRoutes() {
	group := m.router.MainGroup.Group(m.GetDomain())
	group.Add("POST", "/generate-transaction", accounting_handlers.GenerateTransaction(m.accountingService))
}

func (m *AccountingModule) GetAccountingRepository() *accounting_repositories.AccountsRepository {
	return m.accountingService.AccountingRepository
}

func (m *AccountingModule) GetTransactionsRepository() *accounting_repositories.TransactionsRepository {
	return m.accountingService.TransactionRepository
}

var Module = fx.Module("accountingfx",
	fx.Provide(accounting_repositories.NewAccountsRepository, accounting_repositories.NewTransactionsRepository),
	fx.Provide(accounting_services.NewAccountingService),
	fx.Provide(
		fx.Annotate(
			NewAccountingModule,
			fx.As(new(interfaces.AccountingModule)),
		),
	),
)

package modules

import (
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/interfaces"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/accounting"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/businesses"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/clients"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/emails"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/files"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/insurance"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/listings"
	"go.uber.org/fx"
)

type InternalModule struct {
	Container        *container.Container
	FilesModule      *files.FilesModule
	BusinessesModule interfaces.BusinessModule
	AuthModule       interfaces.AuthModule
	EmailsModule     interfaces.EmailModule
	ListingModule    interfaces.ListingsModule
	AccountingModule interfaces.AccountingModule
	InsuranceModule  interfaces.InsuranceModule
	ClientsModule    interfaces.ClientsModule
}

type AllModulesParams struct {
	fx.In
	Container        *container.Container
	FilesModule      *files.FilesModule
	BusinessesModule interfaces.BusinessModule
	AuthModule       interfaces.AuthModule
	EmailsModule     interfaces.EmailModule
	ListingModule    interfaces.ListingsModule
	AccountingModule interfaces.AccountingModule
	InsuranceModule  interfaces.InsuranceModule
	ClientsModule    interfaces.ClientsModule
}

func NewInternalModule(
	params AllModulesParams,
) *InternalModule {

	return &InternalModule{
		Container:        params.Container,
		FilesModule:      params.FilesModule,
		BusinessesModule: params.BusinessesModule,
		AuthModule:       params.AuthModule,
		EmailsModule:     params.EmailsModule,
		ListingModule:    params.ListingModule,
		AccountingModule: params.AccountingModule,
		InsuranceModule:  params.InsuranceModule,
		ClientsModule:    params.ClientsModule,
	}
}

var Module = fx.Options(
	container.Module,
	auth.Module,
	files.Module,
	listings.Module,
	clients.Module,
	emails.Module,
	businesses.Module,
	accounting.Module,
	insurance.Module,
	fx.Provide(NewInternalModule),
)

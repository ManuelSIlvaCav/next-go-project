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
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/listings"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/scrapper"
	"go.uber.org/fx"
)

type InternalModule struct {
	Container *container.Container
}

type AllModulesParams struct {
	fx.In
	container        *container.Container
	filesModule      *files.FilesModule
	clientsModule    *clients.ClientModule
	businessesModule interfaces.BusinessModule
	authModule       interfaces.AuthModule
	emailsModule     interfaces.EmailModule
	listingModule    interfaces.ListingsModule
	scrapperModule   interfaces.ScrapperModule
	accountingModule interfaces.AccountingModule
}

func NewInternalModule(
	container *container.Container,
	filesModule *files.FilesModule,
	clientsModule *clients.ClientModule,
	businessesModule interfaces.BusinessModule,
	authModule interfaces.AuthModule,
	emailsModule interfaces.EmailModule,
	listingModule interfaces.ListingsModule,
	scrapperModule interfaces.ScrapperModule,
	accountingModule interfaces.AccountingModule,
) *InternalModule {

	return &InternalModule{Container: container}
}

var Module = fx.Options(
	container.Module,
	auth.Module,
	files.Module,
	listings.Module,
	clients.Module,
	emails.Module,
	businesses.Module,
	scrapper.Module,
	accounting.Module,
	fx.Provide(NewInternalModule),
)

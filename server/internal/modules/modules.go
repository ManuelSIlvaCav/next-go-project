package modules

import (
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/interfaces"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/businesses"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/clients"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/emails"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/files"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/listings"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/projects"
	"go.uber.org/fx"
)

type InternalModule struct {
	Container *container.Container
}

const (
	EmailsModuleKey   = "emails"
	AuthModuleKey     = "auth"
	BusinessModuleKey = "businesses"
	ClientModuleKey   = "clients"
	ListingModuleKey  = "listings"
	ProjectsModuleKey = "projects"
)

type AllModulesParams struct {
	fx.In
	container        *container.Container
	filesModule      *files.FilesModule
	listingModule    *listings.ListingModule
	clientsModule    *clients.ClientModule
	projectsModule   *projects.ProjectsModule
	businessesModule interfaces.BusinessModule
	authModule       interfaces.AuthModule
	emailsModule     interfaces.EmailModule
}

func NewInternalModule(
	container *container.Container,
	filesModule *files.FilesModule,
	listingModule *listings.ListingModule,
	clientsModule *clients.ClientModule,
	projectsModule *projects.ProjectsModule,
	businessesModule interfaces.BusinessModule,
	authModule interfaces.AuthModule,
	emailsModule interfaces.EmailModule,
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
	projects.Module,
	businesses.Module,
	fx.Provide(NewInternalModule),
)

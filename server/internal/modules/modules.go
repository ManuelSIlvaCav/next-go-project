package modules

import (
	internal_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/clients"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/files"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/listings"
	"go.uber.org/fx"
)

type InternalModule struct {
	Container *container.Container
	Modules   []internal_models.IModule
}

func NewInternalModule(
	container *container.Container,
	filesModule *files.FilesModule,
	listingModule *listings.ListingModule,
	clientsModule *clients.ClientModule,
) *InternalModule {
	modules := []internal_models.IModule{
		filesModule,
		listingModule,
		clientsModule,
	}
	return &InternalModule{Container: container, Modules: modules}
}

var Module = fx.Options(
	container.Module,
	files.Module,
	listings.Module,
	clients.Module,
	fx.Provide(NewInternalModule),
)

package internal

import (
	"server/internal/container"
	"server/internal/files"
	"server/internal/listings"
	"server/internal/router"

	"go.uber.org/fx"
)

type InternalModule struct {
	Container *container.Container
}

func NewInternalModule(
	container *container.Container,
	filesModule *files.FilesModule,
	listingModule *listings.ListingModule) *InternalModule {
	return &InternalModule{Container: container}
}

var Module = fx.Options(
	router.Module,
	container.Module,
	files.Module,
	listings.Module,
	fx.Provide(NewInternalModule),
)

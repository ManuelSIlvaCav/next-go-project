package utils

import "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"

type BaseModule struct {
	container *container.Container
}

func NewBaseModule(container *container.Container) *BaseModule {
	return &BaseModule{
		container: container,
	}
}

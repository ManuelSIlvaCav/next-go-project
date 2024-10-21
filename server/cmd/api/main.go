package main

import (
	"context"
	"fmt"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/router"
	"github.com/labstack/echo/v4"
	"go.uber.org/fx"
)

func NewServer() *echo.Echo {
	return echo.New()
}

func registerHooks(
	lifecycle fx.Lifecycle,
	e *echo.Echo,
	router *router.Router,
	internalModule *modules.InternalModule,
) {
	lifecycle.Append(fx.Hook{
		OnStart: func(ctx context.Context) error {
			container := internalModule.Container
			logger := container.Logger()
			config := container.Config()

			logger.Info(fmt.Sprintf("Server started on :%d asd", config.Port))

			go e.Start(fmt.Sprintf(":%d",
				config.Port))

			return nil
		},
		OnStop: func(ctx context.Context) error {
			container := internalModule.Container
			container.DB().Close()
			return e.Shutdown(ctx)
		},
	})
}

func main() {
	fx.New(
		fx.Options(
			router.Module,
			modules.Module,
			fx.Provide(NewServer),
			fx.Invoke(registerHooks),
		),
	).Run()
}

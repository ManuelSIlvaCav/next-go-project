package main

import (
	"context"
	"fmt"

	"github.com/ManuelSIlvaCav/next-go-project/server/cmd/jobs/job_server"
	"github.com/ManuelSIlvaCav/next-go-project/server/cmd/jobs/migration_controller"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/router"
	"github.com/labstack/echo/v4"
	"go.uber.org/fx"
)

func NewServer() *echo.Echo {
	return echo.New()
}

func registerHooks(
	lyfecycle fx.Lifecycle,
	e *echo.Echo,
	router *router.Router,
	internalModule *modules.InternalModule,
	migrationController *migration_controller.MigrationController,
	jobServer *job_server.JobServer,
) {
	lyfecycle.Append(fx.Hook{
		OnStart: func(ctx context.Context) error {
			container := internalModule.Container
			logger := container.Logger()

			/* Jobs starting */
			logger.Info("Starting jobs server")

			migrationController.RunMigrations()

			jobServer.Run(container.JobTasker().Mux())

			logger.Info("Jobs server started")

			/* Server start */
			config := container.Config()

			logger.Info(fmt.Sprintf("Server started on :%d asd", config.Port))

			go e.Start(fmt.Sprintf(":%d",
				config.Port))

			return nil
		},
		OnStop: func(ctx context.Context) error {
			container := internalModule.Container
			container.DB().Close()
			return nil
		},
	})

}

/* This process will be in charge of handling async tasks like jobs and migrations */
func main() {
	fx.New(
		fx.Options(
			router.Module,
			modules.Module,
			fx.Provide(NewServer),
			fx.Provide(migration_controller.NewMigrationController),
			fx.Provide(job_server.NewJobServer),
			fx.Invoke(registerHooks),
		),
	).Run()
}

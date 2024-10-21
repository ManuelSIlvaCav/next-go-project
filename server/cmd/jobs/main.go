package main

import (
	"context"

	"github.com/ManuelSIlvaCav/next-go-project/server/cmd/jobs/job_server"
	"github.com/ManuelSIlvaCav/next-go-project/server/cmd/jobs/migration_controller"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules"
	"go.uber.org/fx"
)

func registerHooks(
	lyfecycle fx.Lifecycle,
	internalModule *modules.InternalModule,
	migrationController *migration_controller.MigrationController,
	jobServer *job_server.JobServer,
) {
	lyfecycle.Append(fx.Hook{
		OnStart: func(ctx context.Context) error {
			container := internalModule.Container
			logger := container.Logger()

			logger.Info("Jobs service started")

			migrationController.RunMigrations()

			jobServer.Run()
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
			modules.Module,
			fx.Provide(migration_controller.NewMigrationController),
			fx.Provide(job_server.NewJobServer),
			fx.Invoke(registerHooks),
		),
	).Run()
}

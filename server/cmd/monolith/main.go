package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os/signal"
	"syscall"
	"time"

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

			/* jobServer.Run(container.JobTasker().Mux()) */

			logger.Info("Jobs server started")

			/* Server start */
			config := container.Config()
			go func() {
				logger.Info(fmt.Sprintf("Server started on :%d asd", config.Port))

				if err := e.Start(fmt.Sprintf(":%d",
					config.Port)); err != nil && err != http.ErrServerClosed {
					e.Logger.Fatal("shutting down the server2")
				}

			}()

			return nil
		},
		OnStop: func(ctx context.Context) error {
			container := internalModule.Container
			logger := container.Logger()

			logger.Info("Stopping server")
			container.DB().Close()
			return nil
		},
	})

}

/* This process will be in charge of handling async tasks like jobs and migrations */
func main() {

	// When this context is canceled, we will gracefully stop the
	// server.
	ctx, cancel := signal.NotifyContext(context.Background(), syscall.SIGHUP, syscall.SIGINT, syscall.SIGTERM, syscall.SIGQUIT)
	defer cancel()

	// When the server is stopped *not by that context*, but by any
	// other problems, it will return its error via this.
	serr := make(chan error, 1)

	app := fx.New(
		fx.Options(
			router.Module,
			modules.Module,
			fx.Provide(NewServer),
			fx.Provide(migration_controller.NewMigrationController),
			fx.Provide(job_server.NewJobServer),
			fx.Invoke(registerHooks),
		),
	)

	app.Start(ctx)
	// Wait for either the server to fail, or the context to end.
	var err error
	select {
	case err = <-serr:
		// Server failed
		log.Printf("Server error: %v", err)
	case <-ctx.Done():
		// Context was canceled
		log.Println("Received shutdown signal, shutting down gracefully...")
	}

	shutdownCtx, shutdownRelease := context.WithTimeout(context.Background(), 10*time.Second)
	defer shutdownRelease()

	if err := app.Stop(shutdownCtx); err != nil {
		log.Fatalf("HTTP shutdown error: %v", err)
	}
	log.Println("Graceful shutdown complete.")

}

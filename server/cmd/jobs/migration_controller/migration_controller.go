package migration_controller

import (
	"context"
	"database/sql"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/lib/pq"
)

type MigrationController struct {
	Container  *container.Container
	AuthModule auth.IAuthModule
}

func NewMigrationController(
	container *container.Container,
	authModule auth.IAuthModule,
) *MigrationController {
	return &MigrationController{Container: container, AuthModule: authModule}
}

func (mc *MigrationController) RunMigrations() error {
	logger := mc.Container.Logger()

	dbURL := mc.Container.DB().GetConnectionString(mc.Container.Config())

	db, err := sql.Open(
		"postgres", dbURL)

	if err != nil {
		logger.Error("Error opening connection to the database: ", err)
	}

	driver, err := postgres.WithInstance(db, &postgres.Config{})

	if err != nil {
		logger.Error("Error creating driver: ", err)
		return err
	}

	m, err := migrate.NewWithDatabaseInstance(
		"file://"+"/app/cmd/jobs/migration_controller/migrations/",
		"postgres",
		driver)

	if err != nil {
		logger.Error("Error creating migration instance: ", err)
		return err
	}

	logger.Info("Running migrations from folder")

	err = m.Up() // or m.Steps(2) if you want to explicitly set the number of migrations to run

	if err != nil && err != migrate.ErrNoChange {
		logger.Error("Error running migrations: ", err)
		return err
	}

	logger.Info("Migrations applied successfully")

	// Create startup admin after migrations are complete
	if err := mc.CreateStartupAdmin(); err != nil {
		logger.Error("Error creating startup admin: ", err)
		return err
	}

	return nil

}

func (mc *MigrationController) CreateStartupAdmin() error {
	logger := mc.Container.Logger()
	ctx := context.Background()

	authService := mc.AuthModule.GetService()

	// Create startup admin with predefined credentials
	adminEmail := "admin@gmail.com"
	adminPassword := "RootPassword!"

	admin, err := authService.CreateStartupAdmin(ctx, adminEmail, adminPassword)
	if err != nil {
		logger.Error("Failed to create startup admin", "error", err)
		return err
	}

	if admin != nil {
		logger.Info("Startup admin ensured", "admin_id", admin.ID, "email", admin.Email)
	}

	return nil
}

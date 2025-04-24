package migration_controller

import (
	"database/sql"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/lib/pq"
)

type MigrationController struct {
	Container *container.Container
}

func NewMigrationController(container *container.Container) *MigrationController {
	return &MigrationController{Container: container}
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
		"file:///"+"app/cmd/jobs/migration_controller/migrations/",
		"postgres", driver)

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

	return nil

}

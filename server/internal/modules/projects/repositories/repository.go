package projects

import (
	"context"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	projects_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/projects/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/utils"
)

type ProjectsRepository struct {
	container *container.Container
	utils.BaseRepository[projects_models.Project]
}

func NewProjectsRepository(container *container.Container) *ProjectsRepository {
	return &ProjectsRepository{
		container:      container,
		BaseRepository: *utils.NewBaseRepository[projects_models.Project](container),
	}
}

// ReplaceSQL replaces the instance occurrence of any string pattern with an increasing $n based sequence
func ReplaceSQL(old, searchPattern string) string {
	tmpCount := strings.Count(old, searchPattern)
	for m := 1; m <= tmpCount; m++ {
		old = strings.Replace(old, searchPattern, "$"+strconv.Itoa(m), 1)
	}
	return old
}

func (e *ProjectsRepository) GetProjects(
	ctx context.Context, limit int, cursor int,
) ([]projects_models.Project, error) {
	return e.BasePagination(ctx, "projects", limit, cursor)
}

func (e *ProjectsRepository) CreateProject(
	ctx context.Context, params *projects_models.CreateProjectParams,
) (*projects_models.Project, error) {
	logger := e.container.Logger()

	newProject := &projects_models.Project{
		BusinessID:    params.BusinessID,
		Code:          params.Code,
		Name:          params.Name,
		Description:   params.Description,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
		City:          "city",
		Street:        "street",
		CountryCode:   "CL",
		TipologyCount: int64(len(params.Tipologies)),
	}

	logger.Info("Creating project", "project", newProject)

	// Get a Tx for making transaction requests.
	tx, err := e.container.DB().Db.BeginTx(ctx, nil)
	if err != nil {
		return &projects_models.Project{}, fmt.Errorf("failed to start transaction: %w", err)
	}

	if err := tx.QueryRowContext(
		ctx,
		`INSERT INTO projects (business_id, code, name, description, created_at, updated_at, city, street, country_code, tipology_count ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
		newProject.BusinessID,
		newProject.Code,
		newProject.Name,
		newProject.Description,
		newProject.CreatedAt,
		newProject.UpdatedAt,
		newProject.City,
		newProject.Street,
		newProject.CountryCode,
		newProject.TipologyCount,
	).Scan(&newProject.ID); err != nil {
		logger.Error("Failed to insert project", "error", err)
		return nil, err
	}

	sqlStr := "INSERT INTO tipologies (project_id, total_area, net_area, list_price, bedrooms, bathrooms, count) VALUES "

	vals := []interface{}{}

	for _, row := range params.Tipologies {
		sqlStr += "(?, ?, ?, ?, ?, ?, ?),"
		vals = append(vals, newProject.ID, row.TotalArea, row.NetArea, row.ListPrice, row.Bedrooms, row.Bathrooms, row.Count)
	}

	//trim the last ,
	sqlStr = strings.TrimSuffix(sqlStr, ",")

	//Replacing ? with $n for postgres
	sqlStr = ReplaceSQL(sqlStr, "?")

	//prepare the statement
	stmt, _ := tx.PrepareContext(ctx, sqlStr)

	defer stmt.Close()

	//format all vals at once
	res, err := stmt.Exec(vals...)

	if err != nil {
		logger.Error("Failed to insert tipologies", "error", err)
		tx.Rollback()
		return &projects_models.Project{}, err
	}

	logger.Info("Inserted tipologies", "res", res)

	// Commit the transaction.
	if err = tx.Commit(); err != nil {
		tx.Rollback()
		return &projects_models.Project{}, fmt.Errorf("failed to commit transaction: %w", err)
	}

	return newProject, nil
}

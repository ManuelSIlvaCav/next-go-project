package businesses_repositories

import (
	"context"
	"strings"

	businesses_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/businesses/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/utils"
)

type PermissionsRepository struct {
	container *container.Container
}

func NewPermissionsRepository(container *container.Container) *PermissionsRepository {
	return &PermissionsRepository{
		container: container,
	}
}

func (r *BusinessRepository) CreateRoles(ctx context.Context, roles []businesses_models.Role) ([]*businesses_models.Role, error) {

	logger := r.container.Logger()

	var newRoles []*businesses_models.Role

	sqlStr := "INSERT INTO roles (name, description) VALUES "

	vals := []interface{}{}

	for _, row := range roles {
		sqlStr += "(?, ?),"
		vals = append(vals, row.Name, row.Description)
	}

	//trim the last ,
	sqlStr = strings.TrimSuffix(sqlStr, ",")

	//Replacing ? with $n for postgres
	sqlStr = utils.ReplaceSQL(sqlStr, "?")

	//prepare the statement
	stmt, _ := r.container.DB().Db.PrepareContext(ctx, sqlStr)

	defer stmt.Close()

	//format all vals at once
	res, err := stmt.Exec(vals...)

	if err != nil {
		logger.Error("Failed to insert roles", "error", err)
		return nil, err
	}

	logger.Info("Inserted roles", "res", res)

	return newRoles, nil
}

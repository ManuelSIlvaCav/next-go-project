package utils

import (
	"context"
	"database/sql"
	"fmt"
	"strconv"
	"strings"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/jmoiron/sqlx"
)

type BaseRepository[T any] struct {
	container *container.Container
}

func NewBaseRepository[T any](container *container.Container) *BaseRepository[T] {
	return &BaseRepository[T]{
		container: container,
	}
}

func (e *BaseRepository[T]) BasePagination(
	ctx context.Context, table string, limit int, cursor int,
) ([]T, error) {
	logger := e.container.Logger()

	entities := []T{}

	queryLimit := limit

	if queryLimit == 0 {
		queryLimit = 10 // default value
	}

	var rows *sql.Rows
	var err error

	if cursor == 0 {
		rows, err = e.container.DB().Db.QueryContext(ctx, fmt.Sprintf("SELECT * FROM %s ORDER BY id DESC LIMIT $1", table), queryLimit)
	} else {
		rows, err = e.container.DB().Db.QueryContext(ctx, fmt.Sprintf("SELECT * FROM %s WHERE id < $1 ORDER BY id DESC LIMIT $2", table), cursor, queryLimit)
	}

	if err != nil {
		logger.Error("Failed to get pagination", "error", err)
		return nil, err

	}

	defer rows.Close()

	/* for rows.Next() {
		var entity T
		err := rows.Scan(&project.ID, &project.Name, &project.CreatedAt)


		logger.Info("Entity", "entity", entity)

		if err != nil {
			logger.Error("Failed to scan entity", "error", err)
			return nil, err
		}
		entities = append(entities, entity)
	} */

	err = sqlx.StructScan(rows, &entities)

	if err != nil {
		logger.Error("Failed to scan entity", "error", err)
		return nil, err
	}

	return entities, nil
}

// ReplaceSQL replaces the instance occurrence of any string pattern with an increasing $n based sequence
func ReplaceSQL(old, searchPattern string) string {
	tmpCount := strings.Count(old, searchPattern)
	for m := 1; m <= tmpCount; m++ {
		old = strings.Replace(old, searchPattern, "$"+strconv.Itoa(m), 1)
	}
	return old
}

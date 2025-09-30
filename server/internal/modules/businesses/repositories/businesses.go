package businesses_repositories

import (
	"context"
	"database/sql"
	"fmt"

	internal_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/models"
	businesses_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/businesses/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/utils"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jmoiron/sqlx"
)

type BusinessRepository struct {
	container *container.Container
	utils.BaseRepository[businesses_models.Business]
}

func NewBusinessRepository(container *container.Container) *BusinessRepository {
	return &BusinessRepository{
		container:      container,
		BaseRepository: *utils.NewBaseRepository[businesses_models.Business](container),
	}
}

func (r *BusinessRepository) CreateBusiness(ctx context.Context,
	business *businesses_models.CreateBusinessParams) (*businesses_models.Business, *internal_models.HandlerError) {

	newBusiness := &businesses_models.Business{
		Name:       business.Name,
		Identifier: business.Identifier,
		LegalName:  business.LegalName,
		IsActive:   business.IsActive,
		IsAdmin:    business.IsAdmin,
	}

	query := `INSERT INTO businesses (name, identifier, legal_name, is_active, is_admin) VALUES ($1, $2, $3, $4, $5) RETURNING id`

	if err := r.container.DB().Db.QueryRowContext(ctx, query,
		newBusiness.Name,
		newBusiness.Identifier,
		newBusiness.LegalName,
		newBusiness.IsActive,
		newBusiness.IsAdmin,
	).Scan(&newBusiness.ID); err != nil {

		return nil, internal_models.NewErrorWithCode(internal_models.BusinessForeignKeyError)
	}

	return newBusiness, nil
}

/* Business User Related */

func (r *BusinessRepository) GetBusinessUser(
	ctx context.Context,
	params *businesses_models.GetBusinessUserParams) (*businesses_models.BusinessUser, error) {
	logger := r.container.Logger()

	user := &businesses_models.BusinessUser{}

	query := `SELECT id, email, first_name, last_name, phone FROM businesses_users WHERE email = $1`

	if err := r.container.DB().Db.QueryRowContext(ctx, query, params.Email).Scan(
		&user.ID,
		&user.Email,
		&user.FirstName,
		&user.LastName,
		&user.Phone,
	); err != nil {
		logger.Error("Error getting business user", "error", err, "params", params)
		return nil, err
	}

	return user, nil
}

func (r *BusinessRepository) CreateBusinessUser(ctx context.Context,
	user *businesses_models.CreateBusinessUserParams,
) (*businesses_models.BusinessUser, *internal_models.HandlerError) {
	logger := r.container.Logger()

	businessUser := &businesses_models.BusinessUser{
		BusinessID:   user.BusinessID,
		Email:        user.Email,
		FirstName:    user.FirstName,
		LastName:     user.LastName,
		Phone:        user.Phone,
		PasswordHash: user.PasswordHash, // Assume the password is already hashed
	}

	query := `INSERT INTO businesses_users (business_id, first_name, last_name, email, phone, password_hash) 
	VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`

	if err := r.container.DB().Db.QueryRowContext(ctx, query,
		businessUser.BusinessID,
		user.FirstName,
		user.LastName,
		user.Email,
		user.Phone,
		user.PasswordHash,
	).Scan(&businessUser.ID); err != nil {
		pqErr := err.(*pgconn.PgError)
		logger.Error("Error CreateBusinessUser ", "pqErr", pqErr, "error", err, "user", user)

		if pqErr.Code == "23503" {
			return nil, internal_models.NewErrorWithCode(internal_models.BusinessForeignKeyError)
		}
		return nil, internal_models.NewErrorWithCode(internal_models.UserCreationError)
	}

	return businessUser, nil
}

func (r *BusinessRepository) GetBusinessUsers(ctx context.Context, params *businesses_models.GetBusinessUsersParams) ([]businesses_models.BusinessUser, error) {
	logger := r.container.Logger()

	entities := []businesses_models.BusinessUser{}

	queryLimit := params.Limit

	if queryLimit == 0 {
		queryLimit = 10 // default value
	}

	var rows *sql.Rows
	var err error

	logger.Info("Getting business users", "params", params)

	if params.Cursor == 0 {
		rows, err = r.container.DB().Db.QueryContext(ctx, fmt.Sprintf("SELECT * FROM %s WHERE business_id=$1 ORDER BY id DESC LIMIT $2", "businesses_users"), params.BusinessID, queryLimit)
	} else {
		rows, err = r.container.DB().Db.QueryContext(ctx, fmt.Sprintf("SELECT * FROM %s WHERE id < $1 and business_id=$2 ORDER BY id DESC LIMIT $3", "businesses_users"), params.Cursor, params.BusinessID, queryLimit)
	}

	if err != nil {
		logger.Error("Failed to get pagination", "error", err)
		return nil, err

	}

	defer rows.Close()

	err = sqlx.StructScan(rows, &entities)

	if err != nil {
		logger.Error("Failed to scan entity", "error", err)
		return nil, err
	}

	return entities, nil
}

func (r *BusinessRepository) GetBusinessUserPermissionsWithSecurables(ctx context.Context, businessUserID string) ([]*businesses_models.Securable, error) {
	logger := r.container.Logger()

	var permissions []*businesses_models.Securable

	query := `
		SELECT s.id, s.name, s.description
		FROM securables s
		INNER JOIN role_securables rs ON s.id = rs.securable_id
		INNER JOIN roles r ON rs.role_id = r.id
		INNER JOIN business_user_roles bur ON r.id = bur.role_id
		WHERE bur.business_user_id = $1
	`

	rows, err := r.container.DB().Db.QueryContext(ctx, query, businessUserID)
	if err != nil {
		logger.Error("Error getting business user permissions with securables", "error", err, "businessUserID", businessUserID)
		return nil, err
	}

	defer rows.Close()

	err = sqlx.StructScan(rows, &permissions)

	if err != nil {
		logger.Error("Failed to scan entity", "error", err)
		return nil, err
	}

	/* TODO Add the securables into redis cache for easy further access */

	return permissions, nil
}

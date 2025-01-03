package businesses_repositories

import (
	"context"

	businesses_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/businesses/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/utils"
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
	business *businesses_models.CreateBusinessParams) (*businesses_models.Business, error) {

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
		return nil, err
	}

	return newBusiness, nil
}

/* Business User Related */

type GetBusinessUserParams struct {
	ID    string `json:"id"`
	Email string `json:"email"`
}

func (r *BusinessRepository) GetBusinessUser(ctx context.Context, params *GetBusinessUserParams) (*businesses_models.BusinessUser, error) {
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
	user *businesses_models.CreateBusinessUserParams) (*businesses_models.BusinessUser, error) {
	logger := r.container.Logger()

	businessUser := &businesses_models.BusinessUser{
		Email:     user.Email,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Phone:     user.Phone,
	}

	query := `INSERT INTO businesses_users (email, first_name, last_name, phone) VALUES ($1, $2, $3, $4) RETURNING id`

	if err := r.container.DB().Db.QueryRowContext(ctx, query,
		user.Email,
		user.FirstName,
		user.LastName,
		user.Phone,
	).Scan(&businessUser.ID); err != nil {
		logger.Error("Error creating business user", "error", err, "user", user)
		return nil, err
	}

	return businessUser, nil
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

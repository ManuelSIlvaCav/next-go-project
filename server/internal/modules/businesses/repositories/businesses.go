package businesses

import (
	"context"

	businesses_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/businesses/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/utils"
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

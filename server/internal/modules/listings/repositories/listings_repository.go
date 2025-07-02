package listings_repositories

import (
	"context"
	"time"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	listings_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/listings/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/utils"
)

type ListingRepository struct {
	container *container.Container
	utils.BaseRepository[listings_models.Listing]
}

type ListingRepositoryInterface interface {
	CreateListing(ctx context.Context, params *CreateListingParams) (*listings_models.Listing, error)
	// Add other methods as needed
}

func NewListingRepository(container *container.Container) *ListingRepository {
	return &ListingRepository{
		container:      container,
		BaseRepository: *utils.NewBaseRepository[listings_models.Listing](container),
	}
}

type CreateListingParams struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Price       int    `json:"price"`
	PriceUnit   string `json:"price_unit"`
	CategoryID  string `json:"category_id"`
}

func (r *ListingRepository) CreateListing(ctx context.Context, params *CreateListingParams) (*listings_models.Listing, error) {
	logger := r.container.Logger()

	newListing := &listings_models.Listing{
		Title:       params.Title,
		Description: params.Description,
		Price:       params.Price,
		PriceUnit:   params.PriceUnit,
		CategoryID:  params.CategoryID,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	query := `INSERT INTO listings (title, description, price, price_unit, category_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`

	if err := r.container.DB().Db.QueryRowContext(ctx, query,
		newListing.Title,
		newListing.Description,
		newListing.Price,
		newListing.PriceUnit,
		newListing.CategoryID,
		newListing.CreatedAt,
		newListing.UpdatedAt,
	).Scan(&newListing.ID); err != nil {
		logger.Error("Error creating listing", "error", err)
		return nil, err
	}

	return newListing, nil
}

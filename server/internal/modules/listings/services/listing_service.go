package listing_services

import (
	"context"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	listings_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/listings/models"
	listings_repositories "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/listings/repositories"
)

type ListingService struct {
	ListingRepository *listings_repositories.ListingRepository
}

type ListingServiceInterface interface {
	CreateListing(ctx context.Context, params *listings_repositories.CreateListingParams) (*listings_models.Listing, error)
	// Add other methods as needed
}

func NewListingService(container *container.Container) *ListingService {
	listing_repository := listings_repositories.NewListingRepository(container)

	return &ListingService{
		ListingRepository: listing_repository,
	}
}

func (s *ListingService) CreateListing(ctx context.Context, params *listings_repositories.CreateListingParams) (*listings_models.Listing, error) {
	newListing, err := s.ListingRepository.CreateListing(ctx, params)

	if err != nil {
		return nil, err
	}

	return newListing, nil
}

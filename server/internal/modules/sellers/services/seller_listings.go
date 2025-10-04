package sellers_services

import (
	"context"

	internal_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	sellers_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/sellers/models"
	sellers_repositories "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/sellers/repositories"
)

type SellerListingService struct {
	container               *container.Container
	sellerListingRepository *sellers_repositories.SellerListingRepository
	sellerRepository        *sellers_repositories.SellerRepository
}

func NewSellerListingService(
	container *container.Container,
	sellerListingRepository *sellers_repositories.SellerListingRepository,
	sellerRepository *sellers_repositories.SellerRepository,
) *SellerListingService {
	return &SellerListingService{
		container:               container,
		sellerListingRepository: sellerListingRepository,
		sellerRepository:        sellerRepository,
	}
}

func (s *SellerListingService) CreateSellerListing(
	ctx context.Context,
	params *sellers_models.CreateSellerListingParams,
) (*sellers_models.SellerListingDTO, error) {
	logger := s.container.Logger()

	// Get seller information to retrieve business_id
	seller, err := s.sellerRepository.GetSeller(ctx, &sellers_models.GetSellerParams{
		ID: params.SellerID,
	})
	if err != nil {
		logger.Error("Failed to get seller", "error", err, "seller_id", params.SellerID)
		return nil, &internal_models.HandlerError{
			Code:    internal_models.UserCreationError,
			Message: "seller not found",
		}
	}

	// Prepare listing entity
	listing := &sellers_models.SellerListing{
		SellerID:   params.SellerID,
		BusinessID: seller.BusinessID,
		TypeID:     params.TypeID,
	}

	// Prepare listing details
	details := &sellers_models.SellerListingDetails{
		Title:       params.Title,
		Description: params.Description,
		Currency:    params.Currency,
		Metadata:    params.Metadata,
	}

	if details.Metadata == nil {
		details.Metadata = make(map[string]any)
	}

	// Call repository to create the listing
	listingDTO, err := s.sellerListingRepository.CreateSellerListing(
		ctx,
		listing,
		details,
		params.Prices,
		params.Categories,
	)

	if err != nil {
		logger.Error("Failed to create seller listing in repository", "error", err, "params", params)
		return nil, err
	}

	logger.Info("Seller listing created successfully", "listing", listingDTO)
	return listingDTO, nil
}

func (s *SellerListingService) GetSellerListings(
	ctx context.Context,
	params *sellers_models.GetSellerListingsParams,
) (*sellers_models.PaginatedSellerListingsResponse, error) {
	logger := s.container.Logger()

	// Validate that either SellerID or BusinessID is provided
	if params.SellerID == "" && params.BusinessID == 0 {
		return nil, &internal_models.HandlerError{
			Code:    internal_models.UserCreationError,
			Message: "either seller_id or business_id is required",
		}
	}

	// Set default pagination values
	if params.Limit <= 0 {
		params.Limit = 10
	}
	if params.Offset < 0 {
		params.Offset = 0
	}

	// Call repository to get listings
	response, err := s.sellerListingRepository.GetSellerListings(ctx, params)
	if err != nil {
		logger.Error("Failed to get seller listings from repository", "error", err, "params", params)
		return nil, err
	}

	return response, nil
}

func (s *SellerListingService) GetSellerListingsByBusinessID(
	ctx context.Context,
	businessID int64,
	typeID int,
	categoryID int,
	limit int,
	offset int,
) (*sellers_models.PaginatedSellerListingsResponse, error) {
	params := &sellers_models.GetSellerListingsParams{
		BusinessID: businessID,
		TypeID:     typeID,
		CategoryID: categoryID,
		Limit:      limit,
		Offset:     offset,
	}

	return s.GetSellerListings(ctx, params)
}

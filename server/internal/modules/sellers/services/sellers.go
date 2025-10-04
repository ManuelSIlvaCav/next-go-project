package sellers_services

import (
	"context"
	"fmt"

	internal_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/models"
	auth_utils "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/utils"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	sellers_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/sellers/models"
	sellers_repositories "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/sellers/repositories"
)

type SellerService struct {
	container        *container.Container
	sellerRepository *sellers_repositories.SellerRepository
}

func NewSellerService(container *container.Container, sellerRepository *sellers_repositories.SellerRepository) *SellerService {
	return &SellerService{
		container:        container,
		sellerRepository: sellerRepository,
	}
}

func (s *SellerService) CreateSeller(ctx context.Context, params *sellers_models.CreateSellerParams) (*sellers_models.SellerDTO, error) {
	logger := s.container.Logger()

	// Hash the password
	hashedPassword, hashErr := auth_utils.HashPassword(params.Password)
	if hashErr != nil {
		logger.Error("Error hashing password", "error", hashErr)
		return nil, &internal_models.HandlerError{
			Code:    internal_models.UserCreationError,
			Message: "could not hash password",
		}
	}

	newSeller := &sellers_models.Seller{
		BusinessID:   params.BusinessID,
		Email:        params.Email,
		PasswordHash: hashedPassword,
	}

	sellerData := &sellers_models.SellerData{
		FirstName: params.FirstName,
		LastName:  params.LastName,
		Phone:     params.Phone,
	}

	sellerDTO, handlerErr := s.sellerRepository.CreateSeller(ctx, newSeller, sellerData)

	if handlerErr != nil {
		logger.Error("Failed to create seller in repository", "error", handlerErr, "params", params)
		return nil, handlerErr
	}

	return sellerDTO, nil
}

func (s *SellerService) GetSeller(ctx context.Context, params *sellers_models.GetSellerParams) (*sellers_models.SellerDTO, error) {
	logger := s.container.Logger()

	// Simple validation
	if params.ID == "" {
		return nil, fmt.Errorf("seller ID is required")
	}

	// Call repository to get the seller
	seller, err := s.sellerRepository.GetSeller(ctx, params)
	if err != nil {
		logger.Error("Failed to get seller from repository", "error", err, "params", params)
		return nil, err
	}

	return seller, nil
}

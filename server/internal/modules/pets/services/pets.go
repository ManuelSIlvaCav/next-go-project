package pets_services

import (
	"context"
	"fmt"

	internal_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	pets_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/pets/models"
	pets_repositories "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/pets/repositories"
)

type PetService struct {
	container     *container.Container
	petRepository *pets_repositories.PetRepository
}

func NewPetService(container *container.Container, petRepository *pets_repositories.PetRepository) *PetService {
	return &PetService{
		container:     container,
		petRepository: petRepository,
	}
}

func (s *PetService) CreatePet(ctx context.Context, params *pets_models.CreatePetParams) (*pets_models.Pet, error) {
	logger := s.container.Logger()

	newPet := &pets_models.Pet{
		BusinessID: params.BusinessID,
		ClientID:   params.ClientID,
		PetName:    params.PetName,
		PetType:    params.PetType,
		Breed:      params.Breed,
		Age:        params.Age,
	}

	// Call repository to create the pet
	pet, err := s.petRepository.CreatePet(ctx, newPet)
	if err != nil {
		return nil, err
	}

	logger.Info("Pet created successfully", "pet", pet)
	return pet, nil
}

func (s *PetService) GetPet(ctx context.Context, params *pets_models.GetPetParams) (*pets_models.Pet, error) {
	logger := s.container.Logger()

	// Simple validation
	if params.ID == "" {
		return nil, fmt.Errorf("pet ID is required")
	}

	if params.BusinessID != 0 {
		return nil, fmt.Errorf("business ID is required")
	}

	// Call repository to get the pet
	pet, err := s.petRepository.GetPet(ctx, params)
	if err != nil {
		logger.Error("Failed to get pet from repository", "error", err, "params", params)
		return nil, err
	}

	return pet, nil
}

func (s *PetService) GetPets(ctx context.Context, params *pets_models.GetPetsParams) ([]pets_models.Pet, error) {
	logger := s.container.Logger()

	// Simple validation
	if params.BusinessID == 0 {
		return nil, fmt.Errorf("business ID is required")
	}

	// Business rule: Set reasonable limit constraints
	if params.Limit > 100 {
		params.Limit = 100 // Cap at 100 to prevent excessive resource usage
		logger.Warn("Limit capped to 100", "originalLimit", params.Limit)
	}

	// Call repository to get pets
	pets, err := s.petRepository.GetPets(ctx, params)
	if err != nil {
		logger.Error("Failed to get pets from repository", "error", err, "params", params)
		return nil, err
	}

	return pets, nil
}

func (s *PetService) UpdatePet(ctx context.Context, params *pets_models.UpdatePetParams) (*pets_models.Pet, *internal_models.HandlerError) {
	logger := s.container.Logger()

	// Simple validation
	if params.ID == "" {
		return nil, &internal_models.HandlerError{
			Code:    4000,
			Message: "Pet ID is required",
		}
	}

	// Business rule: Ensure at least one field is being updated
	hasUpdates := params.Name != "" || params.PetType != "" || params.Breed != "" ||
		params.Age != 0

	if !hasUpdates {
		logger.Error("No fields to update", "params", params)
		return nil, &internal_models.HandlerError{
			Code:    4000,
			Message: "At least one field must be provided for update",
		}
	}

	// Business rule: Validate name if provided
	if params.Name != "" && len(params.Name) == 0 {
		logger.Error("Pet name cannot be empty", "params", params)
		return nil, &internal_models.HandlerError{
			Code:    4000,
			Message: "Pet name cannot be empty",
		}
	}

	// Business rule: Validate age if provided
	if params.Age < 0 {
		logger.Error("Pet age cannot be negative", "params", params)
		return nil, &internal_models.HandlerError{
			Code:    4000,
			Message: "Pet age cannot be negative",
		}
	}

	// Call repository to update the pet
	pet, err := s.petRepository.UpdatePet(ctx, params)
	if err != nil {
		logger.Error("Failed to update pet in repository", "error", err, "params", params)
		return nil, err
	}

	logger.Info("Pet updated successfully", "petID", params.ID)
	return pet, nil
}

func (s *PetService) DeletePet(ctx context.Context, params *pets_models.DeletePetParams) error {
	logger := s.container.Logger()

	// Simple validation
	if params.ID == "" {
		return &internal_models.HandlerError{
			Code:    4000,
			Message: "Pet ID is required",
		}
	}

	if params.BusinessID == 0 {
		return &internal_models.HandlerError{
			Code:    4000,
			Message: "Business ID is required",
		}
	}

	// Call repository to delete the pet (soft delete)
	err := s.petRepository.DeletePet(ctx, params)
	if err != nil {
		logger.Error("Failed to delete pet in repository", "error", err, "params", params)
		return err
	}

	logger.Info("Pet deleted successfully", "petID", params.ID, "businessID", params.BusinessID)
	return nil
}

// Business logic helper methods

// ValidatePetOwnership checks if a pet belongs to the specified business
func (s *PetService) ValidatePetOwnership(ctx context.Context, petID string, businessID int) (bool, error) {
	logger := s.container.Logger()

	params := &pets_models.GetPetParams{
		ID:         petID,
		BusinessID: businessID,
	}

	_, err := s.petRepository.GetPet(ctx, params)
	if err != nil {
		logger.Error("Pet not found or access denied", "petID", petID, "businessID", businessID, "error", err)
		return false, err
	}

	return true, nil
}

// GetPetsByClient returns all pets for a specific client within a business
func (s *PetService) GetPetsByClient(ctx context.Context, businessID int, clientID string, limit int) ([]pets_models.Pet, error) {
	params := &pets_models.GetPetsParams{
		BusinessID: businessID,
		ClientID:   clientID,
		Limit:      limit,
	}

	return s.GetPets(ctx, params)
}

// GetPetsByType returns all pets of a specific type within a business
func (s *PetService) GetPetsByType(ctx context.Context, businessID int, petType string, limit int) ([]pets_models.Pet, error) {
	params := &pets_models.GetPetsParams{
		BusinessID: businessID,
		PetType:    petType,
		Limit:      limit,
	}

	return s.GetPets(ctx, params)
}

package auth_services

import (
	"context"

	validation "github.com/go-ozzo/ozzo-validation/v4"
	"github.com/go-ozzo/ozzo-validation/v4/is"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/interfaces"
	internal_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/models"
	auth_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/models"
	auth_repository "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/repository"
	auth_utils "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/utils"
	businesses_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/businesses/models"
	clients_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/clients/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
)

type AuthService struct {
	businessModule interfaces.BusinessModule
	clientsModule  interfaces.ClientsModule
	container      *container.Container
	authRepository auth_repository.AuthRepositoryInterface
}

func NewAuthService(
	businessModule interfaces.BusinessModule,
	clientsModule interfaces.ClientsModule,
	container *container.Container,
	authRepo auth_repository.AuthRepositoryInterface,
) *AuthService {
	return &AuthService{
		businessModule: businessModule,
		clientsModule:  clientsModule,
		container:      container,
		authRepository: authRepo,
	}
}

type (
	RegisterUserParams struct {
		BusinessID int64  `json:"business_id" validate:"required" errormgs:"business_id is required"`
		Email      string `json:"email" validate:"required,email" errormgs:"email is required and must be a valid email address"`
		Password   string `json:"password" validate:"required,min=8" errormgs:"password is required and must be at least 8 characters"`
		FirstName  string `json:"first_name"`
		LastName   string `json:"last_name"`
		Phone      string `json:"phone"`
	}

	RegisterClientParams struct {
		BusinessID      int64  `json:"business_id"`
		Email           string `json:"email" `
		Password        string `json:"password" `
		ConfirmPassword string `json:"confirm_password" `
		FirstName       string `json:"first_name" `
		LastName        string `json:"last_name" `
		Phone           string `json:"phone"`
	}

	LoginClientParams struct {
		BusinessID int64  `json:"business_id"`
		Email      string `json:"email"`
		Password   string `json:"password"`
	}
)

func (params RegisterClientParams) Validate() error {
	return validation.ValidateStruct(&params,
		validation.Field(&params.BusinessID, validation.Required.Error("business_id is required")),
		validation.Field(&params.Email, validation.Required.Error("email is required"), is.Email),
		validation.Field(&params.Password, validation.Required.Error("password is required"), validation.Length(6, 0)),
		validation.Field(&params.ConfirmPassword, validation.Required.Error("confirm_password is required"), validation.By(func(value interface{}) error {
			if value != params.Password {
				return validation.NewError("validation_confirm_password", "confirm_password must match password")
			}
			return nil
		})),
		validation.Field(&params.FirstName, validation.Length(5, 50)),
		validation.Field(&params.LastName, validation.Length(5, 50)),
	)
}

func (params LoginClientParams) Validate() error {
	return validation.ValidateStruct(&params,
		validation.Field(&params.BusinessID, validation.Required.Error("business_id is required")),
		validation.Field(&params.Email, validation.Required.Error("email is required"), is.Email),
		validation.Field(&params.Password, validation.Required.Error("password is required")),
	)
}

func (s *AuthService) RegisterBusinessUser(
	ctx context.Context,
	params RegisterUserParams) (*businesses_models.BusinessUser, *internal_models.HandlerError) {
	logger := s.container.Logger()

	logger.Info("Registering user", "params", params)

	HashPassword, err := auth_utils.HashPassword(params.Password)
	if err != nil {
		logger.Error("Error hashing password", "error", err)
		return nil, &internal_models.HandlerError{
			Code:    internal_models.UserCreationError,
			Message: "could not hash password",
		}
	}

	params.Password = HashPassword

	var handlerError *internal_models.HandlerError

	businessUser, handlerError := s.businessModule.GetBusinessRepository().CreateBusinessUser(ctx,
		&businesses_models.CreateBusinessUserParams{
			BusinessID:   params.BusinessID,
			Email:        params.Email,
			PasswordHash: params.Password,
			FirstName:    params.FirstName,
			LastName:     params.LastName,
			Phone:        params.Phone,
		},
	)

	if handlerError != nil {
		return nil, handlerError
	}

	logger.Info("User registered successfully", "user", businessUser)

	return businessUser, nil

}

func (s *AuthService) CreateStartupAdmin(
	ctx context.Context,
	email string,
	password string,
) (*auth_models.Admin, *internal_models.HandlerError) {
	logger := s.container.Logger()

	logger.Info("Creating startup admin", "email", email)

	// Check if admin already exists
	existingAdmin, err := s.authRepository.GetAdminUser(ctx, email)
	if err == nil && existingAdmin != nil {
		logger.Info("Admin already exists", "email", email)
		return existingAdmin, nil
	}

	// Hash the password
	hashedPassword, hashErr := auth_utils.HashPassword(password)
	if hashErr != nil {
		logger.Error("Error hashing password", "error", hashErr)
		return nil, &internal_models.HandlerError{
			Code:    internal_models.UserCreationError,
			Message: "could not hash password",
		}
	}

	// Create the admin
	admin, handlerError := s.authRepository.RegisterAdmin(ctx, auth_repository.RegisterAdminParams{
		Email:        email,
		PasswordHash: hashedPassword,
		IsActive:     true,
	})

	if handlerError != nil {
		logger.Error("Error creating startup admin", "error", handlerError)
		return nil, handlerError
	}

	logger.Info("Startup admin created successfully", "admin_id", admin.ID, "email", email)
	return admin, nil
}

func (s *AuthService) RegisterClient(
	ctx context.Context,
	params RegisterClientParams,
) (*clients_models.Client, *internal_models.HandlerError) {
	logger := s.container.Logger()

	logger.Info("Registering client", "params", params)

	// Check if client already exists
	existingClient, err := s.clientsModule.GetClientRepository().GetClientByEmail(ctx, params.Email, params.BusinessID)
	if err == nil && existingClient != nil {
		logger.Error("Client already exists", "email", params.Email, "business_id", params.BusinessID)
		return nil, internal_models.NewErrorWithCode(internal_models.UserAlreadyExistsError)
	}

	// Hash the password
	hashedPassword, hashErr := auth_utils.HashPassword(params.Password)
	if hashErr != nil {
		logger.Error("Error hashing password", "error", hashErr)
		return nil, &internal_models.HandlerError{
			Code:    internal_models.UserCreationError,
			Message: "could not hash password",
		}
	}

	// Create client
	client, handlerError := s.clientsModule.GetClientRepository().CreateClient(ctx, &clients_models.CreateClientParams{
		BusinessID:   params.BusinessID,
		FirstName:    params.FirstName,
		LastName:     params.LastName,
		Email:        params.Email,
		Phone:        params.Phone,
		PasswordHash: hashedPassword,
	})

	if handlerError != nil {
		logger.Error("Error creating client", "error", handlerError)
		return nil, handlerError
	}

	logger.Info("Client registered successfully", "client_id", client.ID, "email", params.Email)
	return client, nil
}

func (s *AuthService) LoginClient(
	ctx context.Context,
	params LoginClientParams,
) (*clients_models.Client, *internal_models.HandlerError) {
	logger := s.container.Logger()

	logger.Info("Logging in client", "email", params.Email, "business_id", params.BusinessID)

	// Get client by email
	client, err := s.clientsModule.GetClientRepository().GetClientByEmail(ctx, params.Email, params.BusinessID)
	if err != nil {
		logger.Error("Client not found", "email", params.Email, "business_id", params.BusinessID, "error", err)
		return nil, &internal_models.HandlerError{
			Code:    internal_models.InvalidCredentialsError,
			Message: "invalid email or password",
		}
	}

	// Verify password
	if !auth_utils.VerifyPassword(params.Password, client.PasswordHash) {
		logger.Error("Invalid password", "email", params.Email, "business_id", params.BusinessID)
		return nil, &internal_models.HandlerError{
			Code:    internal_models.InvalidCredentialsError,
			Message: "invalid email or password",
		}
	}

	logger.Info("Client logged in successfully", "client_id", client.ID, "email", params.Email)
	return client, nil
}

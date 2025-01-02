package auth_repository

import (
	"context"

	auth_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
)

type LoginParams struct {
	Email    string `json:"email" validate:"required,email" errormgs:"email is required and must be a valid email address"`
	Password string `json:"password" validate:"required" errormgs:"password is required"`
	/* This represent the login method ex (only email, password, SSO) */
	LoginMethod string `json:"type" validatge:"required,oneof=email-only password" errormgs:"type is required"`
}

type AuthRepository struct {
	container *container.Container
}

func NewAuthRepository(container *container.Container) *AuthRepository {
	return &AuthRepository{
		container: container,
	}
}

func (r *AuthRepository) RegisterUser(
	registerParams auth_models.User,
) (*auth_models.User, error) {
	return nil, nil
}

func (r *AuthRepository) LoginUser(
	loginParams *LoginParams,
) (*auth_models.User, error) {

	return nil, nil
}

/* Magic redirect, when the user clicks on the link, the email button there is the url with the email and unique token to auth */
func (r *AuthRepository) LoginUserByEmail(
	ctx context.Context,
	email string,
	authentication_token string,
) (*auth_models.UserEmailLogin, error) {
	logger := r.container.Logger()
	query := `SELECT * FROM user_email_login WHERE email = $1 AND authentication_token = $2`

	loginEmails := []auth_models.UserEmailLogin{}

	if err := r.container.DB().Db.SelectContext(ctx, &loginEmails, query, email, authentication_token); err != nil {
		logger.Error("Error getting user email login", "error", err)
		return nil, err
	}

	if len(loginEmails) == 0 {
		return nil, nil
	}

	return &loginEmails[0], nil

}

func (r *AuthRepository) CreateUserMagicEmail(
	ctx context.Context,
	email string,
	businessID int,
) (*auth_models.UserEmailLogin, error) {
	logger := r.container.Logger()
	newLoginEmail := &auth_models.UserEmailLogin{}

	query := `INSERT INTO user_email_login (email, business_id) VALUES ($1, $2) RETURNING email, authentication_token`

	if err := r.container.DB().Db.QueryRowContext(ctx, query, email, businessID).Scan(&newLoginEmail.Email, &newLoginEmail.AuthenticationToken); err != nil {
		logger.Error("Error creating user email login", "error", err)
		return nil, err
	}

	return newLoginEmail, nil
}

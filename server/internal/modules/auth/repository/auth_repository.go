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

/* Magic redirect, when the user clicks on the link, the email button there is the url with the email and unique token to auth */
func (r *AuthRepository) LoginUserByEmail(
	ctx context.Context,
	email string,
	authentication_token string,
) (*auth_models.UserEmailLogin, error) {
	logger := r.container.Logger()
	query := `SELECT email, expires_at FROM user_email_login WHERE email = $1 AND authentication_token = $2`

	loginEmail := auth_models.UserEmailLogin{}

	if err := r.container.DB().Db.QueryRowContext(ctx, query, email, authentication_token).Scan(&loginEmail.Email, &loginEmail.ExpiresAt); err != nil {
		logger.Error("Error getting user email login", "error", err)
		return nil, err
	}

	return &loginEmail, nil
}

func (r *AuthRepository) CreateUserMagicEmail(
	ctx context.Context,
	email string,
) (*auth_models.UserEmailLogin, error) {
	logger := r.container.Logger()
	newLoginEmail := &auth_models.UserEmailLogin{}

	query := `INSERT INTO user_email_login (email) VALUES ($1) RETURNING email, authentication_token`

	if err := r.container.DB().Db.QueryRowContext(ctx, query, email).Scan(&newLoginEmail.Email, &newLoginEmail.AuthenticationToken); err != nil {
		logger.Error("Error creating user email login", "error", err)
		return nil, err
	}

	return newLoginEmail, nil
}

func (r *AuthRepository) GetAdminUser(
	ctx context.Context,
	email string,
) (*auth_models.Admin, error) {
	logger := r.container.Logger()
	user := &auth_models.Admin{
		Email: email,
	}

	query := `SELECT id FROM admins WHERE email = $1`

	if err := r.container.DB().Db.QueryRowContext(ctx, query, email).Scan(
		&user.ID,
	); err != nil {
		logger.Error("Error getting admin user", "error", err)
		return nil, err
	}

	return user, nil
}

package auth_repository

import (
	"context"
	"database/sql"
	"errors"

	internal_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/models"
	auth_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
)

type LoginParams struct {
	Email    string `json:"email" validate:"required,email" errormgs:"email is required and must be a valid email address"`
	Password string `json:"password" validate:"required" errormgs:"password is required"`
	/* This represent the login method ex (only email, password, SSO) */
	LoginMethod string `json:"type" validatge:"required,oneof=email-only password" errormgs:"type is required"`
}

type AuthRepositoryInterface interface {
	LoginUserByEmail(ctx context.Context, email string, authentication_token string) (*auth_models.UserEmailLogin, *internal_models.HandlerError)
	CreateUserMagicEmail(ctx context.Context, email string) (*auth_models.UserEmailLogin, error)
	GetAdminUser(ctx context.Context, email string) (*auth_models.Admin, *internal_models.HandlerError)
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
) (*auth_models.UserEmailLogin, *internal_models.HandlerError) {
	logger := r.container.Logger()

	query := `
						WITH selected_rows AS (
	    				SELECT id, email, expires_at FROM user_email_login WHERE email = $1 AND authentication_token = $2 AND deleted_at IS NULL and expires_at > NOW() and used_at IS NULL
							FOR UPDATE
						)
						UPDATE user_email_login
						SET used_at = NOW()
						FROM selected_rows
						WHERE user_email_login.id = selected_rows.id
						RETURNING selected_rows.id, selected_rows.email, selected_rows.expires_at;`

	loginEmail := auth_models.UserEmailLogin{}

	if err := r.container.DB().Db.QueryRowContext(ctx, query, email, authentication_token).Scan(&loginEmail.ID, &loginEmail.Email, &loginEmail.ExpiresAt); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			// Handle no rows error
			logger.Error("No rows found for admin user", "error", err)
			return nil, internal_models.NewErrorWithCode(internal_models.MagicLinkExpiredError)
		}
		logger.Error("Error getting user email login", "error", err)
		return nil, internal_models.NewErrorWithCode(internal_models.MagicLinkExpiredError)
	}

	return &loginEmail, nil
}

func (r *AuthRepository) CreateUserMagicEmail(
	ctx context.Context,
	email string,
) (*auth_models.UserEmailLogin, error) {
	logger := r.container.Logger()
	newLoginEmail := &auth_models.UserEmailLogin{}

	//Invalidate all past tokens for the user
	invalidateQuery := `UPDATE user_email_login SET deleted_at = NOW() WHERE email = $1`

	if _, err := r.container.DB().Db.ExecContext(ctx, invalidateQuery, email); err != nil {
		logger.Error("Error invalidating user email login", "error", err)
		return nil, err
	}

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
) (*auth_models.Admin, *internal_models.HandlerError) {
	logger := r.container.Logger()
	user := &auth_models.Admin{
		Email: email,
	}

	query := `SELECT id, email FROM admins WHERE email = $1`

	err := r.container.DB().Db.QueryRowContext(ctx, query, email).Scan(
		&user.ID, &user.Email,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			// Handle no rows error
			logger.Error("No rows found for admin user", "error", err)
			return nil, internal_models.NewErrorWithCode(internal_models.AdminNotFoundError)
		}

		// Handle other errors
		logger.Error("Error getting admin user", "error", err)
		return nil, internal_models.NewErrorWithCode(internal_models.AdminNotFoundError)
	}

	return user, nil
}

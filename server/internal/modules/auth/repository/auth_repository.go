package auth_repository

import (
	"context"
	"database/sql"
	"errors"

	internal_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/models"
	auth_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/models"
	auth_utils "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/utils"
	businesses_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/businesses/models"
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
	LoginByPassword(ctx context.Context, params LoginPasswordParams) (*auth_models.Admin, *internal_models.HandlerError)
	CreateUserMagicEmail(ctx context.Context, email string) (*auth_models.UserEmailLogin, error)
	GetAdminUser(ctx context.Context, email string) (*auth_models.Admin, *internal_models.HandlerError)
	GetBusinessUserByEmail(ctx context.Context, email string, businessID string) (*businesses_models.BusinessUser, *internal_models.HandlerError)
	AdminLoginByPassword(ctx context.Context, params auth_models.AdminLoginParams) (*auth_models.Admin, *internal_models.HandlerError)
	RegisterAdmin(ctx context.Context, params RegisterAdminParams) (*auth_models.Admin, *internal_models.HandlerError)
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

type LoginPasswordParams struct {
	Email    string `json:"email" validate:"required,email" errormgs:"email is required and must be a valid email address"`
	Password string `json:"password" validate:"required" errormgs:"password is required"`
	/* This represent the login method ex (only email, password, SSO) */
	BusinessID string `json:"business_id" validate:"required" errormgs:"business_id is required"`
}

type RegisterAdminParams struct {
	Email        string `json:"email" validate:"required,email" errormgs:"email is required and must be a valid email address"`
	PasswordHash string `json:"password_hash" validate:"required" errormgs:"password_hash is required"`
	IsActive     bool   `json:"is_active"`
}

func (r *AuthRepository) LoginByPassword(
	ctx context.Context,
	params LoginPasswordParams,
) (*auth_models.Admin, *internal_models.HandlerError) {
	/* logger := r.container.Logger()

	user := &auth_models.Admin{
		Email: params.Email,
	}
	query := `SELECT id, email, password_hash, business_id FROM business_users WHERE email = $1 and business_id = $2`

	err := r.container.DB().Db.QueryRowContext(ctx, query, email).Scan(
		&user.ID, &user.Email, &user.PasswordHash,
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

	// Here you would typically compare the provided password with the stored password hash
	// For example, using bcrypt:
	// if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
	//     return nil, internal_models.NewErrorWithCode(internal_models.InvalidCredentialsError)
	// }

	return user, nil */
	return nil, nil
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

func (r *AuthRepository) GetBusinessUserByEmail(
	ctx context.Context,
	email string,
	businessID string,
) (*businesses_models.BusinessUser, *internal_models.HandlerError) {
	logger := r.container.Logger()
	user := &businesses_models.BusinessUser{}

	query := `SELECT id, business_id, first_name, last_name, email, phone FROM businesses_users WHERE email = $1 AND business_id = $2`

	err := r.container.DB().Db.QueryRowContext(ctx, query, email, businessID).Scan(
		&user.ID, &user.BusinessID, &user.FirstName, &user.LastName, &user.Email, &user.Phone,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			logger.Info("No business user found", "email", email, "business_id", businessID)
			return nil, internal_models.NewErrorWithCode(internal_models.UserNotFoundError)
		}

		logger.Error("Error getting business user", "error", err)
		return nil, internal_models.NewErrorWithCode(internal_models.UserNotFoundError)
	}

	return user, nil
}

func (r *AuthRepository) CreateBusinessUser(
	ctx context.Context,
	params *businesses_models.CreateBusinessUserParams,
) (*businesses_models.BusinessUser, *internal_models.HandlerError) {
	logger := r.container.Logger()
	businessUser := &businesses_models.BusinessUser{
		BusinessID: params.BusinessID,
		Email:      params.Email,
		FirstName:  params.FirstName,
		LastName:   params.LastName,
		Phone:      params.Phone,
	}

	query := `INSERT INTO businesses_users (business_id, first_name, last_name, email, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id`

	if err := r.container.DB().Db.QueryRowContext(ctx, query,
		businessUser.BusinessID,
		params.FirstName,
		params.LastName,
		params.Email,
		params.Phone,
	).Scan(&businessUser.ID); err != nil {
		logger.Error("Error creating business user", "error", err, "params", params)
		return nil, internal_models.NewErrorWithCode(internal_models.UserCreationError)
	}

	logger.Info("Business user created successfully", "user_id", businessUser.ID, "email", params.Email)
	return businessUser, nil
}

func (r *AuthRepository) AdminLoginByPassword(
	ctx context.Context,
	params auth_models.AdminLoginParams,
) (*auth_models.Admin, *internal_models.HandlerError) {
	logger := r.container.Logger()
	admin := &auth_models.Admin{}

	query := `SELECT id, email, password_hash, created_at, last_login_at, is_active FROM admins WHERE email = $1 AND is_active = true`

	var passwordHash string
	err := r.container.DB().Db.QueryRowContext(ctx, query, params.Email).Scan(
		&admin.ID, &admin.Email, &passwordHash, &admin.CreatedAt, &admin.LastLoginAt, &admin.IsActive,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			logger.Error("No admin found or admin is inactive", "email", params.Email)
			return nil, internal_models.NewErrorWithCode(internal_models.AdminNotFoundError)
		}
		logger.Error("Error getting admin user", "error", err)
		return nil, internal_models.NewErrorWithCode(internal_models.AdminNotFoundError)
	}

	if !auth_utils.VerifyPassword(params.Password, passwordHash) {
		logger.Error("Invalid password for admin", "email", params.Email)
		return nil, internal_models.NewErrorWithCode(internal_models.InvalidCredentialsError)
	}

	// Update last login timestamp
	updateQuery := `UPDATE admins SET last_login_at = NOW() WHERE id = $1`
	if _, updateErr := r.container.DB().Db.ExecContext(ctx, updateQuery, admin.ID); updateErr != nil {
		logger.Error("Error updating admin last login", "error", updateErr, "admin_id", admin.ID)
		// Don't fail the login for this error, just log it
	}

	return admin, nil
}

func (r *AuthRepository) RegisterAdmin(
	ctx context.Context,
	params RegisterAdminParams,
) (*auth_models.Admin, *internal_models.HandlerError) {
	logger := r.container.Logger()
	admin := &auth_models.Admin{
		Email:    params.Email,
		IsActive: params.IsActive,
	}

	query := `INSERT INTO admins (email, password_hash, is_active) VALUES ($1, $2, $3) RETURNING id, created_at`

	if err := r.container.DB().Db.QueryRowContext(ctx, query,
		params.Email,
		params.PasswordHash,
		params.IsActive,
	).Scan(&admin.ID, &admin.CreatedAt); err != nil {
		logger.Error("Error creating admin", "error", err, "email", params.Email)
		return nil, internal_models.NewErrorWithCode(internal_models.UserCreationError)
	}

	logger.Info("Admin created successfully", "admin_id", admin.ID, "email", params.Email)
	return admin, nil
}

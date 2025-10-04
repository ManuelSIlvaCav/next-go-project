package sellers_repositories

import (
	"context"
	"database/sql"

	internal_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	sellers_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/sellers/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/utils"
	"github.com/jackc/pgx/v5/pgconn"
)

type SellerRepository struct {
	container *container.Container
	utils.BaseRepository[sellers_models.Seller]
}

func NewSellerRepository(container *container.Container) *SellerRepository {
	return &SellerRepository{
		container:      container,
		BaseRepository: *utils.NewBaseRepository[sellers_models.Seller](container),
	}
}

func (r *SellerRepository) CreateSeller(ctx context.Context,
	seller *sellers_models.Seller,
	sellerData *sellers_models.SellerData) (*sellers_models.SellerDTO, error) {
	logger := r.container.Logger()

	// Start a transaction
	tx, err := r.container.DB().Db.BeginTx(ctx, nil)
	if err != nil {
		logger.Error("Error starting transaction", "error", err)
		return nil, internal_models.NewErrorWithCode(internal_models.UserCreationError)
	}
	defer tx.Rollback()

	// Insert seller with ON CONFLICT to handle duplicates
	sellerQuery := `
		INSERT INTO sellers (business_id, email, password_hash) 
		VALUES ($1, $2, $3) 
		ON CONFLICT (email, business_id) DO NOTHING
		RETURNING id, created_at, updated_at`

	err = tx.QueryRowContext(ctx, sellerQuery,
		seller.BusinessID,
		seller.Email,
		seller.PasswordHash,
	).Scan(&seller.ID, &seller.CreatedAt, &seller.UpdatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			// ON CONFLICT triggered, seller already exists
			logger.Error("Seller already exists", "email", seller.Email, "business_id", seller.BusinessID)
			return nil, internal_models.NewErrorWithCode(internal_models.ErrSellerAlreadyExists)
		}
		pqErr, ok := err.(*pgconn.PgError)
		if ok {
			logger.Error("Error creating seller", "error", err, "pqErr", pqErr, "code", pqErr.Code)
		}
		logger.Error("Error creating seller", "error", err)
		return nil, internal_models.NewErrorWithCode(internal_models.UserCreationError)
	}

	// Insert seller data
	if sellerData != nil {
		sellerDataQuery := `INSERT INTO sellers_data (seller_id, first_name, last_name, phone) 
		VALUES ($1, $2, $3, $4) RETURNING id, created_at, updated_at`

		if err := tx.QueryRowContext(ctx, sellerDataQuery,
			seller.ID,
			sellerData.FirstName,
			sellerData.LastName,
			sellerData.Phone,
		).Scan(&sellerData.ID, &sellerData.CreatedAt, &sellerData.UpdatedAt); err != nil {
			logger.Error("Error creating seller data", "error", err)
			return nil, internal_models.NewErrorWithCode(internal_models.UserCreationError)
		}
	}

	// Commit transaction
	if err := tx.Commit(); err != nil {
		logger.Error("Error committing transaction", "error", err)
		return nil, internal_models.NewErrorWithCode(internal_models.UserCreationError)
	}

	// Build DTO
	dto := &sellers_models.SellerDTO{
		ID:         seller.ID,
		BusinessID: seller.BusinessID,
		Email:      seller.Email,
		CreatedAt:  seller.CreatedAt,
		UpdatedAt:  seller.UpdatedAt,
	}

	if sellerData != nil {
		dto.FirstName = sellerData.FirstName
		dto.LastName = sellerData.LastName
		dto.Phone = sellerData.Phone
	}

	return dto, nil
}

func (r *SellerRepository) GetSeller(ctx context.Context, params *sellers_models.GetSellerParams) (*sellers_models.SellerDTO, error) {
	logger := r.container.Logger()

	dto := &sellers_models.SellerDTO{}

	query := `
		SELECT 
			s.id, s.business_id, s.email, s.created_at, s.updated_at,
			sd.first_name, sd.last_name, sd.phone
		FROM sellers s
		LEFT JOIN sellers_data sd ON s.id = sd.seller_id
		WHERE s.id = $1`

	var firstName, lastName, phone sql.NullString

	queryArgs := []interface{}{params.ID}
	if params.BusinessID > 0 {
		query += ` AND s.business_id = $2`
		queryArgs = append(queryArgs, params.BusinessID)
	}

	if err := r.container.DB().Db.QueryRowContext(ctx, query, queryArgs...).Scan(
		&dto.ID,
		&dto.BusinessID,
		&dto.Email,
		&dto.CreatedAt,
		&dto.UpdatedAt,
		&firstName,
		&lastName,
		&phone,
	); err != nil {
		logger.Error("Error getting seller", "error", err, "params", params)
		return nil, err
	}

	// Handle nullable fields
	if firstName.Valid {
		dto.FirstName = firstName.String
	}
	if lastName.Valid {
		dto.LastName = lastName.String
	}
	if phone.Valid {
		dto.Phone = phone.String
	}

	return dto, nil
}

func (r *SellerRepository) GetSellerByEmail(ctx context.Context, email string, businessID int64) (*sellers_models.Seller, error) {
	logger := r.container.Logger()

	seller := &sellers_models.Seller{}

	query := `SELECT id, business_id, email, password_hash, created_at, updated_at 
	FROM sellers WHERE email = $1 AND business_id = $2`

	if err := r.container.DB().Db.QueryRowContext(ctx, query, email, businessID).Scan(
		&seller.ID,
		&seller.BusinessID,
		&seller.Email,
		&seller.PasswordHash,
		&seller.CreatedAt,
		&seller.UpdatedAt,
	); err != nil {
		logger.Error("Error getting seller by email", "error", err, "email", email)
		return nil, err
	}

	return seller, nil
}

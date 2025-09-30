package clients_repositories

import (
	"context"
	"database/sql"
	"time"

	internal_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/models"
	clients_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/clients/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/utils"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgconn"
)

type ClientRepository struct {
	container *container.Container
	utils.BaseRepository[clients_models.Client]
}

func NewClientRepository(container *container.Container) *ClientRepository {
	return &ClientRepository{
		container:      container,
		BaseRepository: *utils.NewBaseRepository[clients_models.Client](container),
	}
}

func (c *ClientRepository) GetClients() []string {
	clients := []string{"client1", "client2", "client3"}
	//Get the clients from the database
	return clients
}

func (r *ClientRepository) CreateClient(ctx context.Context, params *clients_models.CreateClientParams) (*clients_models.Client, *internal_models.HandlerError) {
	logger := r.container.Logger()

	clientID := uuid.New().String()
	now := time.Now()

	newClient := &clients_models.Client{
		ID:         clientID,
		BusinessID: params.BusinessID,
		FirstName:  params.FirstName,
		MiddleName: params.MiddleName,
		LastName:   params.LastName,
		Email:      params.Email,
		CreatedAt:  now,
	}

	// Start a transaction
	tx, err := r.container.DB().Db.BeginTx(ctx, nil)

	if err != nil {
		logger.Error("Error starting transaction", "error", err)
		return nil, internal_models.NewErrorWithCode(internal_models.UserCreationError)
	}
	defer tx.Rollback()

	// Insert client with ON CONFLICT to handle unique constraint on (business_id, email)
	clientQuery := `INSERT INTO clients (id, business_id, first_name, middle_name, last_name, email, created_at) 
	VALUES ($1, $2, $3, $4, $5, $6, $7) 
	ON CONFLICT (business_id, email) 
	DO UPDATE SET 
		first_name = EXCLUDED.first_name,
		middle_name = EXCLUDED.middle_name,
		last_name = EXCLUDED.last_name
	RETURNING id, business_id, first_name, middle_name, last_name, email, created_at`

	var returnedClient clients_models.Client
	if err := tx.QueryRowContext(ctx, clientQuery,
		newClient.ID,
		newClient.BusinessID,
		newClient.FirstName,
		newClient.MiddleName,
		newClient.LastName,
		newClient.Email,
		newClient.CreatedAt,
	).Scan(
		&returnedClient.ID,
		&returnedClient.BusinessID,
		&returnedClient.FirstName,
		&returnedClient.MiddleName,
		&returnedClient.LastName,
		&returnedClient.Email,
		&returnedClient.CreatedAt,
	); err != nil {
		pqErr := err.(*pgconn.PgError)
		logger.Error("Error creating client", "error", err, "pqErr", pqErr, "params", params)

		if pqErr.Code == "23503" {
			return nil, internal_models.NewErrorWithCode(internal_models.BusinessForeignKeyError)
		}
		return nil, internal_models.NewErrorWithCode(internal_models.UserCreationError)
	}

	// Update newClient with the returned values (in case of conflict, we get the existing client)
	newClient = &returnedClient

	// Insert contact information if phone is provided (with ON CONFLICT handling)
	if params.Phone != "" {
		contactQuery := `INSERT INTO client_contacts_information (client_id, phone, email, created_at) 
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (client_id) 
		DO UPDATE SET 
			phone = EXCLUDED.phone,
			email = EXCLUDED.email`

		if _, err := tx.ExecContext(ctx, contactQuery,
			newClient.ID,
			params.Phone,
			params.Email,
			now,
		); err != nil {
			logger.Error("Error creating client contact", "error", err, "client_id", newClient.ID)
			return nil, internal_models.NewErrorWithCode(internal_models.UserCreationError)
		}
	}

	// Commit transaction
	if err := tx.Commit(); err != nil {
		logger.Error("Error committing transaction", "error", err)
		return nil, internal_models.NewErrorWithCode(internal_models.UserCreationError)
	}

	logger.Info("Client created successfully", "client_id", newClient.ID, "email", params.Email)
	return newClient, nil
}

func (r *ClientRepository) GetClient(ctx context.Context, params *clients_models.GetClientParams) (*clients_models.Client, error) {
	logger := r.container.Logger()

	client := &clients_models.Client{}

	query := `SELECT id, business_id, first_name, middle_name, last_name, email, created_at 
	FROM clients WHERE id = $1 AND business_id = $2`

	if err := r.container.DB().Db.QueryRowContext(ctx, query, params.ID, params.BusinessID).Scan(
		&client.ID,
		&client.BusinessID,
		&client.FirstName,
		&client.MiddleName,
		&client.LastName,
		&client.Email,
		&client.CreatedAt,
	); err != nil {
		if err == sql.ErrNoRows {
			logger.Info("Client not found", "id", params.ID, "business_id", params.BusinessID)
			return nil, err
		}
		logger.Error("Error getting client", "error", err, "params", params)
		return nil, err
	}

	return client, nil
}

func (r *ClientRepository) GetClientByEmail(ctx context.Context, email string, businessID int64) (*clients_models.Client, error) {
	logger := r.container.Logger()

	client := &clients_models.Client{}

	query := `SELECT id, business_id, first_name, middle_name, last_name, email, created_at 
	FROM clients WHERE email = $1 AND business_id = $2`

	if err := r.container.DB().Db.QueryRowContext(ctx, query, email, businessID).Scan(
		&client.ID,
		&client.BusinessID,
		&client.FirstName,
		&client.MiddleName,
		&client.LastName,
		&client.Email,
		&client.CreatedAt,
	); err != nil {
		if err == sql.ErrNoRows {
			logger.Info("Client not found", "email", email, "business_id", businessID)
			return nil, err
		}
		logger.Error("Error getting client by email", "error", err, "email", email)
		return nil, err
	}

	return client, nil
}

package pets_repositories

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
	"time"

	internal_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	pets_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/pets/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/utils"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jmoiron/sqlx"
)

type PetRepository struct {
	container *container.Container
	utils.BaseRepository[pets_models.Pet]
}

func NewPetRepository(container *container.Container) *PetRepository {
	return &PetRepository{
		container:      container,
		BaseRepository: *utils.NewBaseRepository[pets_models.Pet](container),
	}
}

func (r *PetRepository) CreatePet(ctx context.Context, params *pets_models.Pet) (*pets_models.Pet, *internal_models.HandlerError) {
	logger := r.container.Logger()

	newPet := params

	query := `INSERT INTO pets (business_id, client_id, pet_name, pet_type, breed, age) 
	VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`

	if err := r.container.DB().Db.QueryRowContext(ctx, query,
		newPet.BusinessID,
		newPet.ClientID,
		newPet.PetName,
		newPet.PetType,
		newPet.Breed,
		newPet.Age,
	).Scan(&newPet.ID); err != nil {
		pqErr := err.(*pgconn.PgError)
		logger.Error("Error creating pet", "error", err, "pqErr", pqErr, "params", params)

		if pqErr.Code == "23503" {
			return nil, internal_models.NewErrorWithCode(internal_models.BusinessForeignKeyError)
		}
		return nil, internal_models.NewErrorWithCode(internal_models.UserCreationError)
	}

	return newPet, nil
}

func (r *PetRepository) GetPet(ctx context.Context, params *pets_models.GetPetParams) (*pets_models.Pet, error) {
	logger := r.container.Logger()

	pet := &pets_models.Pet{}

	query := `SELECT id, business_id, client_id, name, pet_type, breed, age, created_at 
	FROM pets WHERE id = $1 AND business_id = $2`

	if err := r.container.DB().Db.QueryRowContext(ctx, query, params.ID, params.BusinessID).Scan(
		&pet.ID,
		&pet.BusinessID,
		&pet.ClientID,
		&pet.PetName,
		&pet.PetType,
		&pet.Breed,
		&pet.Age,

		&pet.CreatedAt,
	); err != nil {
		logger.Error("Error getting pet", "error", err, "params", params)
		return nil, err
	}

	return pet, nil
}

func (r *PetRepository) GetPets(ctx context.Context, params *pets_models.GetPetsParams) ([]pets_models.Pet, error) {
	logger := r.container.Logger()

	entities := []pets_models.Pet{}

	queryLimit := params.Limit
	if queryLimit == 0 {
		queryLimit = 10 // default value
	}

	var rows *sql.Rows
	var err error

	baseQuery := `SELECT id, business_id, client_id, name, pet_type, breed, age, is_active, created_at, updated_at 
	FROM pets WHERE business_id = $1 AND is_active = true`

	whereConditions := []string{}
	args := []interface{}{params.BusinessID}
	argIndex := 2

	if params.ClientID != "" {
		whereConditions = append(whereConditions, fmt.Sprintf("client_id = $%d", argIndex))
		args = append(args, params.ClientID)
		argIndex++
	}

	if params.PetType != "" {
		whereConditions = append(whereConditions, fmt.Sprintf("pet_type = $%d", argIndex))
		args = append(args, params.PetType)
		argIndex++
	}

	if len(whereConditions) > 0 {
		baseQuery += " AND " + strings.Join(whereConditions, " AND ")
	}

	if params.Cursor == "" {
		rows, err = r.container.DB().Db.QueryContext(ctx, baseQuery+fmt.Sprintf(" ORDER BY created_at DESC LIMIT $%d", argIndex), append(args, queryLimit)...)
	} else {
		baseQuery += fmt.Sprintf(" AND id < $%d ORDER BY created_at DESC LIMIT $%d", argIndex, argIndex+1)
		args = append(args, params.Cursor, queryLimit)
		rows, err = r.container.DB().Db.QueryContext(ctx, baseQuery, args...)
	}

	if err != nil {
		logger.Error("Failed to get pets", "error", err, "params", params)
		return nil, err
	}

	defer rows.Close()

	err = sqlx.StructScan(rows, &entities)
	if err != nil {
		logger.Error("Failed to scan pets", "error", err)
		return nil, err
	}

	return entities, nil
}

func (r *PetRepository) UpdatePet(ctx context.Context, params *pets_models.UpdatePetParams) (*pets_models.Pet, *internal_models.HandlerError) {
	logger := r.container.Logger()

	updates := []string{}
	args := []interface{}{}
	argIndex := 1

	if params.Name != "" {
		updates = append(updates, fmt.Sprintf("name = $%d", argIndex))
		args = append(args, params.Name)
		argIndex++
	}

	if params.PetType != "" {
		updates = append(updates, fmt.Sprintf("pet_type = $%d", argIndex))
		args = append(args, params.PetType)
		argIndex++
	}

	if params.Breed != "" {
		updates = append(updates, fmt.Sprintf("breed = $%d", argIndex))
		args = append(args, params.Breed)
		argIndex++
	}

	if params.Age != 0 {
		updates = append(updates, fmt.Sprintf("age = $%d", argIndex))
		args = append(args, params.Age)
		argIndex++
	}

	if len(updates) == 0 {
		logger.Warn("No fields to update", "params", params)
		return nil, internal_models.NewErrorWithCode(internal_models.UserCreationError)
	}

	// Always update the updated_at field
	updates = append(updates, fmt.Sprintf("updated_at = $%d", argIndex))
	args = append(args, time.Now())
	argIndex++

	// Add WHERE conditions
	args = append(args, params.ID)
	whereClause := fmt.Sprintf("id = $%d AND is_active = true", argIndex)

	query := fmt.Sprintf("UPDATE pets SET %s WHERE %s RETURNING id, business_id, client_id, name, pet_type, breed, age, created_at",
		strings.Join(updates, ", "), whereClause)

	pet := &pets_models.Pet{}
	if err := r.container.DB().Db.QueryRowContext(ctx, query, args...).Scan(
		&pet.ID,
		&pet.BusinessID,
		&pet.ClientID,
		&pet.PetName,
		&pet.PetType,
		&pet.Breed,
		&pet.Age,
		&pet.CreatedAt,
	); err != nil {
		logger.Error("Error updating pet", "error", err, "params", params)
		return nil, internal_models.NewErrorWithCode(internal_models.UserCreationError)
	}

	return pet, nil
}

func (r *PetRepository) DeletePet(ctx context.Context, params *pets_models.DeletePetParams) error {
	logger := r.container.Logger()

	query := `UPDATE pets SET  WHERE id = $1 AND business_id = $2`

	result, err := r.container.DB().Db.ExecContext(ctx, query, params.ID, params.BusinessID)
	if err != nil {
		logger.Error("Error deleting pet", "error", err, "params", params)
		return internal_models.NewErrorWithCode(internal_models.UserCreationError)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil || rowsAffected == 0 {
		logger.Error("Pet not found or already deleted", "error", err, "params", params, "rowsAffected", rowsAffected)
		return internal_models.NewErrorWithCode(internal_models.UserNotFoundError)
	}

	return nil
}

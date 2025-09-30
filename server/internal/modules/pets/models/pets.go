package pets_models

import (
	"time"

	"github.com/google/uuid"
)

type Pet struct {
	ID         string    `json:"id" db:"id"`
	BusinessID int       `json:"business_id" db:"business_id"`
	ClientID   string    `json:"client_id,omitempty" db:"client_id"`
	PetName    string    `json:"pet_name" db:"pet_name"`
	PetType    string    `json:"pet_type" db:"pet_type"`
	Breed      string    `json:"breed,omitempty" db:"breed"`
	Age        float64   `json:"age,omitempty" db:"age"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
}

type CreatePetParams struct {
	BusinessID int     `json:"business_id"`
	ClientID   string  `json:"client_id"`
	PetName    string  `json:"pet_name" validate:"required,min=1,max=100"`
	PetType    string  `json:"pet_type" validate:"required,oneof=dog cat bird fish rabbit hamster guinea_pig turtle snake lizard other"`
	Breed      string  `json:"breed,omitempty" validate:"omitempty,max=100"`
	Age        float64 `json:"age,omitempty" validate:"omitempty,min=0,max=50"`
}

type UpdatePetParams struct {
	ID      string  `json:"id" validate:"required"`
	Name    string  `json:"name,omitempty" validate:"omitempty,min=1,max=100"`
	PetType string  `json:"pet_type,omitempty" validate:"omitempty,oneof=dog cat bird fish rabbit hamster guinea_pig turtle snake lizard other"`
	Breed   string  `json:"breed,omitempty" validate:"omitempty,max=100"`
	Age     float64 `json:"age,omitempty" validate:"omitempty,min=0,max=50"`
}

type GetPetsParams struct {
	BusinessID int    `json:"business_id" validate:"required"`
	ClientID   string `json:"client_id,omitempty"`
	PetType    string `json:"pet_type,omitempty"`
	Limit      int    `json:"limit,omitempty"`
	Cursor     string `json:"cursor,omitempty"`
}

type GetPetParams struct {
	ID         string `json:"id" validate:"required"`
	BusinessID int    `json:"business_id" validate:"required"`
}

type DeletePetParams struct {
	ID         string `json:"id" validate:"required"`
	BusinessID int    `json:"business_id" validate:"required"`
}

// Helper function to generate new UUID for pets
func GeneratePetID() string {
	return uuid.New().String()
}

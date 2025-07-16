package main

import (
	"log"

	services_pet_vet "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/scrapper/services/pet_vet"
)

func main() {
	petVetService := services_pet_vet.NewPetVetService()
	err := petVetService.ScrapTest()
	if err != nil {
		log.Fatalf("Error scraping PetVet: %v", err)
	}
}

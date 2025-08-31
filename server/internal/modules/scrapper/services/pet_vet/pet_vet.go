package services_pet_vet

import (
	"context"
	"log"
	"time"

	"github.com/chromedp/chromedp"
)

/* Package that scrapes petvet.cl */

type PetVetService struct {
	domain string
}

func NewPetVetService() *PetVetService {
	return &PetVetService{
		domain: "https://www.petvet.cl",
	}
}

func (p *PetVetService) Scrape() error {

	log.Println("Scraping Categories from PetVet")

	/* opts := append(chromedp.DefaultExecAllocatorOptions[:],
		// to see what happen
		chromedp.Flag("headless", false),
	)
	ctx, cancel := chromedp.NewExecAllocator(context.Background(), opts...)
	defer cancel() */

	// Add timeout context for connection
	connectCtx, connectCancel := context.WithTimeout(context.Background(), 10*time.Minute)
	defer connectCancel()

	dockerURL := "ws://chromedp:9222"
	remoteCtx, cancel := chromedp.NewRemoteAllocator(
		connectCtx,
		dockerURL,
	)
	defer cancel()

	/* ------------- */

	ctx, cancel := chromedp.NewContext(remoteCtx,
		chromedp.WithDebugf(log.Printf),
	)
	defer cancel()

	categories := ScrapCategories(ctx)

	log.Println("Scraping Products from PetVet")
	categories = categories[3:4] // We only want the fourth category for now

	err := scrapeProducts(ctx, categories)
	if err != nil {
		log.Printf("Error scraping products: %v", err)
		return err
	}

	return nil
}

func (p *PetVetService) ScrapTest() error {
	connectCtx, connectCancel := context.WithTimeout(context.Background(), 60*time.Minute)
	defer connectCancel()

	dockerURL := "ws://127.0.0.1:9222"
	remoteCtx, cancel := chromedp.NewRemoteAllocator(
		connectCtx,
		dockerURL,
	)
	defer cancel()

	ctx, cancel := chromedp.NewContext(remoteCtx,
		chromedp.WithLogf(log.Printf),
		chromedp.WithDebugf(log.Printf),
		chromedp.WithErrorf(log.Printf),
	)
	defer cancel()

	categories := []PetVetCategory{
		{
			Name: "Gatos",
			URL:  "https://www.petvet.cl/collections/gatos",
			SubCategories: []PetVetCategory{
				{
					Name: "Arenas",
					URL:  "https://www.petvet.cl/collections/arenas",
					SubCategories: []PetVetCategory{
						{
							Name:          "Angora",
							URL:           "https://www.petvet.cl/collections/arenas-angora",
							SubCategories: []PetVetCategory{},
						},
					},
				},
			},
		},
	}

	err := scrapeProducts(ctx, categories)
	if err != nil {
		log.Printf("Error scraping products: %v", err)
		return err
	}

	return nil
}

func ScrapCategories(ctx context.Context) []PetVetCategory {
	categories := navigateToHomeAndGetCategories(ctx)

	if len(categories) == 0 {
		log.Println("No categories found")
		return nil
	}

	for index, category := range categories {
		if category.SubCategoryKeyRelation != "" {
			// If the category has a subcategory relation, scrape it
			err := scrapNestedCategory(ctx, &category)
			if err != nil {
				log.Printf("Error scraping nested category %s: %v", category.Name, err)
			}
			categories[index] = category // Update the category in the slice
		}
	}
	TraverseCategories(categories)
	return categories
}

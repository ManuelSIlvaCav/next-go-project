package services_pet_vet

import (
	"context"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/antchfx/htmlquery"
	"github.com/chromedp/chromedp"
)

type PetVetCategory struct {
	Name                   string
	SubCategoryKeyRelation string
	URL                    string
	SubCategories          []PetVetCategory
	level                  int
}

/* Scrape the categories header*/
func navigateToHomeAndGetCategories(ctx context.Context) []PetVetCategory {

	categories := make([]PetVetCategory, 0)
	var htmlContent string
	err := chromedp.Run(ctx,
		chromedp.ActionFunc(func(ctx context.Context) error {
			// Set user agent
			return chromedp.Evaluate(`navigator.userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"`, nil).Do(ctx)
		}),
		chromedp.Navigate("https://www.petvet.cl"),
		chromedp.Sleep(3*time.Second), // Wait for the page to load
		chromedp.WaitReady("body", chromedp.ByQuery),
		/* Get all categories */
		chromedp.WaitReady("//*[@id='shopify-section-header']",
			chromedp.BySearch),

		chromedp.Sleep(7*time.Second),

		chromedp.OuterHTML("//*[@id='shopify-section-header']//div[@class='main-nav__wrapper']//ul[@class='menu center']",
			&htmlContent,
			chromedp.BySearch),
	)

	if err != nil {
		log.Printf("Error navigating to PetVet homepage: %v", err)
		return categories
	}

	doc, err := htmlquery.Parse(strings.NewReader(htmlContent))

	if err != nil {
		log.Printf("Error parsing HTML content: %v", err)
		return categories
	}

	log.Println("HTML content parsed successfully, extracting categories...", htmlContent)

	htmlCategoriesNodes := htmlquery.Find(doc, "//li/a")

	for _, node := range htmlCategoriesNodes {
		category := PetVetCategory{}

		if node != nil {
			category.Name = strings.TrimSpace(htmlquery.InnerText(node))
			category.URL = getFullValidURL(htmlquery.SelectAttr(node, "href"))
			category.level = 1
			category.SubCategories = make([]PetVetCategory, 0)
			category.SubCategoryKeyRelation = htmlquery.SelectAttr(node, "data-dropdown-rel")
		}

		if category.Name == "" || category.URL == "" {
			log.Printf("Skipping category with empty text or href: %v, %v", category.Name, category.URL)
			continue
		}

		categories = append(categories, category)
	}
	return categories
}

/* Scrape nested categories */
func scrapNestedCategory(ctx context.Context, category *PetVetCategory) error {
	var allHeaderContent string

	searchString := "//*[@id='shopify-section-header']//div[@class='main-nav__wrapper']"

	chromedp.Run(ctx,
		chromedp.OuterHTML(searchString,
			&allHeaderContent,
			chromedp.BySearch),
	)

	if allHeaderContent == "" {
		log.Printf("No content found for nested category %s with relation %s", category.Name, category.SubCategoryKeyRelation)
		return nil
	}

	doc, err := htmlquery.Parse(strings.NewReader(allHeaderContent))

	if err != nil {
		log.Printf("Error parsing HTML content: %v", err)
		return nil
	}

	searchDropDown := fmt.Sprintf("//div[@class='dropdown_container' and @data-dropdown='%s']//div[@class='dropdown_content ']",
		category.SubCategoryKeyRelation)

	htmlNode := htmlquery.FindOne(doc, searchDropDown)

	if htmlNode == nil {
		log.Printf("No nested categories found for %s", category.Name)
		return nil
	}

	index := 0
	/* Each dropdown_column */
	for node := range htmlNode.ChildNodes() {
		dropDownColumnChildren := node.ChildNodes()
		if node.Type != 3 {
			continue // Skip non-element nodes
		}

		/* Each should be a ul class */
		for child := range dropDownColumnChildren {
			if child.Type != 3 {
				continue // Skip non-element nodes
			}
			classForChild := htmlquery.SelectAttr(child, "class")
			log.Printf("Child class: %s %s", classForChild, htmlquery.InnerText(child))

			if child.Data == "ul" {
				if classForChild == "dropdown_title" {
					catregoryNode := htmlquery.FindOne(child, "//a")

					subCategory := PetVetCategory{
						Name:          strings.TrimSpace(htmlquery.InnerText(child)),
						URL:           getFullValidURL(htmlquery.SelectAttr(catregoryNode, "href")),
						level:         category.level + 1,
						SubCategories: make([]PetVetCategory, 0),
					}
					category.SubCategories = append(category.SubCategories, subCategory)
					log.Printf("SubCategory: %v", subCategory)
					index++ // Increment index for next subcategory
					continue
				}

				/* These are single categories */
				if classForChild == "dropdown_item" {
					log.Printf("Found single category: %s", htmlquery.InnerText(child))
					singleCategoryNode := htmlquery.FindOne(child, "//a")

					name := strings.TrimSpace(htmlquery.InnerText(singleCategoryNode))
					href := htmlquery.SelectAttr(singleCategoryNode, "href")

					singleCategory := PetVetCategory{
						Name:          name,
						URL:           getFullValidURL(href),
						level:         category.level + 1,
						SubCategories: make([]PetVetCategory, 0),
					}

					category.SubCategories = append(category.SubCategories, singleCategory)
					log.Printf("Single Category %v", singleCategory)
					continue
				}
				// Process the ul class element
				ulChildren := child.ChildNodes()

				/* 3rd level categories */
				for ulChild := range ulChildren {
					if ulChild.Type != 3 {
						continue // Skip non-element nodes
					}
					nestedCategoriesNodes := htmlquery.Find(ulChild, "//a")
					for _, nestedNode := range nestedCategoriesNodes {
						log.Printf("Nested Node: %s, URL: %s", htmlquery.InnerText(nestedNode), htmlquery.SelectAttr(nestedNode, "href"))

						/* Case where the second level does not exist */
						if len(category.SubCategories) < index {
							log.Printf("Skipping nested category for index %d, no subcategory found", index)
							/* Need to add nested category here */
							subCategory := PetVetCategory{
								Name:          strings.TrimSpace(htmlquery.InnerText(nestedNode)),
								URL:           getFullValidURL(htmlquery.SelectAttr(nestedNode, "href")),
								level:         category.level + 1,
								SubCategories: make([]PetVetCategory, 0),
							}
							category.SubCategories = append(category.SubCategories, subCategory)
							log.Printf("Added new subcategory: %v", subCategory)
						}

						/* Case where the second level exists */
						prevCategoryToUpdate := &category.SubCategories[index-1]

						name := strings.TrimSpace(htmlquery.InnerText(nestedNode))
						href := htmlquery.SelectAttr(nestedNode, "href")
						secondLevelCategory := PetVetCategory{
							Name:          name,
							URL:           getFullValidURL(href),
							level:         prevCategoryToUpdate.level + 1,
							SubCategories: make([]PetVetCategory, 0),
						}

						prevCategoryToUpdate.SubCategories = append(prevCategoryToUpdate.SubCategories, secondLevelCategory)

						log.Printf("Nested Category %v", prevCategoryToUpdate)
					}

				}
			}
		}
	}
	return nil
}

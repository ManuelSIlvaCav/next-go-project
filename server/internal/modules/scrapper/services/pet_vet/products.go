package services_pet_vet

import (
	"context"
	"log"
	"os"
	"strings"
	"time"

	"github.com/antchfx/htmlquery"
	"github.com/chromedp/cdproto/page"
	"github.com/chromedp/chromedp"
	"github.com/chromedp/chromedp/kb"
)

type PetVetProductListing struct {
	Name     string
	Brand    string
	Category string
	URL      string
	ImageURL string
	Price    string
	OldPrice string
	InStock  bool
}

func scrapeProducts(ctx context.Context, categories []PetVetCategory) error {
	for _, category := range categories {
		log.Printf("Iterating category: %s", category.Name)
		/* Start processing once we arrive at a leaf, we scrape it */
		if len(category.SubCategories) == 0 {
			// Leaf category, scrape products
			err := scrapeProductsForCategory(ctx, category)
			if err != nil {
				return err
			}
		} else {
			// Not a leaf category, recurse into subcategories
			err := scrapeProducts(ctx, category.SubCategories)
			if err != nil {
				return err
			}
		}
	}

	return nil
}

func scrapeProductsForCategory(ctx context.Context, category PetVetCategory) error {
	log.Printf("Scraping products for category: %s", category.Name)
	if strings.ToLower(category.Name) == "ver todo" || category.URL == "" {
		// Implement the scraping logic for the "Ver todo" category
		log.Printf("Skipping 'Ver todo' category or empty URL for category: %s", category.Name)
	}

	var productsHTML string
	var res []string
	//var htmlContent string

	var timestamp int

	err := chromedp.Run(ctx,
		// Set realistic browser headers and properties to avoid detection
		chromedp.ActionFunc(func(ctx context.Context) error {
			// Set user agent to latest Chrome
			return chromedp.Evaluate(`
				Object.defineProperty(navigator, 'userAgent', {
					get: () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
				});
				Object.defineProperty(navigator, 'webdriver', {
					get: () => undefined
				});
				Object.defineProperty(navigator, 'plugins', {
					get: () => [1, 2, 3, 4, 5]
				});
				Object.defineProperty(navigator, 'languages', {
					get: () => ['en-US', 'en']
				});
				// Remove headless indicators
				delete navigator.__proto__.webdriver;

				Object.defineProperty(screen, 'width', {get: () => 1920});
				Object.defineProperty(screen, 'height', {get: () => 1080});
				Object.defineProperty(screen, 'availWidth', {get: () => 1920});
				Object.defineProperty(screen, 'availHeight', {get: () => 1040});
				Object.defineProperty(screen, 'colorDepth', {get: () => 24});
				Object.defineProperty(screen, 'pixelDepth', {get: () => 24});
			`, nil).Do(ctx)
		}),
		chromedp.ActionFunc(func(ctx context.Context) error {
			_, err := page.AddScriptToEvaluateOnNewDocument(`
				__fired__ = null; 
				
				window.addEventListener('load', (e) => {
					__fired__ = Date.now();
					console.log('Page loaded at:', __fired__);
				});
			`).Do(ctx)
			return err
		}),

		chromedp.Navigate(category.URL),

		chromedp.ActionFunc(func(ctx context.Context) error {
			index := 0
			for {
				var readyState string
				if err := chromedp.Evaluate(`document.readyState`, &readyState).Do(ctx); err != nil {
					log.Printf("Error evaluating document.readyState: %v", err)
					return err
				}
				log.Printf("document.readyState: %s", readyState)
				if readyState == "complete" || index > 5 {
					break
				}
				time.Sleep(10 * time.Second)
				index++
			}
			return nil
		}),
		chromedp.Poll("__fired__", &timestamp, chromedp.WithPollingInterval(time.Second), chromedp.WithPollingTimeout(0)),
		/* chromedp.WaitReady("body", chromedp.ByQuery), */

		chromedp.WaitReady("//div[@id='shopify-block-AcFpIVmN0czFVWWZYT__10249797228608187657']/script",
			chromedp.BySearch),

		chromedp.Sleep(30*time.Second), // Wait for the page to load completely

		chromedp.Evaluate("Object.keys(window.frames)", &res),

		/*  */
		chromedp.ActionFunc(func(ctx context.Context) error {
			log.Printf("Frames keys in window: %v", res)
			index := 0
			for {
				var usfObject interface{}

				// Check for USF object and log available window properties
				if err := chromedp.Evaluate(`window.usf`, &usfObject).Do(ctx); err != nil {
					log.Printf("Error evaluating window.usf: %v", err)
				}

				log.Printf("USF Object: %v", usfObject)

				if usfObject != nil || index > 6 {
					break
				}

				time.Sleep(10 * time.Second)
				index++
			}
			return nil
		}),

		chromedp.Sleep(30*time.Second),

		chromedp.WaitReady("//*[@id='shopify-section-collection-template']",
			chromedp.BySearch),
		chromedp.WaitReady("//div[@id='usf_container']",
			chromedp.BySearch),
		chromedp.WaitVisible("//div[@id='usf_container']",
			chromedp.BySearch),

		chromedp.ActionFunc(func(ctx context.Context) error {
			/* Log all contents of window */
			var windowContent interface{}
			chromedp.Evaluate(`window.Shopify`, &windowContent).Do(ctx)
			log.Printf("Window content: %+v", windowContent)
			return nil
		}),

		chromedp.ActionFunc(func(ctx context.Context) error {
			// Capture browser console errors and take a screenshot
			var buf []byte

			log.Println("Taking full screenshot of the page")
			chromedp.FullScreenshot(&buf, 90).Do(ctx)
			err := os.WriteFile("test_screenshot.png", buf, 0777)
			if err != nil {
				log.Println("Error taking full screenshot of the page:", err)
			}

			return nil
		}),

		chromedp.WaitVisible("//div[contains(@class, 'product-list')]",
			chromedp.BySearch),
		chromedp.WaitReady("//div[contains(@class, 'product-list')]",
			chromedp.BySearch),

		chromedp.OuterHTML("//div[contains(@class, 'product-list')]",
			&productsHTML,
			chromedp.BySearch),
	)

	log.Print(timestamp)

	if err != nil {
		log.Printf("Error navigating to category URL %s: %v", category.URL, err)
		return err
	}

	//log.Println("Products HTML content scraped successfully", productsHTML)

	doc, err := htmlquery.Parse(strings.NewReader(productsHTML))
	if err != nil {
		log.Printf("Error parsing products HTML: %v", err)
		return err
	}

	// Process the products from the HTML document
	productsNodes := htmlquery.Find(doc, "//div[@product-selector]")

	if len(productsNodes) == 0 {
		log.Printf("No products found in category %s", category.Name)
		return nil
	}

	for _, productNode := range productsNodes {
		if productNode.Type != 3 { // Skip text nodes
			continue
		}

		productID := htmlquery.SelectAttr(productNode, "product-selector")
		log.Println("Found product with ID:", productID)

		productDetails := htmlquery.FindOne(productNode, ".//div[contains(@class, 'product-wrap')]")

		if productDetails != nil {
			/* div(product_image), a/div(product-details) */
			for node := range productDetails.ChildNodes() {
				if node.Type != 3 {
					continue
				}
				if node.Data == "div" {
					imageATag := htmlquery.FindOne(node, ".//a")
					if imageATag != nil {
						imgTag := htmlquery.FindOne(imageATag, ".//img")
						if imgTag != nil {
							imageURL := htmlquery.SelectAttr(imgTag, "src")
							log.Println("Found product image URL:", imageURL)
						} else {
							log.Println("No image found for product")
						}
					}

				}
				if node.Data == "a" {
					productURL := htmlquery.SelectAttr(node, "href")
					log.Println("Found product URL:", productURL)
					productDetails := node.FirstChild
					log.Println("Child node:", productDetails.Data, htmlquery.InnerText(productDetails))
					detailsNodes := productDetails.ChildNodes()

					for detailNode := range detailsNodes {
						if detailNode.Type != 3 {
							continue // Skip non-element nodes
						}
						if detailNode.Data == "span" && strings.Contains(htmlquery.SelectAttr(detailNode, "class"), "title") {
							productName := htmlquery.InnerText(detailNode)
							log.Println("Product Name:", productName)
						}
						if detailNode.Data == "span" && strings.Contains(htmlquery.SelectAttr(detailNode, "class"), "brand") {
							productCategoryName := htmlquery.InnerText(detailNode)
							log.Println("Product Brand:", productCategoryName)
						}

						log.Println("Detail Node:", detailNode.Data, htmlquery.InnerText(detailNode), htmlquery.SelectAttr(detailNode, "class"))

						if detailNode.Data == "span" && strings.Contains(htmlquery.SelectAttr(detailNode, "class"), "price sale") {
							/* We can have span. was price or the current price */
							previousAmountNode := htmlquery.FindOne(detailNode, ".//span[@class='was_price']//span[@class='money']")
							currentAmountNode := htmlquery.FindOne(detailNode, ".//span[@class='current_price']//span[@class='money']")
							var previousAmount, currentAmount string

							if currentAmountNode != nil {
								log.Println("Current Amount Node:", currentAmountNode.Type, htmlquery.InnerText(currentAmountNode))
								currentAmount = htmlquery.InnerText(currentAmountNode)
							} else {
								currentAmount = "0" // Default value if not found
							}

							if previousAmountNode != nil {
								log.Println("Previous Amount Node:", previousAmountNode.Type, htmlquery.InnerText(previousAmountNode))

								previousAmount := htmlquery.InnerText(previousAmountNode)
								log.Println("Previous Amount:", previousAmount)
							} else {
								previousAmount = "0" // Default value if not found
							}

							log.Printf("Product Price - Previous: %s, Current: %s", previousAmount, currentAmount)
						}
					}

				}
			}

		}
	}

	return nil
}

func scrollPage(ctx context.Context) error {
	var windowInnerHeight, windowPageYOffset, height float64
	for {
		// Get current scroll height
		if err := chromedp.Evaluate(`document.body.scrollHeight`, &height).Do(ctx); err != nil {
			return err
		}

		if err := chromedp.Evaluate(`window.innerHeight`, &windowInnerHeight).Do(ctx); err != nil {
			return err
		}
		if err := chromedp.Evaluate(`window.pageYOffset`, &windowPageYOffset).Do(ctx); err != nil {
			return err
		}

		log.Printf("Current height: %f, Inner height: %f, Page Y Offset: %f", height, windowInnerHeight, windowPageYOffset)
		// If height hasn't changed, break
		if height <= windowInnerHeight+windowPageYOffset {
			log.Println("Reached the bottom of the page, no more products to load.")
			time.Sleep(10 * time.Second)
			break
		}

		// Scroll to bottom
		if err := chromedp.KeyEvent(kb.End).Do(ctx); err != nil {
			return err
		}
		// Wait for new elements to load
		time.Sleep(10 * time.Second)
	}
	return nil
}

// createRealisticContext creates a Chrome context that better mimics a real browser
func createRealisticContext() (context.Context, context.CancelFunc) {
	opts := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.Flag("headless", true), // You can set this to false for debugging
		chromedp.Flag("disable-gpu", false),
		chromedp.Flag("disable-dev-shm-usage", true),
		chromedp.Flag("disable-background-timer-throttling", false),
		chromedp.Flag("disable-backgrounding-occluded-windows", false),
		chromedp.Flag("disable-renderer-backgrounding", false),
		chromedp.Flag("disable-features", "TranslateUI"),
		chromedp.Flag("disable-ipc-flooding-protection", true),
		chromedp.Flag("disable-blink-features", "AutomationControlled"),
		chromedp.Flag("exclude-switches", "enable-automation"),
		chromedp.Flag("disable-extensions", false),
		chromedp.UserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"),
		chromedp.WindowSize(1920, 1080),
	)

	allocCtx, cancel := chromedp.NewExecAllocator(context.Background(), opts...)
	ctx, _ := chromedp.NewContext(allocCtx, chromedp.WithLogf(log.Printf))

	return ctx, cancel
}

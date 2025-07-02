package services_pet_vet

import (
	"context"
	"log"
	"strings"
	"time"

	"github.com/chromedp/cdproto/cdp"
	"github.com/chromedp/cdproto/emulation"
	"github.com/chromedp/cdproto/page"
	"github.com/chromedp/chromedp"
)

func TraverseCategories(categories []PetVetCategory) {
	for _, category := range categories {
		log.Printf("Level %d - Category: %s, URL: %s", category.level, category.Name, category.URL)
		if len(category.SubCategories) > 0 {
			TraverseCategories(category.SubCategories)
		}
	}
}

/* Sometimes we have complete urls, sometimes missing the domain, for each case return a valid url */
func getFullValidURL(url string) string {
	if !strings.Contains(url, "petvet.cl") {
		return "https://www.petvet.cl" + url
	}
	return url
}

func enableLifeCycleEvents() chromedp.ActionFunc {
	return func(ctx context.Context) error {
		err := page.Enable().Do(ctx)
		if err != nil {
			return err
		}
		err = page.SetLifecycleEventsEnabled(true).Do(ctx)
		if err != nil {
			return err
		}
		return nil
	}
}

func navigateAndWaitFor(url string, eventName string) chromedp.ActionFunc {
	return func(ctx context.Context) error {
		_, _, _, err := page.Navigate(url).Do(ctx)
		if err != nil {
			return err
		}

		return waitFor(ctx, eventName)
	}
}

func waitForAction(ctx context.Context, eventName string) chromedp.ActionFunc {
	return func(ctx context.Context) error {
		return waitFor(ctx, eventName)
	}
}

func waitFor(ctx context.Context, eventName string) error {
	ch := make(chan struct{})
	cctx, cancel := context.WithCancel(ctx)
	chromedp.ListenTarget(cctx, func(ev interface{}) {
		switch e := ev.(type) {
		case *page.EventLifecycleEvent:
			if e.Name == eventName {
				cancel()
				close(ch)
			}
		}
	})
	select {
	case <-ch:
		return nil
	case <-ctx.Done():
		return ctx.Err()
	}

}

/* Need to handle existence of dialog and close it */
/* var isDialogOpen bool
err := chromedp.Run(ctx,
	chromedp.Evaluate(`document.querySelector('.dialog-selector') !== null`, &isDialogOpen),
)
if err != nil {
	return err
}
if isDialogOpen {
	log.Println("Dialog is open, closing it.")
	err := chromedp.Run(ctx,
		chromedp.Click(".dialog-close-button", chromedp.ByQuery),
	)
	if err != nil {
		return err
	}
} */

// waitForShopifyAndUSFScripts waits for Shopify and USF JavaScript to be loaded
func waitForShopifyAndUSFScripts() chromedp.ActionFunc {
	return func(ctx context.Context) error {
		// Wait for USF object or script
		repetitions := 0
		for {
			err := chromedp.Poll(`
			window.Shopify &&
			window.usf && 
			document.querySelector('script[src*="usf"]') 
		`, nil).Do(ctx)
			if err != nil {
				repetitions++
				if repetitions > 10 {
					log.Printf("USF scripts not detected after multiple attempts: %v", err)
					return nil
				}
				log.Printf("Waiting for USF scripts... Attempt %d: %v", repetitions, err)
				time.Sleep(1 * time.Second)
				continue
			}
			log.Println("USF scripts detected!")
			return nil

		}
	}
}

// waitForUSFContent waits for USF container to be populated with actual content
func waitForUSFContent() chromedp.Action {
	return chromedp.ActionFunc(func(ctx context.Context) error {
		// Wait for USF container to have content
		timeout := 30 * time.Second
		start := time.Now()

		for time.Since(start) < timeout {
			var hasContent bool

			// Check if USF container has meaningful content
			err := chromedp.Evaluate(`
				function checkUSFContent() {
					const containers = [
						document.querySelector('#usf_container'),
						document.querySelector('.usf-sr-container'),
						document.querySelector('[class*="usf-sr"]'),
						document.querySelector('.usf-skeleton-container')
					];
					
					for (let container of containers) {
						if (container) {
							// Check if container has child elements (not just loading)
							const children = container.querySelectorAll('*');
							const hasProducts = container.querySelectorAll('[product-selector], .product, .product-item').length > 0;
							const isLoading = container.querySelector('.loading, .skeleton, .spinner') !== null;
							const hasTextContent = container.textContent.trim().length > 100;
							
							if (hasProducts || (children.length > 5 && !isLoading && hasTextContent)) {
								return true;
							}
						}
					}
					return false;
				}
				
				return checkUSFContent();
			`, &hasContent).Do(ctx)

			if err == nil && hasContent {
				log.Println("USF content detected!")
				return nil
			}

			time.Sleep(1 * time.Second)
		}

		log.Println("Warning: USF content may not be fully loaded")
		return nil
	})
}

// waitForProductsToLoad waits for actual products to appear in the product list
func waitForProductsToLoad() chromedp.ActionFunc {
	return func(ctx context.Context) error {
		// If no products found with selectors, check for any product-like content
		var hasProductContent bool
		chromedp.Evaluate(`
			const productLists = document.querySelectorAll('.product-list, .usf-sr-product');
			productLists && productLists.length > 0;
		`, &hasProductContent).Do(ctx)

		if hasProductContent {
			log.Println("Product content detected (using fallback detection)")
		} else {
			log.Println("Warning: No products detected")
		}

		chromedp.Evaluate(`
		window.usf.utils.loadJsFile()
		`, nil).Do(ctx)

		return nil
	}
}

// debugUSFState logs the current state of USF containers for debugging
func debugUSFState() chromedp.Action {
	return chromedp.ActionFunc(func(ctx context.Context) error {
		var result string

		script := `
		function debugUSF() {
			const results = [];
			
			// Check for USF containers
			const containers = [
				'#usf_container',
				'.usf-sr-container', 
				'.usf-skeleton-container',
				'[class*="usf-"]'
			];
			
			containers.forEach(selector => {
				const elements = document.querySelectorAll(selector);
				elements.forEach((el, index) => {
					results.push({
						selector: selector + ' [' + index + ']',
						exists: true,
						visible: el.offsetParent !== null,
						childCount: el.children.length,
						textLength: el.textContent.trim().length,
						classes: el.className,
						innerHTML: el.innerHTML.substring(0, 200) + (el.innerHTML.length > 200 ? '...' : '')
					});
				});
			});
			
			// Check for products
			const productSelectors = ['[product-selector]', '.product', '.product-item', '[data-product-id]'];
			let productCount = 0;
			productSelectors.forEach(selector => {
				productCount += document.querySelectorAll(selector).length;
			});
			
			results.push({
				type: 'PRODUCT_COUNT',
				count: productCount
			});
			
			// Check for scripts
			const scripts = document.querySelectorAll('script[src*="usf"], script[src*="search"], script[src*="filter"]');
			results.push({
				type: 'USF_SCRIPTS',
				count: scripts.length,
				scripts: Array.from(scripts).map(s => s.src).slice(0, 5)
			});
			
			return JSON.stringify(results, null, 2);
		}
		
		return debugUSF();
		`

		err := chromedp.Evaluate(script, &result).Do(ctx)
		if err != nil {
			log.Printf("Debug script failed: %v", err)
			return nil
		}

		log.Printf("USF Debug State:\n%s", result)
		return nil
	})
}

func UserAgentOverride(userAgent string) chromedp.ActionFunc {
	return func(ctx context.Context) error {
		return cdp.Execute(ctx, "Network.setUserAgentOverride",
			emulation.SetUserAgentOverride(userAgent), nil)
	}
}

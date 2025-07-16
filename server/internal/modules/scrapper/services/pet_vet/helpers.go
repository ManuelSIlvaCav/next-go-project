package services_pet_vet

import (
	"context"
	"log"
	"strings"

	"github.com/chromedp/cdproto/cdp"
	"github.com/chromedp/cdproto/emulation"
	"github.com/chromedp/cdproto/page"
	cdruntime "github.com/chromedp/cdproto/runtime"
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

func UserAgentOverride(userAgent string) chromedp.ActionFunc {
	return func(ctx context.Context) error {
		return cdp.Execute(ctx, "Network.setUserAgentOverride",
			emulation.SetUserAgentOverride(userAgent), nil)
	}
}

func ExposeFunc(name string, f func(string)) chromedp.Action {
	return chromedp.Tasks{
		chromedp.ActionFunc(func(ctx context.Context) error {
			chromedp.ListenTarget(ctx, func(ev interface{}) {
				if ev, ok := ev.(*cdruntime.EventBindingCalled); ok && ev.Name == name {
					f(ev.Payload)
				}
			})
			return nil
		}),
		cdruntime.AddBinding(name),
	}
}

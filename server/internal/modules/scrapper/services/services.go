package scrapper_services

type ScrapperService interface {
	Scrape() error
}

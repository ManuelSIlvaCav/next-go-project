package projects

import "time"

/* Create Params */
type CreateProjectParams struct {
	BusinessID  string `json:"business_id"`
	Name        string `json:"name"`
	Description string `json:"description,omitempty"`
	Code        string `json:"code,omitempty"`
	/* Regarding location */
	CountryCode string `json:"country_code,omitempty"`
	City        string `json:"city,omitempty"`
	Street      string `json:"street,omitempty"`

	/* Regarding the project */
	Tipologies []CreateTipologyParams `json:"tipologies,omitempty"`
}

type CreateTipologyParams struct {
	TotalArea float64 `json:"total_area"`
	NetArea   float64 `json:"net_area"`
	Bathrooms int64   `json:"bathrooms"`
	Bedrooms  int64   `json:"bedrooms"`
	ListPrice float64 `json:"list_price"`
	Count     int64   `json:"count"`
}

/* DTO */

type Project struct {
	ID          int64  `json:"id" db:"id"`
	BusinessID  string `json:"business_id" db:"business_id"`
	Name        string `json:"name" db:"name"`
	Description string `json:"description,omitempty" db:"description"`
	Code        string `json:"code,omitempty" db:"code"`
	/* Regarding location */
	CountryCode string `json:"country_code,omitempty" db:"country_code"`
	City        string `json:"city,omitempty" db:"city"`
	Street      string `json:"street,omitempty" db:"street"`

	/* Regarding the project */
	TipologyCount int64      `json:"tipology_count" db:"tipology_count"`
	Tipologies    []Tipology `json:"tipologies,omitempty"`

	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

type Tipology struct {
	ProjectID int64   `json:"project_id" db:"project_id"`
	TotalArea float64 `json:"total_area" db:"total_area"`
	NetArea   float64 `json:"net_area" db:"net_area"`
	Bathrooms int64   `json:"bathrooms" db:"bathrooms"`
	Bedrooms  int64   `json:"bedrooms" db:"bedrooms"`
	Count     int64   `json:"count" db:"count"`
	ListPrice float64 `json:"list_price" db:"list_price"`
}

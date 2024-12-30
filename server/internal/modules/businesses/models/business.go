package businesses

type Business struct {
	ID           string       `json:"id" db:"id"`
	Name         string       `json:"name" db:"name"`
	Email        string       `json:"email" db:"email"`
	Phone        string       `json:"phone" db:"phone"`
	Address      string       `json:"address" db:"address"`
	BusinessData BusinessData `json:"business_data" db:"business_data"`
}

type BusinessData struct {
	ID          string `json:"id" db:"id"`
	BusinessID  string `json:"business_id" db:"business_id"`
	Website     string `json:"website" db:"website"`
	Description string `json:"description" db:"description"`
}

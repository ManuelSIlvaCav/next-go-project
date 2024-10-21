package clients

type Contact struct {
	ClientID int64  `json:"client_id" db:"client_id"`
	Phone    string `json:"phone,omitempty" db:"phone"`
	Email    string `json:"email,omitempty" db:"email"`
}

type Identification struct {
	ClientID             int    `json:"client_id"`
	IdentificationType   string `json:"identification_type"`
	IdentificationNumber string `json:"identification_number"`
}

type Client struct {
	ID             int64          `json:"id" db:"id"`
	FirstName      string         `json:"first_name" db:"first_name"`
	MiddleName     string         `json:"middle_name,omitempty" db:"middle_name"`
	LastName       string         `json:"last_name" db:"last_name"`
	Email          string         `json:"email" db:"email"`
	Contact        Contact        `json:"contact"`
	Identification Identification `json:"identification,omitempty"`
}

package auth_models

type (
	AuthData struct {
		Name   string   `json:"name"`
		Admin  bool     `json:"admin"`
		Access []string `json:"access"`
		UserID string   `json:"user_id"`
	}
)

type User struct {
	ID        string `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

type UserEmailLogin struct {
	ID                  string `json:"id" db:"id"`
	Email               string `json:"email" db:"email"`
	AuthenticationToken string `json:"authentication_token" db:"authentication_token"`
	BusinessID          int    `json:"business_id" db:"business_id"`
	CreatedAt           string `json:"created_at" db:"created_at"`
	ExpiresAt           string `json:"expires_at" db:"expires_at"`
}

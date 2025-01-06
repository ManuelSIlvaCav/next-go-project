package auth_models

import "time"

type (
	JWTData struct {
		Name           string `json:"name"`
		BusinessUserID string `json:"business_user_id"`
		AdminUserID    string `json:"admin_user_id"`
	}
)

type Admin struct {
	ID          string    `json:"id"`
	Email       string    `json:"email"`
	CreatedAt   time.Time `json:"created_at"`
	LastLoginAt time.Time `json:"last_login_at"`
	IsActive    bool      `json:"is_active"`
}

type UserEmailLogin struct {
	ID                  string `json:"id" db:"id"`
	Email               string `json:"email" db:"email"`
	AuthenticationToken string `json:"authentication_token" db:"authentication_token"`
	CreatedAt           string `json:"created_at" db:"created_at"`
	ExpiresAt           string `json:"expires_at" db:"expires_at"`
}

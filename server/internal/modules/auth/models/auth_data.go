package auth_models

import "time"

type (
	JWTData struct {
		ClientID       string `json:"client_id"`
		SellerID       string `json:"seller_id"`
		BusinessID     int64  `json:"business_id"`
		BusinessUserID int64  `json:"business_user_id"`
		AdminID        string `json:"admin_id"`
	}
)

type Admin struct {
	ID          string     `json:"id"`
	Email       string     `json:"email"`
	CreatedAt   *time.Time `json:"created_at"`
	LastLoginAt *time.Time `json:"last_login_at"`
	IsActive    bool       `json:"is_active"`
}

type AdminLoginParams struct {
	Email    string `json:"email" validate:"required,email" errormgs:"email is required and must be a valid email address"`
	Password string `json:"password" validate:"required" errormgs:"password is required"`
}

type AdminLoginResponse struct {
	AccessToken string `json:"access_token"`
	ExpiresAt   string `json:"expires_at"`
	Admin       Admin  `json:"admin"`
}

type UserEmailLogin struct {
	ID                  string `json:"id" db:"id"`
	Email               string `json:"email" db:"email"`
	AuthenticationToken string `json:"authentication_token" db:"authentication_token"`
	CreatedAt           string `json:"created_at" db:"created_at"`
	ExpiresAt           string `json:"expires_at" db:"expires_at"`
}

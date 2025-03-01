package businesses_models

type CreateBusinessUserParams struct {
	BusinessID string `json:"business_id" param:"id"`
	FirstName  string `json:"first_name"`
	LastName   string `json:"last_name"`
	Email      string `json:"email"`
	Phone      string `json:"phone"`
}

type UpdateBusinessSettingsParams struct {
	BusinessID string `json:"business_id" param:"id"`
	Subdomain  string `json:"subdomain"`
}

type GetBusinessUserParams struct {
	ID    string `json:"id"`
	Email string `json:"email"`
}

type GetBusinessUsersParams struct {
	Limit      int    `json:"limit" query:"limit"`
	Cursor     int    `json:"cursor" query:"cursor"`
	BusinessID string `json:"business_id" param:"id"`
}

type BusinessUser struct {
	ID         string `json:"id" db:"id"`
	BusinessID string `json:"business_id" db:"business_id"`
	FirstName  string `json:"first_name" db:"first_name"`
	LastName   string `json:"last_name" db:"last_name"`
	Email      string `json:"email" db:"email"`
	Phone      string `json:"phone" db:"phone"`
}

type Role struct {
	ID          string `json:"id" db:"id"`
	Name        string `json:"name" db:"name"`
	Description string `json:"description" db:"description"`
}

/* Securable represents the resource to be secured Ex. projects.write */
type Securable struct {
	ID          string `json:"id" db:"id"`
	Name        string `json:"name" db:"name"`
	Description string `json:"description" db:"description"`
}

type RoleSecurable struct {
	RoleID      string `json:"role_id" db:"role_id"`
	SecurableID string `json:"securable_id" db:"securable_id"`
}

type BusinessUserRole struct {
	BusinessUserID string `json:"business_user_id" db:"business_user_id"`
	RoleID         string `json:"role_id" db:"role_id"`
}

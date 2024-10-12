package users

type Contact struct {
	UserID int    `json:"user_id"`
	Phone  string `json:"phone"`
	Email  string `json:"email"`
}

type User struct {
	ID      string  `json:"id"`
	Email   string  `json:"email"`
	Contact Contact `json:"contact"`
}

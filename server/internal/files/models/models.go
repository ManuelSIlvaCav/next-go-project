package files

import "time"

type CustomFile struct {
	ID        string    `json:"id" db:"id"`
	Name      string    `json:"name" db:"name"`
	Size      int64     `json:"size" db:"size"`
	URL       string    `json:"url" db:"url"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

package files_handlers

import (
	"server/internal/container"
	files "server/internal/files/models"
	"time"

	"github.com/labstack/echo/v4"
)

func UploadFile(container *container.Container) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		logger.Info(
			"Upload file handler", "path", c.Path(), "method",
			c.Request().Method)

		file := files.CustomFile{
			ID:        "123",
			Name:      "file.txt",
			Size:      123,
			URL:       "https://example.com/file.txt",
			CreatedAt: time.Now().UTC(),
		}

		if err := c.Bind(&file); err != nil {
			logger.Error("Failed to bind file", "error", err)
			return c.String(400, "Failed to bind file")
		}

		if _, err := container.DB().NamedExecContext(
			c.Request().Context(),
			"INSERT INTO files (id, name, size, url, created_at) VALUES (:id, :name, :size, :url, :created_at)",
			file,
		); err != nil {
			logger.Error("Failed to insert file", "error", err)
		}

		logger.Info("File uploaded", "file", file)

		return c.String(200, "Hello, World!")
	}
}

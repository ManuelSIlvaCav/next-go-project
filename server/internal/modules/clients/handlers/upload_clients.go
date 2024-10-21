package clients

import (
	"fmt"
	"net/http"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/jobs/tasks"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/files"
	"github.com/labstack/echo/v4"
)

func UploadClients(container *container.Container,
	filesModule *files.FilesModule) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		logger.Info(
			"Upload clients handler", "path", c.Path(), "method",
			c.Request().Method)

		file, err := c.FormFile("file")
		if err != nil {
			return c.JSON(http.StatusInternalServerError, &echo.Map{
				"error": err.Error(),
			})
		}
		src, err := file.Open()
		if err != nil {
			return err
		}
		defer src.Close()

		//Upload the file to s3
		_, err = filesModule.FileService.UploadFile(file.Filename, src)

		if err != nil {
			return c.JSON(http.StatusInternalServerError, &echo.Map{
				"error": err.Error(),
			})
		}

		jobClient := container.JobClient()

		//generate the task to process the upload
		task, err := tasks.NewUploadClientsTask(file.Filename)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, &echo.Map{
				"error": err.Error(),
			})
		}
		info, err := jobClient.Enqueue(task)

		if err != nil {
			return c.JSON(http.StatusInternalServerError, &echo.Map{
				"error": err.Error(),
			})

		}

		logger.Info("Task enqueued", "taskId", info.ID, "queue", info.Queue)

		return c.JSON(http.StatusOK, &echo.Map{
			"message": fmt.Sprintf("File %s uploaded successfully", file.Filename),
		})

	}
}

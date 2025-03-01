package businesses_handlers

import (
	"net/http"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/jobs/tasks"
	businesses_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/businesses/models"
	businesses "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/businesses/repositories"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/labstack/echo/v4"
)

func CreateBusinessUserHandler(container *container.Container, businessRepository *businesses.BusinessRepository) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		params := businesses_models.CreateBusinessUserParams{}

		if err := c.Bind(&params); err != nil {
			logger.Error("Failed to bind create business user", "error", err)
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Bad Request - Invalid parameters"})
		}

		businessUsers, err := businessRepository.CreateBusinessUser(c.Request().Context(), &params)

		if err != nil {
			logger.Error("Failed to create business user", "error", err)
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Internal Server Error"})
		}

		jobClient := container.JobClient()

		/* Emit event */
		task, err := tasks.NewEventsTask(
			"user_created",
			businessUsers,
		)

		if err != nil {
			logger.Error("could not create task", "error", err)
		}

		info, err := jobClient.Enqueue(task)

		if err != nil {
			logger.Error("could not enqueue task", "error", err)
		}

		logger.Info("Task enqueued", "taskId", info.ID, "queue", info.Queue)

		return c.JSON(http.StatusCreated, echo.Map{"message": "Business users created", "data": businessUsers})

	}
}

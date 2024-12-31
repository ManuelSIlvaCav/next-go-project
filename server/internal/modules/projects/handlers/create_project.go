package projects

import (
	"net/http"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	projects_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/projects/models"
	projects "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/projects/repositories"
	"github.com/labstack/echo/v4"
)

func CreateProject(
	container *container.Container,
	projectRepository *projects.ProjectsRepository,
) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		params := projects_models.CreateProjectParams{}

		if err := c.Bind(&params); err != nil {
			logger.Error("Failed to bind create project params", "error", err)
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Bad Request - Invalid parameters"})
		}

		logger.Info(
			"Create project handler", "path", c.Path(), "method",
			c.Request().Method,
			"params", params,
		)

		newProject, err := projectRepository.CreateProject(c.Request().Context(), &params)

		if err != nil {
			logger.Error("Failed to create project", "error", err)
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Internal Server Error"})
		}

		return c.JSON(http.StatusCreated, echo.Map{"message": "Project created", "project": newProject})
	}
}

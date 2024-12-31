package projects

import (
	"net/http"
	"strconv"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"

	projects "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/projects/repositories"
	"github.com/labstack/echo/v4"
)

type GetProjectsParams struct {
	Limit  string `json:"limit" query:"limit"`
	Cursor string `json:"cursor" query:"cursor"`
}

func GetProjects(
	container *container.Container,
	projectRepository *projects.ProjectsRepository,
) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		params := GetProjectsParams{}

		if err := c.Bind(&params); err != nil {
			logger.Error("Failed to bind projects params", "error", err)
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Bad Request - Limit or Cursor not provided"})
		}

		logger.Info(
			"Get projects handler", "path", c.Path(), "method",
			c.Request().Method, "limit", params.Limit, "cursor", params.Cursor)

		limit, _ := strconv.Atoi(params.Limit)
		cursor, _ := strconv.Atoi(params.Cursor)

		emailTemplates, err := projectRepository.GetProjects(c.Request().Context(), limit, cursor)

		if err != nil {
			logger.Error("Failed to get projects", "error", err)
			return c.JSON(500, echo.Map{"error": "Failed to get projects"})
		}

		return c.JSON(200, echo.Map{"projects": emailTemplates})
	}
}

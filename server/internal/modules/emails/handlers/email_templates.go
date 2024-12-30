package emails

import (
	"net/http"
	"strconv"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	emails "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/emails/repositories"
	"github.com/labstack/echo/v4"
)

type GetEmailsParams struct {
	Limit  string `json:"limit" query:"limit"`
	Cursor string `json:"cursor" query:"cursor"`
}

func GetEmailTemplates(container *container.Container,
	emailRepository *emails.EmailTemplateRepository,
) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		params := GetEmailsParams{}

		if err := c.Bind(&params); err != nil {
			logger.Error("Failed to bind email template params", "error", err)
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Failed to bind email template params"})
		}

		logger.Info(
			"Get email templates handler", "path", c.Path(), "method",
			c.Request().Method, "limit", params.Limit, "cursor", params.Cursor)

		limit, _ := strconv.Atoi(params.Limit)
		cursor, _ := strconv.Atoi(params.Cursor)

		emailTemplates, err := emailRepository.GetEmailTemplates(c.Request().Context(), limit, cursor)

		if err != nil {
			logger.Error("Failed to get email templates", "error", err)
			return c.JSON(500, echo.Map{"error": "Failed to get email templates"})
		}

		return c.JSON(200, echo.Map{"emailTemplates": emailTemplates})
	}
}

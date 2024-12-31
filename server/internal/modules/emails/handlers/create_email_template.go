package emails

import (
	"net/http"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	emails_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/emails/models"
	emails "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/emails/repositories"

	"github.com/labstack/echo/v4"
)

func CreateEmailTemplate(container *container.Container,
	emailRepository *emails.EmailTemplateRepository,
) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()
		logger.Info(
			"Creating email templates handler", "path", c.Path(), "method",
			c.Request().Method)

		params := emails_models.CreateEmailTemplateParams{}

		if err := c.Bind(&params); err != nil {
			logger.Error("Failed to bind email template params", "error", err)
			return c.JSON(http.StatusBadRequest, &echo.Map{"error": "Failed to bind email template params"})
		}

		doc, err := emailRepository.CreateEmailTemplate(c.Request().Context(), params)

		if err != nil {
			logger.Error("Failed to get email templates", "error", err)
			return c.JSON(500, &echo.Map{"error": "Failed to get email templates"})

		}

		logger.Info("Email template created", "email_template", doc)
		return c.JSON(http.StatusCreated, echo.Map{"email_template": doc})
	}
}

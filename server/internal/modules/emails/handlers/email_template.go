package emails

import (
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	emails "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/emails/repositories"
	"github.com/labstack/echo/v4"
)

func GetEmailTemplate(container *container.Container,
	emailRepository *emails.EmailTemplateRepository,
) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		emailTemplateID := c.Param("email_template_id")

		logger.Info("Get email template handler", "path", c.Path(), "method", c.Request().Method, "email_template_id", emailTemplateID)

		return c.JSON(200, echo.Map{"emailTemplates": nil})
	}
}

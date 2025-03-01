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

		emailTemplateID := c.Param("email_template_id")

		emailTemplate, err := emailRepository.GetEmailTemplateByID(emailTemplateID)

		if err != nil {
			return c.JSON(500, echo.Map{"error": "Failed to get email template"})
		}

		return c.JSON(200, echo.Map{"emailTemplate": emailTemplate})
	}
}

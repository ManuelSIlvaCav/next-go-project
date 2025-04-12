package auth_handlers

import (
	"context"
	"net/http"

	internal_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/models"
	auth_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/models"
	auth_repository "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/repository"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	emails_tasks "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/emails/tasks"
	"github.com/labstack/echo/v4"
)

type (
	UserLogin struct {
		Email    string `json:"email" validate:"required,email" errormgs:"email is required and must be a valid email address"`
		Type     string `json:"type" validate:"required,oneof=email-only password" errormgs:"type is required"`
		UserType string `json:"user_type" validate:"required,oneof=user admin" errormgs:"user_type is required"`
	}
)

func Login(container *container.Container, authRepository auth_repository.AuthRepositoryInterface) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()
		ctx := c.Request().Context()

		var user UserLogin

		if err := c.Bind(&user); err != nil {
			return c.JSON(http.StatusBadRequest, &echo.Map{"message": err.Error()})
		}

		/* validator := container.GetCustomValidator()

		if validationErrs := validator.ValidateStruct(user); len(validationErrs) > 0 {

			return c.JSON(http.StatusBadRequest, &echo.Map{"errors": validationErrs})
		} */

		logger.Info("Logging user", "user", user)

		if user.Type == "email-only" {
			/* Validate that the user exists */
			admin, err := LoginAdmin(ctx, authRepository, user)
			if err != nil || admin == nil {
				message := "could not login user"
				if err != nil {
					message = err.Message
				}
				return c.JSON(http.StatusBadRequest, echo.Map{
					"code":  err.Code,
					"error": message,
				})
			}

			/* Send email via an async tasK */
			task, emailSendError := emails_tasks.NewSendEmailTask(user.Email)
			if emailSendError != nil {
				return c.JSON(http.StatusInternalServerError, echo.Map{
					"error": "could not create email task",
				})
			}
			container.EnqueueTask(task)

			return c.JSON(http.StatusCreated, echo.Map{
				"message": "email sent",
				"email":   user.Email,
			})
		}

		return c.JSON(http.StatusBadRequest, echo.Map{
			"message": "could not login user",
		})
	}
}

func LoginAdmin(ctx context.Context, authRepository auth_repository.AuthRepositoryInterface, params UserLogin) (*auth_models.Admin, *internal_models.HandlerError) {
	user, err := authRepository.GetAdminUser(ctx, params.Email)
	if err != nil {
		// Handle error
		return nil, err
	}
	if user == nil {
		// Handle user not found
		return nil, nil
	}
	// Handle successful login
	return user, nil
}

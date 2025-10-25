package auth_handlers

import (
	"context"
	"net/http"

	internal_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/models"
	auth_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/models"
	auth_repository "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/repository"
	auth_services "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/services"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/labstack/echo/v4"
)

type (
	UserLogin struct {
		Email    string `json:"email" validate:"required,email" errormgs:"email is required and must be a valid email address"`
		Password string `json:"password,omitempty"` //Optional if exists
	}
)

func Login(container *container.Container, authService *auth_services.AuthService) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()
		//ctx := c.Request().Context()

		var user UserLogin

		if err := c.Bind(&user); err != nil {
			return c.JSON(http.StatusBadRequest, &echo.Map{"message": err.Error()})
		}

		logger.Info("Login user", "user", user)

		if user.Password == "" {
			return c.JSON(http.StatusBadRequest, echo.Map{
				"message": "password is required",
			})
		}

		return c.JSON(http.StatusBadRequest, echo.Map{
			"message": "could not login user",
		})
	}
}

func LoginAdmin(ctx context.Context,
	authRepository auth_repository.AuthRepositoryInterface,
	params UserLogin) (*auth_models.Admin, *internal_models.HandlerError) {
	user, err := authRepository.GetAdminUser(ctx, params.Email)
	if err != nil {
		// Handle error
		return nil, err
	}
	if user == nil {
		return nil, nil
	}

	return user, nil
}

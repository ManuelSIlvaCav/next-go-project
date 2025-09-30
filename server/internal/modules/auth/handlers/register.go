package auth_handlers

import (
	"net/http"

	auth_jwt "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/jwt"
	auth_services "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/services"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/labstack/echo/v4"
)

func Register(
	container *container.Container,
	authService *auth_services.AuthService) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		ctx := c.Request().Context()

		var registerData auth_services.RegisterUserParams

		if err := c.Bind(&registerData); err != nil {
			return c.JSON(http.StatusBadRequest, &echo.Map{"message": err.Error()})
		}

		logger.Info("Registering user", "email", registerData.Email, "business_id", registerData.BusinessID)

		// Create business user
		_, err := authService.RegisterUser(ctx, registerData)

		if err != nil {
			message := "could not register user"

			if err.Message != "" {
				message = err.Message
			}

			return c.JSON(http.StatusBadRequest, echo.Map{
				"code":  err.Code,
				"error": message,
			})
		}

		// Create JWT token
		jwtParams := auth_jwt.CreateJwtTokenParams{}

		data, jwtErr := auth_jwt.CreateJwtToken(jwtParams)
		if jwtErr != nil {
			logger.Error("Error creating JWT token", "error", jwtErr)
			return c.JSON(http.StatusInternalServerError, echo.Map{
				"error": "could not create access token",
			})
		}

		return c.JSON(http.StatusCreated, echo.Map{
			"access_token": data.AccessToken,
			"expires_at":   data.ExpiresAt,
		})
	}
}

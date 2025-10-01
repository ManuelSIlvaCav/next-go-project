package auth_handlers

import (
	"net/http"

	auth_jwt "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/jwt"
	auth_services "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/services"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/labstack/echo/v4"
)

func LoginClient(
	container *container.Container,
	authService *auth_services.AuthService,
) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		ctx := c.Request().Context()

		var loginData auth_services.LoginClientParams

		if err := c.Bind(&loginData); err != nil {
			logger.Error("Failed to bind login client params", "error", err)
			return c.JSON(http.StatusBadRequest, &echo.Map{"error": "Bad Request - Invalid parameters"})
		}

		logger.Info("Logging in client", "data", loginData)

		if err := loginData.Validate(); err != nil {
			logger.Error("Validation failed for login client params", "error", err)
			return c.JSON(http.StatusBadRequest, echo.Map{"errors": err})
		}

		// Login client
		client, err := authService.LoginClient(ctx, loginData)

		if err != nil {
			message := "could not login client"
			if err.Message != "" {
				message = err.Message
			}

			return c.JSON(http.StatusBadRequest, echo.Map{
				"code":  err.Code,
				"error": message,
			})
		}

		// Create JWT token response for the client
		response, jwtErr := auth_jwt.CreateClientJWTResponse(
			client.ID,
			client.BusinessID,
			client.Email,
			client.FirstName,
			client.LastName,
		)
		if jwtErr != nil {
			logger.Error("Error creating JWT token", "error", jwtErr)
			return c.JSON(http.StatusInternalServerError, echo.Map{
				"error": "could not create access token",
			})
		}

		return c.JSON(http.StatusOK, response)
	}
}

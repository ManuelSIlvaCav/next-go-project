package auth_handlers

import (
	"net/http"

	auth_jwt "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/jwt"
	auth_services "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/services"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/labstack/echo/v4"
)

func RegisterClient(
	container *container.Container,
	authService *auth_services.AuthService,
) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		ctx := c.Request().Context()

		var registerData auth_services.RegisterClientParams

		if err := c.Bind(&registerData); err != nil {
			logger.Error("Failed to bind register client params", "error", err)
			return c.JSON(http.StatusBadRequest, &echo.Map{"error": "Bad Request - Invalid parameters"})
		}

		logger.Info("Registering client", "data", registerData)

		if err := registerData.Validate(); err != nil {
			logger.Error("Validation failed for register client params", "error", err)
			return c.JSON(http.StatusBadRequest, echo.Map{"errors": err})
		}

		// Create client
		client, err := authService.RegisterClient(ctx, registerData)

		if err != nil {
			message := "could not register client"
			if err.Message != "" {
				message = err.Message
			}

			return c.JSON(http.StatusBadRequest, echo.Map{
				"code":  err.Code,
				"error": message,
			})
		}

		// Create JWT token for the client
		jwtParams := auth_jwt.CreateJwtTokenParams{
			ClientID:   client.ID,
			BusinessID: client.BusinessID,
		}

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
			"client": echo.Map{
				"id":          client.ID,
				"email":       client.Email,
				"first_name":  client.FirstName,
				"last_name":   client.LastName,
				"business_id": client.BusinessID,
			},
		})
	}
}

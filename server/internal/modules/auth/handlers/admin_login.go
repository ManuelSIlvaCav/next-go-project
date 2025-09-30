package auth_handlers

import (
	"net/http"

	auth_jwt "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/jwt"
	auth_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/models"
	auth_repository "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/repository"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/labstack/echo/v4"
)

func AdminLogin(container *container.Container, authRepository auth_repository.AuthRepositoryInterface) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()
		ctx := c.Request().Context()

		var params auth_models.AdminLoginParams

		if err := c.Bind(&params); err != nil {
			logger.Error("Error binding admin login params", "error", err)
			return c.JSON(http.StatusBadRequest, &echo.Map{
				"message": "Invalid request format",
			})
		}

		// Validate required fields
		if params.Email == "" {
			return c.JSON(http.StatusBadRequest, &echo.Map{
				"message": "Email is required",
			})
		}

		if params.Password == "" {
			return c.JSON(http.StatusBadRequest, &echo.Map{
				"message": "Password is required",
			})
		}

		logger.Info("Admin login attempt", "email", params.Email)

		// Authenticate admin
		admin, err := authRepository.AdminLoginByPassword(ctx, params)
		if err != nil {
			logger.Error("Admin login failed", "error", err, "email", params.Email)
			return c.JSON(http.StatusUnauthorized, &echo.Map{
				"code":    err.Code,
				"message": err.Message,
			})
		}

		if admin == nil {
			logger.Error("Admin not found", "email", params.Email)
			return c.JSON(http.StatusUnauthorized, &echo.Map{
				"message": "Invalid credentials",
			})
		}

		// Generate JWT token
		jwtData, jwtErr := auth_jwt.CreateJwtToken(auth_jwt.CreateJwtTokenParams{
			AdminID: admin.ID,
		})

		if jwtErr != nil {
			logger.Error("Error creating JWT token", "error", jwtErr, "admin_id", admin.ID)
			return c.JSON(http.StatusInternalServerError, &echo.Map{
				"message": "Error creating authentication token",
			})
		}

		// Prepare response
		response := auth_models.AdminLoginResponse{
			AccessToken: jwtData.AccessToken,
			ExpiresAt:   jwtData.ExpiresAt,
			Admin:       *admin,
		}

		logger.Info("Admin login successful", "admin_id", admin.ID, "email", admin.Email)

		return c.JSON(http.StatusOK, response)
	}
}

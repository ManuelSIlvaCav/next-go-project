package auth_handlers

import (
	"net/http"

	auth_jwt "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/jwt"
	auth_repository "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/repository"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/labstack/echo/v4"
)

func MagicLinkAdminLogin(
	container *container.Container,
	authRepository *auth_repository.AuthRepository,
) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		var params MagicLinkLoginParams

		if err := c.Bind(&params); err != nil {
			return c.JSON(http.StatusBadRequest, &echo.Map{"message": err.Error()})
		}

		/* validator := container.GetCustomValidator()

		if validationErrs := validator.ValidateStruct(user); len(validationErrs) > 0 {

			return c.JSON(http.StatusBadRequest, &echo.Map{"errors": validationErrs})
		} */

		logger.Info("Logging admin with redirect", "user", params)

		_, handlerError := authRepository.LoginUserByEmail(
			c.Request().Context(),
			params.Email, params.Token)

		errorMessage := "could not login user"

		if handlerError != nil {

			if handlerError != nil {
				errorMessage = handlerError.Message
			}
			return c.JSON(http.StatusBadRequest, echo.Map{
				"code":  handlerError.Code,
				"error": errorMessage,
			})
		}

		/* Now we get the information of the desired User */
		admin, handlerError := authRepository.GetAdminUser(
			c.Request().Context(),
			params.Email,
		)

		if handlerError != nil {
			return c.JSON(http.StatusBadRequest, echo.Map{
				"error": "could not find user",
			})

		}

		jwtParams := auth_jwt.CreateJwtTokenParams{
			UserID:  admin.ID,
			AdminID: admin.ID,
		}

		// Create token
		data, err := auth_jwt.CreateJwtToken(jwtParams)

		if err != nil {
			return c.JSON(http.StatusBadRequest, echo.Map{
				"error": "could not create token",
			})
		}

		return c.JSON(http.StatusCreated, echo.Map{
			"access_token": data.AccessToken,
			"expires_at":   data.ExpiresAt,
		})
	}
}

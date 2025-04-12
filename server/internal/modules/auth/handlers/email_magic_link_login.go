package auth_handlers

import (
	"net/http"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/interfaces"
	auth_jwt "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/jwt"
	auth_repository "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/repository"

	businesses_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/businesses/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/labstack/echo/v4"
)

type (
	MagicLinkLoginParams struct {
		Email string `json:"email" validate:"required,email" errormgs:"email is required and must be a valid email address" `
		Token string `json:"token" validate:"required" errormgs:"token is required"`
	}
)

func MagicLinkLogin(
	container *container.Container,
	authRepository *auth_repository.AuthRepository,
	businesModule interfaces.BusinessModule,
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

		logger.Info("Logging user with redirect", "user", params)

		_, handlerError := authRepository.LoginUserByEmail(
			c.Request().Context(),
			params.Email, params.Token)

		if handlerError != nil {
			return c.JSON(http.StatusBadRequest, echo.Map{
				"error": "could not login user",
			})
		}

		/* Now we get the information of the desired User */
		businessRepository := businesModule.GetBusinessRepository()
		businessUser, err := businessRepository.GetBusinessUser(c.Request().Context(), &businesses_models.GetBusinessUserParams{Email: params.Email})

		if err != nil {
			return c.JSON(http.StatusBadRequest, echo.Map{
				"error": "could not find user",
			})
		}

		jwtParams := auth_jwt.CreateJwtTokenParams{
			UserID: businessUser.ID,
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

package auth_handlers

import (
	"net/http"

	auth_jwt "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/jwt"
	auth_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/models"
	auth_repository "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/repository"
	businesses "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/businesses/repositories"
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
	businessRepository *businesses.BusinessRepository,
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

		_, err := authRepository.LoginUserByEmail(
			c.Request().Context(),
			params.Email, params.Token)

		if err != nil {
			return c.JSON(http.StatusBadRequest, echo.Map{
				"error": "could not login user",
			})
		}

		/* Now we get the information of the desired User */

		completeUser := &auth_models.User{
			ID:        "1",
			FirstName: "Manuel",
			LastName:  "Silva",
			Email:     "",
			Password:  "",
		}

		jwtParams := auth_jwt.CreateJwtTokenParams{
			FirstName: completeUser.FirstName,
			LastName:  completeUser.LastName,
			UserId:    completeUser.ID,
		}
		// Create token
		token, err := auth_jwt.CreateJwtToken(jwtParams)

		if err != nil {
			return c.JSON(http.StatusBadRequest, echo.Map{
				"error": "could not create token",
			})
		}

		return c.JSON(http.StatusOK, echo.Map{
			"access_token": token,
		})
	}
}
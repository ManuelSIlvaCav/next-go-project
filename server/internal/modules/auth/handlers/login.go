package auth_handlers

import (
	"net/http"

	auth_jwt "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/jwt"
	auth_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/models"
	auth_repository "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/repository"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/labstack/echo/v4"
)

type (
	UserLogin struct {
		Email      string `json:"email" validate:"required,email" errormgs:"email is required and must be a valid email address"`
		Type       string `json:"type" validate:"required,oneof=email-only password" errormgs:"type is required"`
		BusinessID int    `json:"business_id" validate:"required" errormgs:"business_id is required"`
	}
)

func Login(container *container.Container,
	authRepository *auth_repository.AuthRepository) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

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
			createdEmailLogin, err := emailLogin(c, container,
				authRepository, user.Email, user.BusinessID)

			if err != nil {
				return c.JSON(http.StatusBadRequest, echo.Map{
					"error": "could not create email login",
				})
			}

			return c.JSON(http.StatusOK, echo.Map{
				"message": "email sent",
				"email":   createdEmailLogin.Email,
			})
		}

		params := &auth_repository.LoginParams{
			Email: user.Email,
		}

		loggedUser, err := authRepository.LoginUser(params)

		if err != nil {
			return c.JSON(http.StatusBadRequest, echo.Map{
				"error": "could not login user",
			})
		}

		jwtParams := auth_jwt.CreateJwtTokenParams{
			FirstName: loggedUser.FirstName,
			LastName:  loggedUser.LastName,
			UserId:    loggedUser.ID,
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

/* Send email with the redirection link which includes the email and authentication_token*/
func emailLogin(c echo.Context,
	container *container.Container,
	authRepository *auth_repository.AuthRepository,
	email string,
	businessID int) (*auth_models.UserEmailLogin, error) {
	logger := container.Logger()
	createdEmailLogin, err := authRepository.CreateUserMagicEmail(
		c.Request().Context(),
		email,
		businessID,
	)

	logger.Info("Email login created", "email", createdEmailLogin)
	return createdEmailLogin, err

}
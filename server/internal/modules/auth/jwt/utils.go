package auth_jwt

import (
	"time"

	auth_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/models"
	"github.com/golang-jwt/jwt/v5"
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
)

// jwtCustomClaims are custom claims extending default ones.
// See https://github.com/golang-jwt/jwt for more examples
type JwtCustomClaims struct {
	auth_models.JWTData
	jwt.RegisteredClaims
}

type CreateJwtTokenParams struct {
	UserID  string
	AdminID string
}

func GetJWTConfig() echojwt.Config {

	config := echojwt.Config{
		NewClaimsFunc: func(c echo.Context) jwt.Claims {
			return new(JwtCustomClaims)
		},
		ContextKey: "jwt",
		SigningKey: []byte("CustomSecretFromProyectX"), //TODO Get secret fromconfig
		Skipper: func(c echo.Context) bool {
			/* Skip these */
			if c.Path() == "/health" ||
				c.Path() == "/api/v1/auth/login" ||
				//c.Path() == "/api/v1/businesses" ||
				c.Path() == "/api/v1/auth/magic-link-login" ||
				c.Path() == "/api/v1/auth/magic-link-login/admin" {
				return true
			}
			return false
		},
	}

	return config
}

type CreateJWTData struct {
	AccessToken string `json:"access_token"`
	ExpiresAt   string `json:"expires_at"`
}

func CreateJwtToken(
	jwtParams CreateJwtTokenParams,
) (data *CreateJWTData, err error) {
	// Set custom claims
	claims := &JwtCustomClaims{
		auth_models.JWTData{
			BusinessUserID: jwtParams.UserID,
		},
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24 * 7)), // 1 week duration
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	// Create token with claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	accessToken, err := token.SignedString([]byte("CustomSecretFromProyectX"))

	if err != nil {
		return nil, err
	}

	// Generate encoded token and send it as response.
	return &CreateJWTData{
		AccessToken: accessToken,
		ExpiresAt:   claims.ExpiresAt.Time.String(),
	}, nil

}

func GetJWTData(c echo.Context) auth_models.JWTData {
	user := c.Get("user").(*jwt.Token)

	claims := user.Claims.(*JwtCustomClaims)
	name := claims.Name
	businessUserID := claims.BusinessUserID

	return auth_models.JWTData{
		Name:           name,
		BusinessUserID: businessUserID,
	}
}

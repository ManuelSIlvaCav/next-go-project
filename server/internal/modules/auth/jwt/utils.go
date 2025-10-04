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
	ClientID   string
	SellerID   string
	BusinessID int64
	AdminID    string
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
				c.Path() == "/api/v1/auth/register" ||
				c.Path() == "/api/v1/auth/clients/register" ||
				c.Path() == "/api/v1/auth/clients/login" ||
				c.Path() == "/api/v1/sellers" ||
				c.Path() == "/api/v1/admin/login" ||
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
			ClientID:   jwtParams.ClientID,
			SellerID:   jwtParams.SellerID,
			BusinessID: jwtParams.BusinessID,
			AdminID:    jwtParams.AdminID,
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
	jwt := c.Get("jwt").(*jwt.Token)

	claims := jwt.Claims.(*JwtCustomClaims)

	return auth_models.JWTData{
		ClientID:       claims.ClientID,
		SellerID:       claims.SellerID,
		BusinessID:     claims.BusinessID,
		BusinessUserID: claims.BusinessUserID,
	}
}

// CreateClientJWTResponse creates a JWT token for a client and returns the response map
type CreateClientJWTResponseParams struct {
	ClientID   string
	BusinessID int64
	Email      string
	FirstName  string
	LastName   string
	SellerID   string
}

func CreateClientJWTResponse(
	params CreateClientJWTResponseParams) (*echo.Map, error) {
	jwtParams := CreateJwtTokenParams{
		ClientID:   params.ClientID,
		BusinessID: params.BusinessID,
		SellerID:   params.SellerID,
	}

	data, jwtErr := CreateJwtToken(jwtParams)
	if jwtErr != nil {
		return nil, jwtErr
	}

	return &echo.Map{
		"access_token": data.AccessToken,
		"expires_at":   data.ExpiresAt,
		"user": echo.Map{
			"id":          params.ClientID,
			"email":       params.Email,
			"first_name":  params.FirstName,
			"last_name":   params.LastName,
			"business_id": params.BusinessID,
		},
	}, nil
}

// CreateSellerJWTResponse creates a JWT token for a seller and returns the response map
type CreateSellerJWTResponseParams struct {
	SellerID   string
	BusinessID int64
	Email      string
	FirstName  string
	LastName   string
	Name       string
}

func CreateSellerJWTResponse(
	params CreateSellerJWTResponseParams) (*echo.Map, error) {
	jwtParams := CreateJwtTokenParams{
		SellerID:   params.SellerID,
		BusinessID: params.BusinessID,
	}

	data, jwtErr := CreateJwtToken(jwtParams)
	if jwtErr != nil {
		return nil, jwtErr
	}

	return &echo.Map{
		"access_token": data.AccessToken,
		"expires_at":   data.ExpiresAt,
		"seller": echo.Map{
			"id":          params.SellerID,
			"email":       params.Email,
			"name":        params.Name,
			"first_name":  params.FirstName,
			"last_name":   params.LastName,
			"business_id": params.BusinessID,
		},
	}, nil
}

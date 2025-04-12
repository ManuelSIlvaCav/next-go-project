package auth

import (
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/interfaces"
	auth_handlers "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/handlers"
	auth_jwt "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/jwt"
	auth_repository "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/repository"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/router"

	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"go.uber.org/fx"
)

type AuthModule struct {
	container      *container.Container
	authRepository *auth_repository.AuthRepository
	businessModule interfaces.BusinessModule
	router         *router.Router
}

func NewAuthModule(
	container *container.Container,
	router *router.Router,
) *AuthModule {
	authRepository := auth_repository.NewAuthRepository(container)
	authModule := &AuthModule{
		container:      container,
		authRepository: authRepository,
		router:         router,
	}

	return authModule
}

func (l *AuthModule) GetDomain() string {
	return "/auth"
}

func (l *AuthModule) SetRoutes() {
	group := l.router.MainGroup.Group(l.GetDomain())

	group.Add("POST", "/login", auth_handlers.Login(l.container, l.authRepository))
	group.Add("POST", "/magic-link-login", auth_handlers.MagicLinkLogin(l.container, l.authRepository, l.businessModule))
	group.Add("POST", "/magic-link-login/admin", auth_handlers.MagicLinkAdminLogin(l.container, l.authRepository))
}

func (l *AuthModule) AuthMiddleware() echo.MiddlewareFunc {
	config := auth_jwt.GetJWTConfig()
	return echojwt.WithConfig(config)
}

func (l *AuthModule) SetModules(
	businessModule interfaces.BusinessModule,
) {
	l.businessModule = businessModule
	l.SetRoutes()
}

var Module = fx.Module("authfx",
	fx.Provide(auth_repository.NewAuthRepository),
	fx.Provide(
		fx.Annotate(
			NewAuthModule,
			fx.As(new(interfaces.AuthModule)),
		),
	),
	fx.Invoke(func(
		authModule interfaces.AuthModule, businessModule interfaces.BusinessModule) {
		authModule.SetModules(businessModule)
	}),
)

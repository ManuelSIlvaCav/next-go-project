package auth

import (
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/interfaces"
	auth_handlers "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/handlers"
	auth_jwt "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/jwt"
	auth_repository "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/repository"
	auth_services "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/services"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/router"

	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"go.uber.org/fx"
)

type IAuthModule interface {
	AuthMiddleware() echo.MiddlewareFunc
	SetModules(businessModule interfaces.BusinessModule, clientsModule interfaces.ClientsModule)
	GetRepository() *auth_repository.AuthRepository
	GetService() *auth_services.AuthService
}

type AuthModule struct {
	container      *container.Container
	authRepository *auth_repository.AuthRepository
	authService    *auth_services.AuthService
	businessModule interfaces.BusinessModule
	clientsModule  interfaces.ClientsModule
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

	group.Add("POST", "/login", auth_handlers.Login(l.container, l.authService))
	group.Add("POST", "/register", auth_handlers.Register(l.container, l.authService))
	group.Add("POST", "/magic-link-login", auth_handlers.MagicLinkLogin(l.container, l.authRepository, l.businessModule))
	group.Add("POST", "/magic-link-login/admin", auth_handlers.MagicLinkAdminLogin(l.container, l.authRepository))

	// Client routes
	clientGroup := group.Group("/clients")
	clientGroup.Add("POST", "/register", auth_handlers.RegisterClient(l.container, l.authService))
	clientGroup.Add("POST", "/login", auth_handlers.LoginClient(l.container, l.authService))

	// Admin routes
	adminGroup := group.Group("/admin")
	adminGroup.Add("POST", "/login", auth_handlers.AdminLogin(l.container, l.authRepository))
}

func (l *AuthModule) AuthMiddleware() echo.MiddlewareFunc {
	config := auth_jwt.GetJWTConfig()
	return echojwt.WithConfig(config)
}

func (l *AuthModule) SetModules(
	businessModule interfaces.BusinessModule,
	clientsModule interfaces.ClientsModule,
) {
	l.businessModule = businessModule
	l.clientsModule = clientsModule

	l.authService = auth_services.NewAuthService(
		l.businessModule,
		l.clientsModule,
		l.container,
		l.authRepository,
	)

	l.SetRoutes()
}

func (l *AuthModule) GetRepository() *auth_repository.AuthRepository {
	return l.authRepository
}

func (l *AuthModule) GetService() *auth_services.AuthService {
	return l.authService
}

var Module = fx.Module("authfx",
	fx.Provide(auth_repository.NewAuthRepository),
	fx.Provide(
		fx.Annotate(
			NewAuthModule,
			fx.As(new(IAuthModule)),
		),
	),
	fx.Invoke(func(
		authModule IAuthModule,
		businessModule interfaces.BusinessModule,
		clientsModule interfaces.ClientsModule) {
		authModule.SetModules(businessModule, clientsModule)
	},
	),
)

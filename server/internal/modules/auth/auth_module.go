package auth

import (
	internal_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/models"
	auth_handlers "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/handlers"
	auth_jwt "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/jwt"
	auth_repository "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth/repository"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/businesses"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"

	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"go.uber.org/fx"
)

type AuthModule struct {
	container      *container.Container
	authRepository *auth_repository.AuthRepository
	businessModule *businesses.BusinessesModule
}

func NewAuthModule(
	container *container.Container,
	businessModule *businesses.BusinessesModule,
) *AuthModule {
	authRepository := auth_repository.NewAuthRepository(container)
	authModule := &AuthModule{
		container:      container,
		authRepository: authRepository,
		businessModule: businessModule,
	}
	return authModule
}

func (l *AuthModule) GetDomain() string {
	return "/auth"
}

func (l *AuthModule) GetHandlers() []internal_models.Route {
	routes := []internal_models.Route{}

	routes = append(routes,
		internal_models.Route{
			Method:      "POST",
			Path:        "/login",
			Handler:     auth_handlers.Login(l.container, l.authRepository),
			Description: "Login",
		},
		internal_models.Route{
			Method:      "POST",
			Path:        "/magic-link-login",
			Handler:     auth_handlers.MagicLinkLogin(l.container, l.authRepository, l.businessModule.BusinessesRepository),
			Description: "Magic Link Login",
		},
		internal_models.Route{
			Method:      "POST",
			Path:        "/magic-link-login/admin",
			Handler:     auth_handlers.MagicLinkAdminLogin(l.container, l.authRepository),
			Description: "Magic Link Login Admin",
		},
	)
	return routes
}

func (l *AuthModule) GetTasks() []internal_models.Task {
	tasks := []internal_models.Task{}
	return tasks
}

func (l *AuthModule) GetScheduledJobs() []internal_models.ScheduledJob {
	scheduledJobs := []internal_models.ScheduledJob{}
	return scheduledJobs
}

func (l *AuthModule) AuthMiddleware() echo.MiddlewareFunc {
	config := auth_jwt.GetJWTConfig()
	return echojwt.WithConfig(config)
}

var Module = fx.Module("authModule", fx.Provide(NewAuthModule))

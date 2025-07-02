package interfaces

import (
	businesses_repositories "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/businesses/repositories"
	clients_repositories "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/clients/repositories"

	emails_service "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/emails/services"
	"github.com/labstack/echo/v4"
)

type AuthModule interface {
	AuthMiddleware() echo.MiddlewareFunc
	SetModules(businessModule BusinessModule)
}

type EmailModule interface {
	GetEmailService() *emails_service.EmailService
}

type PetsModule interface {
}

type BookingsModule interface {
}

type ListingsModule interface {
}

type ScrapperModule interface {
	GetDomain() string
}

type BusinessModule interface {
	GetBusinessRepository() *businesses_repositories.BusinessRepository
}

type ClientsModule interface {
	GetClientRepository() *clients_repositories.ClientRepository
}

package interfaces

import (
	accounting_repositories "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/accounting/repositories"
	businesses_repositories "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/businesses/repositories"
	clients_repositories "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/clients/repositories"
	insurance_repository "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/insurance/repositories"
	pets_repositories "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/pets/repositories"
	pets_services "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/pets/services"
	sellers_repositories "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/sellers/repositories"
	sellers_services "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/sellers/services"

	emails_service "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/emails/services"
)

type EmailModule interface {
	GetEmailService() *emails_service.EmailService
}

type PetsModule interface {
	GetPetRepository() *pets_repositories.PetRepository
	GetPetService() *pets_services.PetService
}

type SellersModule interface {
	GetSellerRepository() *sellers_repositories.SellerRepository
	GetSellerService() *sellers_services.SellerService
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

type AccountingModule interface {
	GetAccountingRepository() *accounting_repositories.AccountsRepository
	GetTransactionsRepository() *accounting_repositories.TransactionsRepository
}

type InsuranceModule interface {
	GetPolicyRepository() *insurance_repository.PolicyRepository
}

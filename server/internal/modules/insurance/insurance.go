package insurance

import (
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/interfaces"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	insurance_handlers "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/insurance/handlers"
	insurance_repository "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/insurance/repositories"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/router"
	"go.uber.org/fx"
)

type InsuranceModule struct {
	container        *container.Container
	router           *router.Router
	policyRepository *insurance_repository.PolicyRepository
}

type InsuranceModuleParams struct {
	fx.In
	Container  *container.Container
	Router     *router.Router
	AuthModule interfaces.AuthModule
}

func NewInsuranceModule(params InsuranceModuleParams) *InsuranceModule {
	policyRepository := insurance_repository.NewPolicyRepository(params.Container)

	insuranceModule := &InsuranceModule{
		container:        params.Container,
		router:           params.Router,
		policyRepository: policyRepository,
	}

	insuranceModule.SetRoutes()
	return insuranceModule
}

func (l *InsuranceModule) GetDomain() string {
	return "/insurance"
}

func (l *InsuranceModule) GetPolicyRepository() *insurance_repository.PolicyRepository {
	return l.policyRepository
}

func (l *InsuranceModule) SetRoutes() {
	group := l.router.MainGroup.Group(l.GetDomain())

	//group.Use(l.authModule.AuthMiddleware())
	group.Add("POST", "/policy", insurance_handlers.CreatePolicyHandler(l.container, l.policyRepository))
	group.Add("POST", "/policy/:id/variant", insurance_handlers.CreatePolicyVariantHandler(l.container, l.policyRepository))
	group.Add("GET", "/policy", insurance_handlers.GetPoliciesHandler(l.container, l.policyRepository))
}

var Module = fx.Module("insurancefx",
	fx.Provide(insurance_repository.NewPolicyRepository),
	/* fx.Provide(insurance_services.NewDomainService), */
	fx.Provide(
		fx.Annotate(
			NewInsuranceModule,
			fx.As(new(interfaces.InsuranceModule)),
		),
	),
)

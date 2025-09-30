package pets

import (
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/interfaces"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/auth"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	pets_handlers "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/pets/handlers"
	pets_repositories "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/pets/repositories"
	pets_services "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/pets/services"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/router"
	"go.uber.org/fx"
)

type PetsModule struct {
	petRepository *pets_repositories.PetRepository
	petService    *pets_services.PetService
	container     *container.Container
	router        *router.Router
	authModule    auth.IAuthModule
}

type PetsModuleParams struct {
	fx.In
	Container     *container.Container
	Router        *router.Router
	AuthModule    auth.IAuthModule
	PetRepository *pets_repositories.PetRepository
	PetService    *pets_services.PetService
}

func NewPetsModule(params PetsModuleParams) *PetsModule {
	petsModule := &PetsModule{
		petRepository: params.PetRepository,
		petService:    params.PetService,
		container:     params.Container,
		router:        params.Router,
		authModule:    params.AuthModule,
	}

	petsModule.SetRoutes()
	return petsModule
}

func (p *PetsModule) GetDomain() string {
	return "/pets"
}

func (p *PetsModule) SetRoutes() {
	group := p.router.MainGroup.Group(p.GetDomain())

	group.Use(p.authModule.AuthMiddleware())

	// Pet CRUD routes
	group.Add("POST", "", pets_handlers.CreatePetHandler(p.container, p.petService))
	group.Add("GET", "", pets_handlers.GetPetsHandler(p.container, p.petService))
	group.Add("GET", "/:id", pets_handlers.GetPetHandler(p.container, p.petService))
	group.Add("PUT", "/:id", pets_handlers.UpdatePetHandler(p.container, p.petService))
	group.Add("DELETE", "/:id", pets_handlers.DeletePetHandler(p.container, p.petService))
}

func (p *PetsModule) SetTasks() {
	// No background tasks needed for pets module currently
}

func (p *PetsModule) GetPetRepository() *pets_repositories.PetRepository {
	return p.petRepository
}

func (p *PetsModule) GetPetService() *pets_services.PetService {
	return p.petService
}

// FX Module definition
var Module = fx.Module("petsfx",
	fx.Provide(pets_repositories.NewPetRepository),
	fx.Provide(pets_services.NewPetService),
	fx.Provide(
		fx.Annotate(
			NewPetsModule,
			fx.As(new(interfaces.PetsModule)),
		),
	),
)

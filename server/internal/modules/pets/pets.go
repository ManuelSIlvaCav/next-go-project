package pets

import (
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/interfaces"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/router"
	"go.uber.org/fx"
)

type PetsModule struct {
	clientModule interfaces.ClientsModule
	container    *container.Container
	router       *router.Router
	authModule   interfaces.AuthModule
}

type PetsModuleParams struct {
	fx.In
	Container  *container.Container
	Router     *router.Router
	AuthModule interfaces.AuthModule
}

func NewPetsModule(params PetsModuleParams) *PetsModule {
	petsModule := PetsModule{}

	petsModule.SetRoutes(params)

	return &petsModule
}
func (l *PetsModule) GetDomain() string {
	return "/pets"
}

func (l *PetsModule) SetRoutes(params PetsModuleParams) {
	group := params.Router.MainGroup.Group(l.GetDomain())

	group.Use(params.AuthModule.AuthMiddleware())

	// group.Add("POST", "", emails.CreateEmailTemplate(l.container,
	// 	l.EmailTemplateRepository))
	// group.Add("GET", "", emails.GetEmailTemplates(l.container,
	// 	l.EmailTemplateRepository))

}
func (l *PetsModule) SetTasks() {
	//mux := l.container.JobTasker().Mux()
}

var Module = fx.Module(
	"petsfx",
	fx.Provide(
		fx.Annotate(
			NewPetsModule,
			fx.As(new(interfaces.PetsModule)),
		),
	),
)

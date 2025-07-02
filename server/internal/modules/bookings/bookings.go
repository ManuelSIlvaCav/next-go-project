package bookings

import (
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/interfaces"
	"go.uber.org/fx"
)

type BookingsModule struct {
}

func NewBookingsModule() *BookingsModule {
	return &BookingsModule{}
}

func (b *BookingsModule) GetDomain() string {
	return "/bookings"
}

func (b *BookingsModule) SetRoutes() {
	// group := params.Router.MainGroup.Group(b.GetDomain())
	//
	// group.Use(params.AuthModule.AuthMiddleware())
	//
	// group.Add("POST", "", emails.CreateEmailTemplate(l.container,
	// 	l.EmailTemplateRepository))
	// group.Add("GET", "", emails.GetEmailTemplates(l.container,
	// 	l.EmailTemplateRepository))
}

func (b *BookingsModule) SetTasks() {
	//mux := l.container.JobTasker().Mux()
}

var Module = fx.Module(
	"bookingsfx",
	fx.Provide(
		fx.Annotate(
			NewBookingsModule(),
			fx.As(new(interfaces.BookingsModule)),
		),
	),
)

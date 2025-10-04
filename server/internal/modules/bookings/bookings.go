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

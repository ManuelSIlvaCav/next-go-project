package bookings_services

import "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"

type BookingService struct {
	container *container.Container
}

func NewBookingService(container *container.Container) *BookingService {
	return &BookingService{
		container: container,
	}
}

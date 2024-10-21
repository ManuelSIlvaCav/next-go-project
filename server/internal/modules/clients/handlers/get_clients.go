package clients

import (
	"net/http"

	clients "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/clients/repositories"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/labstack/echo/v4"
)

func Clients(container *container.Container, clientRepository *clients.ClientRepository) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		logger.Info(
			"Get clients handler", "path", c.Path(), "method",
			c.Request().Method)

		//Get the clients from the database
		clients := clientRepository.GetClients()

		//Return the clients

		return c.JSON(http.StatusOK, &echo.Map{
			"clients": clients,
		})

	}
}

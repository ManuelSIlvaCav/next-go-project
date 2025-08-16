package accounting_handlers

import (
	accounting_services "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/accounting/services"
	"github.com/labstack/echo/v4"
)

func GenerateTransaction(service *accounting_services.AccountingService) echo.HandlerFunc {
	return func(c echo.Context) error {
		// Handler logic here
		service.CreateOrderTransactions(c.Request().Context(), "1000", 100.0)
		return nil
	}
}

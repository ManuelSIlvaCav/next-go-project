package listings_handlers

import (
	"net/http"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	listings_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/listings/models"
	listings_repositories "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/listings/repositories"
	"github.com/labstack/echo/v4"
)

func CreateCart(
	container *container.Container,
	cartRepository listings_repositories.ShoppingCartRepositoryInterface) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		params := listings_models.CreateCartParams{}

		if err := c.Bind(&params); err != nil {
			logger.Error("Failed to bind create cart params", "error", err)
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Bad Request - Invalid parameters"})
		}

		cart, err := cartRepository.CreateCart(c.Request().Context(), &params)
		if err != nil {
			logger.Error("Failed to create cart", "error", err)
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Internal Server Error"})
		}

		logger.Info("Cart created successfully", "cart_id", cart.ID, "client_id", cart.ClientID)
		return c.JSON(http.StatusCreated, echo.Map{"data": cart})
	}
}

func GetCart(
	container *container.Container,
	cartRepository listings_repositories.ShoppingCartRepositoryInterface) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		params := listings_models.GetCartParams{
			CartID:   c.Param("cart_id"),
			ClientID: c.QueryParam("client_id"),
		}

		if params.CartID == "" && params.ClientID == "" {
			logger.Error("Either cart_id or client_id must be provided")
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Either cart_id or client_id must be provided"})
		}

		cart, err := cartRepository.GetCart(c.Request().Context(), &params)
		if err != nil {
			if err.Error() == "shopping cart not found" {
				logger.Info("Shopping cart not found", "params", params)
				return c.JSON(http.StatusNotFound, echo.Map{"error": "Shopping cart not found"})
			}
			logger.Error("Failed to get cart", "error", err)
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Internal Server Error"})
		}

		logger.Info("Cart retrieved successfully", "cart_id", cart.ID)
		return c.JSON(http.StatusOK, echo.Map{"data": cart})
	}
}

func AddToCart(
	container *container.Container,
	cartRepository listings_repositories.ShoppingCartRepositoryInterface) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		params := listings_models.AddToCartParams{}

		if err := c.Bind(&params); err != nil {
			logger.Error("Failed to bind add to cart params", "error", err)
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Bad Request - Invalid parameters"})
		}

		item, err := cartRepository.AddToCart(c.Request().Context(), &params)
		if err != nil {
			logger.Error("Failed to add item to cart", "error", err)
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Internal Server Error"})
		}

		logger.Info("Item added to cart successfully", "cart_id", params.CartID, "item_id", item.ID)
		return c.JSON(http.StatusCreated, echo.Map{"data": item})
	}
}

func UpdateCartItem(
	container *container.Container,
	cartRepository listings_repositories.ShoppingCartRepositoryInterface) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		params := listings_models.UpdateCartItemParams{
			ItemID: c.Param("item_id"),
		}

		if err := c.Bind(&params); err != nil {
			logger.Error("Failed to bind update cart item params", "error", err)
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Bad Request - Invalid parameters"})
		}

		item, err := cartRepository.UpdateCartItem(c.Request().Context(), &params)
		if err != nil {
			if err.Error() == "no fields to update" {
				logger.Error("No fields to update for cart item")
				return c.JSON(http.StatusBadRequest, echo.Map{"error": "No fields to update"})
			}
			logger.Error("Failed to update cart item", "error", err)
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Internal Server Error"})
		}

		logger.Info("Cart item updated successfully", "cart_id", params.CartID, "item_id", params.ItemID)
		return c.JSON(http.StatusOK, echo.Map{"data": item})
	}
}

func RemoveFromCart(
	container *container.Container,
	cartRepository listings_repositories.ShoppingCartRepositoryInterface) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := container.Logger()

		params := listings_models.RemoveFromCartParams{
			ItemID: c.Param("item_id"),
		}

		if err := c.Bind(&params); err != nil {
			logger.Error("Failed to bind remove from cart params", "error", err)
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Bad Request - Invalid parameters"})
		}

		err := cartRepository.RemoveFromCart(c.Request().Context(), &params)
		if err != nil {
			if err.Error() == "cart item not found" {
				logger.Info("Cart item not found", "params", params)
				return c.JSON(http.StatusNotFound, echo.Map{"error": "Cart item not found"})
			}
			logger.Error("Failed to remove item from cart", "error", err)
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Internal Server Error"})
		}

		logger.Info("Item removed from cart successfully", "cart_id", params.CartID, "item_id", params.ItemID)
		return c.JSON(http.StatusOK, echo.Map{"message": "Item removed from cart successfully"})
	}
}

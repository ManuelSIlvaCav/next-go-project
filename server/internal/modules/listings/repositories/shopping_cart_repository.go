package listings_repositories

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	listings_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/listings/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/utils"
)

type ShoppingCartRepository struct {
	container *container.Container
	utils.BaseRepository[listings_models.ShoppingCart]
}

type ShoppingCartRepositoryInterface interface {
	CreateCart(ctx context.Context, params *listings_models.CreateCartParams) (*listings_models.ShoppingCart, error)
	GetCart(ctx context.Context, params *listings_models.GetCartParams) (*listings_models.ShoppingCartDTO, error)
	GetCartByClientID(ctx context.Context, clientID string) (*listings_models.ShoppingCartDTO, error)
	AddToCart(ctx context.Context, params *listings_models.AddToCartParams) (*listings_models.ShoppingCartItem, error)
	UpdateCartItem(ctx context.Context, params *listings_models.UpdateCartItemParams) (*listings_models.ShoppingCartItem, error)
	RemoveFromCart(ctx context.Context, params *listings_models.RemoveFromCartParams) error
	GetCartItems(ctx context.Context, cartID string) ([]*listings_models.ShoppingCartItem, error)
}

func NewShoppingCartRepository(container *container.Container) *ShoppingCartRepository {
	return &ShoppingCartRepository{
		container: container,
	}
}

func (r *ShoppingCartRepository) CreateCart(ctx context.Context, params *listings_models.CreateCartParams) (*listings_models.ShoppingCart, error) {
	logger := r.container.Logger()

	cart := &listings_models.ShoppingCart{
		ClientID: params.ClientID,
		Status:   "active",
	}

	query := `INSERT INTO shopping_carts (client_id, status) VALUES ($1, $2) RETURNING id, created_at, updated_at`

	if err := r.container.DB().Db.QueryRowContext(ctx, query,
		cart.ClientID,
		cart.Status,
	).Scan(&cart.ID, &cart.CreatedAt, &cart.UpdatedAt); err != nil {
		logger.Error("Error creating shopping cart", "error", err)
		return nil, err
	}

	logger.Info("Shopping cart created successfully", "cart_id", cart.ID, "client_id", cart.ClientID)
	return cart, nil
}

func (r *ShoppingCartRepository) GetCart(ctx context.Context, params *listings_models.GetCartParams) (*listings_models.ShoppingCartDTO, error) {
	logger := r.container.Logger()

	var whereClause string
	var args []interface{}

	if params.CartID != "" {
		whereClause = "WHERE sc.id = $1 AND sc.deleted_at IS NULL"
		args = append(args, params.CartID)
	} else if params.ClientID != "" {
		whereClause = "WHERE sc.client_id = $1 AND sc.status = 'active' AND sc.deleted_at IS NULL"
		args = append(args, params.ClientID)
	} else {
		return nil, fmt.Errorf("either cart_id or client_id must be provided")
	}

	// Get cart basic info
	cartQuery := `SELECT id, client_id, status, created_at, updated_at FROM shopping_carts sc ` + whereClause

	cart := &listings_models.ShoppingCart{}
	if err := r.container.DB().Db.QueryRowContext(ctx, cartQuery, args...).Scan(
		&cart.ID, &cart.ClientID, &cart.Status, &cart.CreatedAt, &cart.UpdatedAt,
	); err != nil {
		if err == sql.ErrNoRows {
			logger.Info("Shopping cart not found", "params", params)
			return nil, fmt.Errorf("shopping cart not found")
		}
		logger.Error("Error getting shopping cart", "error", err)
		return nil, err
	}

	// Get cart items
	items, err := r.GetCartItems(ctx, cart.ID)
	if err != nil {
		logger.Error("Error getting cart items", "error", err)
		return nil, err
	}

	// Convert to DTO
	cartDTO := r.convertToCartDTO(cart, items)
	return cartDTO, nil
}

func (r *ShoppingCartRepository) GetCartByClientID(ctx context.Context, clientID string) (*listings_models.ShoppingCartDTO, error) {
	return r.GetCart(ctx, &listings_models.GetCartParams{ClientID: clientID})
}

func (r *ShoppingCartRepository) AddToCart(ctx context.Context, params *listings_models.AddToCartParams) (*listings_models.ShoppingCartItem, error) {
	logger := r.container.Logger()

	// Marshal price data and metadata to JSON
	priceData, err := json.Marshal(params.Price)
	if err != nil {
		logger.Error("Error marshaling price data", "error", err)
		return nil, err
	}

	metadata, err := json.Marshal(params.Metadata)
	if err != nil {
		logger.Error("Error marshaling metadata", "error", err)
		return nil, err
	}

	// Check if item already exists in cart
	existingItemQuery := `SELECT id, quantity FROM shopping_cart_items WHERE cart_id = $1 AND listing_id = $2 AND deleted_at IS NULL`
	var existingID string
	var existingQuantity int

	err = r.container.DB().Db.QueryRowContext(ctx, existingItemQuery, params.CartID, params.ListingID).Scan(&existingID, &existingQuantity)
	if err != nil && err != sql.ErrNoRows {
		logger.Error("Error checking existing cart item", "error", err)
		return nil, err
	}

	var item *listings_models.ShoppingCartItem

	if err == sql.ErrNoRows {
		// Create new item
		item = &listings_models.ShoppingCartItem{
			CartID:    params.CartID,
			ListingID: params.ListingID,
			Quantity:  params.Quantity,
			PriceData: priceData,
			Metadata:  metadata,
		}

		query := `INSERT INTO shopping_cart_items (cart_id, listing_id, quantity, price_data, metadata) 
                  VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at, updated_at`

		if err := r.container.DB().Db.QueryRowContext(ctx, query,
			item.CartID, item.ListingID, item.Quantity, item.PriceData, item.Metadata,
		).Scan(&item.ID, &item.CreatedAt, &item.UpdatedAt); err != nil {
			logger.Error("Error adding item to cart", "error", err)
			return nil, err
		}
	} else {
		// Update existing item quantity
		newQuantity := existingQuantity + params.Quantity
		updateQuery := `UPDATE shopping_cart_items SET quantity = $1, price_data = $2, metadata = $3, updated_at = NOW() 
                       WHERE id = $4 RETURNING id, cart_id, listing_id, quantity, price_data, metadata, created_at, updated_at`

		item = &listings_models.ShoppingCartItem{}
		if err := r.container.DB().Db.QueryRowContext(ctx, updateQuery,
			newQuantity, priceData, metadata, existingID,
		).Scan(&item.ID, &item.CartID, &item.ListingID, &item.Quantity, &item.PriceData, &item.Metadata, &item.CreatedAt, &item.UpdatedAt); err != nil {
			logger.Error("Error updating cart item quantity", "error", err)
			return nil, err
		}
	}

	// Update cart updated_at timestamp
	if _, err := r.container.DB().Db.ExecContext(ctx, "UPDATE shopping_carts SET updated_at = NOW() WHERE id = $1", params.CartID); err != nil {
		logger.Error("Error updating cart timestamp", "error", err)
		// Don't fail the operation for this
	}

	logger.Info("Item added to cart successfully", "cart_id", params.CartID, "item_id", item.ID)
	return item, nil
}

func (r *ShoppingCartRepository) UpdateCartItem(ctx context.Context, params *listings_models.UpdateCartItemParams) (*listings_models.ShoppingCartItem, error) {
	logger := r.container.Logger()

	// Build dynamic update query
	setParts := []string{}
	args := []interface{}{}
	argIndex := 1

	if params.Quantity != nil {
		setParts = append(setParts, fmt.Sprintf("quantity = $%d", argIndex))
		args = append(args, *params.Quantity)
		argIndex++
	}

	if params.Price != nil {
		priceData, err := json.Marshal(params.Price)
		if err != nil {
			logger.Error("Error marshaling price data", "error", err)
			return nil, err
		}
		setParts = append(setParts, fmt.Sprintf("price_data = $%d", argIndex))
		args = append(args, priceData)
		argIndex++
	}

	if params.Metadata != nil {
		metadata, err := json.Marshal(params.Metadata)
		if err != nil {
			logger.Error("Error marshaling metadata", "error", err)
			return nil, err
		}
		setParts = append(setParts, fmt.Sprintf("metadata = $%d", argIndex))
		args = append(args, metadata)
		argIndex++
	}

	if len(setParts) == 0 {
		return nil, fmt.Errorf("no fields to update")
	}

	// Add updated_at field
	setParts = append(setParts, "updated_at = NOW()")

	// Build final query
	query := fmt.Sprintf("UPDATE shopping_cart_items SET %s WHERE id = $%d AND cart_id = $%d RETURNING id, cart_id, listing_id, quantity, price_data, metadata, created_at, updated_at",
		fmt.Sprintf("%s", setParts), argIndex, argIndex+1)
	args = append(args, params.ItemID, params.CartID)

	item := &listings_models.ShoppingCartItem{}
	if err := r.container.DB().Db.QueryRowContext(ctx, query, args...).Scan(
		&item.ID, &item.CartID, &item.ListingID, &item.Quantity, &item.PriceData, &item.Metadata, &item.CreatedAt, &item.UpdatedAt,
	); err != nil {
		logger.Error("Error updating cart item", "error", err)
		return nil, err
	}

	// Update cart updated_at timestamp
	if _, err := r.container.DB().Db.ExecContext(ctx, "UPDATE shopping_carts SET updated_at = NOW() WHERE id = $1", params.CartID); err != nil {
		logger.Error("Error updating cart timestamp", "error", err)
	}

	logger.Info("Cart item updated successfully", "cart_id", params.CartID, "item_id", params.ItemID)
	return item, nil
}

func (r *ShoppingCartRepository) RemoveFromCart(ctx context.Context, params *listings_models.RemoveFromCartParams) error {
	logger := r.container.Logger()

	query := `UPDATE shopping_cart_items SET deleted_at = NOW() WHERE id = $1 AND cart_id = $2`

	result, err := r.container.DB().Db.ExecContext(ctx, query, params.ItemID, params.CartID)
	if err != nil {
		logger.Error("Error removing item from cart", "error", err)
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		logger.Error("Error getting rows affected", "error", err)
		return err
	}

	if rowsAffected == 0 {
		return fmt.Errorf("cart item not found")
	}

	// Update cart updated_at timestamp
	if _, err := r.container.DB().Db.ExecContext(ctx, "UPDATE shopping_carts SET updated_at = NOW() WHERE id = $1", params.CartID); err != nil {
		logger.Error("Error updating cart timestamp", "error", err)
	}

	logger.Info("Item removed from cart successfully", "cart_id", params.CartID, "item_id", params.ItemID)
	return nil
}

func (r *ShoppingCartRepository) GetCartItems(ctx context.Context, cartID string) ([]*listings_models.ShoppingCartItem, error) {
	logger := r.container.Logger()

	query := `SELECT id, cart_id, listing_id, quantity, price_data, metadata, created_at, updated_at 
              FROM shopping_cart_items WHERE cart_id = $1 AND deleted_at IS NULL ORDER BY created_at ASC`

	rows, err := r.container.DB().Db.QueryContext(ctx, query, cartID)
	if err != nil {
		logger.Error("Error getting cart items", "error", err)
		return nil, err
	}
	defer rows.Close()

	var items []*listings_models.ShoppingCartItem
	for rows.Next() {
		item := &listings_models.ShoppingCartItem{}
		if err := rows.Scan(
			&item.ID, &item.CartID, &item.ListingID, &item.Quantity,
			&item.PriceData, &item.Metadata, &item.CreatedAt, &item.UpdatedAt,
		); err != nil {
			logger.Error("Error scanning cart item", "error", err)
			return nil, err
		}
		items = append(items, item)
	}

	return items, nil
}

// Helper function to convert models to DTOs
func (r *ShoppingCartRepository) convertToCartDTO(cart *listings_models.ShoppingCart, items []*listings_models.ShoppingCartItem) *listings_models.ShoppingCartDTO {
	itemDTOs := make([]listings_models.ShoppingCartItemDTO, 0, len(items))
	totalItems := 0
	totalPrice := 0.0

	for _, item := range items {
		itemDTO := listings_models.ShoppingCartItemDTO{
			ID:        item.ID,
			CartID:    item.CartID,
			ListingID: item.ListingID,
			Quantity:  item.Quantity,
			CreatedAt: item.CreatedAt,
			UpdatedAt: item.UpdatedAt,
		}

		// Parse price data
		var price listings_models.Price
		if err := json.Unmarshal(item.PriceData, &price); err == nil {
			itemDTO.Price = price
			totalPrice += price.FinalPrice * float64(item.Quantity)
		}

		// Parse metadata
		var metadata map[string]interface{}
		if err := json.Unmarshal(item.Metadata, &metadata); err == nil {
			itemDTO.Metadata = metadata
		}

		itemDTOs = append(itemDTOs, itemDTO)
		totalItems += item.Quantity
	}

	return &listings_models.ShoppingCartDTO{
		ID:         cart.ID,
		ClientID:   cart.ClientID,
		Status:     cart.Status,
		Items:      itemDTOs,
		TotalItems: totalItems,
		TotalPrice: totalPrice,
		CreatedAt:  cart.CreatedAt,
		UpdatedAt:  cart.UpdatedAt,
	}
}

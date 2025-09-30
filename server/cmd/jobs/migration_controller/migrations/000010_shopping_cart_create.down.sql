-- Drop indexes
DROP INDEX IF EXISTS idx_unique_cart_listing;
DROP INDEX IF EXISTS idx_shopping_cart_items_deleted_at;
DROP INDEX IF EXISTS idx_shopping_cart_items_listing_id;
DROP INDEX IF EXISTS idx_shopping_cart_items_cart_id;
DROP INDEX IF EXISTS idx_shopping_carts_status;
DROP INDEX IF EXISTS idx_shopping_carts_client_id;

-- Drop tables
DROP TABLE IF EXISTS shopping_cart_items;
DROP TABLE IF EXISTS shopping_carts;
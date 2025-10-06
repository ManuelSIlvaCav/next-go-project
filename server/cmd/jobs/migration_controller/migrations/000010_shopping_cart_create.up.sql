-- Create shopping_carts table
CREATE TABLE IF NOT EXISTS shopping_carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'abandoned', 'completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Create shopping_cart_items table
CREATE TABLE IF NOT EXISTS shopping_cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID NOT NULL REFERENCES shopping_carts(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price_data JSONB NOT NULL, -- Stores Price object as JSON
    metadata JSONB DEFAULT '{}', -- Stores additional product info as JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (cart_id) REFERENCES shopping_carts(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shopping_carts_client_id ON shopping_carts(client_id);
CREATE INDEX IF NOT EXISTS idx_shopping_carts_status ON shopping_carts(status);

CREATE INDEX IF NOT EXISTS idx_shopping_cart_items_cart_id ON shopping_cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_shopping_cart_items_deleted_at ON shopping_cart_items(deleted_at);

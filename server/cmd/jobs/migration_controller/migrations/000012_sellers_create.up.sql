CREATE TABLE sellers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id SERIAL REFERENCES businesses(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sellers_business_id ON sellers(business_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_seller_email_business ON sellers(email, business_id);

CREATE TABLE sellers_data (
    id SERIAL PRIMARY KEY,
    seller_id UUID REFERENCES sellers(id) ON DELETE CASCADE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE seller_listings_type (
    id INT NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

INSERT INTO seller_listings_type (id, name) VALUES
(1, 'service'),
(2, 'product');

CREATE TABLE seller_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES sellers(id) ON DELETE CASCADE,
    business_id INT REFERENCES businesses(id) ON DELETE CASCADE,
    type_id INT REFERENCES seller_listings_type(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_seller_listings_seller_id ON seller_listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_seller_listings_seller_type ON seller_listings(seller_id, type_id);
CREATE INDEX IF NOT EXISTS idx_seller_listings_business_id ON seller_listings(business_id);

CREATE TABLE seller_listings_details (
    id SERIAL PRIMARY KEY,
    seller_listing_id UUID REFERENCES seller_listings(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    currency VARCHAR(10) NOT NULL,
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_seller_listings_details_listing_id ON seller_listings_details(seller_listing_id);

CREATE TABLE seller_listings_prices (
    id SERIAL PRIMARY KEY,
    seller_listing_id UUID REFERENCES seller_listings(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    interval VARCHAR(50) CHECK (interval IN ('one-time', 'daily', 'weekly', 'monthly', 'yearly')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_seller_listings_prices_listing_id ON seller_listings_prices(seller_listing_id);
CREATE INDEX IF NOT EXISTS idx_seller_listings_prices_listing_order ON seller_listings_prices(seller_listing_id, updated_at DESC);


/* These table will reflect what categories is the listing part of */
CREATE TABLE seller_listings_categories (
    id SERIAL PRIMARY KEY,
    seller_listing_id UUID REFERENCES seller_listings(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE
);
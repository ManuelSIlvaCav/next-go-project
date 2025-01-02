

CREATE TABLE IF NOT EXISTS listings (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(100) NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    price_unit VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc') NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc') NOT NULL
);

CREATE TABLE IF NOT EXISTS listings_details(
    id SERIAL PRIMARY KEY,
    listing_id SERIAL REFERENCES listings(id) ON DELETE CASCADE,
    bedrooms INT,
    bathrooms INT,
    surface_total DECIMAL(12, 2),
    surface_living DECIMAL(12, 2),
    surface_scale VARCHAR(10),
    has_garage BOOLEAN,
    garage_identifier VARCHAR(10),
    has_parking BOOLEAN
);
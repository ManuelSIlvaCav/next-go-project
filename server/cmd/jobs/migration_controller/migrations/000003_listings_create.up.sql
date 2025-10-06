
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description VARCHAR(100),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc') NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc') NOT NULL,
    deleted_at TIMESTAMP WITHOUT TIME ZONE,
    parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    slug VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE or REPLACE FUNCTION category_sub_or_leaf(id_in uuid)
  RETURNS text
  language sql 
  strict 
as $$ 
    select case when exists (select null
                               from categories
                               where parent_id = id_in 
                            )   
                then 'nested_category'
                else 'leaf_category'
             end  ;
$$;

CREATE TABLE IF NOT EXISTS listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100) NOT NULL,
    description VARCHAR(100) NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    price_unit VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc') NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc') NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS listings_details(
    id SERIAL PRIMARY KEY,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    website_url VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL
);

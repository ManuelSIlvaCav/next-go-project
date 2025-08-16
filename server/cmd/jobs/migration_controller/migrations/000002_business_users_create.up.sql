CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS businesses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    identifier VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS business_configuration (
    business_id INT NOT NULL PRIMARY KEY,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
    domain VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS businesses_users (
    id SERIAL PRIMARY KEY,
    business_id INT NOT NULL,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_businesses_users_email ON businesses_users(email);


CREATE TABLE IF NOT EXISTS user_email_login (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    authentication_token uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 day',
    used_at TIMESTAMP,
    deleted_at TIMESTAMP
)


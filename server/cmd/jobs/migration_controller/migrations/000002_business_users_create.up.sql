CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone VARCHAR(255),
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP,
    UNIQUE (business_id, email)
);

CREATE INDEX IF NOT EXISTS idx_businesses_users_email ON businesses_users(email);


CREATE TABLE IF NOT EXISTS user_email_login (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    authentication_token uuid DEFAULT uuid_generate_v4() NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 day',
    used_at TIMESTAMP,
    deleted_at TIMESTAMP
);


INSERT INTO businesses (id, name, identifier, legal_name, is_active, is_admin)
VALUES (1, 'Petza Business', 'petza_business', 'Petza Business LLC', TRUE, TRUE)

INSERT INTO businesses_users (business_id, email, first_name, last_name, is_active)
VALUES (1, 'petzahelp@gmail.com', 'Petza', 'Help', TRUE);
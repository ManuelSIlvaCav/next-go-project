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
    id INT NOT NULL PRIMARY KEY,
    business_id INT NOT NULL,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS securables (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description VARCHAR(255) 
);

CREATE TABLE IF NOT EXISTS role_securables (
    role_id INT NOT NULL,
    securable_id INT NOT NULL,
    PRIMARY KEY (role_id, securable_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (securable_id) REFERENCES securables(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS business_user_roles (
    business_user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (business_user_id, role_id),
    FOREIGN KEY (business_user_id) REFERENCES businesses_users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_email_login (
    id SERIAL PRIMARY KEY,
    business_id INT,
    email VARCHAR(255) NOT NULL,
    authentication_token uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 day'
)
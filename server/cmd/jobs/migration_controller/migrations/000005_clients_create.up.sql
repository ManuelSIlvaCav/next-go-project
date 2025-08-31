CREATE TABLE IF NOT EXISTS clients(
    id SERIAL PRIMARY KEY,
    business_id SERIAL REFERENCES businesses(id) ON DELETE CASCADE,
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS client_contacts_information(
    id SERIAL PRIMARY KEY,
    client_id SERIAL REFERENCES clients(id) ON DELETE CASCADE,
    phone VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


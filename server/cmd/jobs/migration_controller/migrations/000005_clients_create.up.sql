CREATE TABLE IF NOT EXISTS clients(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id SERIAL REFERENCES businesses(id) ON DELETE CASCADE,
    first_name VARCHAR(255),
    middle_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_clients_business_id ON clients(business_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_client_email_business ON clients(email, business_id);


CREATE TABLE IF NOT EXISTS client_contacts_information(
    id SERIAL PRIMARY KEY,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    phone VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


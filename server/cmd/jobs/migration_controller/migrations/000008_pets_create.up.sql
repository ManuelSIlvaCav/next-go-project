CREATE TABLE IF NOT EXISTS pets(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id SERIAL REFERENCES businesses(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    pet_name VARCHAR(255) NOT NULL,
    pet_type VARCHAR(100) NOT NULL,
    breed VARCHAR(100),
    age NUMERIC NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX IF NOT EXISTS idx_pets_business_id ON pets(business_id);
CREATE INDEX IF NOT EXISTS idx_pets_pet_type ON pets(pet_type);
CREATE INDEX IF NOT EXISTS idx_pets_client_id ON pets(client_id);



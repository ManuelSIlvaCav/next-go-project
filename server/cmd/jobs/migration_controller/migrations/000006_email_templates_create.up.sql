CREATE TABLE IF NOT EXISTS email_templates(
    id SERIAL PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS businesses_email_templates(
    id SERIAL PRIMARY KEY,
    business_id SERIAL NOT NULL REFERENCES businesses(id),
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS email_templates_data (
    id SERIAL PRIMARY KEY,
    email_template_id INT NOT NULL REFERENCES email_templates(id),
    design JSON NOT NULL,
    html TEXT NOT NULL
);




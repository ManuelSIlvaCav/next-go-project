CREATE TABLE IF NOT EXISTS projects(
    id SERIAL PRIMARY KEY,
    business_id INT NOT NULL,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    city VARCHAR(255),
    street VARCHAR(255),
    country_code VARCHAR(255) NOT NULL,
    tipology_count INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects_addresses (
    project_id INT NOT NULL,
    address_id INT NOT NULL,
    PRIMARY KEY (project_id, address_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE CASCADE
);


/* These are the clients who are participating in the sale*/
CREATE TABLE IF NOT EXISTS projects_clients (
    project_id INT NOT NULL,
    client_id INT NOT NULL,
    PRIMARY KEY (project_id, client_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

/* These are the users from the business assigned to the project */
CREATE TABLE IF NOT EXISTS projects_users (
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (project_id, user_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES businesses_users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS projects_stages (
    project_id SERIAL REFERENCES projects(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'pre-construction', 'construction', 'on-sale', 'inmediate-delivery', 'finished'
    name VARCHAR(255) NOT NULL,
    started_at TIMESTAMP,
    finished_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects_addresses (
    project_id INT NOT NULL,
    address_id INT NOT NULL,
    PRIMARY KEY (project_id, address_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tipologies (
    id SERIAL PRIMARY KEY,
    project_id INT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    total_area DECIMAL(10,2) NOT NULL,
    net_area DECIMAL(10,2) NOT NULL,
    bedrooms INT NOT NULL,
    bathrooms INT NOT NULL,
    count INT NOT NULL,
    list_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
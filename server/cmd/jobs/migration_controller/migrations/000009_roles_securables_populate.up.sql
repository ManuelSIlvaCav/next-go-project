INSERT INTO roles (name, description) VALUES ('admin', 'Administrator of the business');

INSERT INTO securables (name, description) VALUES ('projects.read', 'Read Project Module'), ('projects.write', 'Write Project Module'), ('admin.read', 'Read Admin Module'), ('admin.write', 'Write Admin Module'), ('business.read', 'Read Business Module'), ('business.write', 'Write Business Module');

INSERT INTO role_securables (role_id, securable_id)
SELECT (SELECT id FROM roles WHERE name = 'admin'), id FROM securables WHERE name IN ('projects.read', 'projects.write', 'business.read', 'business.write', 'admin.read', 'admin.write');


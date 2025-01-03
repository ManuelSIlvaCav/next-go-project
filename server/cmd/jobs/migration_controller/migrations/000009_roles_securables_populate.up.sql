INSERT INTO roles (name, description) VALUES ('superadmin', 'Administrator of the SaaS platform'), ('admin', 'Administrator of the business');

INSERT INTO securables (name, description) VALUES ('projects.read', 'Read Project Module'), ('projects.write', 'Write Project Module'), ('projects.delete', 'Delete Project Module'), ('admin.read', 'Read Admin Module'), ('admin.write', 'Write Admin Module'), ('business.read', 'Read Business Module'), ('business.write', 'Write Business Module'), ('business.delete', 'Delete Business Module');

INSERT INTO role_securables (role_id, securable_id)
SELECT (SELECT id FROM roles WHERE name = 'superadmin'), id FROM securables;

INSERT INTO role_securables (role_id, securable_id)
SELECT (SELECT id FROM roles WHERE name = 'admin'), id FROM securables WHERE name IN ('projects.read', 'projects.write', 'projects.delete', 'business.read', 'business.write', 'business.delete');


USE tattoo_studio;

INSERT INTO services (name, description, photo, created_at, updated_at) VALUES
('Tattoo from catalogue', 'Description1', 'https://example.com/photo1.jpg', NOW(), NOW()),
('Custom Tattoo', 'Description2', 'https://example.com/photo2.jpg', NOW(), NOW()),
('Tattoo Restoration', 'Description3', 'https://example.com/photo3.jpg', NOW(), NOW()),
('Tattoo Removal', 'Description4', 'https://example.com/photo4.jpg', NOW(), NOW()),
('Piercing services', 'Description5', NULL, NOW(), NOW()),
('Piercing Supply', 'Description6', NULL, NOW(), NOW());

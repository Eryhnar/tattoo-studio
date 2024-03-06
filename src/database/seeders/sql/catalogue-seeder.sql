USE tattoo_studio;

INSERT INTO catalogue (name, description, price, before_image, after_image, created_at, updated_at, artist_id, service_id) VALUES 
('Tattoo Design 1', 'A cool tattoo design.', 100, 'before1.jpg', 'after1.jpg', NOW(), NOW(), 3, 1),
('Tattoo Design 2', 'Another cool tattoo design.', 150, 'before2.jpg', 'after2.jpg', NOW(), NOW(), 7, 2),
('Tattoo Design 3', 'Yet another cool tattoo design.', 200, NULL, 'after3.jpg', NOW(), NOW(), 3, 1),
('Tattoo Design 4', 'A really cool tattoo design.', 250, 'before4.jpg', 'after4.jpg', NOW(), NOW(), 2, 2),
('Tattoo Design 5', 'The coolest tattoo design.', 300, NULL, 'after5.jpg', NOW(), NOW(), 3, 1),
('Tattoo Design 6', 'A super cool tattoo design.', 350, 'before6.jpg', 'after6.jpg', NOW(), NOW(), 3, 2),
('Tattoo Design 7', 'An extremely cool tattoo design.', 400, NULL, 'after7.jpg', NOW(), NOW(), 3, 1),
('Tattoo Design 8', 'The most cool tattoo design.', 450, 'before8.jpg', 'after8.jpg', NOW(), NOW(), 7, 2),
('Tattoo Design 9', 'A very cool tattoo design.', 500, NULL, 'after9.jpg', NOW(), NOW(), 7, 1),
('Tattoo Design 10', 'The ultimate cool tattoo design.', 550, 'before10.jpg', 'after10.jpg', NOW(), NOW(), 7, 2);
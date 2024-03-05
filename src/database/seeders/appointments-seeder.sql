USE tattoo_studio;

INSERT INTO appointments (date, status, created_at, updated_at, user_id, artist_id, service_id, catalogue_id) VALUES
('2021-12-01 10:00:00', 'pending', NOW(), NOW(), 1, 1, 3, 1),
('2021-12-01 11:00:00', 'pending', NOW(), NOW(), 2, 1, 7, 2),
('2021-12-01 12:00:00', 'pending', NOW(), NOW(), 3, 2, 3, 3),
('2021-12-01 13:00:00', 'pending', NOW(), NOW(), 4, 2, 7, 4),
('2021-12-01 14:00:00', 'pending', NOW(), NOW(), 5, 1, 7, 5),
('2021-12-01 15:00:00', 'pending', NOW(), NOW(), 6, 1, 3, 6),
('2021-12-01 16:00:00', 'pending', NOW(), NOW(), 7, 2, 7, 7),
('2021-12-01 17:00:00', 'pending', NOW(), NOW(), 8, 2, 3, 8),
('2021-12-01 18:00:00', 'pending', NOW(), NOW(), 9, 1, 7, 9),
('2021-12-01 19:00:00', 'pending', NOW(), NOW(), 10, 1, 7, 10);

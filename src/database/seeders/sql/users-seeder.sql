USE tattoo_studio;

INSERT INTO users (name, surname, email, password, is_active, created_at, updated_at, role_id) VALUES 
('User1', 'Surname1', 'user1@example.com', '$10$T/gxJStI8kOS9INXzov5IOT8Pp8DzIa.UEKVDrTUVSFm1asPFYOuy', true, NOW(), NOW(), 1),
('User2', 'Surname2', 'user2@example.com', '$10$T/gxJStI8kOS9INXzov5IOT8Pp8DzIa.UEKVDrTUVSFm1asPFYOuy', true, NOW(), NOW(), 2),
('User3', NULL, 'user3@example.com', '$10$T/gxJStI8kOS9INXzov5IOT8Pp8DzIa.UEKVDrTUVSFm1asPFYOuy', true, NOW(), NOW(), 3),
('User4', 'Surname4', 'user4@example.com', '$10$T/gxJStI8kOS9INXzov5IOT8Pp8DzIa.UEKVDrTUVSFm1asPFYOuy', true, NOW(), NOW(), 4),
('User5', NULL, 'user5@example.com', '$10$T/gxJStI8kOS9INXzov5IOT8Pp8DzIa.UEKVDrTUVSFm1asPFYOuy', true, NOW(), NOW(), 1),
('User6', 'Surname6', 'user6@example.com', '$10$T/gxJStI8kOS9INXzov5IOT8Pp8DzIa.UEKVDrTUVSFm1asPFYOuy', true, NOW(), NOW(), 2),
('User7', 'Surname7', 'user7@example.com', '$10$T/gxJStI8kOS9INXzov5IOT8Pp8DzIa.UEKVDrTUVSFm1asPFYOuy', true, NOW(), NOW(), 3),
('User8', NULL, 'user8@example.com', '$10$T/gxJStI8kOS9INXzov5IOT8Pp8DzIa.UEKVDrTUVSFm1asPFYOuy', true, NOW(), NOW(), 4),
('User9', 'Surname9', 'user9@example.com', '$10$T/gxJStI8kOS9INXzov5IOT8Pp8DzIa.UEKVDrTUVSFm1asPFYOuy', true, NOW(), NOW(), 1),
('User10', 'Surname10', 'user10@example.com', '$10$T/gxJStI8kOS9INXzov5IOT8Pp8DzIa.UEKVDrTUVSFm1asPFYOuy', true, NOW(), NOW(), 2);
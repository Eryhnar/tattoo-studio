USE tattoo_studio;

INSERT INTO services (name, description, photo, created_at, updated_at) VALUES
('Tattoo from catalogue', 'Choose from one of our fantastic predesigned tattoos', 'https://example.com/photo1.jpg', NOW(), NOW()),
('Custom Tattoo', 'Have a design in mind? We can make that idea come to life. Our talented artists can help you get your ideal design on yourself', 'https://example.com/photo2.jpg', NOW(), NOW()),
('Custom UV Tattoo', 'Have you ever seen a tattoo like this? Checkout our unique ultraviolet tattoos. They will certainly set you apart at the club', 'https://example.com/photo2.jpg', NOW(), NOW()),
('Tattoo Restoration', 'Has that amazing tattoo lost its spark over the years? We can help bring back its colors.', 'https://example.com/photo3.jpg', NOW(), NOW()),
('Tattoo Removal', 'No longer feeling it? You broke up with that someone? No worries, we can work our magic and it will be like the tattoo was never there.', 'https://example.com/photo4.jpg', NOW(), NOW()),
('Piercing services', 'Want a new piercing? Come by and we will make it happen in no time.', NULL, NOW(), NOW()),
('Piercing Supply', 'We have a huge assortment of earrings and piercings. Check them out in our catalogue.', NULL, NOW(), NOW());

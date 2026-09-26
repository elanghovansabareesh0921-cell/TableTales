-- ====================================================================
-- TableTales Seed Data: Signature Venues & Experiential Dishes
-- ====================================================================

-- 1. Locations
INSERT INTO locations (id, name, address, city, lat, lng, hours, hero_image_url, description, tagline) VALUES
(
    'a1b2c3d4-e5f6-4a1b-8c2d-111111111111',
    'Aura Kyoto',
    '45 Higashiyama-ku, Gion',
    'Kyoto',
    35.0037,
    135.7772,
    '5:30 PM - 11:00 PM',
    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80',
    'A tranquil bamboo sanctuary where ancient kaiseki discipline converges with avant-garde fermentation and ambient incense.',
    'Whispers of smoke, moss, and umami in historic Gion.'
),
(
    'a1b2c3d4-e5f6-4a1b-8c2d-222222222222',
    'Osteria Luma',
    'Via de Tornabuoni 18',
    'Florence',
    43.7711,
    11.2505,
    '6:00 PM - 11:30 PM',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80',
    'Vaulted 14th-century brick cellar illuminated by hundreds of dripping beeswax candles, celebrating wood-fired Tuscan alchemy.',
    'Florentine candlelight, wild truffles, and bold Chianti memories.'
),
(
    'a1b2c3d4-e5f6-4a1b-8c2d-333333333333',
    'Fire & Salt Botanica',
    '890 Sonoma Highway',
    'Sonoma Valley',
    38.2919,
    -122.4580,
    '12:00 PM - 10:00 PM',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
    'Sun-drenched vineyard conservatory with live hearth flames, biodynamic heirloom botanicals, and live cellar pairings.',
    'Sunlit vine canopies, open-fire crackle, and regenerative earth.'
),
(
    'a1b2c3d4-e5f6-4a1b-8c2d-444444444444',
    'Casa Mistral',
    'Passeig del Born 24',
    'Barcelona',
    41.3851,
    2.1818,
    '7:00 PM - 1:00 AM',
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80',
    'Pulsing subterranean tapas lab with Mediterranean sea spray aromas, vibrant communal beats, and molecular seafood storytelling.',
    'Catalan coastal electricity, chilled vermouth, and ocean soul.'
)
ON CONFLICT (id) DO NOTHING;

-- 2. Menu Items with Sensory Notes and Origin Stories
INSERT INTO menu_items (id, location_id, name, description, sensory_notes, origin_story, price, dietary_tags, cuisine_region, serves_count, spice_level, image_url, is_signature) VALUES
(
    'b1111111-1111-1111-1111-111111111111',
    'a1b2c3d4-e5f6-4a1b-8c2d-111111111111',
    'Smoked Binchotan Wagyu Tataki',
    'A5 Miyazaki tenderloin seared over white oak coals, crowned with crispy garlic, smoked ponzu gel, and freshly grated Shizuoka wasabi.',
    '{"aroma": "Sweet smoldering oak charcoal, toasted sesame, citrus peel", "texture": "Velvety melt-in-mouth core with micro-crisp seared edges", "temperature": "Warm sear outside with a cool, tender interior", "plating": "Served over frosted black river stone with shiso blossoms"}'::jsonb,
    '{"region": "Miyazaki, Kyushu", "chef_notes": "Sourced from a 4th-generation ranch where cattle graze along volcanic spring pastures.", "cultural_context": "Honors the charcoal-masters of Kishu who have produced white binchotan for over 400 years."}'::jsonb,
    44.00,
    ARRAY['Nut-Free', 'Dairy-Free'],
    'Kyushu, Japan',
    2,
    1,
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    true
),
(
    'b2222222-2222-2222-2222-222222222222',
    'a1b2c3d4-e5f6-4a1b-8c2d-111111111111',
    'Golden Truffle Chawanmushi',
    'Silken dashi egg custard infused with winter black truffles, king oyster mushroom confit, and 24k gold leaf.',
    '{"aroma": "Earthy forest floor, warm kombu broth, delicate sweet mirin", "texture": "Cloud-like, delicate gelatinous softness that dissolves instantly", "temperature": "Steaming hot ceramic cup with cedar lid", "plating": "Hand-carved wabi-sabi black raku ceramic bowl"}'::jsonb,
    '{"region": "Kyoto Basin", "chef_notes": "The dashi is steeped for 48 hours in cold Hokkaido spring water using 3-year aged Rishiri kelp.", "cultural_context": "Traditional Japanese comfort elevated to imperial tea ceremony elegance."}'::jsonb,
    28.00,
    ARRAY['Vegetarian', 'Nut-Free', 'Gluten-Free'],
    'Kansai, Japan',
    1,
    0,
    'https://images.unsplash.com/photo-1615361200141-f45040f367be?auto=format&fit=crop&w=1200&q=80',
    true
),
(
    'b3333333-3333-3333-3333-333333333333',
    'a1b2c3d4-e5f6-4a1b-8c2d-222222222222',
    'Hand-Rolled Truffle Tajarin',
    'Forty-yolk Piedmontese ribbon pasta tossed in cultured Alpine butter, 36-month Parmigiano Reggiano, and freshly shaved Norcia black truffles.',
    '{"aroma": "Intense damp earth, hazelnut brown butter, aged cheese", "texture": "Al dente golden ribbons with a rich, glossy emulsion cling", "temperature": "Hot from the copper pan directly onto heated porcelain", "plating": "Mounded high and shaved tableside under low candlelight"}'::jsonb,
    '{"region": "Langhe, Piedmont", "chef_notes": "Our pasta maker Lucia kneads the dough by hand using eggs from heritage hens fed on flaxseed.", "cultural_context": "The celebratory pasta of northern harvest feasts dating back to the Renaissance."}'::jsonb,
    38.00,
    ARRAY['Vegetarian', 'Nut-Free'],
    'Piedmont, Italy',
    2,
    0,
    'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=1200&q=80',
    true
),
(
    'b4444444-4444-4444-4444-444444444444',
    'a1b2c3d4-e5f6-4a1b-8c2d-222222222222',
    'Wood-Fired Bistecca alla Fiorentina',
    'Dry-aged Chianina T-bone seared over Tuscan olive and oak embers, finished with Maldon sea salt, rosemary brush, and peppery Novello oil.',
    '{"aroma": "Charred timber embers, blooming rosemary, deep caramel crust", "texture": "Crisp mahogany exterior yielding to tender, ruby-rare marbling", "temperature": "Sizzling hot platter, medium-rare center", "plating": "Carved on a rustic olivewood board with grilled lemon halves"}'::jsonb,
    '{"region": "Val di Chiana, Tuscany", "chef_notes": "Dry-aged for 45 days in our temperature-controlled Himalayan salt brick chamber.", "cultural_context": "The sacred centerpiece of Tuscan conviviality, meant for communal sharing and loud laughter."}'::jsonb,
    92.00,
    ARRAY['Gluten-Free', 'Nut-Free', 'Dairy-Free'],
    'Tuscany, Italy',
    3,
    0,
    'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1200&q=80',
    true
),
(
    'b5555555-5555-5555-5555-555555555555',
    'a1b2c3d4-e5f6-4a1b-8c2d-333333333333',
    'Ember-Roasted Maitake & Hazelnut Mole',
    'Wild Sonoma foraged hen-of-the-woods mushrooms roasted over almond wood, draped in toasted hazelnut mole, pomegranate seeds, and purslane.',
    '{"aroma": "Smoky cocoa, roasted hazelnuts, forest pine, tart fruit", "texture": "Crispy feathered mushroom frills with meaty stem chew and velvety sauce", "temperature": "Warm from the embers with a cool herb garnish", "plating": "Earthy speckled stoneware with dark glossy mole swirls"}'::jsonb,
    '{"region": "Northern California Coast", "chef_notes": "The mole incorporates 22 ingredients including roasted Anaheim peppers and Sonoma estate hazelnuts.", "cultural_context": "A modern homage bridging Oaxaca culinary heritage with coastal redwood terroir."}'::jsonb,
    32.00,
    ARRAY['Vegan', 'Gluten-Free', 'Dairy-Free'],
    'California Coast',
    2,
    2,
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
    false
),
(
    'b6666666-6666-6666-6666-666666666666',
    'a1b2c3d4-e5f6-4a1b-8c2d-444444444444',
    'Charred Octopus & Saffron Aioli',
    'Galician octopus slow-braised then flame-charred on the plancha, over smoked paprika potato silk, finger lime pearls, and squid ink crisps.',
    '{"aroma": "Sea minerals, sweet pimentón de la Vera, charred tentacles", "texture": "Tender yielding octopus with a crunchy caramelized crust and pillowy potato", "temperature": "Hot off the plancha with a chilled citrus burst", "plating": "Deep azure ceramic mimicking the Mediterranean abyss"}'::jsonb,
    '{"region": "Rías Baixas, Galicia", "chef_notes": "Tenderized using traditional copper kettles before finishing over open vine cutting fires.", "cultural_context": "The signature pulse of coastal Spanish maritime celebrations."}'::jsonb,
    36.00,
    ARRAY['Gluten-Free', 'Nut-Free', 'Dairy-Free'],
    'Catalonia, Spain',
    2,
    2,
    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80',
    true
)
ON CONFLICT (id) DO NOTHING;

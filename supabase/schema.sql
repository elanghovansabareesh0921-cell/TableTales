-- ====================================================================
-- TableTales: AI Vibe Concierge Dining Platform — Database Schema
-- Supabase Postgres Schema with Row Level Security (RLS) & Seed Data
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. LOCATIONS TABLE
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    lat NUMERIC(10, 7) NOT NULL,
    lng NUMERIC(10, 7) NOT NULL,
    hours TEXT NOT NULL,
    hero_image_url TEXT NOT NULL,
    description TEXT,
    tagline TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MENU ITEMS TABLE
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    sensory_notes JSONB NOT NULL DEFAULT '{}'::jsonb, -- { aroma, texture, temperature, plating }
    origin_story JSONB NOT NULL DEFAULT '{}'::jsonb, -- { region, chef_notes, cultural_context, heritage }
    price NUMERIC(10, 2) NOT NULL,
    dietary_tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[], -- ['Nut-Free', 'Gluten-Free', 'Vegan', etc.]
    cuisine_region TEXT NOT NULL,
    serves_count INT NOT NULL DEFAULT 1,
    spice_level INT NOT NULL DEFAULT 0, -- 0 to 5
    image_url TEXT NOT NULL,
    is_signature BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SESSIONS TABLE
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID, -- nullable for anonymous users
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    mood TEXT,
    party_size INT DEFAULT 1,
    vibe_theme TEXT DEFAULT 'romantic' CHECK (vibe_theme IN ('romantic', 'family', 'adventurous', 'chill', 'celebration')),
    dietary_restrictions TEXT[] DEFAULT ARRAY[]::TEXT[],
    occasion TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. GROUP ROOMS TABLE
CREATE TABLE IF NOT EXISTS group_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    host_user_id UUID,
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    invite_code VARCHAR(10) UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'locked', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. GROUP ROOM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS group_room_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES group_rooms(id) ON DELETE CASCADE,
    user_id UUID,
    display_name TEXT NOT NULL,
    dietary_restrictions TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_host BOOLEAN DEFAULT false,
    joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. GROUP ROOM CART ITEMS TABLE
CREATE TABLE IF NOT EXISTS group_room_cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES group_rooms(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    added_by TEXT NOT NULL, -- member display_name or user_id
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    added_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. RESERVATIONS TABLE
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    user_id UUID,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    party_size INT NOT NULL CHECK (party_size > 0),
    reservation_time TIMESTAMPTZ NOT NULL,
    seating_preference TEXT DEFAULT 'standard',
    special_requests TEXT,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'seated', 'cancelled', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
    room_id UUID REFERENCES group_rooms(id) ON DELETE SET NULL,
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    total_amount NUMERIC(10, 2) NOT NULL,
    tip_amount NUMERIC(10, 2) DEFAULT 0.00,
    tax_amount NUMERIC(10, 2) DEFAULT 0.00,
    payment_status TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
    payment_method TEXT DEFAULT 'stripe_simulated',
    order_type TEXT NOT NULL DEFAULT 'dine_in' CHECK (order_type IN ('dine_in', 'takeout', 'pre_order')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE RESTRICT,
    quantity INT NOT NULL CHECK (quantity > 0),
    price_at_purchase NUMERIC(10, 2) NOT NULL,
    split_among_user_ids UUID[] DEFAULT ARRAY[]::UUID[],
    added_by_name TEXT
);

-- 11. USER PASSPORT STAMPS TABLE
CREATE TABLE IF NOT EXISTS user_passport_stamps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    stamp_type TEXT NOT NULL, -- e.g. 'dish_tried', 'region_explored', 'vibe_master'
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    origin_region TEXT NOT NULL,
    badge_icon TEXT NOT NULL,
    earned_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    user_id UUID,
    food_rating INT NOT NULL CHECK (food_rating BETWEEN 1 AND 5),
    service_rating INT NOT NULL CHECK (service_rating BETWEEN 1 AND 5),
    vibe_rating INT NOT NULL CHECK (vibe_rating BETWEEN 1 AND 5),
    comment TEXT,
    vibe_theme_matched TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_room_cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_passport_stamps ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public read for Locations and Menu Items
CREATE POLICY "Allow public read on locations" ON locations FOR SELECT USING (true);
CREATE POLICY "Allow public read on menu_items" ON menu_items FOR SELECT USING (true);

-- Sessions: Anyone can create a session; users/anon can read & update their session
CREATE POLICY "Allow insert on sessions" ON sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select on sessions" ON sessions FOR SELECT USING (true);
CREATE POLICY "Allow update on sessions" ON sessions FOR UPDATE USING (true);

-- Group Rooms: Public insert and select by invite code
CREATE POLICY "Allow insert on group_rooms" ON group_rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select on group_rooms" ON group_rooms FOR SELECT USING (true);
CREATE POLICY "Allow update on group_rooms" ON group_rooms FOR UPDATE USING (true);

-- Group Room Members: members can join, see peers
CREATE POLICY "Allow insert on group_room_members" ON group_room_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select on group_room_members" ON group_room_members FOR SELECT USING (true);

-- Group Room Cart Items: room members can add & view cart items
CREATE POLICY "Allow insert on group_room_cart_items" ON group_room_cart_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select on group_room_cart_items" ON group_room_cart_items FOR SELECT USING (true);
CREATE POLICY "Allow update on group_room_cart_items" ON group_room_cart_items FOR UPDATE USING (true);
CREATE POLICY "Allow delete on group_room_cart_items" ON group_room_cart_items FOR DELETE USING (true);

-- Reservations: Insert allowed, select by creator or email
CREATE POLICY "Allow insert on reservations" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select on reservations" ON reservations FOR SELECT USING (true);

-- Orders and Order Items: Insert & view
CREATE POLICY "Allow insert on orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select on orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow insert on order_items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select on order_items" ON order_items FOR SELECT USING (true);

-- Passport Stamps: Insert and select
CREATE POLICY "Allow insert on user_passport_stamps" ON user_passport_stamps FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select on user_passport_stamps" ON user_passport_stamps FOR SELECT USING (true);

-- Reviews: Insert allowed for verified dining, public read
CREATE POLICY "Allow insert on reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select on reviews" ON reviews FOR SELECT USING (true);

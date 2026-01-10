
-- ==========================================
-- 16. MARKETPLACE (items)
-- ==========================================
CREATE TABLE IF NOT EXISTS marketplace_items (
    item_id SERIAL PRIMARY KEY,
    seller_id INTEGER REFERENCES users(user_id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    condition VARCHAR(50) DEFAULT 'USED',
    image_url VARCHAR(255),
    status VARCHAR(50) DEFAULT 'AVAILABLE',
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO marketplace_items (seller_id, name, description, price, condition, image_url, status, category) VALUES
(2, 'Lều cắm trại 4 người', 'Lều chống mưa tốt, mới sử dụng 1 lần', 1500000, 'LIKE_NEW', 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800', 'AVAILABLE', 'GEAR'),
(3, 'Giày trekking size 42', 'Giày The North Face chính hãng, hơi mòn đế', 800000, 'USED', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800', 'AVAILABLE', 'CLOTHING'),
(1, 'Ba lô 50L', 'Ba lô leo núi chuyên dụng, có đai trợ lực', 1200000, 'LIKE_NEW', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800', 'AVAILABLE', 'GEAR'),
(4, 'Đèn pin đội đầu', 'Đèn siêu sáng, pin trâu', 200000, 'NEW', 'https://images.unsplash.com/photo-1563294025-b8252274488b?q=80&w=800', 'SOLD', 'GEAR');

-- ==========================================
-- 17. GROUPS
-- ==========================================
CREATE TABLE IF NOT EXISTS groups (
    group_id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(user_id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    trail_id INTEGER REFERENCES trails(trail_id),
    privacy VARCHAR(50) DEFAULT 'PUBLIC',
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO groups (owner_id, name, description, trail_id, privacy, image_url) VALUES
(1, 'Hội đam mê Fansipan', 'Nhóm dành cho những người yêu thích leo Fansipan', 1, 'PUBLIC', 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800'),
(2, 'Trekking Đà Lạt', 'Cùng nhau khám phá những cung đường đẹp tại Đà Lạt', 2, 'PUBLIC', 'https://images.unsplash.com/photo-1527838832700-50592524d78b?q=80&w=800'),
(3, 'Cộng đồng Trekker Sài Gòn', 'Nơi chia sẻ kinh nghiệm và rủ rê đi trekking', NULL, 'PUBLIC', 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=800');

-- ==========================================
-- 18. GROUP MEMBERS
-- ==========================================
CREATE TABLE IF NOT EXISTS group_members (
    group_id INTEGER REFERENCES groups(group_id),
    user_id INTEGER REFERENCES users(user_id),
    role VARCHAR(50) DEFAULT 'MEMBER',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (group_id, user_id)
);

INSERT INTO group_members (group_id, user_id, role) VALUES
(1, 1, 'ADMIN'), (1, 2, 'MEMBER'), (1, 3, 'MEMBER'),
(2, 2, 'ADMIN'), (2, 4, 'MEMBER'),
(3, 3, 'ADMIN'), (3, 1, 'MEMBER'), (3, 5, 'MODERATOR');

-- ==========================================
-- 19. CHALLENGES
-- ==========================================
CREATE TABLE IF NOT EXISTS challenges (
    challenge_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    goal INTEGER NOT NULL,
    unit VARCHAR(50),
    image_url VARCHAR(255),
    start_date DATE,
    end_date DATE,
    type VARCHAR(50) DEFAULT 'DISTANCE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO challenges (title, description, goal, unit, image_url, start_date, end_date, type) VALUES
('Thử thách 50km Tháng 6', 'Hoàn thành 50km đi bộ/leo núi trong tháng 6', 50, 'km', 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=800', '2024-06-01', '2024-06-30', 'DISTANCE'),
('Chinh phục 3 Đỉnh Núi', 'Leo 3 đỉnh núi bất kỳ trong 3 tháng', 3, 'peaks', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800', '2024-06-01', '2024-08-31', 'TRAILS_COMPLETED'),
('Thử thách Leo Cao 1000m', 'Đạt tổng độ cao leo được là 1000m', 1000, 'm', 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=800', '2024-07-01', '2024-07-15', 'ELEVATION');

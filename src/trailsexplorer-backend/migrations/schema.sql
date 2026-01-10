-- 1. KÍCH HOẠT EXTENSIONS
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ĐỊNH NGHĨA CÁC KIỂU DỮ LIỆU ENUM
CREATE TYPE user_role AS ENUM ('ADMIN', 'USER', 'MODERATOR');
CREATE TYPE difficulty_level AS ENUM ('EASY', 'MODERATE', 'HARD');
CREATE TYPE trip_status AS ENUM ('PLANNING', 'PLANNED', 'ONGOING', 'COMPLETED', 'CANCELLED');
CREATE TYPE item_status AS ENUM ('DRAFT', 'AVAILABLE', 'RESERVED', 'SOLD', 'HIDDEN');
CREATE TYPE poi_type AS ENUM ('CAMPING', 'WATER_SOURCE', 'VIEWPOINT', 'DANGER', 'CHECKPOINT', 'RESTROOM', 'FOOD', 'LODGING');
CREATE TYPE contribution_status AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED');
CREATE TYPE alert_severity AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE media_type AS ENUM ('IMAGE', 'VIDEO', 'VOICE', 'TEXT_NOTE');
CREATE TYPE fitness_level AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');
CREATE TYPE challenge_type AS ENUM ('DISTANCE', 'ELEVATION', 'TRAIL_COUNT', 'DURATION', 'STREAK');
CREATE TYPE weather_condition AS ENUM ('CLEAR', 'PARTLY_CLOUDY', 'CLOUDY', 'RAIN', 'STORM', 'SNOW', 'FOG');

-- ==========================================
-- A. QUẢN LÝ NGƯỜI DÙNG (USER MANAGEMENT)
-- ==========================================

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    bio TEXT,
    
    -- Role và trạng thái
    role user_role DEFAULT 'USER',
    is_active BOOLEAN DEFAULT TRUE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    
    -- Hình đại diện
    avatar_url TEXT,
    cover_image_url TEXT,
    
    -- Thống kê cá nhân (Feature #7)
    total_distance_km DECIMAL(10, 2) DEFAULT 0,
    total_elevation_gain DECIMAL(10, 2) DEFAULT 0,
    total_trips_completed INT DEFAULT 0,
    total_trails_conquered INT DEFAULT 0,
    longest_distance DECIMAL(10, 2) DEFAULT 0,
    highest_altitude INT DEFAULT 0,
    
    -- Thông tin thể lực và sở thích (Feature #27)
    fitness_level fitness_level DEFAULT 'BEGINNER',
    average_pace DECIMAL(5, 2), -- phút/km
    preferred_distance_range JSONB DEFAULT '{"min": 5, "max": 20}'::jsonb,
    preferred_difficulties JSONB DEFAULT '["EASY", "MODERATE"]'::jsonb,
    interests JSONB DEFAULT '[]'::jsonb, -- ["camping", "photography", "bird_watching"]
    
    -- Vị trí
    home_city VARCHAR(100),
    home_country VARCHAR(100),
    
    -- Cài đặt
    settings JSONB DEFAULT '{
        "notifications": {
            "weather_alerts": true,
            "safety_alerts": true,
            "community_updates": true,
            "challenge_updates": true
        },
        "privacy": {
            "show_location": "friends_only",
            "show_stats": "public",
            "show_trips": "friends_only"
        },
        "units": "metric"
    }'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_location GEOMETRY(Point, 4326),
    last_location_updated TIMESTAMP WITH TIME ZONE
);

-- Bảng lưu token đăng nhập (JWT)
CREATE TABLE user_auth_tokens (
    token_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    token_type VARCHAR(20) CHECK (token_type IN ('ACCESS', 'REFRESH', 'RESET_PASSWORD')),
    token_value TEXT NOT NULL,
    device_info JSONB,
    ip_address INET,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bảng theo dõi bạn bè (Feature #12)
CREATE TABLE user_follows (
    follower_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    followed_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, followed_id),
    CONSTRAINT no_self_follow CHECK (follower_id != followed_id)
);

-- Bảng danh mục cung đường (Feature #X)
CREATE TABLE trail_categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'Beginner', 'Intermediate', 'Expert'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- B. CUNG ĐƯỜNG & BẢN ĐỒ (TRAILS & MAPS)
-- ==========================================

CREATE TABLE trails (
    trail_id SERIAL PRIMARY KEY,
    category_id INT REFERENCES trail_categories(category_id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    
    -- Thông số kỹ thuật
    difficulty difficulty_level NOT NULL,
    length_km DECIMAL(6, 2) NOT NULL,
    estimated_duration_hours INT NOT NULL,
    elevation_gain INT,
    max_altitude INT,
    min_altitude INT,
    elevation_profile JSONB, -- Lưu profile độ cao dạng mảng
    
    -- Vị trí địa lý
    location_region VARCHAR(100) NOT NULL,
    location_province VARCHAR(100),
    location_district VARCHAR(100),
    location_coordinates GEOMETRY(Point, 4326), -- Trung tâm của trail
    
    -- Dữ liệu đường đi
    path_geometry GEOMETRY(LineString, 4326),
    start_point GEOMETRY(Point, 4326) NOT NULL,
    end_point GEOMETRY(Point, 4326) NOT NULL,
    
    -- Thông tin thời tiết và mùa
    best_season VARCHAR(100),
    weather_notes TEXT,
    
    -- Đánh giá và xếp hạng
    avg_rating DECIMAL(3, 2) DEFAULT 0,
    total_reviews INT DEFAULT 0,
    total_favorites INT DEFAULT 0,
    total_completions INT DEFAULT 0,
    
    -- Trạng thái và xác minh
    is_verified BOOLEAN DEFAULT FALSE,
    verification_status VARCHAR(20) DEFAULT 'UNVERIFIED',
    verified_by INT REFERENCES users(user_id),
    verified_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    tags JSONB DEFAULT '[]'::jsonb,
    features JSONB DEFAULT '[]'::jsonb, -- ["waterfall", "cave", "lake", "summit"]
    permit_required BOOLEAN DEFAULT FALSE,
    permit_info TEXT,
    
    -- Timestamps
    created_by INT REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_by INT REFERENCES users(user_id),
    
    -- Đánh chỉ mục không gian
    CONSTRAINT valid_trail CHECK (length_km > 0 AND estimated_duration_hours > 0)
);

-- Bảng điểm quan trọng trên đường (POIs - Feature #29)
CREATE TABLE trail_pois (
    poi_id SERIAL PRIMARY KEY,
    trail_id INT REFERENCES trails(trail_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type poi_type NOT NULL,
    
    -- Vị trí
    location GEOMETRY(Point, 4326) NOT NULL,
    distance_from_start_km DECIMAL(6, 2),
    elevation INT,
    
    -- Metadata
    is_essential BOOLEAN DEFAULT FALSE, -- Điểm bắt buộc phải ghé
    has_water BOOLEAN DEFAULT FALSE,
    has_shelter BOOLEAN DEFAULT FALSE,
    has_phone_signal BOOLEAN DEFAULT FALSE,
    
    -- Hình ảnh
    images JSONB DEFAULT '[]'::jsonb,
    
    -- Trạng thái
    is_verified BOOLEAN DEFAULT FALSE,
    reported_issues INT DEFAULT 0,
    
    -- Timestamps
    created_by INT REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bảng lưu hình ảnh cung đường
CREATE TABLE trail_images (
    image_id SERIAL PRIMARY KEY,
    trail_id INT REFERENCES trails(trail_id) ON DELETE CASCADE,
    uploaded_by INT REFERENCES users(user_id),
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    caption VARCHAR(255),
    is_featured BOOLEAN DEFAULT FALSE,
    taken_at TIMESTAMP WITH TIME ZONE,
    location GEOMETRY(Point, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- C. BẢN ĐỒ OFFLINE (OFFLINE MAPS - Feature #5)
-- ==========================================

CREATE TABLE offline_map_regions (
    region_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    bounding_box GEOMETRY(Polygon, 4326) NOT NULL,
    zoom_levels JSONB NOT NULL, -- Các mức zoom hỗ trợ
    size_mb DECIMAL(8, 2) NOT NULL,
    version VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_offline_maps (
    download_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    region_id INT REFERENCES offline_map_regions(region_id),
    
    -- Thông tin tải về
    download_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP WITH TIME ZONE,
    access_count INT DEFAULT 0,
    
    -- Trạng thái
    is_downloaded BOOLEAN DEFAULT TRUE,
    download_progress INT DEFAULT 100,
    file_path TEXT,
    file_size_mb DECIMAL(8, 2),
    
    -- Metadata
    device_id VARCHAR(255),
    app_version VARCHAR(20),
    
    UNIQUE(user_id, region_id)
);

-- ==========================================
-- D. LẬP KẾ HOẠCH & CHUYẾN ĐI (PLANNING - Feature #16, #24)
-- ==========================================

CREATE TABLE trips (
    trip_id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4(),
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    trail_id INT REFERENCES trails(trail_id) ON DELETE SET NULL,
    
    -- Thông tin chuyến đi
    name VARCHAR(200) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    visibility VARCHAR(20) DEFAULT 'PUBLIC' CHECK (visibility IN ('PRIVATE', 'FRIENDS_ONLY', 'PUBLIC')),
    
    -- Thời gian
    planned_start_date TIMESTAMP WITH TIME ZONE,
    planned_end_date TIMESTAMP WITH TIME ZONE,
    actual_start_date TIMESTAMP WITH TIME ZONE,
    actual_end_date TIMESTAMP WITH TIME ZONE,
    status trip_status DEFAULT 'PLANNING',
    
    -- Thông tin nhóm
    is_group_trip BOOLEAN DEFAULT FALSE,
    group_size INT DEFAULT 1,
    
    -- Lịch trình AI-generated (Feature #16)
    ai_generated_itinerary JSONB,
    custom_itinerary JSONB,
    itinerary_notes TEXT,
    
    -- Thông tin thời tiết
    weather_snapshot JSONB,
    weather_forecast JSONB,
    
    -- Thống kê
    estimated_distance_km DECIMAL(8, 2),
    estimated_duration_hours DECIMAL(6, 2),
    actual_distance_km DECIMAL(8, 2),
    actual_duration_hours DECIMAL(6, 2),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Checklist trang bị (Feature #21)
CREATE TABLE trip_checklists (
    checklist_id SERIAL PRIMARY KEY,
    trip_id INT REFERENCES trips(trip_id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL CHECK (category IN ('CLOTHING', 'FOOD_WATER', 'SHELTER', 'NAVIGATION', 'SAFETY', 'HYGIENE', 'OTHER')),
    item_name VARCHAR(255) NOT NULL,
    quantity INT DEFAULT 1,
    weight_grams INT,
    is_essential BOOLEAN DEFAULT FALSE,
    is_packed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- E. NHẬT KÝ HÀNH TRÌNH & TRACKING (Feature #4, #11, #22)
-- ==========================================

CREATE TABLE track_logs (
    track_id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4(),
    trip_id INT REFERENCES trips(trip_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    
    -- Thông tin tracking
    device_id VARCHAR(255),
    device_model VARCHAR(100),
    app_version VARCHAR(20),
    
    -- Thời gian
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    paused_duration_seconds INT DEFAULT 0,
    
    -- Dữ liệu đường đi
    recorded_path GEOMETRY(LineString, 4326),
    simplified_path GEOMETRY(LineString, 4326), -- Đường đi đã được simplify
    bounding_box GEOMETRY(Polygon, 4326),
    
    -- Thống kê
    total_distance_km DECIMAL(10, 2),
    average_speed_kmh DECIMAL(5, 2),
    max_speed_kmh DECIMAL(5, 2),
    average_pace_min_per_km DECIMAL(5, 2),
    
    -- Độ cao
    elevation_gain INT,
    elevation_loss INT,
    max_elevation INT,
    min_elevation INT,
    
    -- Pin và hiệu suất
    battery_start_percent INT,
    battery_end_percent INT,
    battery_saver_mode BOOLEAN DEFAULT FALSE, -- Feature #26
    
    -- Metadata
    weather_conditions JSONB,
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_track_time CHECK (end_time IS NULL OR end_time > start_time)
);

-- Điểm theo dõi chi tiết (GPS points)
CREATE TABLE track_points (
    point_id BIGSERIAL, -- Bỏ 'PRIMARY KEY' ở đây
    track_id INT REFERENCES track_logs(track_id) ON DELETE CASCADE,
    
    -- Vị trí
    location GEOMETRY(Point, 4326) NOT NULL,
    altitude DECIMAL(8, 2),
    accuracy DECIMAL(5, 2),
    
    -- Thời gian
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Chuyển động
    speed_kmh DECIMAL(5, 2),
    bearing DECIMAL(5, 2),
    
    -- Metadata
    is_paused BOOLEAN DEFAULT FALSE,
    battery_percent INT,
    signal_strength INT,

    -- ĐỊNH NGHĨA KHÓA CHÍNH MỚI TẠI ĐÂY
    -- Phải bao gồm cả cột point_id và recorded_at
    PRIMARY KEY (point_id, recorded_at)

) PARTITION BY RANGE (recorded_at);

-- Tạo partition (Giữ nguyên)
CREATE TABLE track_points_2024 PARTITION OF track_points
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE track_points_2025 PARTITION OF track_points
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- Tạo Index phụ (Sửa lỗi cú pháp Index từ câu hỏi trước)
CREATE INDEX idx_track_points_track ON track_points (track_id, recorded_at);

-- Media trong hành trình (Feature #4, #22)
CREATE TABLE trip_media (
    media_id SERIAL PRIMARY KEY,
    track_id INT REFERENCES track_logs(track_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    
    -- Loại media
    media_type media_type NOT NULL,
    file_url TEXT NOT NULL,
    thumbnail_url TEXT,
    file_size_bytes BIGINT,
    duration_seconds INT, -- Cho video/audio
    
    -- Vị trí và thời gian
    location GEOMETRY(Point, 4326),
    recorded_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    caption TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    is_favorite BOOLEAN DEFAULT FALSE,
    
    -- Xử lý AI
    ai_generated_caption TEXT,
    ai_tags JSONB DEFAULT '[]'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- F. AN TOÀN & CẢNH BÁO (SAFETY - Feature #9, #12, #17)
-- ==========================================

-- Cảnh báo chung
CREATE TABLE safety_alerts (
    alert_id SERIAL PRIMARY KEY,
    
    -- Thông tin cảnh báo
    alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('WEATHER', 'LANDSLIDE', 'FLOOD', 'FIRE', 'TRAIL_CLOSURE', 'WILDLIFE', 'SOS', 'OTHER')),
    severity alert_severity NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Vị trí
    location GEOMETRY(Point, 4326),
    affected_radius_meters INT DEFAULT 1000,
    affected_trail_ids INT[], -- Danh sách trail bị ảnh hưởng
    
    -- Thời gian
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    effective_from TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Nguồn
    source VARCHAR(50) CHECK (source IN ('SYSTEM', 'ADMIN', 'USER_REPORT', 'GOVERNMENT', 'WEATHER_API')),
    source_url TEXT,
    confidence_level INT CHECK (confidence_level BETWEEN 1 AND 100),
    
    -- Metadata
    instructions JSONB, -- Hướng dẫn xử lý
    contact_info JSONB,
    
    -- Người tạo
    created_by INT REFERENCES users(user_id),
    verified_by INT REFERENCES users(user_id),
    verified_at TIMESTAMP WITH TIME ZONE
);

-- Người dùng nhận cảnh báo
CREATE TABLE user_received_alerts (
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    alert_id INT REFERENCES safety_alerts(alert_id) ON DELETE CASCADE,
    
    -- Trạng thái
    received_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP WITH TIME ZONE,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    dismissed_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    delivery_method VARCHAR(20) CHECK (delivery_method IN ('PUSH', 'IN_APP', 'EMAIL', 'SMS')),
    delivery_status VARCHAR(20) CHECK (delivery_status IN ('PENDING', 'SENT', 'FAILED', 'DELIVERED')),
    
    PRIMARY KEY (user_id, alert_id)
);

-- SOS và emergency
CREATE TABLE emergency_contacts (
    contact_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    
    -- Thông tin liên hệ
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    relationship VARCHAR(50),
    
    -- Ưu tiên
    priority INT DEFAULT 1 CHECK (priority BETWEEN 1 AND 5),
    is_primary BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    can_receive_alerts BOOLEAN DEFAULT TRUE,
    alert_methods JSONB DEFAULT '["SMS"]'::jsonb,
    
    UNIQUE(user_id, phone)
);

-- Checkpoint an toàn (Feature #17)
CREATE TABLE safety_checkpoints (
    checkpoint_id SERIAL PRIMARY KEY,
    trail_id INT REFERENCES trails(trail_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Vị trí
    location GEOMETRY(Point, 4326) NOT NULL,
    distance_from_start_km DECIMAL(6, 2),
    
    -- Loại checkpoint
    checkpoint_type VARCHAR(30) CHECK (checkpoint_type IN ('MANDATORY', 'RECOMMENDED', 'EMERGENCY', 'REST')),
    check_in_required BOOLEAN DEFAULT FALSE,
    
    -- Thông tin liên lạc
    has_phone_signal BOOLEAN,
    emergency_contact TEXT,
    
    -- Metadata
    estimated_time_from_previous_hours DECIMAL(4, 2),
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Log check-in tại checkpoint
CREATE TABLE checkpoint_logs (
    log_id SERIAL PRIMARY KEY,
    checkpoint_id INT REFERENCES safety_checkpoints(checkpoint_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    trip_id INT REFERENCES trips(trip_id) ON DELETE CASCADE,
    
    -- Thời gian
    planned_checkin_time TIMESTAMP WITH TIME ZONE,
    actual_checkin_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Trạng thái
    status VARCHAR(20) CHECK (status IN ('ON_TIME', 'EARLY', 'LATE', 'MISSED', 'CANCELLED')),
    notes TEXT,
    
    -- Vị trí thực tế
    actual_location GEOMETRY(Point, 4326),
    location_accuracy DECIMAL(5, 2),
    
    -- Metadata
    battery_percent INT,
    signal_strength INT,
    weather_at_checkin JSONB,
    
    UNIQUE(checkpoint_id, user_id, trip_id)
);

-- ==========================================
-- G. CỘNG ĐỒNG & MẠNG XÃ HỘI (COMMUNITY - Feature #3, #12, #18, #19)
-- ==========================================

-- Bài đăng trên feed (Feature #12)
CREATE TABLE community_posts (
    post_id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4(),
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    
    -- Nội dung
    content_type VARCHAR(20) CHECK (content_type IN ('TEXT', 'PHOTO', 'VIDEO', 'TRIP_REPORT', 'TRAIL_REVIEW', 'QUESTION')),
    title VARCHAR(200),
    content TEXT,
    
    -- Media
    media_urls JSONB DEFAULT '[]'::jsonb,
    trail_id INT REFERENCES trails(trail_id) ON DELETE SET NULL,
    trip_id INT REFERENCES trips(trip_id) ON DELETE SET NULL,
    
    -- Tương tác
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    share_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    
    -- Quyền riêng tư
    visibility VARCHAR(20) DEFAULT 'PUBLIC' CHECK (visibility IN ('PRIVATE', 'FRIENDS_ONLY', 'PUBLIC', 'GROUP')),
    
    -- Metadata
    tags JSONB DEFAULT '[]'::jsonb,
    location GEOMETRY(Point, 4326),
    
    -- Moderation
    is_published BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    requires_moderation BOOLEAN DEFAULT FALSE,
    moderated_by INT REFERENCES users(user_id),
    moderated_at TIMESTAMP WITH TIME ZONE,
    moderation_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bình luận
CREATE TABLE post_comments (
    comment_id SERIAL PRIMARY KEY,
    post_id INT REFERENCES community_posts(post_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    parent_comment_id INT REFERENCES post_comments(comment_id) ON DELETE CASCADE,
    
    -- Nội dung
    content TEXT NOT NULL,
    
    -- Tương tác
    like_count INT DEFAULT 0,
    
    -- Metadata
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Thích bài viết/bình luận
CREATE TABLE post_likes (
    like_id SERIAL PRIMARY KEY,
    post_id INT REFERENCES community_posts(post_id) ON DELETE CASCADE,
    comment_id INT REFERENCES post_comments(comment_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    
    -- Metadata
    reaction_type VARCHAR(20) DEFAULT 'LIKE' CHECK (reaction_type IN ('LIKE', 'LOVE', 'WOW', 'SAD', 'ANGRY')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ràng buộc: chỉ thích post HOẶC comment
    CONSTRAINT chk_like_target CHECK (
        (post_id IS NOT NULL AND comment_id IS NULL) OR
        (post_id IS NULL AND comment_id IS NOT NULL)
    ),
    UNIQUE(user_id, post_id, comment_id)
);

-- Nhóm (Feature #19)
CREATE TABLE user_groups (
    group_id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4(),
    
    -- Thông tin nhóm
    name VARCHAR(100) NOT NULL,
    description TEXT,
    avatar_url TEXT,
    cover_image_url TEXT,
    
    -- Cài đặt
    group_type VARCHAR(20) DEFAULT 'PUBLIC' CHECK (group_type IN ('PUBLIC', 'PRIVATE', 'INVITE_ONLY')),
    membership_approval_required BOOLEAN DEFAULT FALSE,
    
    -- Thống kê
    member_count INT DEFAULT 0,
    post_count INT DEFAULT 0,
    
    -- Metadata
    tags JSONB DEFAULT '[]'::jsonb,
    rules TEXT,
    
    -- Người tạo
    created_by INT REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Thành viên nhóm
CREATE TABLE group_members (
    group_id INT REFERENCES user_groups(group_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    
    -- Vai trò
    role VARCHAR(20) DEFAULT 'MEMBER' CHECK (role IN ('OWNER', 'ADMIN', 'MODERATOR', 'MEMBER')),
    
    -- Trạng thái
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('PENDING', 'ACTIVE', 'MUTED', 'BANNED')),
    
    -- Metadata
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    invited_by INT REFERENCES users(user_id),
    last_seen_at TIMESTAMP WITH TIME ZONE,
    
    -- Vị trí (cho tracking nhóm)
    last_location GEOMETRY(Point, 4326),
    last_location_updated TIMESTAMP WITH TIME ZONE,
    share_location BOOLEAN DEFAULT TRUE,
    
    PRIMARY KEY (group_id, user_id)
);

-- Tin nhắn nhóm
CREATE TABLE group_messages (
    message_id SERIAL PRIMARY KEY,
    group_id INT REFERENCES user_groups(group_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    media_urls JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Chợ đồ phượt (Feature #3)
CREATE TABLE marketplace_items (
    item_id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4(),
    seller_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    
    -- Thông tin sản phẩm
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('CAMPING', 'CLOTHING', 'FOOTWEAR', 'NAVIGATION', 'SAFETY', 'ACCESSORIES', 'OTHER')),
    subcategory VARCHAR(50),
    
    -- Tình trạng
    condition VARCHAR(20) NOT NULL CHECK (condition IN ('NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR')),
    
    -- Giá cả
    price DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'VND',
    is_negotiable BOOLEAN DEFAULT TRUE,
    
    -- Hình ảnh
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- Vị trí
    location_city VARCHAR(100),
    location_district VARCHAR(100),
    exact_location GEOMETRY(Point, 4326),
    shipping_available BOOLEAN DEFAULT FALSE,
    shipping_cost DECIMAL(10, 2),
    
    -- Trạng thái
    status item_status DEFAULT 'DRAFT',
    views_count INT DEFAULT 0,
    favorites_count INT DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE,
    sold_at TIMESTAMP WITH TIME ZONE
);

-- Yêu thích sản phẩm
CREATE TABLE marketplace_favorites (
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    item_id INT REFERENCES marketplace_items(item_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, item_id)
);

-- Đánh giá cung đường (Feature #8, #11)
CREATE TABLE trail_reviews (
    review_id SERIAL PRIMARY KEY,
    trail_id INT REFERENCES trails(trail_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    trip_id INT REFERENCES trips(trip_id) ON DELETE SET NULL,
    
    -- Đánh giá
    overall_rating INT NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
    
    -- Phân loại đánh giá
    scenery_rating INT CHECK (scenery_rating BETWEEN 1 AND 5),
    difficulty_rating INT CHECK (difficulty_rating BETWEEN 1 AND 5),
    safety_rating INT CHECK (safety_rating BETWEEN 1 AND 5),
    accessibility_rating INT CHECK (accessibility_rating BETWEEN 1 AND 5),
    
    -- Nội dung
    title VARCHAR(200),
    content TEXT,
    
    -- Thời gian đi
    visited_date DATE,
    visited_with VARCHAR(50), -- SOLO, FRIENDS, FAMILY, GROUP
    
    -- Thời tiết
    weather_during_visit VARCHAR(50),
    
    -- Tương tác
    helpful_count INT DEFAULT 0,
    
    -- Metadata
    images JSONB DEFAULT '[]'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(trail_id, user_id)
);

-- Thử thách cộng đồng (Feature #18)
CREATE TABLE challenges (
    challenge_id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4(),
    
    -- Thông tin thử thách
    name VARCHAR(200) NOT NULL,
    description TEXT,
    challenge_type challenge_type NOT NULL,
    
    -- Mục tiêu
    target_value DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    
    -- Thời gian
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern VARCHAR(50), -- DAILY, WEEKLY, MONTHLY, YEARLY
    
    -- Phần thưởng
    reward_type VARCHAR(30) CHECK (reward_type IN ('BADGE', 'POINTS', 'COUPON', 'PHYSICAL', 'NONE')),
    reward_details JSONB,
    
    -- Tham gia
    participation_fee DECIMAL(10, 2) DEFAULT 0,
    max_participants INT,
    current_participants INT DEFAULT 0,
    
    -- Hiển thị
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    visibility VARCHAR(20) DEFAULT 'PUBLIC' CHECK (visibility IN ('PUBLIC', 'PRIVATE', 'INVITE_ONLY')),
    
    -- Metadata
    rules JSONB,
    tags JSONB DEFAULT '[]'::jsonb,
    
    -- Người tạo
    created_by INT REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_dates CHECK (end_date > start_date)
);

CREATE TABLE challenge_participants (
    challenge_id INT REFERENCES challenges(challenge_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    
    -- Tiến độ
    current_progress DECIMAL(10, 2) DEFAULT 0,
    progress_percentage DECIMAL(5, 2) DEFAULT 0,
    
    -- Trạng thái
    status VARCHAR(20) DEFAULT 'JOINED' CHECK (status IN ('JOINED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'LEFT')),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Phần thưởng
    reward_claimed BOOLEAN DEFAULT FALSE,
    reward_claimed_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (challenge_id, user_id)
);

-- Bảng xếp hạng (Feature #18)
CREATE TABLE challenge_leaderboards (
    leaderboard_id SERIAL PRIMARY KEY,
    challenge_id INT REFERENCES challenges(challenge_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    
    -- Xếp hạng
    rank INT NOT NULL,
    score DECIMAL(10, 2) NOT NULL,
    
    -- Thống kê
    trails_completed INT DEFAULT 0,
    distance_km DECIMAL(10, 2) DEFAULT 0,
    elevation_gain INT DEFAULT 0,
    
    -- Timestamps
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(challenge_id, user_id, calculated_at)
);

-- ==========================================
-- H. ĐIỂM YÊU THÍCH & CÁ NHÂN HÓA (FAVORITES - Feature #6, #27)
-- ==========================================

CREATE TABLE user_favorites (
    favorite_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    
    -- Loại yêu thích
    favorite_type VARCHAR(20) NOT NULL CHECK (favorite_type IN ('TRAIL', 'POI', 'TRIP_PLAN', 'POST', 'MARKETPLACE_ITEM')),
    target_id INT NOT NULL, -- ID của đối tượng được yêu thích
    
    -- Metadata
    notes TEXT,
    custom_name VARCHAR(100),
    tags JSONB DEFAULT '[]'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, favorite_type, target_id)
);

-- Lưu lịch sử tìm kiếm và tương tác cho AI gợi ý
CREATE TABLE user_behavior_logs (
    log_id BIGSERIAL, -- BỎ từ khóa PRIMARY KEY ở dòng này
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    session_id UUID,
    
    -- Hành động
    action_type VARCHAR(50) NOT NULL CHECK (action_type IN (
        'VIEW_TRAIL', 'VIEW_PROFILE', 'SEARCH', 'CLICK',
        'SAVE_FAVORITE', 'CREATE_TRIP', 'START_TRACKING',
        'ADD_REVIEW', 'JOIN_CHALLENGE', 'FOLLOW_USER'
    )),
    
    -- Đối tượng
    target_type VARCHAR(50),
    target_id INT,
    
    -- Dữ liệu hành động
    search_query TEXT,
    filters_applied JSONB,
    duration_seconds INT,
    
    -- Vị trí
    location GEOMETRY(Point, 4326),
    
    -- Thiết bị
    device_info JSONB,
    app_version VARCHAR(20),
    platform VARCHAR(20) CHECK (platform IN ('WEB', 'ANDROID', 'IOS')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- THÊM KHÓA CHÍNH MỚI TẠI ĐÂY (Bao gồm cả cột phân vùng)
    PRIMARY KEY (log_id, created_at)
    
) PARTITION BY RANGE (created_at);

-- Tạo partition
CREATE TABLE user_behavior_logs_2024 PARTITION OF user_behavior_logs
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- Tạo index
CREATE INDEX idx_behavior_user_time ON user_behavior_logs (user_id, created_at DESC);

-- ==========================================
-- I. BẢN ĐỒ NHIỆT & THỐNG KÊ (HEATMAP - Feature #23)
-- ==========================================

CREATE TABLE trail_traffic_stats (
    stat_id BIGSERIAL, -- Bỏ PRIMARY KEY ở đây
    trail_id INT REFERENCES trails(trail_id) ON DELETE CASCADE,
    
    -- Phân đoạn đường
    segment_index INT,
    segment_geometry GEOMETRY(LineString, 4326),
    distance_from_start_km DECIMAL(6, 2),
    
    -- Thống kê
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Mật độ
    unique_users_count INT DEFAULT 0,
    total_passes_count INT DEFAULT 0,
    average_speed_kmh DECIMAL(5, 2),
    
    -- Thời gian
    average_time_to_segment_minutes DECIMAL(6, 2),
    peak_hour INT, -- Giờ cao điểm (0-23)
    
    -- Điều kiện
    average_weather_condition VARCHAR(50),
    
    -- Metadata
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- SỬA LẠI: Khóa chính phải bao gồm cột phân vùng (period_start)
    PRIMARY KEY (stat_id, period_start)
    
) PARTITION BY RANGE (period_start);

-- Tạo partition
CREATE TABLE trail_traffic_stats_2024 PARTITION OF trail_traffic_stats
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- Tạo index
CREATE INDEX idx_traffic_trail_period ON trail_traffic_stats (trail_id, period_start);

-- ==========================================
-- J. QUẢN TRỊ & ĐÓNG GÓP (ADMIN - Feature #13, #14)
-- ==========================================

CREATE TABLE user_reports (
    report_id SERIAL PRIMARY KEY,
    
    -- Người báo cáo
    reporter_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    
    -- Đối tượng bị báo cáo
    report_type VARCHAR(30) NOT NULL CHECK (report_type IN (
        'TRAIL', 'POST', 'COMMENT', 'USER', 'MARKETPLACE_ITEM',
        'REVIEW', 'GROUP', 'MESSAGE'
    )),
    target_id INT NOT NULL,
    
    -- Lý do
    reason_category VARCHAR(50) NOT NULL,
    reason_details TEXT,
    
    -- Trạng thái
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED')),
    priority INT DEFAULT 1 CHECK (priority BETWEEN 1 AND 5),
    
    -- Xử lý
    assigned_to INT REFERENCES users(user_id),
    resolution_notes TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    -- Evidence
    evidence_urls JSONB DEFAULT '[]'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Đóng góp chỉnh sửa cung đường (Feature #14)
CREATE TABLE trail_contributions (
    contribution_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    trail_id INT REFERENCES trails(trail_id) ON DELETE CASCADE,
    
    -- Loại đóng góp
    contribution_type VARCHAR(30) NOT NULL CHECK (contribution_type IN (
        'CREATE_TRAIL', 'UPDATE_INFO', 'ADD_POI', 'UPDATE_POI',
        'REPORT_ISSUE', 'ADD_PHOTO', 'ADD_REVIEW'
    )),
    
    -- Dữ liệu đóng góp
    data_payload JSONB NOT NULL,
    change_description TEXT,
    
    -- Evidence
    evidence_urls JSONB DEFAULT '[]'::jsonb,
    
    -- Trạng thái
    status contribution_status DEFAULT 'PENDING',
    
    -- Xử lý
    reviewed_by INT REFERENCES users(user_id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Nhật ký hành động admin
CREATE TABLE admin_audit_logs (
    audit_id BIGSERIAL, -- Bỏ PRIMARY KEY ở dòng này
    admin_id INT REFERENCES users(user_id),
    
    -- Hành động
    action_type VARCHAR(50) NOT NULL,
    target_type VARCHAR(50),
    target_id INT,
    
    -- Chi tiết
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    
    -- Kết quả
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- SỬA LẠI: Khóa chính phải bao gồm cột phân vùng (created_at)
    PRIMARY KEY (audit_id, created_at)
    
) PARTITION BY RANGE (created_at);

-- Tạo partition
CREATE TABLE admin_audit_logs_2024 PARTITION OF admin_audit_logs
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- Tạo index
CREATE INDEX idx_audit_admin_time ON admin_audit_logs (admin_id, created_at DESC);

-- Dashboard admin - Materialized Views
CREATE MATERIALIZED VIEW mv_admin_dashboard_stats AS
SELECT
    -- User stats
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM users WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as new_users_30d,
    (SELECT COUNT(*) FROM users WHERE last_login_at >= CURRENT_DATE - INTERVAL '7 days') as active_users_7d,
    
    -- Trail stats
    (SELECT COUNT(*) FROM trails) as total_trails,
    (SELECT COUNT(*) FROM trails WHERE is_verified = TRUE) as verified_trails,
    (SELECT COUNT(*) FROM trails WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as new_trails_30d,
    
    -- Trip stats
    (SELECT COUNT(*) FROM trips) as total_trips,
    (SELECT COUNT(*) FROM trips WHERE status = 'COMPLETED') as completed_trips,
    
    -- Community stats
    (SELECT COUNT(*) FROM community_posts) as total_posts,
    (SELECT COUNT(*) FROM post_comments) as total_comments,
    
    -- Marketplace stats
    (SELECT COUNT(*) FROM marketplace_items WHERE status = 'SOLD') as items_sold,
    
    -- Refresh timestamp
    CURRENT_TIMESTAMP as last_refreshed
WITH NO DATA;

-- ==========================================
-- K. HỆ THỐNG & HIỆU SUẤT (SYSTEM - Feature #28)
-- ==========================================

CREATE TABLE system_configs (
    config_id SERIAL PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE api_rate_limits (
    limit_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    endpoint VARCHAR(200) NOT NULL,
    request_count INT DEFAULT 0,
    period_start TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    period_end TIMESTAMP WITH TIME ZONE,
    max_requests INT DEFAULT 100
);

CREATE INDEX idx_rate_limit_user_endpoint ON api_rate_limits(user_id, endpoint);

CREATE TABLE system_jobs (
    job_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_type VARCHAR(50) NOT NULL,
    payload JSONB,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'RETRY')),
    priority INT DEFAULT 5,
    attempts INT DEFAULT 0,
    max_attempts INT DEFAULT 3,
    error_message TEXT,
    scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- L. INDEXES & CONSTRAINTS
-- ==========================================

-- Spatial Indexes (CRITICAL for PostGIS performance)
CREATE INDEX idx_trails_path_geometry ON trails USING GIST (path_geometry);
CREATE INDEX idx_trails_start_point ON trails USING GIST (start_point);
CREATE INDEX idx_trails_location ON trails USING GIST (location_coordinates);
CREATE INDEX idx_trail_pois_location ON trail_pois USING GIST (location);
CREATE INDEX idx_track_logs_path ON track_logs USING GIST (recorded_path);
CREATE INDEX idx_track_points_location ON track_points USING GIST (location);
CREATE INDEX idx_safety_alerts_location ON safety_alerts USING GIST (location);
CREATE INDEX idx_user_last_location ON users USING GIST (last_location);

-- B-tree Indexes for frequent queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
CREATE INDEX idx_trails_difficulty ON trails(difficulty);
CREATE INDEX idx_trails_avg_rating ON trails(avg_rating DESC);
CREATE INDEX idx_trails_created_at ON trails(created_at DESC);
CREATE INDEX idx_trails_is_verified ON trails(is_verified) WHERE is_verified = TRUE;
CREATE INDEX idx_trips_user_status ON trips(user_id, status);
CREATE INDEX idx_trips_dates ON trips(planned_start_date, planned_end_date);
CREATE INDEX idx_track_logs_user_time ON track_logs(user_id, start_time DESC);
CREATE INDEX idx_community_posts_user_time ON community_posts(user_id, created_at DESC);
CREATE INDEX idx_marketplace_items_status ON marketplace_items(status);
CREATE INDEX idx_marketplace_items_created_at ON marketplace_items(created_at DESC);
CREATE INDEX idx_challenges_active ON challenges(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_challenges_dates ON challenges(start_date, end_date);

-- Partial Indexes for common queries
CREATE INDEX idx_active_users ON users(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_verified_trails ON trails(is_verified) WHERE is_verified = TRUE;
CREATE INDEX idx_published_posts ON community_posts(is_published) WHERE is_published = TRUE;
CREATE INDEX idx_available_marketplace_items ON marketplace_items(status) 
    WHERE status IN ('AVAILABLE', 'DRAFT');

-- Composite Indexes
CREATE INDEX idx_trail_reviews_trail_user ON trail_reviews(trail_id, user_id);
CREATE INDEX idx_trip_checklists_trip_category ON trip_checklists(trip_id, category);
CREATE INDEX idx_user_favorites_user_type ON user_favorites(user_id, favorite_type);
CREATE INDEX idx_group_members_group_user ON group_members(group_id, user_id);
CREATE INDEX idx_challenge_participants_challenge_user ON challenge_participants(challenge_id, user_id);

-- ==========================================
-- M. FUNCTIONS & TRIGGERS
-- ==========================================

-- Function to update trail statistics
CREATE OR REPLACE FUNCTION update_trail_statistics()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'trail_reviews' THEN
        UPDATE trails 
        SET 
            avg_rating = (
                SELECT AVG(overall_rating)::DECIMAL(3,2)
                FROM trail_reviews 
                WHERE trail_id = NEW.trail_id
            ),
            total_reviews = (
                SELECT COUNT(*) 
                FROM trail_reviews 
                WHERE trail_id = NEW.trail_id
            )
        WHERE trail_id = NEW.trail_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for trail review updates
CREATE TRIGGER trg_update_trail_stats
AFTER INSERT OR UPDATE OR DELETE ON trail_reviews
FOR EACH ROW
EXECUTE FUNCTION update_trail_statistics();

-- Function to update user statistics
CREATE OR REPLACE FUNCTION update_user_statistics()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'track_logs' AND NEW.end_time IS NOT NULL THEN
        UPDATE users 
        SET 
            total_distance_km = COALESCE(total_distance_km, 0) + NEW.total_distance_km,
            total_trips_completed = COALESCE(total_trips_completed, 0) + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user statistics
CREATE TRIGGER trg_update_user_stats
AFTER UPDATE ON track_logs
FOR EACH ROW
WHEN (OLD.end_time IS NULL AND NEW.end_time IS NOT NULL)
EXECUTE FUNCTION update_user_statistics();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables that need it
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_trails_updated_at BEFORE UPDATE ON trails
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_trips_updated_at BEFORE UPDATE ON trips
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_community_posts_updated_at BEFORE UPDATE ON community_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- N. INITIAL DATA & CONFIGURATION
-- ==========================================

-- Insert default system configurations
INSERT INTO system_configs (config_key, config_value, description) VALUES
('app.version', '"1.0.0"', 'Current application version'),
('map.provider', '"google"', 'Default map provider (google, mapbox, osm)'),
('map.default_zoom', '12', 'Default map zoom level'),
('weather.update_interval', '3600', 'Weather update interval in seconds'),
('notification.enabled', 'true', 'Enable push notifications'),
('challenge.default_max_participants', '1000', 'Default max participants for challenges'),
('marketplace.commission_rate', '0.05', 'Commission rate for marketplace sales'),
('safety.sos_response_time', '300', 'Expected SOS response time in seconds');

-- Insert sample difficulty descriptions
INSERT INTO system_configs (config_key, config_value, description) VALUES
('trail.difficulty.easy', '{"description": "Phù hợp cho người mới bắt đầu, đường bằng phẳng, ít leo dốc", "min_distance": 0, "max_distance": 10, "max_elevation": 300}', 'Easy trail configuration'),
('trail.difficulty.moderate', '{"description": "Yêu cầu thể lực trung bình, có đoạn leo dốc vừa phải", "min_distance": 5, "max_distance": 20, "max_elevation": 800}', 'Moderate trail configuration'),
('trail.difficulty.hard', '{"description": "Dành cho người có kinh nghiệm, nhiều đoạn dốc cao, địa hình phức tạp", "min_distance": 10, "max_distance": 30, "max_elevation": 1500}', 'Hard trail configuration'),
('trail.difficulty.extreme', '{"description": "Chỉ dành cho chuyên gia, địa hình hiểm trở, cần trang bị đặc biệt", "min_distance": 15, "max_distance": 50, "max_elevation": 3000}', 'Extreme trail configuration');

-- ==========================================
-- O. COMMENTS FOR DOCUMENTATION
-- ==========================================

COMMENT ON DATABASE traillsexplorer IS 'Database for TrailsExplorer - Trekking and Outdoor Adventure Platform';

COMMENT ON TABLE users IS 'Stores user accounts and profiles';
COMMENT ON TABLE trails IS 'Hiking trails information with GIS data';
COMMENT ON TABLE trips IS 'Trip planning and tracking';
COMMENT ON TABLE track_logs IS 'GPS tracking logs for trips';
COMMENT ON TABLE safety_alerts IS 'Safety alerts and warnings system';
COMMENT ON TABLE community_posts IS 'Social media posts and content';
COMMENT ON TABLE marketplace_items IS 'Gear marketplace items';
COMMENT ON TABLE challenges IS 'Community challenges and competitions';

-- ==========================================
-- P. GRANTS & PERMISSIONS (Example - Adjust based on your setup)
-- ==========================================

-- Example grants (run as superuser):
-- GRANT CONNECT ON DATABASE traillsexplorer TO traillsexplorer_app;
-- GRANT USAGE ON SCHEMA public TO traillsexplorer_app;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO traillsexplorer_app;
-- GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO traillsexplorer_app;

-- ==========================================
-- Q. CLEANUP & MAINTENANCE SCRIPTS
-- ==========================================

-- Example maintenance function to clean old data
CREATE OR REPLACE FUNCTION cleanup_old_data(retention_days INT DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- 1. Xóa track points cũ
    DELETE FROM track_points 
    WHERE recorded_at < CURRENT_TIMESTAMP - (retention_days * INTERVAL '1 day');
    
    -- 2. Lấy số lượng dòng vừa xóa ngay sau lệnh DELETE
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- 3. Xóa behavior logs cũ
    DELETE FROM user_behavior_logs 
    WHERE created_at < CURRENT_TIMESTAMP - (retention_days * INTERVAL '1 day');
    
    -- 4. Xóa sessions cũ
    DELETE FROM user_auth_tokens 
    WHERE expires_at < CURRENT_TIMESTAMP - INTERVAL '7 days';
    
    -- Trả về số lượng track_points đã xóa
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run cleanup (example using pg_cron if available)
-- SELECT cron.schedule('cleanup-old-data', '0 2 * * *', 'SELECT cleanup_old_data(90)');

-- ==========================================
-- END OF DATABASE SCHEMA
-- ==========================================

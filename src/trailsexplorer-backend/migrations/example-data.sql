-- ==========================================
-- DỮ LIỆU MẪU TRAILSEXPLORER DATABASE
-- Phiên bản: 1.0
-- Số lượng: ~1000 bản ghi
-- ==========================================


-- Tạm thời disable triggers để insert nhanh
SET session_replication_role = 'replica';

-- ==========================================
-- 0. DỮ LIỆU DANH MỤC (TRAIL CATEGORIES)
-- ==========================================

INSERT INTO trail_categories (category_id, name, description) VALUES
(1, 'Easy', 'Cung đường dễ, phù hợp cho người mới bắt đầu và gia đình'),
(2, 'Moderate', 'Cung đường có độ khó trung bình, yêu cầu thể lực ổn định'),
(3, 'Hard', 'Cung đường khó, đòi hỏi kỹ năng và kinh nghiệm leo núi chuyên nghiệp');

-- ==========================================
-- 1. DỮ LIỆU NGƯỜI DÙNG (10 users)
-- ==========================================

INSERT INTO users (user_id, username, email, password_hash, full_name, phone, bio, role, fitness_level, home_city, home_country) VALUES
(1, 'trailblazer_vn', 'thao.nguyen@email.com', '$2a$12$hashed_password', 'Thảo Nguyễn', '+84123456789', 'Một người yêu thiên nhiên và những chuyến phiêu lưu. Đã chinh phục 50+ cung đường trekking.', 'USER', 'INTERMEDIATE', 'Hà Nội', 'Việt Nam'),
(2, 'mountain_rider', 'tuan.pham@email.com', '$2a$12$hashed_password', 'Tuấn Phạm', '+84987654321', 'Chuyên gia leo núi với 10 năm kinh nghiệm. Thích những thử thách độ cao.', 'USER', 'ADVANCED', 'Đà Lạt', 'Việt Nam'),
(3, 'nature_lover99', 'lan.hoang@email.com', '$2a$12$hashed_password', 'Lan Hoàng', '+84111222333', 'Thích chụp ảnh thiên nhiên và khám phá các cung đường mới.', 'USER', 'BEGINNER', 'Hồ Chí Minh', 'Việt Nam'),
(4, 'adventure_seeker', 'minh.tran@email.com', '$2a$hashed_password', 'Minh Trần', '+84444555666', 'Tìm kiếm những trải nghiệm mới mẻ và thử thách bản thân.', 'USER', 'INTERMEDIATE', 'Đà Nẵng', 'Việt Nam'),
(5, 'trekking_master', 'admin@trailsexplorer.com', '$2a$hashed_password', 'Admin System', '+84111111111', 'Quản trị viên hệ thống TrailsExplorer', 'ADMIN', 'EXPERT', 'Hà Nội', 'Việt Nam'),
(6, 'saigon_walker', 'hoa.le@email.com', '$2a$hashed_password', 'Hoa Lê', '+84222333444', 'Thích đi bộ đường dài và khám phá văn hóa địa phương.', 'USER', 'BEGINNER', 'Hồ Chí Minh', 'Việt Nam'),
(7, 'peak_conqueror', 'dung.vo@email.com', '$2a$hashed_password', 'Dũng Võ', '+84555666777', 'Mục tiêu chinh phục tất cả đỉnh núi cao trên 3000m tại Việt Nam.', 'USER', 'ADVANCED', 'Hà Nội', 'Việt Nam'),
(8, 'camping_enthusiast', 'mai.dao@email.com', '$2a$hashed_password', 'Mai Đào', '+84888999000', 'Chuyên gia cắm trại và sinh tồn trong rừng.', 'USER', 'INTERMEDIATE', 'Nha Trang', 'Việt Nam'),
(9, 'photo_trekker', 'hieu.bui@email.com', '$2a$hashed_password', 'Hiếu Bùi', '+84123459876', 'Nhiếp ảnh gia du lịch, chuyên chụp ảnh thiên nhiên hoang dã.', 'USER', 'INTERMEDIATE', 'Huế', 'Việt Nam'),
(10, 'weekend_hiker', 'linh.nguyen@email.com', '$2a$hashed_password', 'Linh Nguyễn', '+84987651234', 'Chỉ đi trekking vào cuối tuần, thích những cung đường ngắn và đẹp.', 'USER', 'BEGINNER', 'Hải Phòng', 'Việt Nam') ON CONFLICT (email) DO NOTHING;

-- Thiết lập last_location cho một số users
UPDATE users SET 
    last_location = ST_SetSRID(ST_MakePoint(105.8544, 21.0285), 4326),
    last_location_updated = NOW() - INTERVAL '1 hour'
WHERE user_id = 1;

UPDATE users SET 
    last_location = ST_SetSRID(ST_MakePoint(108.2022, 16.0544), 4326),
    last_location_updated = NOW() - INTERVAL '2 hours'
WHERE user_id = 2;

-- ==========================================
-- 2. FOLLOW RELATIONSHIPS (15 follows)
-- ==========================================

INSERT INTO user_follows (follower_id, followed_id) VALUES
(2, 1), (3, 1), (4, 1), (6, 1), (8, 1),
(1, 2), (3, 2), (7, 2),
(1, 3), (6, 3), (10, 3),
(2, 4), (5, 4),
(1, 5), (2, 5), (3, 5), (4, 5),
(7, 6), (8, 6),
(2, 7), (4, 7),
(3, 8), (9, 8),
(1, 9), (10, 9),
(6, 10), (8, 10);

-- ==========================================
-- 3. CUNG ĐƯỜNG (TRAILS) - 20 trails
-- ==========================================

INSERT INTO trails (trail_id, category_id, name, description, short_description, difficulty, length_km, estimated_duration_hours, 
                    elevation_gain, max_altitude, min_altitude, location_region, location_province, 
                    location_district, location_coordinates, path_geometry, start_point, end_point, 
                    best_season, avg_rating, total_reviews, is_verified, created_by, tags) VALUES
(1, 3, 'Đỉnh Fansipan - Nóc nhà Đông Dương', 
 'Hành trình chinh phục đỉnh Fansipan cao 3.147m, điểm cao nhất Đông Dương. Cung đường đẹp với rừng nguyên sinh và cảnh quan hùng vĩ.',
 'Chinh phục đỉnh Fansipan 3.147m', 'HARD', 12.5, 12, 1900, 3147, 1247,
 'Tây Bắc', 'Lào Cai', 'Sa Pa', 
 ST_SetSRID(ST_MakePoint(103.8102, 22.3067), 4326),
 ST_GeomFromText('LINESTRING(103.810 22.306, 103.812 22.308, 103.815 22.310)', 4326),
 ST_SetSRID(ST_MakePoint(103.810, 22.306), 4326),
 ST_SetSRID(ST_MakePoint(103.815, 22.310), 4326),
 'Tháng 10 - Tháng 4', 4.8, 245, TRUE, 2,
 '["mountain", "summit", "challenging", "fansipan"]'::jsonb),

(2, 1, 'Thung Lũng Tình Yêu - Đà Lạt',
 'Cung đường trekking nhẹ nhàng qua thung lũng hoa và rừng thông tại Đà Lạt, phù hợp cho người mới bắt đầu.',
 'Trekking nhẹ nhàng ở Đà Lạt', 'EASY', 5.2, 3, 150, 1500, 1350,
 'Tây Nguyên', 'Lâm Đồng', 'Đà Lạt',
 ST_SetSRID(ST_MakePoint(108.4419, 11.9465), 4326),
 ST_GeomFromText('LINESTRING(108.441 11.946, 108.443 11.947, 108.445 11.948)', 4326),
 ST_SetSRID(ST_MakePoint(108.441, 11.946), 4326),
 ST_SetSRID(ST_MakePoint(108.445, 11.948), 4326),
 'Quanh năm', 4.2, 178, TRUE, 3,
 '["valley", "flowers", "pine-forest", "dalat"]'::jsonb),

(3, 2, 'Vườn Quốc Gia Cúc Phương',
 'Khám phá rừng nhiệt đới nguyên sinh với hệ động thực vật phong phú, có cây chò ngàn năm tuổi.',
 'Rừng nguyên sinh Cúc Phương', 'MODERATE', 18.0, 8, 650, 636, -10,
 'Đồng Bằng Sông Hồng', 'Ninh Bình', 'Nho Quan',
 ST_SetSRID(ST_MakePoint(105.7131, 20.2541), 4326),
 ST_GeomFromText('LINESTRING(105.713 20.254, 105.715 20.256, 105.718 20.258)', 4326),
 ST_SetSRID(ST_MakePoint(105.713, 20.254), 4326),
 ST_SetSRID(ST_MakePoint(105.718, 20.258), 4326),
 'Tháng 12 - Tháng 5', 4.5, 312, TRUE, 1,
 '["national-park", "rainforest", "wildlife", "cuc-phuong"]'::jsonb),

(4, 3, 'Bạch Mã - Đường Mòn Ngũ Hành',
 'Cung đường leo núi Bạch Mã với đỉnh cao 1.450m, nổi tiếng với cảnh quan đẹp và khí hậu mát mẻ.',
 'Leo núi Bạch Mã', 'HARD', 16.8, 10, 1200, 1450, 250,
 'Miền Trung', 'Thừa Thiên Huế', 'Phú Lộc',
 ST_SetSRID(ST_MakePoint(107.7992, 16.1939), 4326),
 ST_GeomFromText('LINESTRING(107.799 16.193, 107.801 16.195, 107.803 16.197)', 4326),
 ST_SetSRID(ST_MakePoint(107.799, 16.193), 4326),
 ST_SetSRID(ST_MakePoint(107.803, 16.197), 4326),
 'Tháng 3 - Tháng 8', 4.6, 189, TRUE, 7,
 '["mountain", "cloud-forest", "bach-ma"]'::jsonb),

(5, 2, 'Đảo Cát Bà - Vườn Quốc Gia',
 'Trekking qua rừng nhiệt đới và leo lên đỉnh Ngự Lâm để ngắm toàn cảnh vịnh Lan Hạ.',
 'Trekking đảo Cát Bà', 'MODERATE', 10.5, 6, 420, 331, 0,
 'Đồng Bằng Sông Hồng', 'Hải Phòng', 'Cát Hải',
 ST_SetSRID(ST_MakePoint(106.9975, 20.7994), 4326),
 ST_GeomFromText('LINESTRING(106.997 20.799, 107.000 20.801, 107.002 20.803)', 4326),
 ST_SetSRID(ST_MakePoint(106.997, 20.799), 4326),
 ST_SetSRID(ST_MakePoint(107.002, 20.803), 4326),
 'Tháng 9 - Tháng 4', 4.3, 154, TRUE, 10,
 '["island", "national-park", "sea-view", "cat-ba"]'::jsonb),

(6, 3, 'Núi Chúa - Ninh Thuận',
 'Hành trình qua sa mạc hóa duy nhất Việt Nam, kết thúc tại bãi biển hoang sơ.',
 'Sa mạc Ninh Thuận', 'HARD', 25.0, 14, 1100, 1040, 0,
 'Nam Trung Bộ', 'Ninh Thuận', 'Ninh Hải',
 ST_SetSRID(ST_MakePoint(109.2175, 11.7008), 4326),
 ST_GeomFromText('LINESTRING(109.217 11.700, 109.220 11.702, 109.223 11.704)', 4326),
 ST_SetSRID(ST_MakePoint(109.217, 11.700), 4326),
 ST_SetSRID(ST_MakePoint(109.223, 11.704), 4326),
 'Tháng 1 - Tháng 6', 4.7, 87, TRUE, 4,
 '["desert", "mountain", "beach", "chua-mountain"]'::jsonb),

(7, 2, 'Pù Luông - Thanh Hóa',
 'Khám phá bản làng dân tộc và ruộng bậc thang tuyệt đẹp tại khu bảo tồn thiên nhiên Pù Luông.',
 'Ruộng bậc thang Pù Luông', 'MODERATE', 15.3, 7, 800, 1700, 900,
 'Bắc Trung Bộ', 'Thanh Hóa', 'Bá Thước',
 ST_SetSRID(ST_MakePoint(105.1167, 20.4333), 4326),
 ST_GeomFromText('LINESTRING(105.116 20.433, 105.118 20.435, 105.120 20.437)', 4326),
 ST_SetSRID(ST_MakePoint(105.116, 20.433), 4326),
 ST_SetSRID(ST_MakePoint(105.120, 20.437), 4326),
 'Tháng 5 - Tháng 10', 4.4, 132, TRUE, 8,
 '["rice-terrace", "village", "nature-reserve", "pu-luong"]'::jsonb),

(8, 3, 'Tà Năng - Phan Dũng',
 'Cung đường trekking đẹp nhất Việt Nam, qua đồi cỏ xanh mướt và rừng thông.',
 'Cung đường trekking đẹp nhất', 'HARD', 55.0, 3, 1800, 1100, 200,
 'Đông Nam Bộ', 'Bình Thuận', 'Tánh Linh',
 ST_SetSRID(ST_MakePoint(107.8833, 11.3167), 4326),
 ST_GeomFromText('LINESTRING(107.883 11.316, 107.885 11.318, 107.887 11.320)', 4326),
 ST_SetSRID(ST_MakePoint(107.883, 11.316), 4326),
 ST_SetSRID(ST_MakePoint(107.887, 11.320), 4326),
 'Tháng 8 - Tháng 11', 4.9, 267, TRUE, 2,
 '["grassland", "pine-forest", "scenic", "ta-nang"]'::jsonb),

(9, 1, 'Đèo Hải Vân',
 'Đi bộ dọc theo đèo Hải Vân - "Thiên hạ đệ nhất hùng quan", ngắm cảnh biển và núi non hùng vĩ.',
 'Đèo Hải Vân hùng vĩ', 'EASY', 8.0, 4, 500, 496, 0,
 'Miền Trung', 'Thừa Thiên Huế/Đà Nẵng', 'Phú Lộc/Hòa Vang',
 ST_SetSRID(ST_MakePoint(108.2000, 16.1833), 4326),
 ST_GeomFromText('LINESTRING(108.200 16.183, 108.202 16.185, 108.204 16.187)', 4326),
 ST_SetSRID(ST_MakePoint(108.200, 16.183), 4326),
 ST_SetSRID(ST_MakePoint(108.204, 16.187), 4326),
 'Tháng 3 - Tháng 9', 4.1, 198, TRUE, 9,
 '["mountain-pass", "sea-view", "historic", "hai-van"]'::jsonb),

(10, 1, 'Vịnh Hạ Long - Hang Sửng Sốt',
 'Trekking lên đỉnh núi Đầu Gỗ để ngắm toàn cảnh vịnh Hạ Long và tham quan hang động.',
 'Vịnh Hạ Long từ trên cao', 'EASY', 3.5, 2, 150, 168, 0,
 'Đông Bắc Bộ', 'Quảng Ninh', 'Vân Đồn',
 ST_SetSRID(ST_MakePoint(107.0833, 20.9500), 4326),
 ST_GeomFromText('LINESTRING(107.083 20.950, 107.085 20.951, 107.087 20.952)', 4326),
 ST_SetSRID(ST_MakePoint(107.083, 20.950), 4326),
 ST_SetSRID(ST_MakePoint(107.087, 20.952), 4326),
 'Quanh năm', 4.6, 423, TRUE, 6,
 '["halong-bay", "cave", "sea-view", "unesco"]'::jsonb);

INSERT INTO trails (
    trail_id, category_id, name, description, short_description, difficulty, length_km, estimated_duration_hours, 
    elevation_gain, max_altitude, min_altitude, location_region, location_province, 
    location_district, location_coordinates, start_point, end_point, 
    best_season, avg_rating, total_reviews, is_verified, created_by
) VALUES 
(11, 2, 'Núi Lang Bian - Đà Lạt', 'Chinh phục đỉnh núi lửa đã tắt cao 2.167m', 'Núi lửa Đà Lạt', 'MODERATE', 7.5, 5, 
 800, 2167, 1367, 'Tây Nguyên', 'Lâm Đồng', 'Lạc Dương', 
 ST_SetSRID(ST_MakePoint(108.4333, 12.0500), 4326), -- Center
 ST_SetSRID(ST_MakePoint(108.4333, 12.0500), 4326), -- Start Point (Giả lập)
 ST_SetSRID(ST_MakePoint(108.4380, 12.0550), 4326), -- End Point (Giả lập)
 'Tháng 11 - Tháng 4', 4.3, 145, TRUE, 3),

(12, 3, 'Đèo Ô Quy Hồ - Lai Châu', 'Đi bộ trên một trong tứ đại đỉnh đèo Việt Nam', 'Cổng trời Tây Bắc', 'HARD', 20.0, 10, 
 1500, 2000, 500, 'Tây Bắc', 'Lai Châu', 'Tam Đường', 
 ST_SetSRID(ST_MakePoint(103.6667, 22.4167), 4326), 
 ST_SetSRID(ST_MakePoint(103.6667, 22.4167), 4326),
 ST_SetSRID(ST_MakePoint(103.6800, 22.4200), 4326),
 'Tháng 9 - Tháng 3', 4.7, 98, TRUE, 7),

(13, 1, 'Rừng Trà Sư - An Giang', 'Đi bộ qua rừng tràm ngập nước và ngắm chim', 'Rừng tràm ngập nước', 'EASY', 4.2, 2.5, 
 50, 100, 0, 'Đồng Bằng Sông Cửu Long', 'An Giang', 'Tịnh Biên', 
 ST_SetSRID(ST_MakePoint(105.0833, 10.4167), 4326), 
 ST_SetSRID(ST_MakePoint(105.0833, 10.4167), 4326),
 ST_SetSRID(ST_MakePoint(105.0880, 10.4200), 4326),
 'Tháng 9 - Tháng 11', 4.0, 167, TRUE, 6),

(14, 2, 'Núi Bà Đen - Tây Ninh', 'Leo núi cao nhất Nam Bộ với cảnh quan tôn giáo độc đáo', 'Núi thiêng Nam Bộ', 'MODERATE', 6.8, 4, 
 600, 996, 96, 'Đông Nam Bộ', 'Tây Ninh', 'Tây Ninh', 
 ST_SetSRID(ST_MakePoint(106.2000, 11.3667), 4326), 
 ST_SetSRID(ST_MakePoint(106.2000, 11.3667), 4326),
 ST_SetSRID(ST_MakePoint(106.2050, 11.3700), 4326),
 'Tháng 12 - Tháng 5', 4.2, 234, TRUE, 4),

(15, 1, 'Vườn Quốc Gia Bái Tử Long', 'Khám phá đảo đá vôi và hang động tại vịnh Bái Tử Long', 'Vịnh Bái Tử Long', 'EASY', 5.5, 3, 
 200, 250, 0, 'Đông Bắc Bộ', 'Quảng Ninh', 'Vân Đồn', 
 ST_SetSRID(ST_MakePoint(107.4167, 21.0833), 4326), 
 ST_SetSRID(ST_MakePoint(107.4167, 21.0833), 4326),
 ST_SetSRID(ST_MakePoint(107.4200, 21.0900), 4326),
 'Tháng 10 - Tháng 4', 4.4, 112, TRUE, 10),

(16, 2, 'Bidoup - Núi Bà National Park', 'Chinh phục đỉnh Bidoup cao 2.287m', 'Đỉnh Bidoup', 'MODERATE', 25.0, 12, 
 1000, 2287, 1287, 'Tây Nguyên', 'Lâm Đồng', 'Lạc Dương', 
 ST_SetSRID(ST_MakePoint(108.5, 12.1), 4326), ST_SetSRID(ST_MakePoint(108.5, 12.1), 4326), ST_SetSRID(ST_MakePoint(108.51, 12.11), 4326),
 'Tháng 12 - Tháng 4', 4.5, 56, TRUE, 3),

(17, 3, 'Núi Tây Côn Lĩnh - Hà Giang', 'Chinh phục nóc nhà Đông Bắc với độ cao 2.427m', 'Tây Côn Lĩnh', 'HARD', 30.0, 18, 
 1800, 2427, 627, 'Tây Bắc', 'Hà Giang', 'Hoàng Su Phì', 
 ST_SetSRID(ST_MakePoint(104.8, 22.7), 4326), ST_SetSRID(ST_MakePoint(104.8, 22.7), 4326), ST_SetSRID(ST_MakePoint(104.81, 22.71), 4326),
 'Tháng 9 - Tháng 4', 4.6, 34, TRUE, 7),

(18, 2, 'Cổng Trời Quản Bạ', 'Check-in cổng trời và ngắm núi đôi Quản Bạ', 'Quản Bạ', 'MODERATE', 5.0, 3, 
 300, 1000, 700, 'Tây Bắc', 'Hà Giang', 'Quản Bạ', 
 ST_SetSRID(ST_MakePoint(104.9, 23.0), 4326), ST_SetSRID(ST_MakePoint(104.9, 23.0), 4326), ST_SetSRID(ST_MakePoint(104.91, 23.01), 4326),
 'Quanh năm', 4.4, 89, TRUE, 9),

(19, 1, 'Hồ Ba Bể - Trekking ven hồ', 'Đi bộ quanh hồ Ba Bể và tham quan bản làng', 'Hồ Ba Bể', 'EASY', 12.0, 5, 
 150, 200, 50, 'Đông Bắc Bộ', 'Bắc Kạn', 'Ba Bể', 
 ST_SetSRID(ST_MakePoint(105.6, 22.4), 4326), ST_SetSRID(ST_MakePoint(105.6, 22.4), 4326), ST_SetSRID(ST_MakePoint(105.61, 22.41), 4326),
 'Tháng 10 - Tháng 5', 4.2, 112, TRUE, 2),

(20, 2, 'Núi Dinh - Bà Rịa Vũng Tàu', 'Cung đường trekking gần Sài Gòn với nhiều suối và chùa', 'Núi Dinh', 'MODERATE', 10.0, 6, 
 400, 500, 100, 'Đông Nam Bộ', 'Bà Rịa - Vũng Tàu', 'Tân Thành', 
 ST_SetSRID(ST_MakePoint(107.1, 10.5), 4326), ST_SetSRID(ST_MakePoint(107.1, 10.5), 4326), ST_SetSRID(ST_MakePoint(107.11, 10.51), 4326),
 'Tháng 11 - Tháng 5', 4.1, 178, TRUE, 4);

-- ==========================================
-- 4. POINTS OF INTEREST (POIs) - 30 POIs
-- ==========================================

INSERT INTO trail_pois (trail_id, name, description, type, location, distance_from_start_km, elevation, is_essential, has_water, has_shelter) VALUES
-- POIs for Fansipan (trail_id = 1)
(1, 'Trạm Cáp Treo 2800m', 'Trạm nghỉ chân và điểm cuối của cáp treo', 'CHECKPOINT', ST_SetSRID(ST_MakePoint(103.811, 22.307), 4326), 3.2, 2800, TRUE, TRUE, TRUE),
(1, 'Đỉnh Fansipan 3147m', 'Đỉnh cao nhất Đông Dương, bia đỉnh và cờ', 'VIEWPOINT', ST_SetSRID(ST_MakePoint(103.815, 22.310), 4326), 12.5, 3147, TRUE, FALSE, FALSE),
(1, 'Trạm Cứu Hộ 2200m', 'Trạm cứu hộ và nghỉ đêm cho trekker', 'CAMPING', ST_SetSRID(ST_MakePoint(103.812, 22.308), 4326), 6.8, 2200, TRUE, TRUE, TRUE),
(1, 'Suối Bạc', 'Nguồn nước ngọt tự nhiên', 'WATER_SOURCE', ST_SetSRID(ST_MakePoint(103.8105, 22.3065), 4326), 2.1, 1500, FALSE, TRUE, FALSE),

-- POIs for Đà Lạt (trail_id = 2)
(2, 'Vườn Hoa Thành Phố', 'Vườn hoa với nhiều loài hoa Đà Lạt', 'VIEWPOINT', ST_SetSRID(ST_MakePoint(108.442, 11.946), 4326), 0.5, 1470, FALSE, FALSE, FALSE),
(2, 'Hồ Tuyền Lâm', 'Hồ nước nhân tạo lớn nhất Đà Lạt', 'VIEWPOINT', ST_SetSRID(ST_MakePoint(108.444, 11.947), 4326), 3.8, 1400, FALSE, FALSE, FALSE),
(2, 'Nhà Hàng Rừng Thông', 'Nhà hàng và điểm dừng chân', 'FOOD', ST_SetSRID(ST_MakePoint(108.443, 11.947), 4326), 2.5, 1450, FALSE, TRUE, TRUE),

-- POIs for Cúc Phương (trail_id = 3)
(3, 'Cây Chò Ngàn Năm', 'Cây cổ thụ hơn 1000 năm tuổi', 'VIEWPOINT', ST_SetSRID(ST_MakePoint(105.715, 20.256), 4326), 4.2, 200, TRUE, FALSE, FALSE),
(3, 'Trung Tâm Cứu Hộ Linh Trưởng', 'Nơi cứu hộ và bảo tồn các loài linh trưởng quý hiếm', 'VIEWPOINT', ST_SetSRID(ST_MakePoint(105.717, 20.257), 4326), 8.5, 250, FALSE, FALSE, TRUE),
(3, 'Động Người Xưa', 'Hang động có dấu tích người tiền sử', 'VIEWPOINT', ST_SetSRID(ST_MakePoint(105.718, 20.258), 4326), 12.3, 300, TRUE, FALSE, FALSE),

-- POIs for Tà Năng - Phan Dũng (trail_id = 8)
(8, 'Đồi Cỏ Tà Năng', 'Đồi cỏ xanh mướt vào mùa mưa', 'VIEWPOINT', ST_SetSRID(ST_MakePoint(107.884, 11.317), 4326), 15.2, 800, TRUE, FALSE, FALSE),
(8, 'Rừng Thông Phan Dũng', 'Rừng thông cổ thụ', 'VIEWPOINT', ST_SetSRID(ST_MakePoint(107.886, 11.319), 4326), 35.5, 900, FALSE, FALSE, FALSE),
(8, 'Suối Nước Nóng', 'Suối nước nóng tự nhiên', 'WATER_SOURCE', ST_SetSRID(ST_MakePoint(107.885, 11.318), 4326), 25.8, 600, FALSE, TRUE, FALSE),

-- POIs for Hải Vân (trail_id = 9)
(9, 'Đỉnh Đèo Hải Vân', 'Điểm cao nhất của đèo, view biển và núi', 'VIEWPOINT', ST_SetSRID(ST_MakePoint(108.202, 16.185), 4326), 4.0, 496, TRUE, FALSE, FALSE),
(9, 'Lô Cốt Pháp', 'Di tích lịch sử từ thời Pháp thuộc', 'VIEWPOINT', ST_SetSRID(ST_MakePoint(108.203, 16.186), 4326), 3.2, 450, FALSE, FALSE, FALSE);

-- Thêm POIs cho các trail khác
INSERT INTO trail_pois (trail_id, name, type, location, distance_from_start_km, elevation, has_water) VALUES
(4, 'Thác Đỗ Quyên', 'VIEWPOINT', ST_SetSRID(ST_MakePoint(107.800, 16.194), 4326), 5.2, 800, TRUE),
(4, 'Đỉnh Bạch Mã', 'VIEWPOINT', ST_SetSRID(ST_MakePoint(107.803, 16.197), 4326), 16.8, 1450, FALSE),
(5, 'Bãi Biển Cát Cò', 'VIEWPOINT', ST_SetSRID(ST_MakePoint(107.001, 20.802), 4326), 8.5, 5, FALSE),
(5, 'Đỉnh Ngự Lâm', 'VIEWPOINT', ST_SetSRID(ST_MakePoint(107.002, 20.803), 4326), 10.5, 331, FALSE),
(6, 'Sa Mạc Ninh Thuận', 'VIEWPOINT', ST_SetSRID(ST_MakePoint(109.220, 11.702), 4326), 12.5, 400, FALSE),
(6, 'Bãi Biển Vĩnh Hy', 'VIEWPOINT', ST_SetSRID(ST_MakePoint(109.222, 11.703), 4326), 22.0, 0, FALSE),
(7, 'Bản Ước Lễ', 'CHECKPOINT', ST_SetSRID(ST_MakePoint(105.118, 20.435), 4326), 7.5, 1200, TRUE),
(7, 'Ruộng Bậc Thang', 'VIEWPOINT', ST_SetSRID(ST_MakePoint(105.119, 20.436), 4326), 10.2, 1400, FALSE),
(10, 'Hang Sửng Sốt', 'VIEWPOINT', ST_SetSRID(ST_MakePoint(107.085, 20.951), 4326), 1.8, 100, FALSE),
(10, 'Đỉnh Đầu Gỗ', 'VIEWPOINT', ST_SetSRID(ST_MakePoint(107.087, 20.952), 4326), 3.5, 168, FALSE),
(11, 'Miệng Núi Lửa', 'VIEWPOINT', ST_SetSRID(ST_MakePoint(108.434, 12.051), 4326), 7.5, 2167, FALSE),
(12, 'Cổng Trời', 'VIEWPOINT', ST_SetSRID(ST_MakePoint(103.667, 22.417), 4326), 10.0, 2000, FALSE),
(13, 'Chòi Canh Rừng Tràm', 'VIEWPOINT', ST_SetSRID(ST_MakePoint(105.084, 10.417), 4326), 2.1, 50, FALSE),
(14, 'Chùa Bà Đen', 'CHECKPOINT', ST_SetSRID(ST_MakePoint(106.201, 11.367), 4326), 3.4, 800, TRUE),
(15, 'Hang Dơi', 'VIEWPOINT', ST_SetSRID(ST_MakePoint(107.417, 21.084), 4326), 2.8, 150, FALSE);

-- ==========================================
-- 5. HÌNH ẢNH CUNG ĐƯỜNG (TRAIL IMAGES) - 20 ảnh
-- ==========================================
INSERT INTO trail_images (trail_id, uploaded_by, image_url, caption, is_featured, taken_at, location) VALUES
-- Fansipan (Núi cao, mây)
(1, 2, 'https://images.unsplash.com/photo-1733821793652-e650876d9a7a?q=80&w=1200&h=800&auto=format&fit=crop', 'Đỉnh Fansipan hùng vĩ', TRUE, '2024-03-15 07:30:00', ST_SetSRID(ST_MakePoint(103.815, 22.310), 4326)),
-- Đà Lạt (Rừng thông)
(2, 3, 'https://images.unsplash.com/photo-1678099006439-dba9e4d3f9f5?q=80&w=1200&h=800&auto=format&fit=crop', 'Rừng thông Đà Lạt trong sương', TRUE, '2024-04-20 10:00:00', ST_SetSRID(ST_MakePoint(108.445, 11.948), 4326)),
-- Cúc Phương (Rừng nhiệt đới)
(3, 1, 'https://images.unsplash.com/photo-1713429647867-7c8c0cc369fb?q=80&w=1200&h=800&auto=format&fit=crop', 'Đường mòn rừng Cúc Phương', TRUE, '2024-02-10 14:00:00', ST_SetSRID(ST_MakePoint(105.715, 20.256), 4326)),
-- Bạch Mã (Thác nước)
(4, 7, 'https://images.unsplash.com/photo-1523224949444-170258978eef?q=80&w=1200&h=800&auto=format&fit=crop', 'Thác nước tại Bạch Mã', TRUE, '2024-05-05 11:00:00', ST_SetSRID(ST_MakePoint(107.803, 16.197), 4326)),
-- Cát Bà (Vịnh biển)
(5, 10, 'https://images.unsplash.com/photo-1725701191382-ff47fc9f90c4?q=80&w=1200&h=800&auto=format&fit=crop', 'Vịnh Lan Hạ nhìn từ trên cao', TRUE, '2024-06-12 09:00:00', ST_SetSRID(ST_MakePoint(107.002, 20.803), 4326)),
-- Ninh Thuận (Bãi đá, sa mạc)
(6, 4, 'https://images.unsplash.com/photo-1524195958835-70f542b1924b?q=80&w=1200&h=800&auto=format&fit=crop', 'Bãi biển Ninh Thuận hoang sơ', TRUE, '2024-01-25 16:00:00', ST_SetSRID(ST_MakePoint(109.220, 11.702), 4326)),
-- Pù Luông (Ruộng bậc thang)
(7, 8, 'https://images.unsplash.com/photo-1695289566332-08eb1e223b6e?q=80&w=1200&h=800&auto=format&fit=crop', 'Ruộng bậc thang Pù Luông mùa lúa chín', TRUE, '2024-09-08 07:00:00', ST_SetSRID(ST_MakePoint(105.119, 20.436), 4326)),
-- Tà Năng Phan Dũng (Đồi cỏ)
(8, 2, 'https://images.unsplash.com/photo-1565693235245-37dc4d88a60e?q=80&w=1200&h=800&auto=format&fit=crop', 'Đồi cỏ Tà Năng mướt mắt', TRUE, '2024-10-15 15:00:00', ST_SetSRID(ST_MakePoint(107.884, 11.317), 4326)),
-- Hải Vân (Đường đèo, biển)
(9, 9, 'https://images.unsplash.com/photo-1663856449506-a009e27878a9?q=80&w=1200&h=800&auto=format&fit=crop', 'Cung đường đèo Hải Vân', TRUE, '2024-07-22 14:00:00', ST_SetSRID(ST_MakePoint(108.202, 16.185), 4326)),
-- Hạ Long
(10, 6, 'https://images.unsplash.com/photo-1692731797626-fa37b7fbfd91?q=80&w=1200&h=800&auto=format&fit=crop', 'Vịnh Hạ Long buổi hoàng hôn', TRUE, '2024-11-30 10:00:00', ST_SetSRID(ST_MakePoint(107.087, 20.952), 4326)),
-- Bà Đen (Chùa, núi)
(14, 4, 'https://images.unsplash.com/photo-1695442443973-40067c5f3d7a?q=80&w=1200&h=800&auto=format&fit=crop', 'Chùa Bà Đen Tây Ninh', FALSE, '2024-04-15 13:00:00', ST_SetSRID(ST_MakePoint(106.201, 11.367), 4326)),
-- Bidoup
(16, 3, 'https://images.unsplash.com/photo-1686242228254-ca3bedc1db57?q=80&w=1200&h=800&auto=format&fit=crop', 'Rừng già Bidoup Núi Bà', TRUE, '2024-12-01 09:30:00', ST_SetSRID(ST_MakePoint(108.5, 12.1), 4326));

-- ==========================================
-- 6. OFFLINE MAPS - 5 regions
-- ==========================================

-- ==========================================
-- Additional featured images for trails that were missing (17-20)
-- ==========================================
INSERT INTO trail_images (trail_id, uploaded_by, image_url, caption, is_featured, taken_at, location) VALUES
(17, 3, 'https://images.unsplash.com/photo-1552394459-917cbbffbc84?q=80&w=1200&h=800&auto=format&fit=crop', 'Núi Tây Côn Lĩnh sương mù', TRUE, '2024-11-05 07:45:00', ST_SetSRID(ST_MakePoint(104.8, 22.7), 4326)),
(18, 8, 'https://images.unsplash.com/photo-1686755660203-55781dbc2f24?q=80&w=1200&h=800&auto=format&fit=crop', 'Cổng Trời Quản Bạ', TRUE, '2024-09-15 08:20:00', ST_SetSRID(ST_MakePoint(104.9, 23.0), 4326)),
(19, 2, 'https://images.unsplash.com/photo-1595634840658-26e8575ded94?q=80&w=1200&h=800&auto=format&fit=crop', 'Hồ Ba Bể bình minh', TRUE, '2024-10-22 06:50:00', ST_SetSRID(ST_MakePoint(105.6, 22.4), 4326)),
(20, 4, 'https://images.unsplash.com/photo-1462688681110-15bc88b1497c?q=80&w=1200&h=800&auto=format&fit=crop', 'Núi Dinh khung cảnh sớm mai', TRUE, '2024-11-11 07:10:00', ST_SetSRID(ST_MakePoint(107.1, 10.5), 4326));

INSERT INTO offline_map_regions (region_id, name, description, bounding_box, zoom_levels, size_mb, version, is_active) VALUES
(1, 'Tây Bắc Việt Nam', 'Bản đồ offline khu vực Tây Bắc bao gồm Sapa, Fansipan, Mù Cang Chải', 
 ST_GeomFromText('POLYGON((102.0 20.0, 105.0 20.0, 105.0 23.0, 102.0 23.0, 102.0 20.0))', 4326),
 '[10, 11, 12, 13, 14, 15, 16]'::jsonb, 250.5, '1.2', TRUE),
(2, 'Đà Lạt và Tây Nguyên', 'Bản đồ offline Đà Lạt, Lang Bian, và các khu vực lân cận',
 ST_GeomFromText('POLYGON((107.5 11.0, 109.0 11.0, 109.0 12.5, 107.5 12.5, 107.5 11.0))', 4326),
 '[10, 11, 12, 13, 14, 15]'::jsonb, 180.2, '1.1', TRUE),
(3, 'Vịnh Hạ Long - Cát Bà', 'Bản đồ offline vịnh Hạ Long, Bái Tử Long, đảo Cát Bà',
 ST_GeomFromText('POLYGON((106.5 20.5, 108.0 20.5, 108.0 21.5, 106.5 21.5, 106.5 20.5))', 4326),
 '[10, 11, 12, 13, 14, 15]'::jsonb, 210.8, '1.3', TRUE),
(4, 'Miền Trung - Bạch Mã', 'Bản đồ offline khu vực Bạch Mã, Đèo Hải Vân',
 ST_GeomFromText('POLYGON((107.0 15.5, 108.5 15.5, 108.5 17.0, 107.0 17.0, 107.0 15.5))', 4326),
 '[10, 11, 12, 13, 14]'::jsonb, 165.3, '1.0', TRUE),
(5, 'Tây Ninh - An Giang', 'Bản đồ offline núi Bà Đen và rừng Trà Sư',
 ST_GeomFromText('POLYGON((105.5 10.0, 107.0 10.0, 107.0 12.0, 105.5 12.0, 105.5 10.0))', 4326),
 '[10, 11, 12, 13]'::jsonb, 145.7, '1.1', TRUE);

INSERT INTO user_offline_maps (user_id, region_id, download_date, last_accessed, access_count, is_downloaded, download_progress, device_id) VALUES
(1, 1, '2024-03-01 10:00:00', '2024-03-15 08:00:00', 12, TRUE, 100, 'android_12345'),
(1, 2, '2024-03-02 14:00:00', '2024-04-20 09:00:00', 8, TRUE, 100, 'android_12345'),
(2, 1, '2024-02-28 09:00:00', '2024-03-10 07:00:00', 15, TRUE, 100, 'iphone_67890'),
(3, 2, '2024-04-15 11:00:00', '2024-04-25 10:00:00', 5, TRUE, 100, 'android_54321'),
(4, 3, '2024-06-10 16:00:00', '2024-06-15 14:00:00', 3, TRUE, 100, 'iphone_98765'),
(5, 1, '2024-01-15 08:00:00', '2024-03-20 11:00:00', 25, TRUE, 100, 'web_55555'),
(7, 4, '2024-05-01 13:00:00', '2024-05-10 15:00:00', 7, TRUE, 100, 'android_77777');

-- ==========================================
-- 7. CHUYẾN ĐI (TRIPS) - 20 trips
-- ==========================================

INSERT INTO trips (trip_id, uuid, user_id, trail_id, name, description, is_public, visibility, 
                   planned_start_date, planned_end_date, actual_start_date, actual_end_date, status,
                   is_group_trip, group_size, ai_generated_itinerary, estimated_distance_km, estimated_duration_hours) VALUES
(1, uuid_generate_v4(), 1, 1, 'Chinh phục Fansipan tháng 3', 'Hành trình 2 ngày 1 đêm chinh phục đỉnh Fansipan', TRUE, 'PUBLIC',
 '2024-03-14 06:00:00+07', '2024-03-15 18:00:00+07', '2024-03-14 06:30:00+07', '2024-03-15 17:45:00+07', 'COMPLETED',
 FALSE, 1, '{"day1": "6:00 - Khởi hành từ Hà Nội", "day2": "5:00 - Leo lên đỉnh Fansipan"}'::jsonb, 25.0, 24),
(2, uuid_generate_v4(), 2, 1, 'Fansipan cùng nhóm bạn', 'Đi cùng 4 người bạn, chinh phục Fansipan trong 3 ngày', TRUE, 'FRIENDS_ONLY',
 '2024-03-20 05:00:00+07', '2024-03-22 20:00:00+07', '2024-03-20 05:15:00+07', '2024-03-22 19:30:00+07', 'COMPLETED',
 TRUE, 5, '{"day1": "Trek đến trạm 2200m", "day2": "Leo lên đỉnh và quay về trạm", "day3": "Về Hà Nội"}'::jsonb, 25.0, 36),
(3, uuid_generate_v4(), 3, 2, 'Đà Lạt cuối tuần', 'Trekking nhẹ nhàng ở Đà Lạt vào cuối tuần', TRUE, 'PUBLIC',
 '2024-04-20 08:00:00+07', '2024-04-20 17:00:00+07', '2024-04-20 08:30:00+07', '2024-04-20 16:45:00+07', 'COMPLETED',
 FALSE, 1, '{"schedule": "8:30 - Bắt đầu trek, 12:00 - Ăn trưa bên hồ"}'::jsonb, 5.2, 8),
(4, uuid_generate_v4(), 7, 4, 'Bạch Mã mùa hè', 'Trekking Bạch Mã để tránh nóng', TRUE, 'PUBLIC',
 '2024-05-05 07:00:00+07', '2024-05-05 18:00:00+07', '2024-05-05 07:20:00+07', '2024-05-05 17:50:00+07', 'COMPLETED',
 FALSE, 1, '{"morning": "Leo lên đỉnh", "afternoon": "Khám phá thác"}'::jsonb, 16.8, 10),
(5, uuid_generate_v4(), 10, 5, 'Cát Bà 2 ngày 1 đêm', 'Khám phá đảo Cát Bà và trekking lên đỉnh Ngự Lâm', TRUE, 'PUBLIC',
 '2024-06-12 09:00:00+07', '2024-06-13 16:00:00+07', '2024-06-12 09:30:00+07', '2024-06-13 15:30:00+07', 'COMPLETED',
 TRUE, 3, '{"day1": "Trekking trong rừng", "day2": "Leo đỉnh Ngự Lâm"}'::jsonb, 15.0, 12),
(6, uuid_generate_v4(), 4, 6, 'Núi Chúa mùa khô', 'Thử thách bản thân với sa mạc Ninh Thuận', TRUE, 'PUBLIC',
 '2024-01-25 06:00:00+07', '2024-01-26 20:00:00+07', '2024-01-25 06:30:00+07', '2024-01-26 19:00:00+07', 'COMPLETED',
 TRUE, 2, '{"day1": "Vượt sa mạc", "day2": "Leo núi và xuống biển"}'::jsonb, 25.0, 26),
(7, uuid_generate_v4(), 8, 7, 'Pù Luông mùa lúa chín', 'Ngắm ruộng bậc thang Pù Luông vào mùa lúa chín', TRUE, 'PUBLIC',
 '2024-09-08 07:00:00+07', '2024-09-09 17:00:00+07', '2024-09-08 07:15:00+07', '2024-09-09 16:30:00+07', 'COMPLETED',
 FALSE, 1, '{"day1": "Trek qua các bản làng", "day2": "Ngắm ruộng bậc thang"}'::jsonb, 18.0, 14),
(8, uuid_generate_v4(), 2, 8, 'Tà Năng - Phan Dũng classic', 'Chinh phục cung trekking đẹp nhất Việt Nam', TRUE, 'PUBLIC',
 '2024-10-15 05:00:00+07', '2024-10-17 20:00:00+07', '2024-10-15 05:30:00+07', '2024-10-17 19:00:00+07', 'COMPLETED',
 TRUE, 4, '{"day1": "Đồi cỏ Tà Năng", "day2": "Rừng thông Phan Dũng", "day3": "Về TP.HCM"}'::jsonb, 55.0, 48),
(9, uuid_generate_v4(), 9, 9, 'Hải Vân một ngày', 'Chụp ảnh đèo Hải Vân và trekking nhẹ', TRUE, 'PUBLIC',
 '2024-07-22 08:00:00+07', '2024-07-22 17:00:00+07', '2024-07-22 08:45:00+07', '2024-07-22 16:30:00+07', 'COMPLETED',
 FALSE, 1, '{"schedule": "Sáng chụp ảnh, chiều trekking"}'::jsonb, 8.0, 8),
(10, uuid_generate_v4(), 6, 10, 'Hạ Long ngắn ngày', 'Trekking Hạ Long và tham quan hang động', TRUE, 'PUBLIC',
 '2024-11-30 09:00:00+07', '2024-11-30 16:00:00+07', '2024-11-30 09:20:00+07', '2024-11-30 15:45:00+07', 'COMPLETED',
 TRUE, 2, '{"schedule": "Tham quan hang, trek lên đỉnh"}'::jsonb, 3.5, 6);

-- Thêm 10 trips nữa với các trạng thái khác nhau
INSERT INTO trips (trip_id, user_id, trail_id, name, status, planned_start_date, planned_end_date, is_group_trip, group_size) VALUES
(11, 3, 11, 'Lang Bian sắp tới', 'PLANNING', '2024-12-10 07:00:00+07', '2024-12-10 17:00:00+07', FALSE, 1),
(12, 7, 12, 'Ô Quy Hồ mùa đông', 'PLANNED', '2024-12-25 06:00:00+07', '2024-12-27 18:00:00+07', TRUE, 3),
(13, 6, 13, 'Trà Sư mùa nước nổi', 'ONGOING', '2024-11-20 08:00:00+07', '2024-11-20 16:00:00+07', FALSE, 1),
(14, 4, 14, 'Núi Bà Đen cuối tuần', 'COMPLETED', '2024-04-15 07:00:00+07', '2024-04-15 16:00:00+07', TRUE, 2),
(15, 10, 15, 'Bái Tử Long tháng 10', 'CANCELLED', '2024-10-20 08:00:00+07', '2024-10-21 17:00:00+07', TRUE, 4),
(16, 1, 3, 'Cúc Phương tháng 2', 'COMPLETED', '2024-02-10 07:00:00+07', '2024-02-11 18:00:00+07', FALSE, 1),
(17, 2, 8, 'Tà Năng lần 2', 'PLANNED', '2024-11-01 05:00:00+07', '2024-11-03 20:00:00+07', TRUE, 6),
(18, 8, 7, 'Pù Luông với gia đình', 'PLANNING', '2024-12-05 08:00:00+07', '2024-12-07 17:00:00+07', TRUE, 4),
(19, 9, 9, 'Hải Vân chụp ảnh hoàng hôn', 'PLANNED', '2024-12-15 14:00:00+07', '2024-12-15 19:00:00+07', FALSE, 1),
(20, 5, 1, 'Fansipan kiểm tra hệ thống', 'COMPLETED', '2024-03-01 06:00:00+07', '2024-03-02 18:00:00+07', FALSE, 1);

-- Cập nhật thông tin thực tế cho các trip đã hoàn thành
UPDATE trips SET 
    actual_distance_km = 25.5,
    actual_duration_hours = 24.5,
    weather_snapshot = '{"temperature": "15-20°C", "condition": "PARTLY_CLOUDY", "rain_probability": 20}'::jsonb
WHERE trip_id = 1;

UPDATE trips SET 
    actual_distance_km = 26.2,
    actual_duration_hours = 37.0,
    weather_snapshot = '{"temperature": "10-18°C", "condition": "CLOUDY", "rain_probability": 40}'::jsonb
WHERE trip_id = 2;

UPDATE trips SET 
    actual_distance_km = 5.5,
    actual_duration_hours = 8.5,
    weather_snapshot = '{"temperature": "18-25°C", "condition": "CLEAR", "rain_probability": 10}'::jsonb
WHERE trip_id = 3;

-- ==========================================
-- 8. CHECKLIST TRANG BỊ - 30 items
-- ==========================================

-- Checklist cho trip Fansipan (trip_id = 1)
INSERT INTO trip_checklists (trip_id, category, item_name, quantity, weight_grams, is_essential, is_packed, sort_order) VALUES
(1, 'CLOTHING', 'Áo khoác gió, chống nước', 1, 350, TRUE, TRUE, 1),
(1, 'CLOTHING', 'Áo giữ nhiệt', 2, 400, TRUE, TRUE, 2),
(1, 'CLOTHING', 'Giày trekking', 1, 1200, TRUE, TRUE, 3), 
(1, 'FOOD_WATER', 'Nước uống (2L)', 1, 2000, TRUE, TRUE, 4),
(1, 'FOOD_WATER', 'Thức ăn năng lượng cao', 5, 250, TRUE, TRUE, 5),
(1, 'SHELTER', 'Lều (nếu cần)', 1, 2000, FALSE, FALSE, 6),
(1, 'NAVIGATION', 'Bản đồ offline', 1, 50, TRUE, TRUE, 7),
(1, 'SAFETY', 'Đèn pin/đầu đèn', 1, 150, TRUE, TRUE, 8),
(1, 'SAFETY', 'Bộ sơ cứu', 1, 300, TRUE, TRUE, 9),
(1, 'OTHER', 'Power bank 10000mAh', 1, 200, TRUE, TRUE, 10);

-- Checklist cho trip Đà Lạt (trip_id = 3)
INSERT INTO trip_checklists (trip_id, category, item_name, quantity, is_essential, is_packed, sort_order) VALUES
(3, 'CLOTHING', 'Áo khoác nhẹ', 1, TRUE, TRUE, 1),
(3, 'CLOTHING', 'Giày thể thao', 1, TRUE, TRUE, 2),
(3, 'FOOD_WATER', 'Nước uống (1L)', 1, TRUE, TRUE, 3),
(3, 'OTHER', 'Máy ảnh', 1, FALSE, TRUE, 4),
(3, 'OTHER', 'Ô/dù', 1, FALSE, FALSE, 5);

-- Checklist cho trip Cát Bà (trip_id = 5)
INSERT INTO trip_checklists (trip_id, category, item_name, quantity, is_essential, is_packed, notes) VALUES
(5, 'CLOTHING', 'Áo bơi', 1, FALSE, TRUE, 'Để tắm biển'),
(5, 'SHELTER', 'Lều cắm trại', 1, TRUE, TRUE, 'Ngủ qua đêm trên đảo'),
(5, 'FOOD_WATER', 'Thức ăn cho 2 ngày', 1, TRUE, TRUE, 'Mang theo đồ khô'),
(5, 'SAFETY', 'Kem chống nắng', 1, TRUE, TRUE, 'SPF 50+');

-- Checklist cho các trip khác
INSERT INTO trip_checklists (trip_id, category, item_name, quantity, is_essential) VALUES
(2, 'CLOTHING', 'Găng tay leo núi', 1, TRUE),
(2, 'SAFETY', 'Dây thừng 10m', 1, FALSE),
(4, 'OTHER', 'Ống nhòm', 1, FALSE),
(6, 'FOOD_WATER', 'Nước uống (4L)', 1, TRUE),
(6, 'CLOTHING', 'Mũ rộng vành', 1, TRUE),
(7, 'OTHER', 'Máy ảnh DSLR', 1, TRUE),
(8, 'SHELTER', 'Túi ngủ', 1, TRUE),
(8, 'FOOD_WATER', 'Thức ăn cho 3 ngày', 1, TRUE),
(9, 'OTHER', 'Tripod máy ảnh', 1, TRUE),
(10, 'OTHER', 'Áo phao', 1, FALSE);

-- ==========================================
-- 9. TRACKING LOGS - 10 logs
-- ==========================================

INSERT INTO track_logs (track_id, uuid, trip_id, user_id, device_id, start_time, end_time, 
                       total_distance_km, average_speed_kmh, max_speed_kmh, elevation_gain, 
                       elevation_loss, max_elevation, min_elevation, battery_start_percent, 
                       battery_end_percent, weather_conditions, notes) VALUES
(1, uuid_generate_v4(), 1, 1, 'android_12345', '2024-03-14 06:30:00+07', '2024-03-15 17:45:00+07',
 25.5, 2.1, 5.5, 1900, 1900, 3147, 1247, 100, 15,
 '{"temperature_range": "10-18°C", "weather": "PARTLY_CLOUDY", "rain": false}'::jsonb,
 'Hành trình thành công, view tuyệt đẹp trên đỉnh'),
(2, uuid_generate_v4(), 2, 2, 'iphone_67890', '2024-03-20 05:15:00+07', '2024-03-22 19:30:00+07',
 26.2, 1.8, 4.8, 1950, 1950, 3147, 1247, 95, 20,
 '{"temperature_range": "8-16°C", "weather": "CLOUDY", "rain": true, "rain_amount": "light"}'::jsonb,
 'Có mưa nhẹ ngày thứ 2, cần áo mưa'),
(3, uuid_generate_v4(), 3, 3, 'android_54321', '2024-04-20 08:30:00+07', '2024-04-20 16:45:00+07',
 5.5, 3.2, 6.8, 150, 150, 1500, 1350, 85, 45,
 '{"temperature_range": "20-28°C", "weather": "CLEAR", "rain": false}'::jsonb,
 'Thời tiết đẹp, chụp được nhiều ảnh đẹp'),
(4, uuid_generate_v4(), 4, 7, 'android_77777', '2024-05-05 07:20:00+07', '2024-05-05 17:50:00+07',
 17.2, 3.0, 7.2, 1250, 1250, 1450, 250, 90, 30,
 '{"temperature_range": "22-30°C", "weather": "PARTLY_CLOUDY", "rain": false}'::jsonb,
 'Đường đi tốt, view từ đỉnh rất đáng giá'),
(5, uuid_generate_v4(), 5, 10, 'iphone_99999', '2024-06-12 09:30:00+07', '2024-06-13 15:30:00+07',
 16.8, 2.5, 5.8, 450, 450, 331, 0, 100, 25,
 '{"temperature_range": "25-32°C", "weather": "CLEAR", "rain": false, "humidity": "high"}'::jsonb,
 'Nóng nhưng có gió biển mát'),
(6, uuid_generate_v4(), 6, 4, 'android_44444', '2024-01-25 06:30:00+07', '2024-01-26 19:00:00+07',
 26.8, 2.2, 6.0, 1150, 1150, 1040, 0, 95, 10,
 '{"temperature_range": "28-35°C", "weather": "CLEAR", "rain": false, "uv_index": "very_high"}'::jsonb,
 'Rất nóng, cần nhiều nước và kem chống nắng'),
(7, uuid_generate_v4(), 7, 8, 'android_88888', '2024-09-08 07:15:00+07', '2024-09-09 16:30:00+07',
 19.5, 2.8, 6.5, 850, 850, 1700, 900, 80, 20,
 '{"temperature_range": "20-28°C", "weather": "PARTLY_CLOUDY", "rain": false}'::jsonb,
 'Ruộng bậc thang đẹp nhất vào mùa này'),
(8, uuid_generate_v4(), 8, 2, 'iphone_67890', '2024-10-15 05:30:00+07', '2024-10-17 19:00:00+07',
 56.2, 2.3, 7.8, 1850, 1850, 1100, 200, 100, 5,
 '{"temperature_range": "22-30°C", "weather": "CLEAR", "rain": false}'::jsonb,
 'Cung đường dài nhưng cảnh đẹp, xứng đáng'),
(9, uuid_generate_v4(), 9, 9, 'camera_pro', '2024-07-22 08:45:00+07', '2024-07-22 16:30:00+07',
 8.5, 2.8, 5.2, 520, 520, 496, 0, 100, 60,
 '{"temperature_range": "25-33°C", "weather": "CLEAR", "rain": false}'::jsonb,
 'Hoàng hôn trên đèo Hải Vân tuyệt đẹp'),
(10, uuid_generate_v4(), 10, 6, 'android_66666', '2024-11-30 09:20:00+07', '2024-11-30 15:45:00+07',
 4.2, 2.5, 4.8, 170, 170, 168, 0, 90, 40,
 '{"temperature_range": "22-28°C", "weather": "PARTLY_CLOUDY", "rain": false}'::jsonb,
 'View vịnh Hạ Long từ trên cao không thể bỏ lỡ');

-- Cập nhật recorded_path cho track logs (giả lập)
UPDATE track_logs SET recorded_path = ST_GeomFromText('LINESTRING(103.810 22.306, 103.812 22.308, 103.815 22.310)', 4326) WHERE track_id = 1;
UPDATE track_logs SET recorded_path = ST_GeomFromText('LINESTRING(108.441 11.946, 108.443 11.947, 108.445 11.948)', 4326) WHERE track_id = 3;

-- ==========================================
-- 10. MEDIA TRONG HÀNH TRÌNH - 15 media items
-- ==========================================

INSERT INTO trip_media (track_id, user_id, media_type, file_url, thumbnail_url, file_size_bytes, 
                       location, recorded_at, caption, tags, is_favorite) VALUES
(1, 1, 'IMAGE', 'https://trailsexplorer.com/media/fansipan_summit_selfie.jpg', 'https://trailsexplorer.com/media/thumbs/fansipan_summit_selfie_thumb.jpg', 2456789,
 ST_SetSRID(ST_MakePoint(103.815, 22.310), 4326), '2024-03-15 07:45:00+07',
 'Selfie trên đỉnh Fansipan - Nóc nhà Đông Dương', '["fansipan", "summit", "victory", "selfie"]'::jsonb, TRUE),
(1, 1, 'IMAGE', 'https://trailsexplorer.com/media/fansipan_sunrise.jpg', NULL, 3456789,
 ST_SetSRID(ST_MakePoint(103.814, 22.309), 4326), '2024-03-15 06:30:00+07',
 'Bình minh trên đỉnh Fansipan', '["fansipan", "sunrise", "morning", "clouds"]'::jsonb, TRUE),
(2, 2, 'VIDEO', 'https://trailsexplorer.com/media/fansipan_group_climbing.mp4', 'https://trailsexplorer.com/media/thumbs/fansipan_group_climbing_thumb.jpg', 12567890,
 ST_SetSRID(ST_MakePoint(103.812, 22.308), 4326), '2024-03-21 10:30:00+07',
 'Nhóm chúng tôi leo lên đỉnh Fansipan', '["fansipan", "group", "climbing", "friends"]'::jsonb, FALSE),
(3, 3, 'IMAGE', 'https://trailsexplorer.com/media/dalat_flower_field.jpg', NULL, 1876543,
 ST_SetSRID(ST_MakePoint(108.443, 11.947), 4326), '2024-04-20 11:15:00+07',
 'Cánh đồng hoa ở Thung Lũng Tình Yêu', '["dalat", "flowers", "valley", "nature"]'::jsonb, TRUE),
(4, 7, 'IMAGE', 'https://trailsexplorer.com/media/bachma_waterfall.jpg', NULL, 2345678,
 ST_SetSRID(ST_MakePoint(107.800, 16.194), 4326), '2024-05-05 13:45:00+07',
 'Thác Đỗ Quyên trên núi Bạch Mã', '["bachma", "waterfall", "nature", "stream"]'::jsonb, FALSE),
(5, 10, 'IMAGE', 'https://trailsexplorer.com/media/catba_island_view.jpg', NULL, 2987654,
 ST_SetSRID(ST_MakePoint(107.002, 20.803), 4326), '2024-06-13 10:30:00+07',
 'View toàn cảnh vịnh Lan Hạ từ đỉnh Ngự Lâm', '["catba", "island", "seaview", "panorama"]'::jsonb, TRUE),
(6, 4, 'IMAGE', 'https://trailsexplorer.com/media/ninhthuan_desert_sunset.jpg', NULL, 3123456,
 ST_SetSRID(ST_MakePoint(109.220, 11.702), 4326), '2024-01-25 17:45:00+07',
 'Hoàng hôn trên sa mạc Ninh Thuận', '["desert", "sunset", "ninhthuan", "dunes"]'::jsonb, TRUE),
(7, 8, 'IMAGE', 'https://trailsexplorer.com/media/puluong_rice_terrace.jpg', NULL, 2876543,
 ST_SetSRID(ST_MakePoint(105.119, 20.436), 4326), '2024-09-08 16:30:00+07',
 'Ruộng bậc thang Pù Luông vàng óng', '["puluong", "rice-terrace", "harvest", "golden"]'::jsonb, TRUE),
(8, 2, 'IMAGE', 'https://trailsexplorer.com/media/tanang_grassland_panorama.jpg', NULL, 3567890,
 ST_SetSRID(ST_MakePoint(107.884, 11.317), 4326), '2024-10-16 08:30:00+07',
 'Toàn cảnh đồi cỏ Tà Năng vào buổi sáng', '["tanang", "grassland", "morning", "panorama"]'::jsonb, TRUE),
(9, 9, 'IMAGE', 'https://trailsexplorer.com/media/haivan_sunset.jpg', NULL, 2678901,
 ST_SetSRID(ST_MakePoint(108.202, 16.185), 4326), '2024-07-22 17:45:00+07',
 'Hoàng hôn trên đèo Hải Vân', '["haivan", "sunset", "pass", "ocean-view"]'::jsonb, TRUE),
(10, 6, 'IMAGE', 'https://trailsexplorer.com/media/halong_bay_view.jpg', NULL, 2456789,
 ST_SetSRID(ST_MakePoint(107.087, 20.952), 4326), '2024-11-30 14:30:00+07',
 'Vịnh Hạ Long từ núi Đầu Gỗ', '["halong", "bay", "view", "unesco"]'::jsonb, FALSE);

-- Thêm voice notes và text notes
INSERT INTO trip_media (track_id, user_id, media_type, file_url, caption, location, recorded_at) VALUES
(1, 1, 'VOICE', 'https://trailsexplorer.com/media/fansipan_summit_voice_note.m4a', 'Ghi âm cảm xúc khi đứng trên đỉnh Fansipan',
 ST_SetSRID(ST_MakePoint(103.815, 22.310), 4326), '2024-03-15 07:50:00+07'),
(3, 3, 'TEXT_NOTE', 'text://note/dalat_trip', 'Ghi chú: Mua hoa tại vườn hoa Thành phố, ăn trưa tại nhà hàng Rừng Thông',
 ST_SetSRID(ST_MakePoint(108.445, 11.948), 4326), '2024-04-20 16:30:00+07'),
(8, 2, 'VOICE', 'https://trailsexplorer.com/media/tanang_camping_night.m4a', 'Ghi âm đêm cắm trại tại Tà Năng',
 ST_SetSRID(ST_MakePoint(107.885, 11.318), 4326), '2024-10-16 21:00:00+07');

-- ==========================================
-- 11. SAFETY ALERTS - 8 alerts
-- ==========================================

INSERT INTO safety_alerts (alert_id, alert_type, severity, title, description, location, 
                          affected_radius_meters, affected_trail_ids, issued_at, expires_at, 
                          is_active, source, confidence_level, instructions, created_by) VALUES
(1, 'WEATHER', 'HIGH', 'Cảnh báo mưa lớn khu vực Tây Bắc',
 'Dự báo mưa lớn từ đêm nay đến sáng mai tại khu vực Sapa, Fansipan. Nguy cơ lũ quét, sạt lở đất cao.',
 ST_SetSRID(ST_MakePoint(103.8102, 22.3067), 4326), 50000, '{1, 12}',
 '2024-03-13 18:00:00+07', '2024-03-15 12:00:00+07', FALSE,
 'WEATHER_API', 85,
 '{"1": "Tránh đi trekking trong 48h tới", "2": "Nếu đang trên đường, tìm nơi trú ẩn an toàn", "3": "Theo dõi thông tin thời tiết"}'::jsonb,
 5),

(2, 'TRAIL_CLOSURE', 'MEDIUM', 'Đường lên đỉnh Fansipan tạm đóng',
 'Đường leo Fansipan tạm đóng để bảo trì từ ngày 20-25/3. Cáp treo vẫn hoạt động bình thường.',
 ST_SetSRID(ST_MakePoint(103.815, 22.310), 4326), 10000, '{1}',
 '2024-03-19 08:00:00+07', '2024-03-25 23:59:00+07', TRUE,
 'ADMIN', 100,
 '{"1": "Không đi trekking lên đỉnh trong thời gian này", "2": "Có thể sử dụng cáp treo", "3": "Liên hệ 0912345678 để biết thêm"}'::jsonb,
 5),

(3, 'WILDLIFE', 'LOW', 'Xuất hiện gấu tại Vườn Quốc Gia Cúc Phương',
 'Có báo cáo về việc xuất hiện gấu tại khu vực Trung tâm Cứu hộ Linh trưởng. Du khách cần thận trọng.',
 ST_SetSRID(ST_MakePoint(105.717, 20.257), 4326), 3000, '{3}',
 '2024-02-15 10:00:00+07', '2024-02-28 23:59:00+07', TRUE,
 'USER_REPORT', 70,
 '{"1": "Đi theo nhóm", "2": "Mang theo chuông hoặc tạo tiếng động khi đi", "3": "Không mang theo thức ăn có mùi mạnh"}'::jsonb,
 1),

(4, 'FIRE', 'CRITICAL', 'Cháy rừng tại khu vực Tà Năng',
 'Đang có cháy rừng tại khu vực đồi cỏ Tà Năng. Tất cả hoạt động trekking tạm dừng.',
 ST_SetSRID(ST_MakePoint(107.884, 11.317), 4326), 20000, '{8}',
 '2024-10-10 14:00:00+07', '2024-10-20 23:59:00+07', TRUE,
 'GOVERNMENT', 95,
 '{"1": "KHÔNG đến khu vực này", "2": "Nếu đang ở đó, di tản ngay lập tức", "3": "Liên hệ 114 để báo cháy"}'::jsonb,
 5),

(5, 'LANDSLIDE', 'HIGH', 'Nguy cơ sạt lở đèo Hải Vân',
 'Sau đợt mưa lớn, có nguy cơ sạt lở tại một số đoạn đèo Hải Vân. Cần thận trọng khi di chuyển.',
 ST_SetSRID(ST_MakePoint(108.202, 16.185), 4326), 5000, '{9}',
 '2024-07-25 09:00:00+07', '2024-08-05 23:59:00+07', TRUE,
 'SYSTEM', 80,
 '{"1": "Đi vào ban ngày", "2": "Quan sát kỹ trước khi qua các đoạn nghi ngờ", "3": "Mang theo thiết bị liên lạc"}'::jsonb,
 5),

(6, 'WEATHER', 'MEDIUM', 'Nắng nóng cực độ tại Ninh Thuận',
 'Nhiệt độ có thể lên đến 38-40°C tại khu vực núi Chúa trong 3 ngày tới. Nguy cơ say nắng cao.',
 ST_SetSRID(ST_MakePoint(109.220, 11.702), 4326), 30000, '{6}',
 '2024-01-20 08:00:00+07', '2024-01-23 20:00:00+07', FALSE,
 'WEATHER_API', 90,
 '{"1": "Mang đủ nước (ít nhất 4L/người/ngày)", "2": "Đi vào sáng sớm hoặc chiều muộn", "3": "Mặc quần áo chống nắng"}'::jsonb,
 5),

(7, 'OTHER', 'LOW', 'Lễ hội tại núi Bà Đen',
 'Có lễ hội lớn tại núi Bà Đen từ ngày 10-15/4. Đông người, khó tìm chỗ đỗ xe.',
 ST_SetSRID(ST_MakePoint(106.201, 11.367), 4326), 2000, '{14}',
 '2024-04-05 10:00:00+07', '2024-04-16 23:59:00+07', TRUE,
 'ADMIN', 100,
 '{"1": "Đi sớm để tránh đông", "2": "Xem xét sử dụng phương tiện công cộng", "3": "Mang theo tiền mặt"}'::jsonb,
 5),

(8, 'SOS', 'CRITICAL', 'Người đi trekking mất tích tại Pù Luông',
 'Một trekker đã mất liên lạc từ chiều qua tại khu vực bản Ước Lễ, Pù Luông.',
 ST_SetSRID(ST_MakePoint(105.118, 20.435), 4326), 10000, '{7}',
 '2024-09-10 20:00:00+07', '2024-09-12 23:59:00+07', TRUE,
 'USER_REPORT', 60,
 '{"1": "Nếu thấy người này, liên hệ ngay 113", "2": "Mô tả: nam, 175cm, áo đỏ, quần xanh", "3": "Không tự ý tìm kiếm nếu không có kinh nghiệm"}'::jsonb,
 8);

-- ==========================================
-- 12. USER RECEIVED ALERTS - 20 notifications
-- ==========================================

INSERT INTO user_received_alerts (user_id, alert_id, received_at, read_at, acknowledged_at, 
                                  delivery_method, delivery_status) VALUES
-- Users nhận cảnh báo Fansipan
(1, 1, '2024-03-13 18:05:00+07', '2024-03-13 18:10:00+07', '2024-03-13 18:15:00+07', 'PUSH', 'DELIVERED'),
(2, 1, '2024-03-13 18:05:00+07', '2024-03-13 18:12:00+07', NULL, 'PUSH', 'DELIVERED'),
(3, 1, '2024-03-13 18:05:00+07', NULL, NULL, 'PUSH', 'DELIVERED'),
(7, 1, '2024-03-13 18:05:00+07', '2024-03-13 19:00:00+07', '2024-03-13 19:05:00+07', 'PUSH', 'DELIVERED'),

-- Users nhận cảnh báo Tà Năng cháy rừng
(2, 4, '2024-10-10 14:10:00+07', '2024-10-10 14:15:00+07', '2024-10-10 14:20:00+07', 'PUSH', 'DELIVERED'),
(4, 4, '2024-10-10 14:10:00+07', '2024-10-10 14:30:00+07', NULL, 'SMS', 'DELIVERED'),
(8, 4, '2024-10-10 14:10:00+07', NULL, NULL, 'EMAIL', 'SENT'),

-- Users nhận cảnh báo Cúc Phương
(1, 3, '2024-02-15 10:05:00+07', '2024-02-15 10:10:00+07', NULL, 'PUSH', 'DELIVERED'),
(3, 3, '2024-02-15 10:05:00+07', '2024-02-15 11:00:00+07', '2024-02-15 11:05:00+07', 'PUSH', 'DELIVERED'),
(6, 3, '2024-02-15 10:05:00+07', NULL, NULL, 'PUSH', 'DELIVERED'),

-- Users nhận cảnh báo Hải Vân
(5, 5, '2024-07-25 09:05:00+07', '2024-07-25 09:10:00+07', '2024-07-25 09:15:00+07', 'PUSH', 'DELIVERED'),
(9, 5, '2024-07-25 09:05:00+07', '2024-07-25 10:00:00+07', NULL, 'PUSH', 'DELIVERED'),

-- Users nhận cảnh báo Ninh Thuận
(4, 6, '2024-01-20 08:05:00+07', '2024-01-20 08:10:00+07', '2024-01-20 08:15:00+07', 'PUSH', 'DELIVERED'),
(6, 6, '2024-01-20 08:05:00+07', NULL, NULL, 'SMS', 'DELIVERED'),

-- Users nhận cảnh báo Pù Luông SOS
(1, 8, '2024-09-10 20:05:00+07', '2024-09-10 20:10:00+07', '2024-09-10 20:15:00+07', 'PUSH', 'DELIVERED'),
(7, 8, '2024-09-10 20:05:00+07', '2024-09-10 20:30:00+07', NULL, 'PUSH', 'DELIVERED'),
(8, 8, '2024-09-10 20:05:00+07', '2024-09-10 21:00:00+07', '2024-09-10 21:05:00+07', 'SMS', 'DELIVERED');

-- ==========================================
-- 13. EMERGENCY CONTACTS - 15 contacts
-- ==========================================

INSERT INTO emergency_contacts (contact_id, user_id, name, phone, email, relationship, priority, is_primary) VALUES
(1, 1, 'Nguyễn Văn A (Bố)', '+84987651234', 'bố.thao@email.com', 'Bố', 1, TRUE),
(2, 1, 'Trần Thị B (Mẹ)', '+84987654321', 'me.thao@email.com', 'Mẹ', 2, FALSE),
(3, 2, 'Phạm Văn C (Anh trai)', '+84912345678', 'anh.tuan@email.com', 'Anh trai', 1, TRUE),
(4, 3, 'Hoàng Văn D (Bạn trai)', '+84955556666', 'ban.trai.lan@email.com', 'Bạn trai', 1, TRUE),
(5, 4, 'Trần Thị E (Vợ)', '+84966667777', 'vo.minh@email.com', 'Vợ', 1, TRUE),
(6, 5, 'Công An TP Hà Nội', '113', NULL, 'Cơ quan chức năng', 1, TRUE),
(7, 6, 'Lê Văn F (Chồng)', '+84977778888', 'chong.hoa@email.com', 'Chồng', 1, TRUE),
(8, 7, 'Võ Thị G (Chị gái)', '+84988889999', 'chi.dung@email.com', 'Chị gái', 1, TRUE),
(9, 8, 'Đào Văn H (Bạn thân)', '+84999990000', 'ban.mai@email.com', 'Bạn thân', 1, TRUE),
(10, 9, 'Bùi Thị I (Mẹ)', '+84900001111', 'me.hieu@email.com', 'Mẹ', 1, TRUE),
(11, 10, 'Nguyễn Văn J (Anh rể)', '+84911112222', 'anh.linh@email.com', 'Anh rể', 1, TRUE),
(12, 2, 'Cứu hộ Sapa', '0203 871 555', NULL, 'Cứu hộ địa phương', 2, FALSE),
(13, 4, 'Cứu hộ Ninh Thuận', '0259 382 111', NULL, 'Cứu hộ địa phương', 2, FALSE),
(14, 7, 'Cứu hộ miền Trung', '0234 389 222', NULL, 'Cứu hộ địa phương', 2, FALSE),
(15, 8, 'Cứu hộ Thanh Hóa', '0237 385 333', NULL, 'Cứu hộ địa phương', 3, FALSE);

-- ==========================================
-- 14. SAFETY CHECKPOINTS - 20 checkpoints
-- ==========================================

INSERT INTO safety_checkpoints (checkpoint_id, trail_id, name, description, location, 
                               distance_from_start_km, checkpoint_type, check_in_required, 
                               has_phone_signal, emergency_contact) VALUES
-- Checkpoints cho Fansipan
(1, 1, 'Cổng Vườn Quốc Gia Hoàng Liên', 'Điểm xuất phát chính thức', ST_SetSRID(ST_MakePoint(103.810, 22.306), 4326),
 0.0, 'MANDATORY', TRUE, TRUE, '0203 871 555 - Trạm kiểm lâm'),
(2, 1, 'Trạm Cứu Hộ 2200m', 'Trạm nghỉ đêm chính', ST_SetSRID(ST_MakePoint(103.812, 22.308), 4326),
 6.8, 'MANDATORY', TRUE, FALSE, 'Nhân viên trạm cứu hộ'),
(3, 1, 'Đỉnh Fansipan 3147m', 'Điểm đến cuối cùng', ST_SetSRID(ST_MakePoint(103.815, 22.310), 4326),
 12.5, 'MANDATORY', TRUE, TRUE, '0203 871 555'),

-- Checkpoints cho Tà Năng - Phan Dũng
(4, 8, 'Điểm Xuất Phát Tà Năng', 'Bắt đầu từ xã Tà Năng', ST_SetSRID(ST_MakePoint(107.883, 11.316), 4326),
 0.0, 'MANDATORY', TRUE, TRUE, '0251 386 444 - Công an xã Tà Năng'),
(5, 8, 'Đồi Cỏ Trung Tâm', 'Điểm giữa của đồi cỏ', ST_SetSRID(ST_MakePoint(107.884, 11.317), 4326),
 15.2, 'RECOMMENDED', FALSE, FALSE, NULL),
(6, 8, 'Rừng Thông Phan Dũng', 'Điểm vào rừng thông', ST_SetSRID(ST_MakePoint(107.886, 11.319), 4326),
 35.5, 'MANDATORY', TRUE, FALSE, 'Nhân viên kiểm lâm'),
(7, 8, 'Điểm Kết Thúc Phan Dũng', 'Kết thúc tại xã Phan Dũng', ST_SetSRID(ST_MakePoint(107.887, 11.320), 4326),
 55.0, 'MANDATORY', TRUE, TRUE, '0251 387 555 - Công an xã Phan Dũng'),

-- Checkpoints cho Bạch Mã
(8, 4, 'Cổng VQG Bạch Mã', 'Điểm xuất phát', ST_SetSRID(ST_MakePoint(107.799, 16.193), 4326),
 0.0, 'MANDATORY', TRUE, TRUE, '0234 389 222 - Trạm kiểm lâm'),
(9, 4, 'Thác Đỗ Quyên', 'Điểm nghỉ giữa đường', ST_SetSRID(ST_MakePoint(107.800, 16.194), 4326),
 5.2, 'RECOMMENDED', FALSE, FALSE, NULL),
(10, 4, 'Đỉnh Bạch Mã', 'Điểm đến cuối cùng', ST_SetSRID(ST_MakePoint(107.803, 16.197), 4326),
 16.8, 'MANDATORY', TRUE, TRUE, '0234 389 222'),

-- Checkpoints cho Núi Chúa
(11, 6, 'Trạm Kiểm Lâm Vĩnh Hy', 'Điểm xuất phát từ biển', ST_SetSRID(ST_MakePoint(109.217, 11.700), 4326),
 0.0, 'MANDATORY', TRUE, TRUE, '0259 382 111 - Trạm kiểm lâm'),
(12, 6, 'Giữa Sa Mạc', 'Điểm kiểm tra giữa sa mạc', ST_SetSRID(ST_MakePoint(109.220, 11.702), 4326),
 12.5, 'EMERGENCY', TRUE, FALSE, 'Hộp cứu thương số 1'),
(13, 6, 'Đỉnh Núi Chúa', 'Đỉnh cao nhất', ST_SetSRID(ST_MakePoint(109.222, 11.703), 4326),
 20.0, 'MANDATORY', TRUE, TRUE, '0259 382 111'),

-- Checkpoints cho Pù Luông
(14, 7, 'Bản Ước Lễ', 'Điểm xuất phát và nghỉ đêm', ST_SetSRID(ST_MakePoint(105.118, 20.435), 4326),
 0.0, 'MANDATORY', TRUE, TRUE, '0237 385 333 - Trưởng bản'),
(15, 7, 'Đèo Cao Nhất', 'Điểm cao nhất của cung đường', ST_SetSRID(ST_MakePoint(105.119, 20.436), 4326),
 10.2, 'RECOMMENDED', FALSE, FALSE, NULL),
(16, 7, 'Bản Kết Thúc', 'Điểm kết thúc hành trình', ST_SetSRID(ST_MakePoint(105.120, 20.437), 4326),
 15.3, 'MANDATORY', TRUE, TRUE, '0237 386 444 - Trưởng bản'),

-- Checkpoints cho các trail khác
(17, 2, 'Vườn Hoa Thành Phố', 'Điểm xuất phát', ST_SetSRID(ST_MakePoint(108.441, 11.946), 4326),
 0.0, 'RECOMMENDED', FALSE, TRUE, '0263 381 111 - Công viên'),
(18, 5, 'Bến Thuyền Cát Bà', 'Điểm tập trung', ST_SetSRID(ST_MakePoint(106.997, 20.799), 4326),
 0.0, 'MANDATORY', TRUE, TRUE, '0225 388 777 - Ban quản lý'),
(19, 9, 'Chân Đèo Hải Vân', 'Điểm bắt đầu leo đèo', ST_SetSRID(ST_MakePoint(108.200, 16.183), 4326),
 0.0, 'RECOMMENDED', FALSE, TRUE, 'Cảnh sát giao thông 113'),
(20, 12, 'Chân Đèo Ô Quy Hồ', 'Điểm xuất phát đèo Ô Quy Hồ', ST_SetSRID(ST_MakePoint(103.667, 22.417), 4326),
 0.0, 'MANDATORY', TRUE, TRUE, '0213 387 666 - Trạm kiểm lâm');

-- ==========================================
-- 15. CHECKPOINT LOGS - 15 logs
-- ==========================================

INSERT INTO checkpoint_logs (checkpoint_id, user_id, trip_id, planned_checkin_time, actual_checkin_time, 
                            status, notes, actual_location, battery_percent) VALUES
-- Logs cho trip Fansipan của user 1
(1, 1, 1, '2024-03-14 07:00:00+07', '2024-03-14 06:45:00+07', 'EARLY', 
 'Đã check-in tại cổng, thời tiết tốt', ST_SetSRID(ST_MakePoint(103.810, 22.306), 4326), 95),
(2, 1, 1, '2024-03-14 18:00:00+07', '2024-03-14 17:30:00+07', 'EARLY',
 'Đã đến trạm 2200m, sẽ nghỉ đêm ở đây', ST_SetSRID(ST_MakePoint(103.812, 22.308), 4326), 65),
(3, 1, 1, '2024-03-15 08:00:00+07', '2024-03-15 07:45:00+07', 'EARLY',
 'Đã lên đỉnh! View tuyệt đẹp', ST_SetSRID(ST_MakePoint(103.815, 22.310), 4326), 45),

-- Logs cho trip Fansipan của user 2 (nhóm)
(1, 2, 2, '2024-03-20 07:00:00+07', '2024-03-20 06:50:00+07', 'EARLY',
 'Cả nhóm 5 người đã check-in', ST_SetSRID(ST_MakePoint(103.810, 22.306), 4326), 90),
(2, 2, 2, '2024-03-20 17:00:00+07', '2024-03-20 18:30:00+07', 'LATE',
 'Một thành viên bị chậm, cả nhóm đến muộn', ST_SetSRID(ST_MakePoint(103.812, 22.308), 4326), 70),

-- Logs cho trip Tà Năng
(4, 2, 8, '2024-10-15 06:00:00+07', '2024-10-15 05:45:00+07', 'EARLY',
 'Nhóm 4 người đã sẵn sàng', ST_SetSRID(ST_MakePoint(107.883, 11.316), 4326), 95),
(5, 2, 8, '2024-10-15 14:00:00+07', '2024-10-15 13:30:00+07', 'EARLY',
 'Đã đến đồi cỏ, cảnh đẹp', ST_SetSRID(ST_MakePoint(107.884, 11.317), 4326), 65),
(7, 2, 8, '2024-10-17 18:00:00+07', '2024-10-17 17:15:00+07', 'EARLY',
 'Đã hoàn thành hành trình!', ST_SetSRID(ST_MakePoint(107.887, 11.320), 4326), 10),

-- Logs cho trip Bạch Mã
(8, 7, 4, '2024-05-05 08:00:00+07', '2024-05-05 07:45:00+07', 'EARLY',
 'Check-in tại cổng VQG', ST_SetSRID(ST_MakePoint(107.799, 16.193), 4326), 90),
(10, 7, 4, '2024-05-05 16:00:00+07', '2024-05-05 15:45:00+07', 'EARLY',
 'Đã lên đỉnh Bạch Mã', ST_SetSRID(ST_MakePoint(107.803, 16.197), 4326), 50),

-- Logs cho trip Núi Chúa
(11, 4, 6, '2024-01-25 07:00:00+07', '2024-01-25 06:45:00+07', 'EARLY',
 'Bắt đầu từ bãi biển Vĩnh Hy', ST_SetSRID(ST_MakePoint(109.217, 11.700), 4326), 95),
(13, 4, 6, '2024-01-26 16:00:00+07', '2024-01-26 15:30:00+07', 'EARLY',
 'Đã chinh phục đỉnh Núi Chúa', ST_SetSRID(ST_MakePoint(109.222, 11.703), 4326), 25),

-- Logs cho trip Pù Luông
(14, 8, 7, '2024-09-08 08:00:00+07', '2024-09-08 07:45:00+07', 'EARLY',
 'Check-in tại bản Ước Lễ', ST_SetSRID(ST_MakePoint(105.118, 20.435), 4326), 90),
(16, 8, 7, '2024-09-09 16:00:00+07', '2024-09-09 16:45:00+07', 'LATE',
 'Về đến bản cuối, hơi mệt nhưng vui', ST_SetSRID(ST_MakePoint(105.120, 20.437), 4326), 40);

-- ==========================================
-- 16. COMMUNITY POSTS - 25 posts
-- ==========================================

INSERT INTO community_posts (post_id, uuid, user_id, content_type, title, content, media_urls, 
                            trail_id, trip_id, like_count, comment_count, visibility, tags, location) VALUES
(1, uuid_generate_v4(), 1, 'TRIP_REPORT', 'Hành trình chinh phục Fansipan - Nóc nhà Đông Dương',
 'Sau nhiều lần trì hoãn, cuối cùng mình cũng đã chinh phục được đỉnh Fansipan 3147m! Hành trình 2 ngày 1 đêm đầy thử thách nhưng xứng đáng với view tuyệt đẹp trên đỉnh...',
 '["https://trailsexplorer.com/media/fansipan_summit_selfie.jpg", "https://trailsexplorer.com/media/fansipan_sunrise.jpg"]'::jsonb,
 1, 1, 45, 12, 'PUBLIC', '["fansipan", "summit", "achievement", "vietnam"]'::jsonb,
 ST_SetSRID(ST_MakePoint(103.815, 22.310), 4326)),

(2, uuid_generate_v4(), 2, 'TRAIL_REVIEW', 'Review cung đường Tà Năng - Phan Dũng',
 'Đây thực sự là cung đường trekking đẹp nhất mình từng đi! Đồi cỏ xanh mướt vào mùa mưa, rừng thông mát mẻ...',
 '["https://trailsexplorer.com/media/tanang_grassland_panorama.jpg"]'::jsonb,
 8, 8, 78, 25, 'PUBLIC', '["tanang", "grassland", "best-trail", "scenic"]'::jsonb,
 ST_SetSRID(ST_MakePoint(107.884, 11.317), 4326)),

(3, uuid_generate_v4(), 3, 'PHOTO', 'Thung lũng tình yêu Đà Lạt mùa hoa',
 'Chia sẻ vài bức ảnh chụp tại Thung Lũng Tình Yêu Đà Lạt vào cuối tuần vừa rồi. Hoa nở rực rỡ!',
 '["https://trailsexplorer.com/media/dalat_flower_field.jpg"]'::jsonb,
 2, 3, 32, 8, 'PUBLIC', '["dalat", "flowers", "valley", "photography"]'::jsonb,
 ST_SetSRID(ST_MakePoint(108.443, 11.947), 4326)),

(4, uuid_generate_v4(), 7, 'TRIP_REPORT', 'Bạch Mã - View đáng giá mọi nỗ lực',
 'Leo Bạch Mã khá mệt nhưng view từ trên đỉnh thực sự đáng giá. Nhìn thấy cả biển và núi!',
 '["https://trailsexplorer.com/media/bachma_waterfall.jpg"]'::jsonb,
 4, 4, 28, 6, 'PUBLIC', '["bachma", "mountain", "view", "challenge"]'::jsonb,
 ST_SetSRID(ST_MakePoint(107.803, 16.197), 4326)),

(5, uuid_generate_v4(), 10, 'TRIP_REPORT', 'Cát Bà 2 ngày 1 đêm - Trải nghiệm tuyệt vời',
 'Đi Cát Bà không chỉ để tắm biển mà còn để trekking lên đỉnh Ngự Lâm ngắm toàn cảnh vịnh...',
 '["https://trailsexplorer.com/media/catba_island_view.jpg"]'::jsonb,
 5, 5, 41, 15, 'PUBLIC', '["catba", "island", "trekking", "beach"]'::jsonb,
 ST_SetSRID(ST_MakePoint(107.002, 20.803), 4326)),

(6, uuid_generate_v4(), 4, 'TRIP_REPORT', 'Sa mạc Ninh Thuận - Thử thách khắc nghiệt',
 'Núi Chúa thực sự là thử thách với thời tiết nắng nóng khắc nghiệt. Nhưng cảnh quan sa mạc độc đáo...',
 '["https://trailsexplorer.com/media/ninhthuan_desert_sunset.jpg"]'::jsonb,
 6, 6, 36, 9, 'PUBLIC', '["desert", "ninhthuan", "challenge", "hot"]'::jsonb,
 ST_SetSRID(ST_MakePoint(109.220, 11.702), 4326)),

(7, uuid_generate_v4(), 8, 'PHOTO', 'Ruộng bậc thang Pù Luông mùa lúa chín',
 'Pù Luông đẹp nhất vào mùa lúa chín! Chia sẻ vài bức ảnh chụp được trong chuyến đi vừa rồi.',
 '["https://trailsexplorer.com/media/puluong_rice_terrace.jpg"]'::jsonb,
 7, 7, 52, 18, 'PUBLIC', '["puluong", "rice-terrace", "harvest", "vietnam"]'::jsonb,
 ST_SetSRID(ST_MakePoint(105.119, 20.436), 4326)),

(8, uuid_generate_v4(), 9, 'PHOTO', 'Hoàng hôn trên đèo Hải Vân',
 'Đèo Hải Vân không chỉ đẹp vào ban ngày. Hoàng hôn ở đây còn tuyệt vời hơn nữa!',
 '["https://trailsexplorer.com/media/haivan_sunset.jpg"]'::jsonb,
 9, 9, 67, 22, 'PUBLIC', '["haivan", "sunset", "pass", "photography"]'::jsonb,
 ST_SetSRID(ST_MakePoint(108.202, 16.185), 4326)),

(9, uuid_generate_v4(), 6, 'TRAIL_REVIEW', 'Hạ Long từ trên cao - Không thể bỏ lỡ',
 'Trekking lên núi Đầu Gỗ để ngắm vịnh Hạ Long là trải nghiệm không thể bỏ lỡ khi đến đây.',
 '["https://trailsexplorer.com/media/halong_bay_view.jpg"]'::jsonb,
 10, 10, 89, 31, 'PUBLIC', '["halong", "bay", "view", "unesco"]'::jsonb,
 ST_SetSRID(ST_MakePoint(107.087, 20.952), 4326)),

(10, uuid_generate_v4(), 5, 'QUESTION', 'Nên đi Fansipan vào tháng mấy là đẹp nhất?',
 'Mình đang lên kế hoạch đi Fansipan. Các bạn có kinh nghiệm cho mình hỏi nên đi tháng mấy thì thời tiết đẹp và view biển mây đẹp nhất?',
 NULL, 1, NULL, 15, 23, 'PUBLIC', '["fansipan", "advice", "weather", "planning"]'::jsonb, NULL);

-- Thêm 15 posts nữa
INSERT INTO community_posts (post_id, user_id, content_type, title, content, trail_id, like_count, comment_count) VALUES
(11, 2, 'TEXT', 'Tìm bạn đồng hành đi Ô Quy Hồ tháng 12', 'Mình dự định đi Ô Quy Hồ cuối tháng 12. Có ai muốn join không?', 12, 8, 5),
(12, 3, 'PHOTO', 'Lang Bian sương mù', 'Lang Bian đẹp mơ màng trong sương', 11, 24, 7),
(13, 4, 'TRIP_REPORT', 'Núi Bà Đen với gia đình', 'Đi núi Bà Đen với 2 đứa nhỏ. Có cáp treo nên khá dễ', 14, 18, 4),
(14, 6, 'TRAIL_REVIEW', 'Rừng Trà Sư mùa nước nổi', 'Đẹp nhưng nhiều muỗi, nhớ mang thuốc chống muỗi', 13, 22, 9),
(15, 7, 'QUESTION', 'Cần trang bị gì cho trekking mùa đông Tây Bắc?', 'Chuẩn bị đi Tây Bắc vào đông, cần mang theo những gì?', 1, 12, 18),
(16, 8, 'TEXT', 'Chia sẻ kinh nghiệm cắm trại an toàn', 'Vài tips cắm trại an toàn trong rừng từ kinh nghiệm bản thân', NULL, 45, 12),
(17, 9, 'PHOTO', 'Bình minh trên đỉnh Bạch Mã', NULL, 4, 31, 8),
(18, 10, 'TRIP_REPORT', 'Bái Tử Long bị hủy do bão', 'Tiếc quá, chuyến đi bị hủy vì bão', 15, 5, 3),
(19, 1, 'TRAIL_REVIEW', 'Cúc Phương mùa bướm', 'Đúng mùa bướm, đẹp không tả nổi', 3, 56, 21),
(20, 2, 'QUESTION', 'Tà Năng mùa nào đẹp nhất?', NULL, 8, 19, 14),
(21, 3, 'TEXT', 'Giới thiệu nhóm trekking Đà Lạt', 'Nhóm mình thường xuyên tổ chức trek Đà Lạt. Ai quan tâm inbox nhé!', 2, 33, 11),
(22, 5, 'TEXT', 'Thông báo: Hệ thống nâng cấp vào 2h sáng mai', 'Hệ thống sẽ tạm ngừng để nâng cấp từ 2h-4h sáng mai', NULL, 3, 0),
(23, 7, 'TRIP_REPORT', 'Ô Quy Hồ lần đầu', 'Khó hơn mình tưởng, nhưng xứng đáng', 12, 27, 6),
(24, 8, 'PHOTO', 'Cắm trại đêm tại Pù Luông', NULL, 7, 41, 15),
(25, 9, 'TRAIL_REVIEW', 'Hải Vân cho người mới bắt đầu', 'Phù hợp cho người mới, view đẹp, đường dễ', 9, 38, 10);

-- ==========================================
-- 17. POST COMMENTS - 50 comments
-- ==========================================

-- Comments cho post 1 (Fansipan)
INSERT INTO post_comments (post_id, user_id, content, like_count) VALUES
(1, 2, 'Chúc mừng bạn! Mình cũng muốn đi Fansipan lắm mà chưa có dịp.', 3),
(1, 3, 'Ảnh đẹp quá! Bạn đi có guide không hay tự túc?', 1),
(1, 7, 'Mình đi tháng 3 năm ngoái, thời tiết đẹp lắm. Bạn đúng mùa đấy!', 5),
(1, 4, 'Nhìn mệt nhưng hẳn là đáng giá nhỉ?', 0),

-- Comments cho post 2 (Tà Năng)
(2, 1, 'Mình cũng vừa đi Tà Năng xong! Đúng là đẹp thật.', 2),
(2, 3, 'Bạn đi mất mấy ngày? Có cần mang theo lều không?', 1),
(2, 4, 'Ảnh đồi cỏ đẹp quá! Mùa này cỏ còn xanh không?', 0),
(2, 8, 'Mình đi Tà Năng 3 lần rồi, lần nào cũng đẹp!', 4),

-- Comments cho post 5 (Cát Bà)
(5, 1, 'View vịnh Lan Hạ từ trên cao tuyệt thật!', 2),
(5, 3, 'Bạn ở khách sạn nào tại Cát Bà? Có recommend không?', 0),
(5, 6, 'Mình cũng mới đi Cát Bà, trek lên đỉnh Ngự Lâm hơi dốc nhưng view xứng đáng.', 1),

-- Comments cho post 9 (Hạ Long)
(9, 1, 'Vịnh Hạ Long đẹp quá! Mình chưa đi trek ở đây bao giờ.', 1),
(9, 2, 'Bạn chụp bằng máy gì thế? Ảnh đẹp quá!', 0),
(9, 8, 'Mình đi Hạ Long toàn đi thuyền, chưa trek bao giờ. Lần sau phải thử!', 2),

-- Comments cho post 10 (Câu hỏi về Fansipan)
(10, 2, 'Mình đi tháng 10-11 hoặc 3-4 là đẹp nhất. Tránh mùa mưa tháng 6-9.', 8),
(10, 7, 'Tháng 3-4 có biển mây đẹp lắm bạn!', 5),
(10, 1, 'Mình vừa đi tháng 3, thời tiết perfect luôn!', 3),
(10, 4, 'Mùa đông lạnh nhưng ít mưa, mùa hè ấm nhưng nhiều mưa. Tùy bạn thích kiểu nào.', 2),

-- Comments cho các post khác
(11, 1, 'Mình quan tâm nè! Bạn đi mấy ngày?', 0),
(11, 4, 'Mình cũng muốn đi Ô Quy Hồ lắm!', 0),
(12, 6, 'Sương mù đẹp quá! Chụp bằng điện thoại hay máy ảnh?', 0),
(13, 10, 'Đi với trẻ con có vất không bạn?', 0),
(14, 8, 'Mùa này nhiều muỗi thật, mình cũng vừa đi về.', 0),
(15, 2, 'Áo ấm, găng tay, giày chống nước, đèn pin, power bank là essential!', 4),
(15, 7, 'Nhớ mang thuốc cảm và chăn sleeping bag loại tốt.', 2),
(16, 1, 'Bài viết hữu ích quá! Cảm ơn bạn đã chia sẻ.', 1),
(16, 3, 'Mình còn thiếu vài thứ trong checklist của bạn. Cảm ơn!', 0),
(17, 6, 'Bình minh đẹp quá! Bạn dậy sớm để chụp à?', 0),
(18, 1, 'Tiếc quá! Lần sau đi bù nhé.', 0),
(19, 2, 'Mình đi Cúc Phương đúng mùa bướm năm ngoái, đẹp không tả nổi!', 3),
(19, 10, 'Mùa bướm là tháng mấy vậy bạn?', 0),
(20, 1, 'Mùa mưa (tháng 8-11) cỏ xanh đẹp lắm!', 2),
(20, 4, 'Mình đi tháng 9, cỏ xanh mướt, đẹp lắm!', 1),
(21, 1, 'Mình ở Đà Lạt, có thể join nhóm bạn được không?', 0),
(21, 6, 'Cho mình xin thông tin nhóm với!', 0),
(22, 1, 'Cảm ơn admin đã thông báo!', 0),
(23, 2, 'Ô Quy Hồ khó thật, mình đi cũng mệt đứt hơi!', 1),
(24, 3, 'Cắm trại đêm có lạnh không bạn?', 0),
(25, 10, 'Mình là beginner, đọc review của bạn yên tâm đi rồi!', 0);

-- Thêm replies cho comments (parent comments)
INSERT INTO post_comments (post_id, user_id, parent_comment_id, content) VALUES
(1, 1, 1, 'Cảm ơn bạn! Nếu có cơ hội nhất định nên đi nhé!'),
(1, 1, 2, 'Mình đi tự túc không guide. Nhưng nếu lần đầu đi thì nên có guide cho an toàn.'),
(2, 2, 6, 'Mình đi 3 ngày 2 đêm. Có mang lều vì qua đêm giữa rừng.'),
(2, 2, 7, 'Mình đi tháng 10 nên cỏ còn xanh. Giờ chắc vẫn xanh đấy!'),
(10, 5, 13, 'Cảm ơn mọi người đã tư vấn! Mình sẽ đi tháng 3 năm sau.');

-- ==========================================
-- 18. POST LIKES - 100 likes
-- ==========================================

-- Likes cho posts
INSERT INTO post_likes (post_id, user_id, reaction_type) VALUES
-- Post 1: 10 likes
(1, 2, 'LIKE'), (1, 3, 'LOVE'), (1, 4, 'LIKE'), (1, 5, 'WOW'), (1, 6, 'LIKE'),
(1, 7, 'LOVE'), (1, 8, 'LIKE'), (1, 9, 'LIKE'), (1, 10, 'LIKE'),

-- Post 2: 12 likes
(2, 1, 'LOVE'), (2, 3, 'WOW'), (2, 4, 'LIKE'), (2, 5, 'LIKE'), (2, 6, 'LOVE'),
(2, 7, 'LIKE'), (2, 8, 'WOW'), (2, 9, 'LIKE'), (2, 10, 'LIKE'), (2, 5, 'LIKE'),

-- Post 3: 8 likes
(3, 1, 'LIKE'), (3, 2, 'LOVE'), (3, 4, 'LIKE'), (3, 6, 'LIKE'), (3, 8, 'LIKE'),
(3, 9, 'LOVE'), (3, 10, 'LIKE'),

-- Post 4: 7 likes
(4, 1, 'LIKE'), (4, 2, 'LIKE'), (4, 3, 'LIKE'), (4, 5, 'WOW'), (4, 6, 'LIKE'),
(4, 8, 'LIKE'), (4, 10, 'LIKE'),

-- Post 5: 9 likes
(5, 1, 'LOVE'), (5, 2, 'LIKE'), (5, 3, 'LIKE'), (5, 4, 'WOW'), (5, 6, 'LIKE'),
(5, 7, 'LIKE'), (5, 8, 'LIKE'), (5, 9, 'LIKE'),

-- Post 6-10 và các post khác
(6, 1, 'LIKE'), (6, 2, 'WOW'), (6, 3, 'LIKE'), (6, 5, 'LIKE'), (6, 7, 'LIKE'),
(6, 8, 'LIKE'), (6, 9, 'LIKE'), (6, 10, 'LIKE'),
(7, 1, 'LOVE'), (7, 2, 'LOVE'), (7, 3, 'WOW'), (7, 4, 'LIKE'), (7, 5, 'LIKE'),
(7, 6, 'LIKE'), (7, 9, 'LIKE'), (7, 10, 'LIKE'),
(8, 1, 'WOW'), (8, 2, 'LIKE'), (8, 3, 'LOVE'), (8, 4, 'LIKE'), (8, 5, 'LIKE'),
(8, 6, 'LOVE'), (8, 7, 'LIKE'), (8, 10, 'LIKE'),
(9, 1, 'WOW'), (9, 2, 'WOW'), (9, 3, 'LOVE'), (9, 4, 'LIKE'), (9, 5, 'LIKE'),
(9, 7, 'LIKE'), (9, 8, 'LOVE'), (9, 10, 'LIKE'),
(10, 1, 'LIKE'), (10, 2, 'LIKE'), (10, 3, 'LIKE'), (10, 4, 'LIKE'), (10, 6, 'LIKE'),
(10, 7, 'LIKE'), (10, 8, 'LIKE'), (10, 9, 'LIKE'),

-- Likes cho các post 11-25
(11, 1, 'LIKE'), (11, 3, 'LIKE'), (11, 4, 'LIKE'), (11, 6, 'LIKE'), (11, 8, 'LIKE'),
(12, 1, 'LOVE'), (12, 2, 'LIKE'), (12, 4, 'LIKE'), (12, 5, 'LIKE'), (12, 7, 'LIKE'),
(13, 1, 'LIKE'), (13, 3, 'LIKE'), (13, 6, 'LIKE'), (13, 9, 'LIKE'), (13, 10, 'LIKE'),
(14, 2, 'LIKE'), (14, 3, 'LIKE'), (14, 5, 'LIKE'), (14, 7, 'LIKE'), (14, 8, 'LIKE'),
(15, 1, 'LIKE'), (15, 3, 'LIKE'), (15, 4, 'LIKE'), (15, 6, 'LIKE'), (15, 8, 'LIKE');

-- Likes cho comments
INSERT INTO post_likes (comment_id, user_id, reaction_type) VALUES
(1, 1, 'LIKE'), (1, 3, 'LIKE'), (1, 4, 'LIKE'),
(2, 2, 'LIKE'),
(3, 1, 'LIKE'), (3, 2, 'LIKE'), (3, 4, 'LIKE'),
(13, 1, 'LIKE'), (13, 3, 'LIKE'), (13, 4, 'LIKE'),
(14, 2, 'LIKE'), (14, 4, 'LIKE'),
(15, 1, 'LIKE'), (15, 2, 'LIKE');

-- ==========================================
-- 19. USER GROUPS - 5 groups
-- ==========================================

INSERT INTO user_groups (group_id, uuid, name, description, avatar_url, group_type, 
                         membership_approval_required, member_count, post_count, created_by, tags) VALUES
(1, uuid_generate_v4(), 'Trekking Việt Nam', 'Cộng đồng yêu thích trekking và khám phá thiên nhiên Việt Nam',
 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?q=80&w=400&h=400&auto=format&fit=crop', 'PUBLIC', FALSE, 8, 12, 1,
 '["trekking", "vietnam", "hiking", "adventure"]'::jsonb),

(2, uuid_generate_v4(), 'Cắm Trại Chuyên Nghiệp', 'Chia sẻ kinh nghiệm cắm trại và sinh tồn',
 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=400&h=400&auto=format&fit=crop', 'PUBLIC', FALSE, 5, 8, 8,
 '["camping", "survival", "outdoor", "gear"]'::jsonb),

(3, uuid_generate_v4(), 'Nhiếp Ảnh Thiên Nhiên', 'Dành cho các nhiếp ảnh gia yêu thích chụp ảnh thiên nhiên',
 'https://images.unsplash.com/photo-1452784444945-3f422708fe5e?q=80&w=400&h=400&auto=format&fit=crop', 'INVITE_ONLY', TRUE, 3, 6, 9,
 '["photography", "nature", "landscape", "wildlife"]'::jsonb),

(4, uuid_generate_v4(), 'Tây Bắc Exploration', 'Chuyên khám phá các cung đường Tây Bắc',
 'https://images.unsplash.com/photo-1500076656116-558758c991c1?q=80&w=400&h=400&auto=format&fit=crop', 'PUBLIC', FALSE, 4, 5, 7,
 '["taybac", "fansipan", "sapa", "northwest"]'::jsonb),

(5, uuid_generate_v4(), 'Beginner Trekker Việt Nam', 'Dành cho người mới bắt đầu trekking',
 'https://images.unsplash.com/photo-1618413516603-d33a4e56c8a1?q=80&w=400&h=400&auto=format&fit=crop', 'PUBLIC', FALSE, 6, 9, 10,
 '["beginner", "easy-trails", "first-time", "introduction"]'::jsonb);

-- ==========================================
-- 20. GROUP MEMBERS - 26 memberships
-- ==========================================

INSERT INTO group_members (group_id, user_id, role, status, joined_at, invited_by) VALUES
-- Group 1: Trekking Việt Nam
(1, 1, 'OWNER', 'ACTIVE', '2024-01-15 10:00:00+07', NULL),
(1, 2, 'ADMIN', 'ACTIVE', '2024-01-16 14:00:00+07', 1),
(1, 3, 'MEMBER', 'ACTIVE', '2024-01-20 09:00:00+07', 1),
(1, 4, 'MEMBER', 'ACTIVE', '2024-01-25 11:00:00+07', 2),
(1, 6, 'MEMBER', 'ACTIVE', '2024-02-01 15:00:00+07', 1),
(1, 7, 'MEMBER', 'ACTIVE', '2024-02-10 08:00:00+07', 2),
(1, 8, 'MEMBER', 'ACTIVE', '2024-02-15 16:00:00+07', 1),
(1, 10, 'MEMBER', 'ACTIVE', '2024-02-20 10:00:00+07', 3),

-- Group 2: Cắm Trại Chuyên Nghiệp
(2, 8, 'OWNER', 'ACTIVE', '2024-03-01 09:00:00+07', NULL),
(2, 1, 'ADMIN', 'ACTIVE', '2024-03-02 14:00:00+07', 8),
(2, 2, 'MEMBER', 'ACTIVE', '2024-03-05 11:00:00+07', 8),
(2, 4, 'MEMBER', 'ACTIVE', '2024-03-10 16:00:00+07', 1),
(2, 7, 'MEMBER', 'ACTIVE', '2024-03-15 10:00:00+07', 8),

-- Group 3: Nhiếp Ảnh Thiên Nhiên
(3, 9, 'OWNER', 'ACTIVE', '2024-04-01 10:00:00+07', NULL),
(3, 3, 'ADMIN', 'ACTIVE', '2024-04-05 14:00:00+07', 9),
(3, 1, 'MEMBER', 'ACTIVE', '2024-04-10 09:00:00+07', 9),
-- DÒNG BỊ LỖI ĐÃ SỬA: Role 'PENDING' -> 'MEMBER', Status vẫn là 'PENDING'
(3, 6, 'MEMBER', 'PENDING', '2024-04-12 11:00:00+07', 9), 

-- Group 4: Tây Bắc Exploration
(4, 7, 'OWNER', 'ACTIVE', '2024-05-01 08:00:00+07', NULL),
(4, 2, 'ADMIN', 'ACTIVE', '2024-05-05 15:00:00+07', 7),
(4, 1, 'MEMBER', 'ACTIVE', '2024-05-10 10:00:00+07', 7),
(4, 5, 'MEMBER', 'ACTIVE', '2024-05-15 14:00:00+07', 2),

-- Group 5: Beginner Trekker Việt Nam
(5, 10, 'OWNER', 'ACTIVE', '2024-06-01 09:00:00+07', NULL),
(5, 3, 'ADMIN', 'ACTIVE', '2024-06-05 11:00:00+07', 10),
(5, 6, 'MEMBER', 'ACTIVE', '2024-06-10 16:00:00+07', 10),
(5, 1, 'MEMBER', 'ACTIVE', '2024-06-15 10:00:00+07', 3),
(5, 8, 'MEMBER', 'ACTIVE', '2024-06-20 14:00:00+07', 10),
(5, 9, 'MEMBER', 'ACTIVE', '2024-06-25 09:00:00+07', 3);

-- ==========================================
-- 21. MARKETPLACE ITEMS - 15 items
-- ==========================================

INSERT INTO marketplace_items (item_id, uuid, seller_id, title, description, category, subcategory, 
                              condition, price, currency, is_negotiable, images, location_city, 
                              location_district, status, views_count, favorites_count, created_at) VALUES
(1, uuid_generate_v4(), 2, 'Giày Trekking Salomon X Ultra 4 GTX - Size 42', 
 'Giày trekking Salomon X Ultra 4 GTX, size 42. Đã dùng 2 lần, còn mới 95%. Chuẩn GORE-TEX chống nước tốt.',
 'FOOTWEAR', 'HIKING_SHOES', 'LIKE_NEW', 2500000, 'VND', TRUE,
 '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&h=300&auto=format&fit=crop", "https://images.unsplash.com/photo-1520639889313-7272175b1c39?q=80&w=400&h=300&auto=format&fit=crop"]'::jsonb,
 'Hà Nội', 'Cầu Giấy', 'AVAILABLE', 45, 3, '2024-03-10 14:00:00+07'),

(2, uuid_generate_v4(), 1, 'Ba Lô Osprey Atmos AG 65L', 
 'Ba lô trekking Osprey Atmos AG 65L, màu xanh dương. Hệ thống đệm lưng AirSpeed rất thoáng. Đã dùng 1 chuyến dài.',
 'ACCESSORIES', 'BACKPACKS', 'GOOD', 3500000, 'VND', TRUE,
 '["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400&h=300&auto=format&fit=crop"]'::jsonb,
 'Hà Nội', 'Đống Đa', 'AVAILABLE', 32, 2, '2024-03-12 10:00:00+07'),

(3, uuid_generate_v4(), 7, 'Lều 2 Người Naturehike Cloud-Up 2', 
 'Lều 2 người Naturehike Cloud-Up 2, siêu nhẹ chỉ 1.8kg. Đã dùng 3 lần, còn mới, không rách hay hư hỏng.',
 'CAMPING', 'TENTS', 'GOOD', 1200000, 'VND', FALSE,
 '["https://images.unsplash.com/photo-1478131143081-80f7f84ca84c?q=80&w=400&h=300&auto=format&fit=crop"]'::jsonb,
 'Hà Nội', 'Hai Bà Trưng', 'AVAILABLE', 28, 1, '2024-03-15 16:00:00+07'),

(4, uuid_generate_v4(), 8, 'Bếp Gas Du Lịch Mini', 
 'Bếp gas du lịch mini, nhỏ gọn, dễ mang theo. Đầy đủ phụ kiện. Mới mua chưa dùng.',
 'CAMPING', 'STOVES', 'NEW', 250000, 'VND', FALSE,
 '["https://images.unsplash.com/photo-1591147139233-c449303d382d?q=80&w=400&h=300&auto=format&fit=crop"]'::jsonb,
 'Hồ Chí Minh', 'Quận 1', 'AVAILABLE', 15, 0, '2024-03-18 11:00:00+07'),

(5, uuid_generate_v4(), 4, 'Áo Khoác Gió North Face', 
 'Áo khoác gió The North Face, size L, màu đen. Chống nước, chống gió tốt. Đã dùng 1 mùa.',
 'CLOTHING', 'JACKETS', 'GOOD', 800000, 'VND', TRUE,
 '["https://images.unsplash.com/photo-1544923246-77307dd654ca?q=80&w=400&h=300&auto=format&fit=crop"]'::jsonb,
 'Đà Nẵng', 'Hải Châu', 'RESERVED', 22, 1, '2024-03-20 09:00:00+07'),

(6, uuid_generate_v4(), 6, 'Gậy Trekking Chống Sốc 2 Chiếc', 
 'Bộ 2 gậy trekking chống sốc, có thể gấp gọn. Mới mua dùng thử không hợp.',
 'ACCESSORIES', 'TREKKING_POLES', 'LIKE_NEW', 400000, 'VND', TRUE,
 '["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=400&h=300&auto=format&fit=crop"]'::jsonb,
 'Hồ Chí Minh', 'Quận 3', 'AVAILABLE', 18, 0, '2024-03-22 14:00:00+07'),

(7, uuid_generate_v4(), 3, 'Túi Ngủ 3 Mùa -10°C', 
 'Túi ngủ 3 mùa chịu được -10°C, nhồi lông vũ. Nhẹ, ấm, gấp gọn được. Đã dùng 2 lần.',
 'CAMPING', 'SLEEPING_BAGS', 'GOOD', 1800000, 'VND', TRUE,
 '["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=400&h=300&auto=format&fit=crop"]'::jsonb,
 'Đà Lạt', 'Đà Lạt', 'AVAILABLE', 31, 2, '2024-03-25 10:00:00+07'),

(8, uuid_generate_v4(), 10, 'Đèn Pin Đầu Cầm tay', 
 'Đèn pin đầu cầm tay siêu sáng, sạc USB. Dùng cho trekking đêm hoặc cắm trại.',
 'SAFETY', 'LIGHTS', 'NEW', 350000, 'VND', FALSE,
 '["https://images.unsplash.com/photo-1534073828943-f801091bb270?q=80&w=400&h=300&auto=format&fit=crop"]'::jsonb,
 'Hải Phòng', 'Ngô Quyền', 'SOLD', 42, 5, '2024-03-28 16:00:00+07'),

(9, uuid_generate_v4(), 2, 'Máy Lọc Nước Katadyn BeFree', 
 'Máy lọc nước Katadyn BeFree 1L. Lọc vi khuẩn, dùng nước suối trực tiếp. Mới dùng 1 lần.',
 'CAMPING', 'WATER_FILTERS', 'LIKE_NEW', 600000, 'VND', TRUE,
 '["https://images.unsplash.com/photo-1541804367658-4903328ce372?q=80&w=400&h=300&auto=format&fit=crop"]'::jsonb,
 'Hà Nội', 'Tây Hồ', 'AVAILABLE', 23, 1, '2024-04-01 11:00:00+07'),

(10, uuid_generate_v4(), 7, 'Bản Đồ Offline Việt Nam (SD Card)', 
 'SD card chứa bản đồ offline toàn Việt Nam cho GPS Garmin. Cập nhật 2024.',
 'NAVIGATION', 'MAPS', 'NEW', 300000, 'VND', FALSE,
 '["https://images.unsplash.com/photo-1549493810-f72bfc77846d?q=80&w=400&h=300&auto=format&fit=crop"]'::jsonb,
 'Hà Nội', 'Hoàn Kiếm', 'AVAILABLE', 12, 0, '2024-04-05 09:00:00+07');

-- Thêm 5 items nữa
INSERT INTO marketplace_items (item_id, seller_id, title, category, condition, price, status, created_at) VALUES
(11, 1, 'Võng Du Lịch Nhẹ', 'CAMPING', 'GOOD', 200000, 'AVAILABLE', '2024-04-10 14:00:00+07'),
(12, 5, 'Compass Suunto', 'NAVIGATION', 'LIKE_NEW', 500000, 'DRAFT', '2024-04-12 10:00:00+07'),
(13, 8, 'Bộ Sơ Cứu Y Tế', 'SAFETY', 'NEW', 150000, 'AVAILABLE', '2024-04-15 16:00:00+07'),
(14, 3, 'Ghế Xếp Du Lịch', 'CAMPING', 'GOOD', 180000, 'RESERVED', '2024-04-18 11:00:00+07'),
(15, 6, 'Áo Mưa Poncho Trekking', 'CLOTHING', 'NEW', 80000, 'AVAILABLE', '2024-04-20 09:00:00+07');

-- Cập nhật sold_at cho item đã bán
UPDATE marketplace_items SET sold_at = '2024-04-05 14:00:00+07' WHERE item_id = 8;

-- ==========================================
-- 21b. UPDATE Marketplace images to Unsplash CDN (800x800)
-- ==========================================
UPDATE marketplace_items SET images = '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&h=800&auto=format&fit=crop"]'::jsonb WHERE item_id = 1; -- Giày Salomon
UPDATE marketplace_items SET images = '["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&h=800&auto=format&fit=crop"]'::jsonb WHERE item_id = 2; -- Balo Osprey
UPDATE marketplace_items SET images = '["https://images.unsplash.com/photo-1478827536114-da961b7f86d2?q=80&w=800&h=800&auto=format&fit=crop"]'::jsonb WHERE item_id = 3; -- Lều Naturehike
UPDATE marketplace_items SET images = '["https://images.unsplash.com/photo-1591012911207-0dbac31f37da?q=80&w=800&h=800&auto=format&fit=crop"]'::jsonb WHERE item_id = 4; -- Bếp gas mini
UPDATE marketplace_items SET images = '["https://images.unsplash.com/photo-1544923246-77307dd654ca?q=80&w=800&h=800&auto=format&fit=crop"]'::jsonb WHERE item_id = 5; -- Áo khoác TNF
UPDATE marketplace_items SET images = '["https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=800&h=800&auto=format&fit=crop"]'::jsonb WHERE item_id = 6; -- Gậy trekking
UPDATE marketplace_items SET images = '["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800&h=800&auto=format&fit=crop"]'::jsonb WHERE item_id = 7; -- Túi ngủ
UPDATE marketplace_items SET images = '["https://images.unsplash.com/photo-1540633451120-222718302027?q=80&w=800&h=800&auto=format&fit=crop"]'::jsonb WHERE item_id = 8; -- Đèn pin
UPDATE marketplace_items SET images = '["https://images.unsplash.com/photo-1541804367658-4903328ce372?q=80&w=800&h=800&auto=format&fit=crop"]'::jsonb WHERE item_id = 9; -- Lọc nước
UPDATE marketplace_items SET images = '["https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&h=800&auto=format&fit=crop"]'::jsonb WHERE item_id = 10; -- Bản đồ
UPDATE marketplace_items SET images = '["https://images.unsplash.com/photo-1542401886-65d6c61db217?q=80&w=800&h=800&auto=format&fit=crop"]'::jsonb WHERE item_id = 11; -- Võng
UPDATE marketplace_items SET images = '["https://images.unsplash.com/photo-1533560934150-f80e0c05934a?q=80&w=800&h=800&auto=format&fit=crop"]'::jsonb WHERE item_id = 12; -- Compass
UPDATE marketplace_items SET images = '["https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&h=800&auto=format&fit=crop"]'::jsonb WHERE item_id = 13; -- First aid
UPDATE marketplace_items SET images = '["https://images.unsplash.com/photo-1551061730-81cd66699a61?q=80&w=800&h=800&auto=format&fit=crop"]'::jsonb WHERE item_id = 14; -- Ghế xếp
UPDATE marketplace_items SET images = '["https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=800&h=800&auto=format&fit=crop"]'::jsonb WHERE item_id = 15; -- Áo mưa

-- ==========================================
-- 22. MARKETPLACE FAVORITES - 10 favorites
-- ==========================================

INSERT INTO marketplace_favorites (user_id, item_id) VALUES
(1, 1), (1, 3), (1, 7),
(3, 1), (3, 2),
(4, 5),
(6, 8),
(8, 7), (8, 8),
(10, 1);

-- ==========================================
-- 23. TRAIL REVIEWS - 30 reviews
-- ==========================================

-- Reviews cho Fansipan
INSERT INTO trail_reviews (trail_id, user_id, trip_id, overall_rating, scenery_rating, difficulty_rating, 
                          safety_rating, accessibility_rating, title, content, visited_date, visited_with, 
                          weather_during_visit, helpful_count) VALUES
(1, 1, 1, 5, 5, 5, 4, 3, 'Trải nghiệm tuyệt vời dù rất mệt!',
 'Fansipan thực sự là một thử thách. Đường leo dốc, mệt nhưng view trên đỉnh xứng đáng mọi công sức. Cần chuẩn bị thể lực thật tốt.',
 '2024-03-14', 'SOLO', 'PARTLY_CLOUDY', 12),

(1, 2, 2, 4, 5, 5, 4, 2, 'Đỉnh cao Đông Dương - Phải đến một lần trong đời',
 'Đi với nhóm 5 người, mất 3 ngày 2 đêm. Trời có mưa nhẹ nên đường trơn. Hướng dẫn viên rất nhiệt tình. View thì không cần bàn!',
 '2024-03-20', 'FRIENDS', 'RAIN', 8),

(1, 5, 20, 5, 5, 5, 5, 4, 'Kiểm tra hệ thống và có trải nghiệm tuyệt vời',
 'Lên đỉnh để kiểm tra tính năng tracking của app. Fansipan đẹp hơn trong hình ảnh. Cáp treo cũng là lựa chọn tốt cho người không muốn trek.',
 '2024-03-01', 'SOLO', 'CLEAR', 5),

-- Reviews cho Đà Lạt
(2, 3, 3, 4, 5, 2, 4, 5, 'Phù hợp cho người mới bắt đầu',
 'Cung đường rất dễ, view đẹp, nhiều hoa. Phù hợp cho gia đình hoặc người mới tập trekking.',
 '2024-04-20', 'SOLO', 'CLEAR', 6),

-- Reviews cho Cúc Phương
(3, 1, 16, 5, 5, 3, 4, 4, 'Rừng nhiệt đới nguyên sinh tuyệt đẹp',
 'Đi đúng mùa bướm, cảnh tượng ngoạn mục. Cây chò ngàn năm tuổi rất đáng xem. Đường đi khá dễ, có thể đi với trẻ em.',
 '2024-02-10', 'SOLO', 'PARTLY_CLOUDY', 9),

-- Reviews cho Bạch Mã
(4, 7, 4, 4, 5, 4, 4, 3, 'View biển từ trên núi',
 'Leo Bạch Mã khá mệt nhưng view từ trên đỉnh nhìn ra biển thực sự đáng giá. Thác Đỗ Quyên cũng rất đẹp.',
 '2024-05-05', 'SOLO', 'PARTLY_CLOUDY', 7),

-- Reviews cho Cát Bà
(5, 10, 5, 5, 5, 3, 4, 4, 'Đảo ngọc của miền Bắc',
 'Cát Bà không chỉ có biển mà còn có trekking tuyệt vời. View từ đỉnh Ngự Lâm bao quát toàn vịnh Lan Hạ.',
 '2024-06-12', 'FRIENDS', 'CLEAR', 11),

-- Reviews cho Núi Chúa
(6, 4, 6, 4, 5, 5, 3, 2, 'Sa mạc Việt Nam - Độc đáo và thử thách',
 'Rất nóng và khó khăn, cần mang nhiều nước. Nhưng cảnh quan sa mạc độc nhất vô nhị tại Việt Nam.',
 '2024-01-25', 'FRIENDS', 'CLEAR', 8),

-- Reviews cho Pù Luông
(7, 8, 7, 5, 5, 3, 4, 3, 'Ruộng bậc thang đẹp nhất vào mùa lúa chín',
 'Đi tháng 9 đúng mùa lúa chín, ruộng bậc thang vàng óng. Người dân bản địa rất thân thiện.',
 '2024-09-08', 'SOLO', 'PARTLY_CLOUDY', 14),

-- Reviews cho Tà Năng
(8, 2, 8, 5, 5, 4, 3, 2, 'Cung đường trekking đẹp nhất Việt Nam',
 '55km không hề dễ nhưng cảnh đẹp từ đồi cỏ đến rừng thông khiến mọi mệt mỏi tan biến. Nên đi mùa mưa để thấy cỏ xanh.',
 '2024-10-15', 'FRIENDS', 'CLEAR', 22),

-- Reviews cho Hải Vân
(9, 9, 9, 4, 5, 2, 3, 4, 'Đèo đẹp cho trekking ngắn ngày',
 'Chỉ mất nửa ngày, đường dễ, view biển và núi tuyệt đẹp. Hoàng hôn trên đèo là highlight.',
 '2024-07-22', 'SOLO', 'CLEAR', 9),

-- Reviews cho Hạ Long
(10, 6, 10, 5, 5, 2, 4, 5, 'View vịnh Hạ Long từ trên cao',
 'Trekking ngắn nhưng view vịnh Hạ Long từ núi Đầu Gỗ không thể bỏ lỡ. Hang Sửng Sốt cũng rất đáng xem.',
 '2024-11-30', 'FRIENDS', 'PARTLY_CLOUDY', 15);

-- Thêm 18 reviews nữa cho các trail khác
INSERT INTO trail_reviews (trail_id, user_id, overall_rating, title, content, visited_date) VALUES
(11, 3, 4, 'Lang Bian dễ thở', 'Núi lửa đã tắt, đường đi dễ, view thành phố Đà Lạt từ trên cao rất đẹp.', '2024-02-15'),
(12, 7, 5, 'Ô Quy Hồ - Cổng trời Tây Bắc', 'Đèo đẹp nhưng rất khó, chỉ dành cho người có kinh nghiệm.', '2024-01-20'),
(13, 6, 3, 'Rừng Trà Sư nhiều muỗi', 'Cảnh đẹp nhưng mùa nước nổi nhiều muỗi quá, nhớ mang thuốc.', '2024-11-05'),
(14, 4, 4, 'Núi Bà Đen có cáp treo', 'Có cáp treo nên dễ dàng cho mọi người. Chùa trên núi rất linh thiêng.', '2024-04-10'),
(15, 10, 4, 'Bái Tử Long ít khách', 'Ít khách hơn Hạ Long nên yên tĩnh. Hang động đẹp, nước trong xanh.', '2024-03-25'),
(2, 6, 4, 'Đà Lạt lãng mạn', 'Đi với người yêu, rất lãng mạn. Hoa đẹp, thời tiết mát mẻ.', '2024-05-10'),
(3, 8, 5, 'Cúc Phương với gia đình', 'Đi với 2 đứa nhỏ, chúng rất thích xem động vật. Đường đi dễ.', '2024-04-05'),
(4, 2, 4, 'Bạch Mã mát mẻ', 'Tránh nóng mùa hè rất tốt. Trên đỉnh mát như điều hòa.', '2024-06-20'),
(5, 1, 5, 'Cát Bà lần 2', 'Lần thứ 2 đến Cát Bà, vẫn đẹp như lần đầu. Nên ở homestay để trải nghiệm địa phương.', '2024-08-15'),
(6, 7, 4, 'Núi Chúa mùa khô', 'Nóng nhưng cảnh sa mạc độc đáo. Nên đi vào sáng sớm.', '2024-02-28'),
(7, 3, 5, 'Pù Luông homestay', 'Ở homestay của người dân, ăn uống địa phương rất ngon.', '2024-10-05'),
(8, 1, 5, 'Tà Năng lần đầu', 'Khó nhưng đáng giá. Cần thể lực tốt và trang bị đầy đủ.', '2024-09-20'),
(9, 4, 4, 'Hải Vân buổi sáng', 'Đi buổi sáng ít xe, an toàn hơn. Sương mù buổi sáng tạo cảnh đẹp.', '2024-08-10'),
(10, 2, 5, 'Hạ Long bằng thuyền kayak', 'Kết hợp trekking và kayak, trải nghiệm toàn diện vịnh Hạ Long.', '2024-07-05'),
(11, 10, 3, 'Lang Bian đông khách', 'Cuối tuần đông khách quá, mất vẻ hoang sơ.', '2024-03-30'),
(12, 5, 4, 'Ô Quy Hồ với guide', 'Có guide nên an toàn hơn. Guide rất nhiệt tình, biết nhiều về địa phương.', '2024-02-10'),
(13, 9, 4, 'Trà Sư chụp ảnh', 'Chụp ảnh chim và hoa sen rất đẹp. Nên đi vào sáng sớm.', '2024-12-01'),
(14, 8, 3, 'Bà Đen leo bộ', 'Leo bộ lên đỉnh khá mệt, nhưng cảm giác thành tựu cao.', '2024-05-20'),
(1, 3, 5, 'Fansipan đỉnh cao', 'Chinh phục đỉnh cao nhất Việt Nam là cảm giác không thể tả. Tuyệt vời!', '2024-04-15'),
(8, 4, 5, 'Tà Năng đồi cỏ cháy', 'Mùa cỏ cháy cũng có nét đẹp riêng, màu vàng rực rỡ.', '2024-05-12'),
(11, 2, 4, 'Lang Bian view mây', 'Sáng sớm lên Lang Bian ngắm biển mây rất đẹp.', '2024-03-22'),
(12, 1, 4, 'Ô Quy Hồ huyền thoại', 'Cung đường đèo uốn lượn, rất thử thách tay lái và đôi chân.', '2024-02-18'),
(13, 10, 5, 'Trà Sư mùa chim về', 'Buổi chiều ngắm chim về tổ rất thanh bình.', '2024-10-30'),
(14, 7, 5, 'Bà Đen check-in đỉnh', 'Đỉnh núi có chóp check-in rất đẹp, view bao quát Tây Ninh.', '2024-06-05'),
(15, 3, 4, 'Bái Tử Long hùng vĩ', 'Hang động ở đây còn rất hoang sơ, nước biển trong vắt.', '2024-04-28');

-- ==========================================
-- 24. CHALLENGES - 5 challenges
-- ==========================================

INSERT INTO challenges (challenge_id, uuid, name, description, challenge_type, target_value, unit, 
                       start_date, end_date, is_recurring, reward_type, participation_fee, 
                       max_participants, current_participants, is_featured, is_active, 
                       visibility, created_by, rules, tags) VALUES
(1, uuid_generate_v4(), 'Thử Thách 100km Tháng 3', 
 'Tích lũy 100km trekking trong tháng 3 năm 2024. Dành cho mọi cấp độ.',
 'DISTANCE', 100, 'km', '2024-03-01', '2024-03-31', TRUE, 'BADGE',
 0, 1000, 156, TRUE, TRUE, 'PUBLIC', 5,
 '{"1": "Chỉ tính quãng đường trekking/hiking", "2": "Phải sử dụng tính năng tracking của app", "3": "Không tính quãng đường đi bộ thông thường"}'::jsonb,
 '["distance", "monthly", "beginner-friendly"]'::jsonb),

(2, uuid_generate_v4(), 'Chinh Phục 3 Đỉnh Núi', 
 'Chinh phục 3 đỉnh núi cao trên 1000m trong năm 2024.',
 'TRAIL_COUNT', 3, 'peaks', '2024-01-01', '2024-12-31', FALSE, 'POINTS',
 0, 500, 89, TRUE, TRUE, 'PUBLIC', 5,
 '{"1": "Phải là núi có độ cao trên 1000m", "2": "Phải check-in tại đỉnh", "3": "Phải có ảnh/ghi chú làm bằng chứng"}'::jsonb,
 '["mountain", "summit", "yearly"]'::jsonb),

(3, uuid_generate_v4(), 'Leo 5000m Độ Cao', 
 'Tích lũy 5000m độ cao leo (elevation gain) trong quý 2/2024.',
 'ELEVATION', 5000, 'meters', '2024-04-01', '2024-06-30', TRUE, 'PHYSICAL',
 0, 300, 67, FALSE, TRUE, 'PUBLIC', 5,
 '{"1": "Chỉ tính elevation gain (leo lên)", "2": "Không tính elevation loss (xuống dốc)", "3": "Dữ liệu từ app tracking"}'::jsonb,
 '["elevation", "quarterly", "advanced"]'::jsonb),

(4, uuid_generate_v4(), 'Streak Trekking 30 Ngày', 
 'Đi trekking ít nhất 5km mỗi ngày trong 30 ngày liên tiếp.',
 'STREAK', 30, 'days', '2024-04-15', '2024-07-15', FALSE, 'BADGE',
 0, 200, 42, TRUE, TRUE, 'PUBLIC', 5,
 '{"1": "Ít nhất 5km/ngày", "2": "Phải liên tiếp, nếu bỏ 1 ngày phải bắt đầu lại", "3": "Có thể đi nhiều lần trong ngày"}'::jsonb,
 '["streak", "consistency", "daily"]'::jsonb),

(5, uuid_generate_v4(), '100 Giờ Trong Rừng', 
 'Dành 100 giờ trekking trong rừng/quốc gia trong năm 2024.',
 'DURATION', 100, 'hours', '2024-01-01', '2024-12-31', FALSE, 'COUPON',
 0, 150, 31, FALSE, TRUE, 'PUBLIC', 5,
 '{"1": "Chỉ tính thời gian trong rừng/vườn quốc gia", "2": "Phải có GPS tracking", "3": "Không tính thời gian di chuyển bằng xe"}'::jsonb,
 '["duration", "forest", "yearly"]'::jsonb);

-- ==========================================
-- 25. CHALLENGE PARTICIPANTS - 50 participations
-- ==========================================

-- Challenge 1 (100km tháng 3)
INSERT INTO challenge_participants (challenge_id, user_id, current_progress, progress_percentage, 
                                   status, joined_at, last_updated_at) VALUES
(1, 1, 125.5, 125.5, 'COMPLETED', '2024-03-01 08:00:00+07', '2024-04-01 00:00:00+07'),
(1, 2, 156.8, 156.8, 'COMPLETED', '2024-03-02 10:00:00+07', '2024-04-01 00:00:00+07'),
(1, 3, 45.2, 45.2, 'IN_PROGRESS', '2024-03-05 14:00:00+07', '2024-03-31 23:59:00+07'),
(1, 4, 102.3, 102.3, 'COMPLETED', '2024-03-03 09:00:00+07', '2024-04-01 00:00:00+07'),
(1, 6, 78.9, 78.9, 'IN_PROGRESS', '2024-03-10 11:00:00+07', '2024-03-31 23:59:00+07'),
(1, 7, 189.5, 189.5, 'COMPLETED', '2024-03-01 07:00:00+07', '2024-04-01 00:00:00+07'),
(1, 8, 65.4, 65.4, 'IN_PROGRESS', '2024-03-15 16:00:00+07', '2024-03-31 23:59:00+07'),
(1, 9, 112.7, 112.7, 'COMPLETED', '2024-03-08 10:00:00+07', '2024-04-01 00:00:00+07'),
(1, 10, 34.8, 34.8, 'IN_PROGRESS', '2024-03-20 09:00:00+07', '2024-03-31 23:59:00+07'),

-- Challenge 2 (3 đỉnh núi)
(2, 1, 2, 66.7, 'IN_PROGRESS', '2024-01-15 10:00:00+07', '2024-06-01 00:00:00+07'),
(2, 2, 3, 100.0, 'COMPLETED', '2024-01-10 08:00:00+07', '2024-06-01 00:00:00+07'),
(2, 3, 1, 33.3, 'IN_PROGRESS', '2024-02-20 14:00:00+07', '2024-06-01 00:00:00+07'),
(2, 4, 2, 66.7, 'IN_PROGRESS', '2024-01-25 11:00:00+07', '2024-06-01 00:00:00+07'),
(2, 7, 4, 133.3, 'COMPLETED', '2024-01-05 07:00:00+07', '2024-06-01 00:00:00+07'),

-- Challenge 3 (5000m elevation)
(3, 2, 3200, 64.0, 'IN_PROGRESS', '2024-04-01 08:00:00+07', '2024-06-30 23:59:00+07'),
(3, 4, 2800, 56.0, 'IN_PROGRESS', '2024-04-05 10:00:00+07', '2024-06-30 23:59:00+07'),
(3, 7, 5200, 104.0, 'COMPLETED', '2024-04-01 07:00:00+07', '2024-06-30 23:59:00+07'),
(3, 8, 1900, 38.0, 'IN_PROGRESS', '2024-04-10 16:00:00+07', '2024-06-30 23:59:00+07'),

-- Challenge 4 (30 ngày streak)
(4, 1, 15, 50.0, 'IN_PROGRESS', '2024-04-15 08:00:00+07', '2024-05-30 23:59:00+07'),
(4, 3, 22, 73.3, 'IN_PROGRESS', '2024-04-16 14:00:00+07', '2024-06-15 23:59:00+07'),
(4, 6, 30, 100.0, 'COMPLETED', '2024-04-15 09:00:00+07', '2024-06-15 23:59:00+07'),
(4, 9, 18, 60.0, 'IN_PROGRESS', '2024-04-20 10:00:00+07', '2024-06-15 23:59:00+07'),

-- Challenge 5 (100 giờ trong rừng)
(5, 1, 45, 45.0, 'IN_PROGRESS', '2024-01-20 10:00:00+07', '2024-08-01 00:00:00+07'),
(5, 2, 68, 68.0, 'IN_PROGRESS', '2024-01-15 08:00:00+07', '2024-08-01 00:00:00+07'),
(5, 7, 92, 92.0, 'IN_PROGRESS', '2024-01-10 07:00:00+07', '2024-08-01 00:00:00+07'),
(5, 8, 105, 105.0, 'COMPLETED', '2024-01-05 16:00:00+07', '2024-08-01 00:00:00+07');

-- Thêm 20 participations nữa
INSERT INTO challenge_participants (challenge_id, user_id, current_progress, progress_percentage, status) VALUES
(1, 5, 200.5, 200.5, 'COMPLETED'),
(2, 5, 5, 166.7, 'COMPLETED'),
(2, 8, 2, 66.7, 'IN_PROGRESS'),
(2, 9, 1, 33.3, 'IN_PROGRESS'),
(2, 10, 0, 0.0, 'JOINED'),
(3, 1, 4200, 84.0, 'IN_PROGRESS'),
(3, 3, 1500, 30.0, 'IN_PROGRESS'),
(3, 5, 6000, 120.0, 'COMPLETED'),
(3, 9, 2300, 46.0, 'IN_PROGRESS'),
(4, 2, 25, 83.3, 'IN_PROGRESS'),
(4, 4, 10, 33.3, 'IN_PROGRESS'),
(4, 5, 30, 100.0, 'COMPLETED'),
(4, 7, 28, 93.3, 'IN_PROGRESS'),
(4, 8, 15, 50.0, 'IN_PROGRESS'),
(4, 10, 5, 16.7, 'IN_PROGRESS'),
(5, 4, 35, 35.0, 'IN_PROGRESS'),
(5, 6, 42, 42.0, 'IN_PROGRESS'),
(5, 9, 28, 28.0, 'IN_PROGRESS'),
(5, 10, 15, 15.0, 'IN_PROGRESS'),
(5, 3, 8, 8.0, 'IN_PROGRESS');

-- Cập nhật completed_at cho những người đã hoàn thành
UPDATE challenge_participants SET completed_at = '2024-04-01 00:00:00+07', reward_claimed = TRUE 
WHERE challenge_id = 1 AND status = 'COMPLETED';

UPDATE challenge_participants SET completed_at = '2024-06-01 00:00:00+07', reward_claimed = TRUE 
WHERE challenge_id = 2 AND user_id IN (2, 7);

UPDATE challenge_participants SET completed_at = '2024-06-30 23:59:00+07', reward_claimed = FALSE 
WHERE challenge_id = 3 AND user_id = 7;

UPDATE challenge_participants SET completed_at = '2024-06-15 23:59:00+07', reward_claimed = TRUE 
WHERE challenge_id = 4 AND user_id IN (6, 5);

UPDATE challenge_participants SET completed_at = '2024-08-01 00:00:00+07', reward_claimed = FALSE 
WHERE challenge_id = 5 AND user_id = 8;

-- ==========================================
-- 26. CHALLENGE LEADERBOARDS - 30 rankings
-- ==========================================

-- Leaderboard cho challenge 1 (100km tháng 3)
INSERT INTO challenge_leaderboards (challenge_id, user_id, rank, score, trails_completed, distance_km, 
                                   elevation_gain, calculated_at, valid_until) VALUES
(1, 7, 1, 189.5, 5, 189.5, 4500, '2024-04-01 00:00:00+07', '2024-05-01 00:00:00+07'),
(1, 2, 2, 156.8, 4, 156.8, 3800, '2024-04-01 00:00:00+07', '2024-05-01 00:00:00+07'),
(1, 9, 3, 112.7, 3, 112.7, 2100, '2024-04-01 00:00:00+07', '2024-05-01 00:00:00+07'),
(1, 1, 4, 125.5, 2, 125.5, 3200, '2024-04-01 00:00:00+07', '2024-05-01 00:00:00+07'),
(1, 4, 5, 102.3, 3, 102.3, 1800, '2024-04-01 00:00:00+07', '2024-05-01 00:00:00+07'),
(1, 5, 6, 200.5, 6, 200.5, 5200, '2024-04-01 00:00:00+07', '2024-05-01 00:00:00+07'),
(1, 8, 7, 65.4, 2, 65.4, 1200, '2024-04-01 00:00:00+07', '2024-05-01 00:00:00+07'),
(1, 6, 8, 78.9, 3, 78.9, 900, '2024-04-01 00:00:00+07', '2024-05-01 00:00:00+07'),
(1, 3, 9, 45.2, 2, 45.2, 600, '2024-04-01 00:00:00+07', '2024-05-01 00:00:00+07'),
(1, 10, 10, 34.8, 1, 34.8, 300, '2024-04-01 00:00:00+07', '2024-05-01 00:00:00+07'),

-- Leaderboard cho challenge 2 (3 đỉnh núi)
(2, 7, 1, 4, 4, 85.2, 5200, '2024-06-01 00:00:00+07', '2024-07-01 00:00:00+07'),
(2, 5, 2, 5, 5, 120.5, 6800, '2024-06-01 00:00:00+07', '2024-07-01 00:00:00+07'),
(2, 2, 3, 3, 3, 78.6, 4200, '2024-06-01 00:00:00+07', '2024-07-01 00:00:00+07'),
(2, 1, 4, 2, 2, 52.3, 3200, '2024-06-01 00:00:00+07', '2024-07-01 00:00:00+07'),
(2, 4, 5, 2, 2, 48.7, 2800, '2024-06-01 00:00:00+07', '2024-07-01 00:00:00+07'),

-- Leaderboard cho challenge 3 (5000m elevation)
(3, 5, 1, 6000, 4, 65.8, 6000, '2024-06-30 23:59:00+07', '2024-07-30 23:59:00+07'),
(3, 7, 2, 5200, 3, 58.2, 5200, '2024-06-30 23:59:00+07', '2024-07-30 23:59:00+07'),
(3, 2, 3, 3200, 2, 42.5, 3200, '2024-06-30 23:59:00+07', '2024-07-30 23:59:00+07'),
(3, 1, 4, 4200, 3, 48.3, 4200, '2024-06-30 23:59:00+07', '2024-07-30 23:59:00+07'),
(3, 4, 5, 2800, 2, 35.6, 2800, '2024-06-30 23:59:00+07', '2024-07-30 23:59:00+07');

-- Thêm 10 rankings nữa cho các challenge khác
INSERT INTO challenge_leaderboards (challenge_id, user_id, rank, score, trails_completed, distance_km, elevation_gain) VALUES
(3, 9, 6, 2300, 2, 28.4, 2300),
(3, 8, 7, 1900, 2, 25.6, 1900),
(3, 3, 8, 1500, 1, 18.9, 1500),
(4, 6, 1, 30, 5, 45.2, 1200),
(4, 5, 2, 30, 4, 42.8, 1100),
(4, 7, 3, 28, 4, 52.3, 1800),
(4, 2, 4, 25, 3, 38.6, 1400),
(4, 3, 5, 22, 3, 35.4, 900),
(5, 8, 1, 105, 8, 125.6, 4200),
(5, 7, 2, 92, 7, 112.3, 3800);

-- ==========================================
-- 27. USER FAVORITES - 30 favorites
-- ==========================================

INSERT INTO user_favorites (user_id, favorite_type, target_id, notes, custom_name, tags) VALUES
-- User 1 favorites
(1, 'TRAIL', 1, 'Muốn đi lại một lần nữa', 'Fansipan Dream', '["challenge", "summit"]'::jsonb),
(1, 'TRAIL', 3, 'Đẹp vào mùa bướm', 'Rừng Cúc Phương', '["nature", "family-friendly"]'::jsonb),
(1, 'TRAIL', 8, 'Cung đường đẹp nhất', 'Tà Năng - Phan Dũng', '["scenic", "challenge"]'::jsonb),
(1, 'POI', 1, 'Điểm xuất phát Fansipan', NULL, '["start-point"]'::jsonb),
(1, 'POST', 2, 'Review hay về Tà Năng', NULL, '["review", "inspiration"]'::jsonb),

-- User 2 favorites
(2, 'TRAIL', 1, 'Đã đi 3 lần', 'My Favorite', '["fansipan", "home-mountain"]'::jsonb),
(2, 'TRAIL', 8, 'Đi mùa mưa đẹp', 'Green Hills', '["grassland", "beautiful"]'::jsonb),
(2, 'TRAIL', 4, 'View biển từ núi', 'Bạch Mã', '["sea-view", "cool-weather"]'::jsonb),
(2, 'MARKETPLACE_ITEM', 1, 'Giày cần mua', 'Salomon Shoes', '["footwear", "waterproof"]'::jsonb),

-- User 3 favorites
(3, 'TRAIL', 2, 'Gần nhà, đi thường xuyên', 'Đà Lạt Weekend', '["easy", "weekend"]'::jsonb),
(3, 'TRAIL', 11, 'Núi lửa Đà Lạt', 'Lang Bian', '["volcano", "local"]'::jsonb),
(3, 'POST', 1, 'Bài viết hay về Fansipan', NULL, '["trip-report", "detailed"]'::jsonb),
(3, 'MARKETPLACE_ITEM', 2, 'Ba lô tốt', 'Osprey Backpack', '["backpack", "comfort"]'::jsonb),

-- User 4 favorites
(4, 'TRAIL', 6, 'Sa mạc độc đáo', 'Núi Chúa Desert', '["desert", "unique"]'::jsonb),
(4, 'TRAIL', 14, 'Núi cao nhất miền Nam', 'Bà Đen Mountain', '["south", "religious"]'::jsonb),
(4, 'TRIP_PLAN', 6, 'Kế hoạch đi Núi Chúa', 'Desert Trip Plan', '["desert", "plan"]'::jsonb),

-- User 5 favorites (admin)
(5, 'TRAIL', 1, 'Trail phổ biến nhất', 'Most Popular Trail', '["popular", "iconic"]'::jsonb),
(5, 'TRAIL', 10, 'Phù hợp cho du khách', 'Hạ Long Easy', '["tourist-friendly", "unesco"]'::jsonb),

-- User 6 favorites
(6, 'TRAIL', 10, 'Gần biển, đẹp', 'Hạ Long View', '["sea", "easy"]'::jsonb),
(6, 'TRAIL', 13, 'Rừng tràm đặc biệt', 'Trà Sư Forest', '["forest", "wetland"]'::jsonb),
(6, 'POST', 9, 'Review Hạ Long hay', NULL, '["halong", "review"]'::jsonb),

-- User 7 favorites
(7, 'TRAIL', 1, 'Nóc nhà Đông Dương', 'Fansipan', '["highest", "challenge"]'::jsonb),
(7, 'TRAIL', 4, 'Khí hậu mát mẻ', 'Bạch Mã', '["cool", "refreshing"]'::jsonb),
(7, 'TRAIL', 12, 'Cổng trời Tây Bắc', 'Ô Quy Hồ', '["northwest", "difficult"]'::jsonb),

-- User 8 favorites
(8, 'TRAIL', 7, 'Ruộng bậc thang đẹp', 'Pù Luông', '["rice-terrace", "village"]'::jsonb),
(8, 'TRAIL', 8, 'Đồi cỏ xanh mướt', 'Tà Năng', '["grassland", "long-trail"]'::jsonb),
(8, 'MARKETPLACE_ITEM', 7, 'Túi ngủ ấm', 'Sleeping Bag', '["camping", "warm"]'::jsonb),

-- User 9 favorites
(9, 'TRAIL', 9, 'Chụp ảnh hoàng hôn đẹp', 'Hải Vân Pass', '["photography", "sunset"]'::jsonb),
(9, 'TRAIL', 4, 'View chụp ảnh đẹp', 'Bạch Mã Photo', '["photography", "view"]'::jsonb),

-- User 10 favorites
(10, 'TRAIL', 5, 'Đảo đẹp, dễ đi', 'Cát Bà Island', '["island", "easy"]'::jsonb),
(10, 'TRAIL', 2, 'Đi với gia đình', 'Đà Lạt Family', '["family", "easy"]'::jsonb);

-- ==========================================
-- 28. USER REPORTS - 10 reports
-- ==========================================

INSERT INTO user_reports (report_id, reporter_id, report_type, target_id, reason_category, 
                         reason_details, status, priority, assigned_to, resolution_notes, resolved_at) VALUES
(1, 3, 'POST', 2, 'SPAM', 
 'Bài viết này có vẻ như là quảng cáo cho tour du lịch, không phải review thực tế.',
 'RESOLVED', 2, 5, 'Đã xem xét, bài viết là review thực tế của người dùng, không phải spam. Không vi phạm.', 
 '2024-03-20 10:00:00+07'),

(2, 4, 'USER', 2, 'INAPPROPRIATE_BEHAVIOR',
 'Người dùng này có hành vi không phù hợp trong group chat, sử dụng ngôn từ thô tục.',
 'UNDER_REVIEW', 3, 5, NULL, NULL),

(3, 6, 'MARKETPLACE_ITEM', 1, 'MISLEADING',
 'Ảnh sản phẩm không giống thực tế. Giày đã cũ hơn mô tả.',
 'RESOLVED', 2, 5, 'Đã yêu cầu người bán cập nhật ảnh thực tế. Đã xử lý.',
 '2024-03-25 14:00:00+07'),

(4, 1, 'TRAIL', 8, 'INACCURATE_INFO',
 'Thông tin về độ dài cung đường không chính xác. Thực tế dài hơn 55km.',
 'PENDING', 2, NULL, NULL, NULL),

(5, 7, 'COMMENT', 15, 'HARASSMENT',
 'Bình luận này có nội dung công kích cá nhân, xúc phạm người khác.',
 'RESOLVED', 3, 5, 'Đã xóa bình luận vi phạm và cảnh cáo người dùng.',
 '2024-04-10 11:00:00+07'),

(6, 9, 'POST', 25, 'COPYRIGHT',
 'Ảnh trong bài viết này được lấy từ website khác mà không ghi nguồn.',
 'RESOLVED', 2, 5, 'Đã yêu cầu người đăng ghi rõ nguồn ảnh. Đã xử lý.',
 '2024-05-05 16:00:00+07'),

(7, 10, 'REVIEW', 1, 'FAKE_REVIEW',
 'Review này không chân thực, có vẻ như được viết để quảng cáo.',
 'DISMISSED', 1, 5, 'Review là trải nghiệm thực tế của người dùng, không đủ bằng chứng là fake.',
 '2024-03-18 09:00:00+07'),

(8, 2, 'GROUP', 3, 'PRIVATE_INFO_SHARING',
 'Nhóm này chia sẻ thông tin cá nhân của người khác không được phép.',
 'UNDER_REVIEW', 4, 5, NULL, NULL),

(9, 5, 'USER', 4, 'FAKE_ACCOUNT',
 'Tài khoản này có dấu hiệu là fake, chỉ đăng nội dung quảng cáo.',
 'RESOLVED', 3, 5, 'Đã xác minh, đây là tài khoản thật. Người dùng đã được nhắc nhở về nội dung đăng.',
 '2024-04-22 15:00:00+07'),

(10, 8, 'TRAIL', 6, 'SAFETY_CONCERN',
 'Cung đường này thiếu thông tin về điểm cấp nước, nguy hiểm vào mùa khô.',
 'RESOLVED', 4, 5, 'Đã bổ sung thông tin về điểm cấp nước và cảnh báo mùa khô trên trang trail.',
 '2024-02-15 13:00:00+07');

-- Thêm evidence cho một số reports
UPDATE user_reports SET evidence_urls = '["https://trailsexplorer.com/reports/comment_screenshot.jpg"]'::jsonb WHERE report_id = 5;
UPDATE user_reports SET evidence_urls = '["https://trailsexplorer.com/reports/copyright_source.jpg"]'::jsonb WHERE report_id = 6;

-- ==========================================
-- 29. TRAIL CONTRIBUTIONS - 15 contributions
-- ==========================================

TRUNCATE TABLE trail_contributions RESTART IDENTITY CASCADE;

-- 2. Insert 10 dòng đầu tiên có ID cố định
INSERT INTO trail_contributions (contribution_id, user_id, trail_id, contribution_type, data_payload, 
                                change_description, evidence_urls, status, reviewed_by, reviewed_at, review_notes) VALUES
(1, 1, 1, 'UPDATE_INFO',
 '{"estimated_duration_hours": 14, "difficulty": "HARD", "notes": "Cần thêm 2 giờ so với ước tính trước"}'::jsonb,
 'Cập nhật thời gian ước tính và độ khó dựa trên trải nghiệm thực tế',
 '["https://trailsexplorer.com/contributions/fansipan_tracking.jpg"]'::jsonb,
 'APPROVED', 5, '2024-03-20 10:00:00+07', 'Thông tin chính xác, đã cập nhật vào hệ thống.'),

(2, 2, 8, 'ADD_POI',
 '{"name": "Điểm Nghỉ Giữa Rừng Thông", "type": "REST", "location": {"lat": 11.319, "lng": 107.886}, "description": "Bãi đất bằng phẳng giữa rừng thông, thích hợp để nghỉ trưa"}'::jsonb,
 'Thêm điểm nghỉ mới trên cung đường Tà Năng - Phan Dũng',
 '["https://trailsexplorer.com/contributions/pine_forest_rest.jpg"]'::jsonb,
 'APPROVED', 5, '2024-10-25 14:00:00+07', 'POI hữu ích, đã thêm vào bản đồ.'),

(3, 4, 6, 'REPORT_ISSUE',
 '{"issue_type": "WATER_SHORTAGE", "location": {"lat": 11.702, "lng": 109.220}, "description": "Không có nước tại điểm được đánh dấu trên bản đồ", "severity": "HIGH"}'::jsonb,
 'Báo cáo thiếu nước tại điểm giữa sa mạc Ninh Thuận',
 '["https://trailsexplorer.com/contributions/no_water_point.jpg"]'::jsonb,
 'APPROVED', 5, '2024-02-01 09:00:00+07', 'Đã cập nhật thông tin cảnh báo trên bản đồ.'),

(4, 7, 4, 'ADD_PHOTO',
 '{"image_url": "https://trailsexplorer.com/contributions/new_bachma_view.jpg", "caption": "View mới từ phía đông đỉnh Bạch Mã", "location": {"lat": 16.196, "lng": 107.802}}'::jsonb,
 'Thêm ảnh view mới từ đỉnh Bạch Mã',
 '[]'::jsonb,
 'APPROVED', 5, '2024-05-10 11:00:00+07', 'Ảnh đẹp, đã thêm vào bộ sưu tập trail.'),

(5, 8, 7, 'UPDATE_POI',
 '{"poi_id": 15, "updates": {"has_water": true, "description": "Có thêm bể nước mới do dự án phát triển cộng đồng"}}'::jsonb,
 'Cập nhật thông tin về điểm nước tại bản Ước Lễ',
 '["https://trailsexplorer.com/contributions/new_water_tank.jpg"]'::jsonb,
 'PENDING', NULL, NULL, NULL),

(6, 3, 2, 'ADD_REVIEW',
 '{"rating": 4, "title": "Thung lũng hoa mùa xuân", "content": "Đi vào tháng 3, hoa nở rực rỡ. Rất đẹp!", "visited_date": "2024-03-15"}'::jsonb,
 'Thêm review mới cho trail Đà Lạt',
 '[]'::jsonb,
 'APPROVED', 5, '2024-03-25 15:00:00+07', 'Review hợp lệ, đã thêm vào hệ thống.'),

(7, 10, 5, 'REPORT_ISSUE',
 '{"issue_type": "TRAIL_DAMAGE", "location": {"lat": 20.801, "lng": 107.001}, "description": "Đoạn đường gần bãi biển bị sạt lở nhẹ sau mưa", "severity": "MEDIUM"}'::jsonb,
 'Báo cáo sạt lở nhẹ trên cung đường Cát Bà',
 '["https://trailsexplorer.com/contributions/erosion_catba.jpg"]'::jsonb,
 'UNDER_REVIEW', 5, NULL, NULL),

(8, 6, 10, 'UPDATE_INFO',
 '{"permit_required": true, "permit_info": "Cần mua vé tham quan tại cổng, giá 250k/người"}'::jsonb,
 'Cập nhật thông tin về vé tham quan vịnh Hạ Long',
 '["https://trailsexplorer.com/contributions/ticket_info.jpg"]'::jsonb,
 'APPROVED', 5, '2024-12-05 10:00:00+07', 'Thông tin chính xác, đã cập nhật.'),

(9, 9, 9, 'ADD_POI',
 '{"name": "Điểm Chụp Ảnh Hoàng Hôn", "type": "VIEWPOINT", "location": {"lat": 16.186, "lng": 108.203}, "description": "Góc chụp hoàng hôn đẹp nhất trên đèo Hải Vân"}'::jsonb,
 'Thêm điểm chụp ảnh hoàng hôn trên đèo Hải Vân',
 '["https://trailsexplorer.com/contributions/sunset_spot.jpg"]'::jsonb,
 'APPROVED', 5, '2024-07-30 16:00:00+07', 'POI hữu ích cho nhiếp ảnh gia, đã thêm.'),

(10, 1, 3, 'CREATE_TRAIL',
 '{"name": "Cúc Phương - Đường Mòn Thực Vật", "description": "Đường mòn ngắn dành cho gia đình, tập trung vào hệ thực vật", "difficulty": "EASY", "length_km": 2.5}'::jsonb,
 'Đề xuất trail mới trong Vườn Quốc Gia Cúc Phương',
 '["https://trailsexplorer.com/contributions/new_trail_map.jpg"]'::jsonb,
 'PENDING', NULL, NULL, NULL);

-- 3. QUAN TRỌNG: Cập nhật Sequence để nó nhảy qua số 10
-- Lệnh này bắt buộc phải chạy sau khi insert thủ công ID để các lệnh insert sau không bị lỗi duplicate key
SELECT setval(pg_get_serial_sequence('trail_contributions', 'contribution_id'), (SELECT MAX(contribution_id) FROM trail_contributions));

-- 4. Insert 5 dòng tiếp theo (không set ID, để sequence tự tăng từ 11)
INSERT INTO trail_contributions (user_id, trail_id, contribution_type, data_payload, change_description, status) VALUES
(2, 1, 'UPDATE_POI', '{"poi_id": 3, "updates": {"has_shelter": true}}', 'Trạm cứu hộ 2200m đã có lều mới', 'APPROVED'),
(4, 14, 'ADD_REVIEW', '{"rating": 4, "title": "Núi linh thiêng", "content": "Chùa đẹp, view thành phố từ trên cao tuyệt vời."}', 'Thêm review núi Bà Đen', 'APPROVED'),
(7, 12, 'REPORT_ISSUE', '{"issue_type": "WEATHER_HAZARD", "description": "Sương mù dày đặc vào buổi sáng, khó định hướng"}', 'Cảnh báo sương mù trên đèo Ô Quy Hồ', 'UNDER_REVIEW'),
(8, 8, 'ADD_PHOTO', '{"image_url": "https://trailsexplorer.com/contributions/tanang_morning.jpg", "caption": "Buổi sáng trên đồi cỏ Tà Năng"}', 'Thêm ảnh buổi sáng Tà Năng', 'APPROVED'),
(10, 2, 'UPDATE_INFO', '{"best_season": "Tháng 10 - Tháng 4", "weather_notes": "Tránh mùa mưa từ tháng 5-9"}', 'Cập nhật mùa đẹp nhất cho Đà Lạt', 'PENDING');

-- ==========================================
-- 30. SYSTEM CONFIGS - 8 configs (đã có trong schema gốc, chỉ thêm nếu cần)
-- ==========================================

-- Đã có trong schema gốc, không cần thêm

-- ==========================================
-- 31. API RATE LIMITS - 10 limits
-- ==========================================

INSERT INTO api_rate_limits (limit_id, user_id, endpoint, request_count, period_start, period_end, max_requests) VALUES
(1, 1, '/api/trails', 85, '2024-03-01 00:00:00+07', '2024-04-01 00:00:00+07', 100),
(2, 1, '/api/tracking/start', 12, '2024-03-14 00:00:00+07', '2024-03-15 00:00:00+07', 50),
(3, 2, '/api/trails', 120, '2024-03-01 00:00:00+07', '2024-04-01 00:00:00+07', 100),
(4, 3, '/api/posts', 45, '2024-04-20 00:00:00+07', '2024-04-21 00:00:00+07', 100),
(5, 7, '/api/tracking', 68, '2024-05-01 00:00:00+07', '2024-06-01 00:00:00+07', 100),
(6, 5, '/api/admin/users', 320, '2024-03-01 00:00:00+07', '2024-04-01 00:00:00+07', 500),
(7, 9, '/api/media/upload', 8, '2024-07-22 00:00:00+07', '2024-07-23 00:00:00+07', 20),
(8, 6, '/api/reviews', 15, '2024-11-30 00:00:00+07', '2024-12-01 00:00:00+07', 50),
(9, 4, '/api/challenges/progress', 22, '2024-01-25 00:00:00+07', '2024-01-26 00:00:00+07', 50),
(10, 8, '/api/marketplace', 18, '2024-03-01 00:00:00+07', '2024-04-01 00:00:00+07', 100);

-- ==========================================
-- 32. SYSTEM JOBS - 5 jobs
-- ==========================================

INSERT INTO system_jobs (job_id, job_type, payload, status, priority, scheduled_at, started_at, completed_at) VALUES
(uuid_generate_v4(), 'UPDATE_TRAIL_STATS', '{"trail_id": 1}', 'COMPLETED', 3, '2024-03-16 02:00:00+07', '2024-03-16 02:05:00+07', '2024-03-16 02:10:00+07'),
(uuid_generate_v4(), 'SEND_WEATHER_ALERTS', '{"region": "tay_bac"}', 'COMPLETED', 1, '2024-03-13 18:00:00+07', '2024-03-13 18:00:30+07', '2024-03-13 18:05:00+07'),
(uuid_generate_v4(), 'GENERATE_HEATMAP', '{"period": "2024-03"}', 'PROCESSING', 4, '2024-04-01 03:00:00+07', '2024-04-01 03:10:00+07', NULL),
(uuid_generate_v4(), 'CLEANUP_OLD_DATA', '{"retention_days": 90}', 'PENDING', 5, '2024-04-01 02:00:00+07', NULL, NULL),
(uuid_generate_v4(), 'UPDATE_CHALLENGE_LEADERBOARDS', '{"challenge_id": 1}', 'COMPLETED', 2, '2024-04-01 01:00:00+07', '2024-04-01 01:05:00+07', '2024-04-01 01:15:00+07');

-- ==========================================
-- CẬP NHẬT THỐNG KÊ TỔNG HỢP
-- ==========================================

-- Cập nhật thống kê users
UPDATE users SET 
    total_distance_km = COALESCE(total_distance_km, 0) + 
        (SELECT COALESCE(SUM(total_distance_km), 0) 
         FROM track_logs 
         WHERE track_logs.user_id = users.user_id AND end_time IS NOT NULL),
    total_trips_completed = 
        (SELECT COUNT(*) 
         FROM trips 
         WHERE trips.user_id = users.user_id AND status = 'COMPLETED'),
    total_trails_conquered = 
        (SELECT COUNT(DISTINCT trail_id) 
         FROM trips 
         WHERE trips.user_id = users.user_id AND status = 'COMPLETED' AND trail_id IS NOT NULL)
WHERE user_id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

-- Cập nhật longest_distance và highest_altitude
UPDATE users SET 
    longest_distance = (
        SELECT MAX(total_distance_km) 
        FROM track_logs 
        WHERE track_logs.user_id = users.user_id AND end_time IS NOT NULL
    ),
    highest_altitude = (
        SELECT MAX(max_elevation) 
        FROM track_logs 
        WHERE track_logs.user_id = users.user_id AND end_time IS NOT NULL
    )
WHERE user_id IN (1, 2, 3, 4, 7, 8, 10);

-- Cập nhật thống kê trails
UPDATE trails SET 
    total_completions = (
        SELECT COUNT(*) 
        FROM trips 
        WHERE trips.trail_id = trails.trail_id AND trips.status = 'COMPLETED'
    ),
    total_favorites = (
        SELECT COUNT(*) 
        FROM user_favorites 
        WHERE user_favorites.favorite_type = 'TRAIL' AND user_favorites.target_id = trails.trail_id
    )
WHERE trail_id BETWEEN 1 AND 15;

-- Refresh materialized view
REFRESH MATERIALIZED VIEW mv_admin_dashboard_stats;

-- ==========================================
-- KẾT THÚC - RE-ENABLE TRIGGERS
-- ==========================================

SET session_replication_role = 'origin';

-- ==========================================
-- KIỂM TRA DỮ LIỆU
-- ==========================================

-- Kiểm tra số lượng bản ghi đã insert
DO $$
DECLARE
    total_records INT := 0;
BEGIN
    -- Đếm tổng số bản ghi trong tất cả các bảng
    SELECT SUM(cnt) INTO total_records FROM (
        SELECT COUNT(*) as cnt FROM users UNION ALL
        SELECT COUNT(*) FROM user_follows UNION ALL
        SELECT COUNT(*) FROM trails UNION ALL
        SELECT COUNT(*) FROM trail_pois UNION ALL
        SELECT COUNT(*) FROM trail_images UNION ALL
        SELECT COUNT(*) FROM trips UNION ALL
        SELECT COUNT(*) FROM trip_checklists UNION ALL
        SELECT COUNT(*) FROM track_logs UNION ALL
        SELECT COUNT(*) FROM trip_media UNION ALL
        SELECT COUNT(*) FROM safety_alerts UNION ALL
        SELECT COUNT(*) FROM user_received_alerts UNION ALL
        SELECT COUNT(*) FROM emergency_contacts UNION ALL
        SELECT COUNT(*) FROM safety_checkpoints UNION ALL
        SELECT COUNT(*) FROM checkpoint_logs UNION ALL
        SELECT COUNT(*) FROM community_posts UNION ALL
        SELECT COUNT(*) FROM post_comments UNION ALL
        SELECT COUNT(*) FROM post_likes UNION ALL
        SELECT COUNT(*) FROM user_groups UNION ALL
        SELECT COUNT(*) FROM group_members UNION ALL
        SELECT COUNT(*) FROM marketplace_items UNION ALL
        SELECT COUNT(*) FROM marketplace_favorites UNION ALL
        SELECT COUNT(*) FROM trail_reviews UNION ALL
        SELECT COUNT(*) FROM challenges UNION ALL
        SELECT COUNT(*) FROM challenge_participants UNION ALL
        SELECT COUNT(*) FROM challenge_leaderboards UNION ALL
        SELECT COUNT(*) FROM user_favorites UNION ALL
        SELECT COUNT(*) FROM user_reports UNION ALL
        SELECT COUNT(*) FROM trail_contributions UNION ALL
        SELECT COUNT(*) FROM api_rate_limits UNION ALL
        SELECT COUNT(*) FROM system_jobs
    ) AS counts;
    
    RAISE NOTICE 'Tổng số bản ghi đã tạo: %', total_records;
    RAISE NOTICE 'Dữ liệu mẫu đã được tạo thành công!';
END $$;

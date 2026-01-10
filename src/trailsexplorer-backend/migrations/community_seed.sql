
-- ==========================================
-- 1. CLEANUP PREVIOUS SEED DATA
-- ==========================================
TRUNCATE TABLE marketplace_items RESTART IDENTITY CASCADE;
TRUNCATE TABLE community_posts RESTART IDENTITY CASCADE;
TRUNCATE TABLE user_groups RESTART IDENTITY CASCADE;
TRUNCATE TABLE group_members RESTART IDENTITY CASCADE;
TRUNCATE TABLE challenges RESTART IDENTITY CASCADE;

-- ==========================================
-- 2. POLISHED MARKETPLACE (items)
-- ==========================================
INSERT INTO marketplace_items (seller_id, title, description, price, condition, images, status, category) VALUES
(2, 'Lều Premium 4 Người NatureHike', 'Lều chống mưa tốt, chỉ số chống nước 3000mm. Full phụ kiện, siêu nhẹ.', 1500000, 'LIKE_NEW', '["/tent.png"]'::jsonb, 'AVAILABLE', 'CAMPING'),
(3, 'Giày Trekking Salomon X Ultra 4', 'Giày chính hãng, size 42. Chống nước Gore-Tex, cực kỳ bám đá.', 1800000, 'GOOD', '["/boots.png"]'::jsonb, 'AVAILABLE', 'FOOTWEAR'),
(1, 'Ba lô Osprey Atmos AG 50L', 'Ba lô leo núi chuyên dụng với hệ thống đai lực Anti-Gravity. Rất thoải mái.', 3200000, 'LIKE_NEW', '["/backpack.png"]'::jsonb, 'AVAILABLE', 'ACCESSORIES'),
(4, 'Đèn pin Black Diamond 450lm', 'Đèn siêu sáng 450 lumen, chống nước hoàn toàn IP67.', 850000, 'NEW', '["/headlamp.png"]'::jsonb, 'AVAILABLE', 'ACCESSORIES'),
(6, 'Gậy leo núi Carbon Diamond', 'Siêu nhẹ, có thể gập gọn. Phụ hợp cho các cung đường dốc cao.', 1200000, 'NEW', '["/poles.png"]'::jsonb, 'AVAILABLE', 'ACCESSORIES'),
(2, 'Bếp Gas Cắm Trại Portable', 'Bếp gas dã ngoại gấp gọn, đánh lửa tự động, kèm hộp đựng.', 450000, 'NEW', '["/stove.png"]'::jsonb, 'AVAILABLE', 'CAMPING'),
(3, 'Túi Ngủ Winter Pro -15C', 'Túi ngủ chịu nhiệt cực thấp, nhồi lông vũ cao cấp, siêu ấm.', 2200000, 'LIKE_NEW', '["/sleepingbag.png"]'::jsonb, 'AVAILABLE', 'CAMPING'),
(1, 'Bộ Sơ Cứu Y Tế Cá Nhân', 'Đầy đủ dụng cụ sơ cứu cơ bản cho trekking và cắm trại.', 250000, 'NEW', '["/firstaid.png"]'::jsonb, 'AVAILABLE', 'ACCESSORIES'),
(4, 'Võng Du Lịch Siêu Nhẹ', 'Võng dù 2 lớp chịu lực tốt, kèm dây đai và móc khóa.', 350000, 'NEW', '["/hammock.png"]'::jsonb, 'AVAILABLE', 'CAMPING'),
(6, 'Áo Mưa Poncho Trekking', 'Áo mưa chuyên dụng, đủ rộng để che cả ba lô lớn.', 120000, 'NEW', '["/poncho.png"]'::jsonb, 'AVAILABLE', 'ACCESSORIES'),
(2, 'Bình Lọc Nước Cầm Tay', 'Lọc sạch 99.9% vi khuẩn, dùng trực tiếp nước suối.', 650000, 'NEW', '["/waterfilter.png"]'::jsonb, 'AVAILABLE', 'CAMPING'),
(3, 'Bếp Gas Mini Siêu Gọn', 'Kích thước chỉ bằng bàn tay, công suất đun nấu mạnh.', 280000, 'NEW', '["/ministove.png"]'::jsonb, 'AVAILABLE', 'CAMPING');

-- ==========================================
-- 3. ENHANCED COMMUNITY POSTS (2025/2026)
-- ==========================================
INSERT INTO community_posts (user_id, content_type, title, content, media_urls, like_count, comment_count, created_at) VALUES
(1, 'TRIP_REPORT', 'Chinh phục Fansipan - Mùa mây trắng 2026', 'Hành trình 2 ngày 1 đêm tuyệt vời. Cảm giác đứng trên đỉnh ngắm biển mây thực sự không thể tả bằng lời. #Fansipan #TrekkingVN', '["https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=1200"]'::jsonb, 124, 18, '2026-01-05 08:30:00+07'),
(2, 'PHOTO', 'Bình minh trên đồi cỏ Tà Năng', 'Dậy từ 5h sáng để bắt kịp khoảnh khắc này. Mùa này cỏ xanh mướt, không khí rất trong lành.', '["https://images.unsplash.com/photo-1565693235245-37dc4d88a60e?q=80&w=1200"]'::jsonb, 256, 42, '2026-01-08 06:15:00+07'),
(3, 'TRAIL_REVIEW', 'Đánh giá giày Salomon X Ultra 4 sau 100km', 'Ưu điểm: Bám đá tốt, cực kỳ nhẹ. Nhược điểm: Giá hơi cao nhưng đáng đồng tiền bát gạo.', '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800"]'::jsonb, 89, 24, '2026-01-09 14:20:00+07'),
(4, 'QUESTION', 'Nên đi trekking Pù Luông vào tháng mấy?', 'Chào mọi người, mình đang định đi Pù Luông vào cuối năm nay, không biết lúc đó có còn ruộng lúa không nhỉ?', '[]'::jsonb, 15, 34, '2026-01-10 10:00:00+07'),
(7, 'TRIP_REPORT', 'Khám phá hang động tại Bái Tử Long', 'Ít người hơn Hạ Long nên cảm giác hoang sơ hơn hẳn. Hang Dơi thực sự ấn tượng!', '["https://images.unsplash.com/photo-1523224949444-170258978eef?q=80&w=1200"]'::jsonb, 167, 12, '2026-01-02 16:45:00+07');

-- ==========================================
-- 4. POLISHED GROUPS
-- ==========================================
INSERT INTO user_groups (created_by, name, description, group_type, avatar_url, member_count) VALUES
(1, 'Hội đam mê Fansipan 2026', 'Nhóm dành cho những người chuẩn bị chinh phục Fansipan trong năm 2026. Chia sẻ lịch trình và tìm đồng đội.', 'PUBLIC', 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800', 1250),
(2, 'Trekking Đà Lạt & Tây Nguyên 2026', 'Cùng nhau khám phá những cung đường sương mù tuyệt đẹp tại Đà Lạt năm 2026.', 'PUBLIC', 'https://images.unsplash.com/photo-1527838832700-50592524d78b?q=80&w=800', 850),
(3, 'Cộng đồng Ultralight Trekking VN', 'Nơi chia sẻ kinh nghiệm trekking nhẹ nhàng, tối ưu hóa trang bị.', 'PUBLIC', 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=800', 420);

-- ==========================================
-- 5. GROUP MEMBERShips
-- ==========================================
INSERT INTO group_members (group_id, user_id, role) VALUES
(1, 1, 'OWNER'), (1, 2, 'MEMBER'), (1, 3, 'MEMBER'),
(2, 2, 'OWNER'), (2, 4, 'MEMBER'),
(3, 3, 'OWNER'), (3, 1, 'MEMBER')
ON CONFLICT (group_id, user_id) DO NOTHING;

-- ==========================================
-- 6. CHALLENGES 2026
-- ==========================================
INSERT INTO challenges (name, description, target_value, unit, start_date, end_date, challenge_type, is_active, is_featured) VALUES
('Thử thách 50km Tháng 1', 'Tích lũy 50km trekking trong tháng 1 năm 2026 để nhận huy hiệu "Pro Trekker".', 50, 'km', '2026-01-01', '2026-01-31', 'DISTANCE', TRUE, TRUE),
('Chinh phục 3 đỉnh núi mới', 'Check-in tại 3 đỉnh núi bất kỳ có độ cao trên 1000m trong quý 1 năm 2026.', 3, 'đỉnh', '2026-01-01', '2026-03-31', 'TRAIL_COUNT', TRUE, TRUE);

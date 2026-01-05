-- Top 5 Cung đường "Hot" nhất (Dựa trên đánh giá và độ khó)
SELECT 
    t.name AS trail_name,
    t.location_province AS province,
    t.difficulty,
    t.avg_rating,
    t.total_reviews,
    t.length_km,
    t.elevation_gain
FROM trails t
WHERE t.is_verified = TRUE
ORDER BY t.avg_rating DESC, t.total_reviews DESC
LIMIT 5;

-- Phân bố độ khó của các cung đường
-- Biểu đồ gợi ý: Pie Chart
SELECT 
    difficulty,
    COUNT(*) AS total_trails,
    ROUND(AVG(length_km), 1) AS avg_length_km,
    ROUND(AVG(estimated_duration_hours), 1) AS avg_duration_hours
FROM trails
GROUP BY difficulty
ORDER BY 
    CASE difficulty 
        WHEN 'EASY' THEN 1 
        WHEN 'MODERATE' THEN 2 
        WHEN 'HARD' THEN 3 
        WHEN 'EXTREME' THEN 4 
    END;

-- Bảng xếp hạng Trekker (Top 5 người đi nhiều nhất)
-- Biểu đồ gợi ý: Horizontal Bar Chart
SELECT 
    DENSE_RANK() OVER (ORDER BY total_distance_km DESC) as rank,
    username,
    full_name,
    total_distance_km,
    total_trips_completed,
    highest_altitude,
    fitness_level
FROM users
WHERE is_active = TRUE
ORDER BY total_distance_km DESC
LIMIT 5;

-- Tìm các cung đường trong bán kính 200km từ Hà Nội
-- (Tọa độ Hà Nội: 105.8544, 21.0285)
SELECT 
    name,
    location_province,
    difficulty,
    length_km,
    -- Tính khoảng cách theo KM
    ROUND((ST_Distance(
        location_coordinates::geography, 
        ST_MakePoint(105.8544, 21.0285)::geography
    ) / 1000)::numeric, 2) AS distance_from_hanoi_km
FROM trails
WHERE ST_DWithin(
    location_coordinates::geography, 
    ST_MakePoint(105.8544, 21.0285)::geography, 
    200000 -- 200km in meters
)
ORDER BY distance_from_hanoi_km ASC;

-- Thống kê sàn thương mại điện tử (Marketplace)
-- Biểu đồ gợi ý: Treemap hoặc Bar Chart
SELECT 
    category,
    status,
    COUNT(*) as item_count,
    SUM(price) as total_value_vnd,
    ROUND(AVG(price), 0) as avg_price_vnd
FROM marketplace_items
GROUP BY category, status
ORDER BY total_value_vnd DESC;
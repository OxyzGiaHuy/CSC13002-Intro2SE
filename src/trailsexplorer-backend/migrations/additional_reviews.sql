
-- Reviews cho Halong (Trail 10)
INSERT INTO trail_reviews (trail_id, user_id, trip_id, overall_rating, scenery_rating, difficulty_rating, safety_rating, accessibility_rating, title, content, visited_date, visited_with, weather_during_visit, helpful_count) VALUES
(10, 6, 10, 5, 5, 3, 5, 4, 'Hạ Long đẹp trai', 'Một chuyến đi tuyệt vời, cảnh quan hùng vĩ.', '2024-11-30', 'FRIENDS', 'PARTLY_CLOUDY', 10),
(10, 3, 10, 4, 4, 3, 4, 5, 'Khá đông đúc', 'Cảnh đẹp nhưng hơi đông khách du lịch.', '2024-12-01', 'FAMILY', 'CLOUDY', 5);

INSERT INTO trail_reviews (trail_id, user_id, trip_id, overall_rating, scenery_rating, difficulty_rating, safety_rating, accessibility_rating, title, content, visited_date, visited_with, weather_during_visit, helpful_count) VALUES
(11, 2, 11, 4, 5, 4, 4, 4, 'Langbian gió lớn', 'Đỉnh núi gió rất to, nên mang áo ấm. Cảnh Đà Lạt từ trên cao rất đẹp.', '2024-12-10', 'SOLO', 'WINDY', 8),
(12, 7, 12, 5, 5, 5, 3, 3, 'Ô Quy Hồ hùng vĩ', 'Đèo dài và đẹp, săn mây thành công.', '2024-12-26', 'FRIENDS', 'CLOUDY', 15),
(13, 6, 13, 4, 4, 2, 5, 5, 'Rừng tràm xanh mát', 'Đi thuyền len lỏi trong rừng tràm rất thú vị.', '2024-11-20', 'FAMILY', 'SUNNY', 7),
(14, 4, 14, 4, 3, 4, 4, 4, 'Bà Đen nóng quá', 'Leo núi Bà Đen mùa này rất nắng, nhưng chùa rất đẹp.', '2024-04-15', 'FRIENDS', 'SUNNY', 6),
(15, 10, 15, 5, 5, 3, 5, 4, 'Bái Tử Long hoang sơ', 'Vịnh này vắng vẻ và sạch hơn Hạ Long nhiều.', '2024-10-20', 'GROUP', 'CLEAR', 9),
(16, 1, 16, 5, 5, 4, 4, 3, 'Bidoup mùa lá đỏ', 'Rừng lá phong rất đẹp, trek vừa sức.', '2024-12-05', 'SOLO', 'COOL', 12),
(17, 3, 9, 3, 4, 5, 2, 2, 'Tây Côn Lĩnh khó đi', 'Đường đi rất xấu và trơn trượt, cần cẩn thận.', '2024-11-05', 'GROUP', 'RAIN', 4),
(18, 8, 7, 5, 5, 3, 4, 5, 'Quản Bạ yên bình', 'Cổng trời Quản Bạ nhìn xuống núi đôi rất đẹp.', '2024-09-15', 'FAMILY', 'CLEAR', 11),
(19, 2, 8, 4, 4, 2, 5, 4, 'Hồ Ba Bể trong xanh', 'Nước hồ xanh biếc, chèo kayak rất vui.', '2024-10-22', 'FRIENDS', 'CLOUDY', 8),
(20, 4, 6, 4, 3, 4, 4, 3, 'Núi Dinh cuối tuần', 'Địa điểm trekking gần Sài Gòn khá ổn.', '2024-11-11', 'SOLO', 'HOT', 5);

-- More fake reviews to ensure every trail has at least a couple and some variation
INSERT INTO trail_reviews (trail_id, user_id, trip_id, overall_rating, scenery_rating, difficulty_rating, safety_rating, accessibility_rating, title, content, visited_date, visited_with, weather_during_visit, helpful_count) VALUES
(1, 4, 1, 5, 5, 5, 5, 5, 'Tuyệt vời', 'Không thể chê vào đâu được.', '2024-03-16', 'SOLO', 'CLEAR', 20),
(2, 5, 3, 3, 4, 2, 5, 5, 'Bình thường', 'Cũng đẹp nhưng hơi nhân tạo.', '2024-04-21', 'FAMILY', 'CLOUDY', 3),
(3, 8, 16, 5, 5, 3, 4, 4, 'Rừng xanh', 'Không khí trong lành tuyệt đối.', '2024-02-12', 'FRIENDS', 'RAIN', 6),
(5, 2, 5, 4, 5, 3, 4, 4, 'Biển xanh cát trắng', 'Leo núi xong xuống tắm biển là nhất.', '2024-06-14', 'SOLO', 'HOT', 14);

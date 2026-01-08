# Backend API Development Summary

**Task:** Phase 5 - Backend API Routes Implementation

## Mục tiêu
Xây dựng các API RESTful để phục vụ cho các tính năng cốt lõi của ứng dụng TrailsExplorer, bao gồm:
1.  **Trails & Reviews**: Hiển thị danh sách, chi tiết đường mòn, tìm kiếm và đánh giá.
2.  **Community**: Đăng bài thảo luận, chia sẻ trải nghiệm.
3.  **Favorites**: Lưu đường mòn yêu thích.

## Kết quả đạt được

### 1. Hệ thống Models mới
Đã tích hợp thêm các Models vào Sequelize (`src/trailsexplorer-backend/models/`):
-   **`CommunityPost`**: Map với bảng `community_posts` để lưu bài đăng.
-   **`Favorite`**: Map với bảng `user_favorites` (dùng `favorite_type='TRAIL'`).
-   **`Review`** (Cập nhật): Bật timestamps (`created_at`) để hiển thị thời gian chính xác.

### 2. Các API Endpoints đã triển khai
Toàn bộ API được mount tại `/api` và đã tích hợp Authentication (JWT).

#### 🏔️ Trails API (`/api/trails`)
-   `GET /`: Lấy danh sách trails (Hỗ trợ phân trang, lọc theo difficulty/location).
-   `GET /:id`: Xem chi tiết 1 trail + 5 reviews mới nhất.
-   `GET /search?q=...`: Tìm kiếm trail theo tên hoặc địa điểm.
-   `POST /:id/reviews`: Đăng review mới (Yêu cầu đăng nhập).
-   `DELETE /:id/reviews/:reviewId`: Xóa review.

#### 💬 Community API (`/api/community`)
-   `GET /posts`: Lấy danh sách bài đăng cộng đồng (Mới nhất trước).
-   `POST /posts`: Tạo bài đăng mới (Text, Photo, Video...).
-   `DELETE /posts/:id`: Xóa bài đăng của chính mình.

#### ❤️ Favorites API (`/api/user`)
-   `GET /favorites`: Lấy danh sách các trails đã yêu thích.
-   `POST /favorites/:trailId`: Thêm trail vào danh sách yêu thích.
-   `DELETE /favorites/:trailId`: Bỏ yêu thích.

### 3. Sửa lỗi hệ thống (Bug Fixes)
-   **Database Sequence Sync**: Phát hiện và xử lý lỗi `unique violation` do Sequence ID của PostgreSQL bị lệch so với dữ liệu nhập tay. Đã tạo script `fix-sequence.js` để đồng bộ lại toàn bộ ID.
-   **User Model Timestamps**: Sửa cấu hình Model User để map đúng cột `created_at`/`updated_at` trong Schema.

## Ý nghĩa (Significance)
Việc hoàn thành task này mang lại các giá trị quan trọng:
1.  **Kết nối Frontend - Real Data**: Frontend giờ đây có thể gọi API thật thay vì dùng Mock Data, cho phép hiển thị dữ liệu động từ database.
2.  **Lưu trữ bền vững (Persistence)**: Mọi hành động của người dùng (đăng bài, yêu thích, đánh giá) đều được lưu trữ an toàn vào PostgreSQL.
3.  **Tương tác người dùng**: Mở khóa các tính năng mạng xã hội và cá nhân hóa, làm nền tảng cho sự phát triển của cộng đồng người dùng ứng dụng.

## Hướng dẫn kiểm thử
Đã tạo script tự động `test-api-routes.js` để verify toàn bộ luồng hoạt động:
```bash
cd src/trailsexplorer-backend
node test-api-routes.js
```
Kết quả test cuối cùng: **✅ ALL PASSED**

# Bảng Phân Công Nhiệm Vụ Chi Tiết (Task Assignment)

Tài liệu này quy định chi tiết các đầu việc cho nhóm 4 thành viên (M1, M2, M3, M4) để phát triển dự án **TrailsExplorer**.

## 👥 Phân Công Theo Role

### Định nghĩa Role trong Software Engineering Process

- **M1 (Project Lead + Backend Developer)**: 
  - Vai trò: Team Lead, chịu trách nhiệm architecture, database design, backend API
  - Kỹ năng: Leadership, System Design, Backend (Node.js/Express), Database (SQL)
  - Output: Architecture docs, Database schema, Backend API, Technical decisions

- **M2 (Frontend Developer + UI/UX)**: 
  - Vai trò: Frontend development, responsive design, user experience
  - Kỹ năng: React, TypeScript, Tailwind CSS, UI/UX principles
  - Output: Reusable components, Responsive UI, Frontend documentation

- **M3 (Integration Engineer + Full-stack)**: 
  - Vai trò: Integration với external services, complex features, full-stack tasks
  - Kỹ năng: API Integration, Leaflet, Google Gemini AI, Problem-solving
  - Output: Integrated features, API connections, Advanced functionalities

- **M4 (QA Engineer + Business Analyst)**: 
  - Vai trò: Quality assurance, testing, requirements analysis, documentation
  - Kỹ năng: Testing (Manual + Automation), Documentation, Requirements gathering
  - Output: Test plans, Test reports, User documentation, Quality metrics

## 📋 Nguyên tắc làm việc
*   **Mô hình:** Agile / Scrum (rút gọn).
*   **Chu kỳ (Sprint):** 1 tuần / giai đoạn.
*   **Quy ước độ khó:**
    *   ⭐ (Dễ): UI cơ bản, ít logic, sửa lỗi vặt.
    *   ⭐⭐ (Trung bình): Có xử lý logic, state, tách component.
    *   ⭐⭐⭐ (Khó): Liên quan đến kiến trúc, Context API, tích hợp thư viện ngoài (Map, AI).

---

## 📍 Giai đoạn 1: Refactoring & Foundation (Tuần 1)
**Mục tiêu:** Tái cấu trúc mã nguồn từ `App.tsx` thành các module nhỏ, chuẩn bị nền móng vững chắc.

| Thành viên | Task ID | Tên công việc | Độ khó | Mô tả chi tiết (Cụ thể từng bước) | Output mong đợi |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **M1** | 1.1 | **Project Structure Setup** | ⭐⭐ | 1. Tạo cây thư mục: `src/components`, `src/pages`, `src/layouts`, `src/services`, `src/types`, `src/context`.<br>2. Di chuyển `types.ts` vào `src/types/index.ts`.<br>3. Di chuyển `constants.tsx` vào `src/data/constants.ts`.<br>4. Sửa lại toàn bộ đường dẫn import trong `App.tsx` để không bị lỗi. | Cấu trúc thư mục mới. App vẫn chạy bình thường không lỗi build. |
| **M2** | 1.2 | **Refactor UI Components** | ⭐ | 1. Tách component `TrailCard` từ `App.tsx` ra file `src/components/common/TrailCard.tsx`.<br>2. Định nghĩa interface `TrailCardProps` rõ ràng.<br>3. Tách `Header` ra `src/components/layout/Header.tsx`.<br>4. Đảm bảo các component này nhận props thay vì dùng biến global. | Các file component nhỏ, độc lập, dễ tái sử dụng. |
| **M3** | 1.3 | **Refactor Pages (Group A)** | ⭐⭐ | 1. Tạo file `src/pages/Home.tsx`, `src/pages/Discover.tsx`, `src/pages/TrailDetail.tsx`.<br>2. Cắt toàn bộ code JSX tương ứng của các màn hình này từ `App.tsx` bỏ vào file mới.<br>3. Xử lý các props cần truyền vào (ví dụ: danh sách trails, hàm onSelect). | File `App.tsx` giảm được 30% độ dài. Các trang hiển thị đúng. |
| **M4** | 1.4 | **Refactor Pages (Group B)** | ⭐⭐ | 1. Tạo file `src/pages/Planner.tsx`, `src/pages/Community.tsx`, `src/pages/Profile.tsx`.<br>2. Cắt code JSX tương ứng bỏ vào.<br>3. **Lưu ý:** Trang `Planner` cần import lại `geminiService` và xử lý state loading/result nội bộ trong trang đó. | File `App.tsx` giảm tiếp 30% độ dài. Tính năng AI Planner vẫn chạy tốt. |
| **M1 + M2** | 1.5 | **Service Layer Implementation** | ⭐⭐ | 1. Tạo file `src/services/trailService.ts`.<br>2. Viết hàm `getTrails()`: Trả về `Promise` (dùng `setTimeout` 500ms để giả lập delay mạng) sau đó resolve về `MOCK_TRAILS`.<br>3. Thay thế việc gọi trực tiếp `MOCK_TRAILS` ở UI bằng việc gọi hàm này trong `useEffect`. | Code UI không còn phụ thuộc cứng vào file constants. Có loading state khi tải dữ liệu. |
| **M3 + M4** | 1.6 | **Global State (AuthContext)** | ⭐⭐⭐ | 1. Tạo `src/context/AuthContext.tsx`.<br>2. Dùng `createContext` để lưu trữ: `user` (object), `isAuthenticated` (boolean), `login()` (function), `logout()` (function).<br>3. Bọc `<AuthProvider>` quanh `App` trong `main.tsx`. | Các trang có thể lấy thông tin user bằng `useAuth()` mà không cần truyền props qua 5 cấp. |

---

## 📍 Giai đoạn 2: Interactive Features (Tuần 2)
**Mục tiêu:** Biến giao diện tĩnh thành động, người dùng có thể thao tác (CRUD trên RAM/LocalStorage).

| Thành viên | Task ID | Tên công việc | Độ khó | Mô tả chi tiết (Cụ thể từng bước) | Output mong đợi |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **M1** | 2.1 | **Authentication Pages** | ⭐⭐ | 1. Tạo trang `src/pages/Login.tsx` và `Register.tsx`.<br>2. Thiết kế form (Email, Password).<br>3. Khi submit: Gọi hàm `login()` từ `AuthContext`.<br>4. Logic giả: Nếu email chứa "admin" -> set role="admin", ngược lại role="user". | Đăng nhập thành công chuyển hướng về Home. Header thay đổi (hiện tên User thay vì nút Login). |
| **M2** | 2.2 | **Social Feed Logic** | ⭐⭐ | 1. Trong `Community.tsx`, tạo state `posts` (khởi tạo bằng Mock Data).<br>2. Thêm ô nhập text "What's on your mind?".<br>3. Viết hàm `handlePost`: Tạo object post mới -> thêm vào đầu mảng `posts`.<br>4. (Optional) Lưu mảng `posts` vào `localStorage` để F5 không mất. | Đăng bài viết mới hiện lên ngay lập tức. |
| **M3** | 2.3 | **Marketplace Logic** | ⭐⭐ | 1. Tạo Modal "Sell Item".<br>2. Form gồm: Tên đồ, Giá, Tình trạng.<br>3. Xử lý logic: Thêm item vào danh sách `marketItems`.<br>4. Thêm nút "Add to Cart" ở mỗi item -> Lưu vào state giỏ hàng đơn giản. | Người dùng có thể đăng bán đồ ảo và thêm đồ vào giỏ. |
| **M4** | 2.4 | **Group & Profile Edit** | ⭐ | 1. Tại `Profile.tsx`, thêm nút "Edit Profile".<br>2. Chuyển các dòng Text thành Input khi bấm Edit.<br>3. Nút Save: Cập nhật lại thông tin vào `AuthContext`.<br>4. Tab Group: Thêm nút "Create Group" -> Nhập tên -> Hiện trong danh sách. | Thông tin Profile thay đổi được. Tạo được nhóm mới. |

---

## 📍 Giai đoạn 3: Advanced & Admin (Tuần 3)
**Mục tiêu:** Các tính năng nâng cao và trang quản trị hệ thống.

| Thành viên | Task ID | Tên công việc | Độ khó | Mô tả chi tiết (Cụ thể từng bước) | Output mong đợi |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **M1** | 3.1 | **Admin Dashboard Layout** | ⭐⭐ | 1. Tạo Layout riêng `AdminLayout` (có Sidebar bên trái).<br>2. Tạo trang `src/pages/admin/Dashboard.tsx`.<br>3. Hiển thị 4 Card thống kê: Total Users, Total Trails, New Posts, Reports. | Giao diện Admin khác biệt với User thường. Chỉ Admin mới vào được (Route Guard). |
| **M2** | 3.2 | **User Management (Admin)** | ⭐⭐ | 1. Tạo trang `src/pages/admin/Users.tsx`.<br>2. Hiển thị Table danh sách User (Mock).<br>3. Thêm cột Action: Nút "Ban/Block".<br>4. Logic: Khi bấm Ban -> Đổi trạng thái user đó thành `inactive`. | Admin có thể khóa tài khoản người dùng (giả lập). |
| **M3** | 3.3 | **Advanced Map (Geolocation)** | ⭐⭐⭐ | 1. Trong `TrailDetail.tsx` (phần Map), thêm nút "My Location".<br>2. Dùng `navigator.geolocation.getCurrentPosition` lấy tọa độ browser.<br>3. Dùng `L.marker` (Leaflet) để vẽ điểm xanh tại tọa độ đó.<br>4. Tính khoảng cách từ User đến điểm bắt đầu Trail (dùng công thức Haversine). | Bản đồ hiển thị được vị trí người dùng và khoảng cách tới cung đường. |
| **M4** | 3.4 | **SOS & Utilities** | ⭐ | 1. Tạo nút tròn đỏ (Floating Button) góc màn hình.<br>2. Bấm vào -> Hiện Modal đếm ngược 5-4-3-2-1.<br>3. Hết giờ -> Hiện thông báo "SOS Signal Sent to [Emergency Contact]".<br>4. Lưu lịch sử SOS vào `Profile`. | Tính năng SOS hoạt động mượt mà, tạo cảm giác khẩn cấp. |

---

## 📍 Giai đoạn 4: Frontend Enhancements & Polish (Tuần 4)
**Mục tiêu:** Cải thiện trải nghiệm người dùng, form validation, error handling, tối ưu UI/UX.

| Thành viên | Task ID | Tên công việc | Độ khó | Mô tả chi tiết (Cụ thể từng bước) | Output mong đợi | Role |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **M2** | 4.1 | **Form Validation & Error Handling (AI Planner)** | ⭐⭐ | 1. Thêm validation cho form Input: Location, Duration, Difficulty phải có giá trị hợp lệ.<br>2. Duration phải là số > 0 và <= 30 ngày.<br>3. Thêm error message rõ ràng khi validation fail.<br>4. Disable nút "Generate" khi form không hợp lệ.<br>5. Thêm toast/notification khi API success. | Form không submit được nếu invalid. UX tốt hơn với feedback rõ ràng. | Frontend + UI/UX |
| **M2** | 4.2 | **Responsive Design Polish** | ⭐⭐ | 1. Test ứng dụng trên breakpoint mobile (320px), tablet (768px), desktop (1024px).<br>2. Sửa các vấn đề layout: Text overflow, Button bị cắt, Image không responsive.<br>3. Tối ưu hóa Padding/Margin cho mobile.<br>4. Đảm bảo Navigation vẫn dùng được trên mobile (Hamburger menu nếu cần). | Ứng dụng hiển thị đẹp trên mọi kích thước màn hình. | Frontend + UI/UX |
| **M3** | 4.3 | **Loading States & Skeleton Components** | ⭐ | 1. Tạo component `SkeletonCard` (placeholder animation khi loading).<br>2. Tạo component `LoadingSpinner` (animated loading icon).<br>3. Dùng skeleton thay vì blank screen khi fetch trails, user data, plans.<br>4. Thêm transition smooth khi component mount/unmount. | Giao diện không bị "flashing" khi load dữ liệu. UX mượt mà hơn. | Integration + Full-stack |
| **M4** | 4.4 | **Performance Optimization** | ⭐⭐ | 1. Sử dụng React DevTools Profiler để detect performance bottleneck.<br>2. Implement `memo()` cho components được render nhiều lần (TrailCard, CommentItem).<br>3. Lazy load images dùng Intersection Observer hoặc lazy-loading attribute.<br>4. Code splitting: Tách các trang thành separate chunks (Home, Planner, etc.).<br>5. Ghi lại metrics: Build size, Initial load time, FCP (First Contentful Paint). | Build size giảm 20%, FCP < 2s trên 4G network. | QA + Business Analyst |

---

## 📍 Giai đoạn 5: Backend & Database Setup (Tuần 5)
**Mục tiêu:** Thiết kế và xây dựng Backend API, Database schema, Authentication system.

| Thành viên | Task ID | Tên công việc | Độ khó | Mô tả chi tiết (Cụ thể từng bước) | Output mong đợi | Role |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **M1** | 5.1 | **Database Design & Schema** | ⭐⭐⭐ | 1. Thiết kế ERD chi tiết bao gồm các bảng: `users`, `trails`, `trail_reviews`, `user_favorites`, `community_posts`, `marketplace_items`, `groups`, `group_members`.<br>2. Xác định Primary Keys, Foreign Keys, Constraints (Unique, Not Null).<br>3. Viết SQL scripts tạo các bảng (sử dụng PostgreSQL hoặc MySQL).<br>4. Tạo file `schema.sql` trong `/docs` hoặc `/backend/migrations/`.<br>5. Vẽ ER Diagram chất lượng cao (dùng Lucidchart hoặc draw.io) để báo cáo. | File `schema.sql`, ER Diagram (hình ảnh PDF) sẵn sàng để implement. | Project Lead + Backend |
| **M1** | 5.2 | **Backend API Setup (Node.js + Express)** | ⭐⭐⭐ | 1. Tạo project Node.js: `npm init` -> `npm install express`.<br>2. Cài đặt dependencies: `cors`, `dotenv`, `jsonwebtoken`, `bcryptjs`.<br>3. Tạo folder structure: `/routes`, `/controllers`, `/models`, `/middleware`, `/config`.<br>4. Implement middleware CORS để Frontend có thể gọi API.<br>5. Tạo file `.env` chứa: `DB_HOST`, `DB_USER`, `DB_PASS`, `JWT_SECRET`.<br>6. Implement error handler middleware tập trung. | Server chạy trên `http://localhost:5000` và có endpoint `/api/health` trả về status OK. | Project Lead + Backend |
| **M1** | 5.3 | **Database Connection & ORM Setup** | ⭐⭐ | 1. Cài `sequelize` hoặc `typeorm` làm ORM.<br>2. Cấu hình connection pool tới PostgreSQL/MySQL.<br>3. Tạo file cấu hình database: `/config/database.js`.<br>4. Implement Sequelize models cho các bảng chính: `User`, `Trail`, `Review`.<br>5. Thử kết nối và log message "Database connected successfully". | ORM hoạt động, có thể query test được từ Node.js console. | Project Lead + Backend |
| **M1** | 5.4 | **Authentication & JWT Implementation** | ⭐⭐⭐ | 1. Implement endpoint `/api/auth/register`: Nhận email & password, hash bcrypt, lưu vào DB.<br>2. Implement endpoint `/api/auth/login`: Verify password, trả về JWT token.<br>3. Implement middleware `authenticateToken` kiểm tra JWT có hợp lệ hay không.<br>4. Implement endpoint `/api/auth/logout` để client clear token.<br>5. Thêm `Authorization: Bearer <token>` header vào protected routes. | Client có thể register, login, nhận JWT token, và dùng token để gọi protected endpoints. | Project Lead + Backend |
| **M2** | 5.5 | **Frontend API Integration Layer** | ⭐⭐ | 1. Tạo file `src/services/api.ts` chứa Axios instance hoặc Fetch wrapper.<br>2. Implement base URL từ `.env`: `VITE_API_BASE_URL`.<br>3. Tạo hàm utility: `apiCall(method, endpoint, data)`.<br>4. Implement interceptor để tự động thêm JWT token vào request header.<br>5. Handle error response: Nếu 401, clear localStorage và redirect về Login. | Frontend có layer API tập trung, không cần lặp lại code gọi fetch. | Frontend + UI/UX |
| **M2** | 5.6 | **Real Authentication Integration (Frontend)** | ⭐⭐⭐ | 1. Update `AuthContext` để thay vì mock, sử dụng API thực.<br>2. Hàm `login()`: Gọi `/api/auth/login`, nhận JWT, lưu vào `localStorage`.<br>3. Hàm `register()`: Gọi `/api/auth/register`.<br>4. Hàm `logout()`: Xóa JWT khỏi `localStorage`, clear user state.<br>5. Implement `useAuth()` hook để các component dễ dàng lấy user info và functions.<br>6. Protected route: Nếu không có JWT, redirect về Login. | Ứng dụng xác thực người dùng với Backend thực tế. | Frontend + UI/UX |
| **M3** | 5.7 | **Backend API Routes: Trails & Reviews** | ⭐⭐ | 1. Implement `GET /api/trails`: Trả về danh sách trails (có pagination, filtering by difficulty).<br>2. Implement `GET /api/trails/:id`: Chi tiết 1 trail + list reviews.<br>3. Implement `POST /api/trails/:id/reviews`: Thêm review mới (require JWT).<br>4. Implement `GET /api/trails/search?q=keyword`: Search trails by name/location.<br>5. Implement `DELETE /api/trails/:id/reviews/:reviewId`: Xóa review (chỉ người tạo hoặc admin). | Frontend có thể tải danh sách trails từ DB thực tế thay vì Mock Data. | Integration + Full-stack |
| **M3** | 5.8 | **Backend API Routes: Community & Favorites** | ⭐⭐ | 1. Implement `GET /api/community/posts`: Trả về danh sách posts (pagination).<br>2. Implement `POST /api/community/posts`: Tạo post mới (require JWT).<br>3. Implement `DELETE /api/community/posts/:id`: Xóa post.<br>4. Implement `GET /api/user/favorites`: Danh sách trails yêu thích của user.<br>5. Implement `POST /api/user/favorites/:trailId`: Thêm vào favorites.<br>6. Implement `DELETE /api/user/favorites/:trailId`: Xóa khỏi favorites. | Community feed và favorites được persist lên DB, không mất khi refresh page. | Integration + Full-stack |
| **M4** | 5.9 | **API Testing & Documentation (Postman)** | ⭐⭐ | 1. Tạo Postman collection chứa tất cả API endpoints.<br>2. Thêm test scripts kiểm tra response status code, response body format.<br>3. Viết API documentation (README với ví dụ request/response).<br>4. Sử dụng Postman's Collection Runner để chạy toàn bộ test.<br>5. Export collection thành JSON file lưu vào `/docs/api/`.<br>6. Ghi lại bugs (nếu có) trong Jira hoặc file markdown. | File Postman collection và API documentation sẵn sàng cho deployment. | QA + Business Analyst |
| **M4** | 5.10 | **Backend Deployment Preparation** | ⭐⭐ | 1. Cài đặt `.env.production` (khác với `.env.development`).<br>2. Tối ưu database queries: Add indexes trên columns thường query (user_id, trail_id).<br>3. Implement logging: Winston hoặc Bunyan để ghi request/error logs.<br>4. Tạo health check endpoint `/api/health` để monitoring.<br>5. Tạo backup script cho database (mysqldump hoặc pg_dump).<br>6. Chuẩn bị deployment checklist (ports, environment variables, dependencies). | Server ready to deploy lên production environment (Heroku, AWS, DigitalOcean, etc.). | QA + Business Analyst |

---

## 📍 Giai đoạn 6: Data Migration & Full Integration (Tuần 6)
**Mục tiêu:** Chuyển dữ liệu từ Mock sang Database thực tế, kiểm tra toàn bộ luồng.

| Thành viên | Task ID | Tên công việc | Độ khó | Mô tả chi tiết (Cụ thể từng bước) | Output mong đợi | Role |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **M1** | 6.1 | **Seed Database with Initial Data** | ⭐⭐ | 1. Tạo file `seeds/seedDatabase.js` chứa script insert dữ liệu mẫu.<br>2. Viết hàm insert ~20 trails, ~10 users, ~30 reviews (lấy từ constants.tsx cũ).<br>3. Viết hàm insert vào bảng `trail_categories` (e.g., "Beginner", "Intermediate", "Expert").<br>4. Chạy script: `node seeds/seedDatabase.js`.<br>5. Verify data bằng SQL query đơn giản (SELECT COUNT(*) FROM trails). | Database chứa dữ liệu mẫu, có thể dùng để test. | Project Lead + Backend |
| **M2** | 6.2 | **Remove Mock Data & Update Frontend Services** | ⭐⭐ | 1. Xóa phần `MOCK_TRAILS`, `MOCK_USERS`, `MOCK_POSTS` khỏi `constants.tsx`.<br>2. Update `trailService.ts` để gọi API thực tế thay vì return mock:<br>   - `getTrails()`: Gọi `GET /api/trails` thay vì `MOCK_TRAILS`.<br>   - `getTrailById(id)`: Gọi `GET /api/trails/:id`.<br>3. Update component `Discover.tsx` để gọi `trailService.getTrails()` thay vì constants.<br>4. Ghi sẵn error handling nếu API fail: hiển thị message, retry button. | Frontend không còn phụ thuộc vào mock data. Tất cả dữ liệu từ API. | Frontend + UI/UX |
| **M3** | 6.3 | **Real Gemini AI Integration with Database** | ⭐⭐⭐ | 1. Update `geminiService.ts`: Thêm tham số `userId` và `trailId` (nếu generate plan cho specific trail).<br>2. Khi user generate plan thành công, auto-save plan vào database (bảng mới `saved_plans`).<br>3. Implement endpoint `GET /api/user/saved-plans`: Trả về danh sách plans của user.<br>4. Frontend: Thêm tính năng "Save Plan" để user có thể lưu lại plans yêu thích.<br>5. Implement "View Saved Plans" ở trang Profile. | User có thể generate plans và lưu lại để xem lại sau. | Integration + Full-stack |
| **M4** | 6.4 | **End-to-End Testing (E2E)** | ⭐⭐⭐ | 1. Viết E2E test using Cypress hoặc Playwright:<br>   - **Test 1 (Login & View Trails):** Đăng nhập -> Vào Discover -> Xem danh sách trails từ API.<br>   - **Test 2 (Generate Plan):** Vào Planner -> Nhập input -> Click "Generate" -> Verify plan hiển thị.<br>   - **Test 3 (Favorite & Save):** View trail -> Click favorite -> Check API call success.<br>   - **Test 4 (Community Post):** Create post -> Verify post appears in feed -> Delete post.<br>2. Chạy test suite: `npm run test:e2e`.<br>3. Ghi lại kết quả pass/fail. | Test suite hoàn chỉnh, có thể chạy tự động trước mỗi deployment. | QA + Business Analyst |

---
## 📍 Giai đoạn 7: Demo Day Preparation (Tuần 7)
**Mục tiêu:** Hoàn thiện tài liệu kỹ thuật, thực hiện kiểm thử tự động và chuẩn bị tài liệu báo cáo Demo Day.

| Thành viên | Task ID | Tên công việc | Độ khó | Mô tả chi tiết (Cụ thể từng bước) | Output mong đợi |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **M1** | 7.1 | **Database Design & Architecture Documentation** | ⭐⭐⭐ | 1. Hoàn thiện ERD chi tiết từ task 5.1.<br>2. Vẽ lại **Architecture Diagram** (như đã thảo luận) để đưa vào Slide phần "Analysis and design".<br>3. Viết mô tả ngắn về công nghệ sử dụng (React, Vite, Gemini AI, Leaflet).<br>4. Tạo system flow diagram cho các use-cases chính. | Ảnh ERD, Ảnh Architecture Diagram chất lượng cao cho Slide. |
| **M2** | 7.2 | **Automated Testing (Katalon)** | ⭐⭐⭐ | 1. Cài đặt **Katalon Studio**.<br>2. Sử dụng tính năng "Record" để tạo Test Script cho **2 Use-cases**:<br>   - **UC1 (Discover):** Search thành công & Search không ra kết quả.<br>   - **UC2 (AI Planner):** Tạo plan thành công & Báo lỗi khi thiếu input.<br>3. Xuất file báo cáo kết quả (PDF/HTML). | File tài liệu "Test Report" chứa: Test Case Name, Script, Result (Pass/Fail). |
| **M3** | 7.3 | **Video Demo Production** | ⭐⭐ | 1. Viết kịch bản **Key Scenario** (User Story xuyên suốt từ đầu đến cuối app).<br>2. Quay màn hình (OBS/Camtasia) theo kịch bản.<br>3. Lồng tiếng hoặc thêm phụ đề giải thích.<br>4. Upload lên Youtube/Drive lấy link. | Video Demo hoàn chỉnh (có âm thanh/phụ đề), thể hiện hết tính năng core. |
| **M4** | 7.4 | **Final Presentation Slides** | ⭐⭐ | 1. Soạn Slide theo đúng 6 phần bắt buộc:<br>   - Problem & Vision.<br>   - Project Management (Team structure).<br>   - Requirements (Use-case model).<br>   - Analysis & Design (Architecture).<br>   - Testing (Katalon results).<br>   - Demo (Link video).<br>2. Phân chia kịch bản nói cho 4 người (mỗi người > 2 phút). | File Slide (PPTX/PDF) và kịch bản thuyết trình (Script). |

---
## 📊 Tóm Tắt Phân Công (Summary)

### Tổng Task Count & Deadline

| Giai Đoạn | Tên Giai Đoạn | Ngày Bắt Đầu | Ngày Kết Thúc | M1 | M2 | M3 | M4 | Tổng Task | Trạng Thái |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **1** | Refactoring & Foundation | Ngày 1 | Ngày 2 | 2 | 1 | 1 | 1 (+1 collab) | **6** | 🔴 Not Started |
| **2** | Interactive Features | Ngày 3 | Ngày 4 | 1 | 1 | 1 | 1 (+1 collab) | **5** | 🔴 Not Started |
| **3** | Advanced & Admin | Ngày 5 | Ngày 6 | 1 | 1 | 1 | 1 | **4** | 🔴 Not Started |
| **4** | FE Enhancements & Polish | Ngày 6 | Ngày 7 | - | 2 | 1 | 1 | **4** | 🔴 Not Started |
| **5** | Backend & Database Setup | Ngày 8 | Ngày 10 | 4 | 2 | 2 | 2 | **10** | 🔴 Not Started |
| **6** | Data Migration & Full Integration | Ngày 11 | Ngày 11 | 1 | 1 | 1 | 1 | **4** | 🔴 Not Started |
| **7** | Demo Day Preparation | Ngày 12 | Ngày 12 | 1 | 1 | 1 | 1 | **4** | 🔴 Not Started |
| | | | | | | | **TỔNG CỘNG** | **37** | |

#### Chú thích:
- **Ngày 1-12**: Calendar development (tính từ ngày bắt đầu dự án)
- **Song song (Parallel)**: Các thành viên khác nhau làm việc trên features khác nhau cùng lúc
- **Tuần tự (Sequential)**: Giai đoạn này phụ thuộc vào kết quả giai đoạn trước
- **🔴 Not Started**: Chưa bắt đầu | 🟡 In Progress: Đang làm | 🟢 Completed: Hoàn thành

### Task Count per Member

| Thành viên | Role | Giai đoạn 1 | Giai đoạn 2 | Giai đoạn 3 | Giai đoạn 4 | Giai đoạn 5 | Giai đoạn 6 | Giai đoạn 7 | **Tổng** | Workload |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **M1** | Project Lead + Backend | 2 | 1 | 1 | - | 4 | 1 | 1 | **10** | 🔴 Cao (Backend-heavy) |
| **M2** | Frontend + UI/UX | 1 | 1 | 1 | 2 | 2 | 1 | 1 | **9** | 🟡 Trung bình |
| **M3** | Integration + Full-stack | 1 | 1 | 1 | 1 | 2 | 1 | 1 | **8** | 🟡 Trung bình |
| **M4** | QA + Business Analyst | 1 | 1 | 1 | 1 | 2 | 1 | 1 | **8** | 🟡 Trung bình |
| **Collab** | M1+M2, M3+M4 | 2 | - | - | - | - | - | - | **2** | - |
| | | | | | | | | | **TỔNG: 37** | |

### Timeline & Milestones (Chi tiết Theo Ngày)

```
📅 PROJECT TIMELINE: 12 Ngày (1.5 tuần sprint)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Giai Đoạn 1: Refactoring & Foundation
├── Ngày 1-2: Setup project structure, refactor components (M1, M2, M3, M4 song song)
├── Ngày 2: Service layer + AuthContext (M1+M2, M3+M4)
└── ✅ Milestone: Project structure hoàn thiện, App run không lỗi

Giai Đoạn 2: Interactive Features
├── Ngày 3-4: Auth pages, Social feed, Marketplace (M1, M2, M3, M4 song song)
└── ✅ Milestone: Tất cả tính năng core UI hoàn thiện

Giai Đoạn 3: Advanced & Admin Features
├── Ngày 5: Admin dashboard, User management, Map + Geolocation (M1, M2, M3 song song)
├── Ngày 5-6: SOS feature (M4)
└── ✅ Milestone: Advanced features hoạt động tốt

Giai Đoạn 4: Frontend Enhancements & Polish
├── Ngày 6-7: Form validation, Responsive design (M2)
├── Ngày 7: Loading states, Performance optimization (M3, M4 song song)
└── ✅ Milestone: Frontend hoàn thiện, responsive trên mọi device

Giai Đoạn 5: Backend & Database Setup
├── Ngày 8: Database design, Backend API setup (M1 song song)
├── Ngày 8-9: ORM configuration, JWT implementation (M1)
├── Ngày 9: Frontend API integration, Real auth (M2)
├── Ngày 9-10: API routes (Trails, Community, Favorites) (M3)
├── Ngày 10: API testing, Deployment prep (M4)
└── ✅ Milestone: Backend & API hoàn toàn hoạt động

Giai Đoạn 6: Data Migration & Full Integration
├── Ngày 11: Database seeding (M1)
├── Ngày 11: Remove mock data, update services (M2)
├── Ngày 11: Real Gemini + database integration (M3)
├── Ngày 11-12: E2E Testing (M4)
└── ✅ Milestone: Full integration pass, tất cả test pass

Giai Đoạn 7: Demo Day Preparation
├── Ngày 12: Database & Architecture documentation (M1)
├── Ngày 12: Automated testing (Katalon) (M2)
├── Ngày 12: Video demo production (M3)
├── Ngày 12: Final presentation slides (M4)
└── ✅ FINAL MILESTONE: Sẵn sàng Demo Day

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 CRITICAL PATH (Ngành Chính - Không Thể Trễ):
  Giai đoạn 1 → 2 → 3 → 4 → 5 → 6 → 7
  (Phải tuần tự vì mỗi giai đoạn depend vào trước)

🔄 PARALLEL WORK (Có Thể Làm Song Song):
  - Trong Giai đoạn 2-3: M1, M2, M3, M4 làm các feature khác nhau
  - Trong Giai đoạn 5: M1 làm DB, M2 làm Frontend API, M3 làm Routes (song song)
  - Trong Giai đoạn 6-7: Tất cả làm doc, test, demo (song song)
```

### Phân Công Theo Kỹ Năng & Trách Nhiệm

**M1 - Project Lead + Backend Developer (Trưởng Nhóm & Backend)**
- **Trách nhiệm chính**: 
  - Leadership: Điều phối team, quyết định kỹ thuật, review code
  - Architecture: Thiết kế tổng thể hệ thống, database schema
  - Backend: API development, authentication, security
- **Công việc cụ thể**: 
  - Giai đoạn 1: Setup project structure, refactoring
  - Giai đoạn 2-3: Authentication, admin features
  - Giai đoạn 5: Database design, backend API, JWT implementation
  - Giai đoạn 6-7: Database seeding, technical documentation
- **Kỹ năng yêu cầu**: Node.js/Express, SQL/PostgreSQL, JWT, System Design, Git
- **Deliverables**: Database schema, API endpoints, Architecture diagram, ERD

**M2 - Frontend Developer + UI/UX (Chuyên Frontend)**
- **Trách nhiệm chính**: 
  - UI Development: Xây dựng giao diện người dùng
  - UX: Đảm bảo trải nghiệm người dùng mượt mà
  - Responsive: Tối ưu cho mọi thiết bị
- **Công việc cụ thể**: 
  - Giai đoạn 1: Refactor UI components, tách Header/TrailCard
  - Giai đoạn 2: Social feed logic
  - Giai đoạn 3: User management UI
  - Giai đoạn 4: Form validation, responsive design polish
  - Giai đoạn 5: Frontend API integration, authentication UI
  - Giai đoạn 6-7: Remove mock data, update services, Katalon testing
- **Kỹ năng yêu cầu**: React 19, TypeScript, Tailwind CSS, HTML5/CSS3, Responsive Design
- **Deliverables**: Reusable components, Responsive UI, Form validation, Test scripts

**M3 - Integration Engineer + Full-stack (Kỹ Sư Tích Hợp)**
- **Trách nhiệm chính**: 
  - Integration: Kết nối external APIs (Gemini AI, Maps)
  - Advanced Features: Tính năng phức tạp (Geolocation, AI Planning)
  - Full-stack: Hỗ trợ cả frontend và backend khi cần
- **Công việc cụ thể**: 
  - Giai đoạn 1: Refactor pages (Home, Discover, TrailDetail)
  - Giai đoạn 2: Marketplace logic
  - Giai đoạn 3: Advanced Map với Geolocation
  - Giai đoạn 4: Loading states & skeleton components
  - Giai đoạn 5: Backend API routes (Trails, Reviews, Community, Favorites)
  - Giai đoạn 6: Real Gemini AI + database integration
  - Giai đoạn 7: Video demo production
- **Kỹ năng yêu cầu**: JavaScript advanced, Leaflet, Google Gemini API, REST API, Node.js
- **Deliverables**: Integrated external services, Advanced features, API routes, Demo video

**M4 - QA Engineer + Business Analyst (QA & Phân Tích)**
- **Trách nhiệm chính**: 
  - Quality Assurance: Kiểm thử chất lượng phần mềm
  - Testing: Manual testing, automation testing (Katalon, Cypress)
  - Documentation: Viết tài liệu kỹ thuật, user guide
  - Business Analysis: Phân tích requirements, use cases
- **Công việc cụ thể**: 
  - Giai đoạn 1: Refactor pages (Planner, Community, Profile)
  - Giai đoạn 2: Group & Profile edit
  - Giai đoạn 3: SOS utilities feature
  - Giai đoạn 4: Performance optimization
  - Giai đoạn 5: API testing (Postman), deployment prep
  - Giai đoạn 6: End-to-end testing (Cypress/Playwright)
  - Giai đoạn 7: Final presentation slides
- **Kỹ năng yêu cầu**: Testing (Katalon, Cypress, Postman), Documentation, Requirements analysis
- **Deliverables**: Test plans, Test reports, API documentation, Presentation slides, Metrics

---

## 📌 Lưu Ý Quan Trọng

1. **Độc lập công việc**: Cố gắng chia tasks sao cho các thành viên có thể làm song song mà ít xung đột nhất.
2. **Daily Sync**: Mỗi ngày check-in 10-15 phút để cập nhật progress và blocker.
3. **Code Review**: Trước khi merge PR, ít nhất 1 bạn khác review.
4. **Git Flow**: 
   - Tạo branch từ `main` hoặc `develop`: `feature/task-id-name`
   - Commit message: `[Task-ID] Brief description`
   - Example: `[1.1] Create project folder structure`
5. **Testing Before Commit**: Chạy `npm run build` và `pnpm dev` để đảm bảo code không bị lỗi.
6. **Document**: Mỗi task nên có README hoặc comment trong code giải thích logic phức tạp.

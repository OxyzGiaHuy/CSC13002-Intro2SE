# Bảng Phân Công Nhiệm Vụ Chi Tiết (Task Assignment)

Tài liệu này quy định chi tiết các đầu việc cho nhóm 4 thành viên (M1, M2, M3, M4) để phát triển dự án **TrailsExplorer**.

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

## 📍 Giai đoạn 4: Backend Prep & Demo Day Preparation (Tuần 4)
**Mục tiêu:** Hoàn thiện tài liệu kỹ thuật, thực hiện kiểm thử tự động và chuẩn bị tài liệu báo cáo Demo Day.

| Thành viên | Task ID | Tên công việc | Độ khó | Mô tả chi tiết (Cụ thể từng bước) | Output mong đợi |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **M1** | 4.1 | **Database Design & Architecture** | ⭐⭐⭐ | 1. Thiết kế ERD chi tiết.<br>2. Vẽ lại **Architecture Diagram** (như đã thảo luận) để đưa vào Slide phần "Analysis and design".<br>3. Viết mô tả ngắn về công nghệ sử dụng (React, Vite, Gemini AI, Leaflet). | Ảnh ERD, Ảnh Architecture Diagram chất lượng cao cho Slide. |
| **M2** | 4.2 | **Automated Testing (Katalon)** | ⭐⭐⭐ | 1. Cài đặt **Katalon Studio**.<br>2. Sử dụng tính năng "Record" để tạo Test Script cho **2 Use-cases**:<br>   - **UC1 (Discover):** Search thành công & Search không ra kết quả.<br>   - **UC2 (AI Planner):** Tạo plan thành công & Báo lỗi khi thiếu input.<br>3. Xuất file báo cáo kết quả (PDF/HTML). | File tài liệu "Test Report" chứa: Test Case Name, Script, Result (Pass/Fail). |
| **M3** | 4.3 | **Video Demo Production** | ⭐⭐ | 1. Viết kịch bản **Key Scenario** (User Story xuyên suốt từ đầu đến cuối app).<br>2. Quay màn hình (OBS/Camtasia) theo kịch bản.<br>3. Lồng tiếng hoặc thêm phụ đề giải thích.<br>4. Upload lên Youtube/Drive lấy link. | Video Demo hoàn chỉnh (có âm thanh/phụ đề), thể hiện hết tính năng core. |
| **M4** | 4.4 | **Final Presentation Slides** | ⭐⭐ | 1. Soạn Slide theo đúng 6 phần bắt buộc:<br>   - Problem & Vision.<br>   - Project Management (Team structure).<br>   - Requirements (Use-case model).<br>   - Analysis & Design (Architecture).<br>   - Testing (Katalon results).<br>   - Demo (Link video).<br>2. Phân chia kịch bản nói cho 4 người (mỗi người > 2 phút). | File Slide (PPTX/PDF) và kịch bản thuyết trình (Script). |

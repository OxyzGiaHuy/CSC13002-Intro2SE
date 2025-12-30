# Tình trạng Source Code Hiện Tại - TrailsExplorer

Tài liệu này mô tả tổng quan về trạng thái hiện tại của mã nguồn dự án **TrailsExplorer**, giúp người đọc hiểu cấu trúc và chức năng mà không cần đọc trực tiếp code.

## 1. Tổng Quan Công Nghệ (Tech Stack)

Dự án được xây dựng dựa trên các công nghệ hiện đại sau:

*   **Framework:** React 19 (sử dụng Hooks: `useState`, `useEffect`, `useRef`).
*   **Build Tool:** Vite (tối ưu hóa tốc độ phát triển và build).
*   **Ngôn ngữ:** TypeScript (đảm bảo tính chặt chẽ về kiểu dữ liệu).
*   **Styling:** Tailwind CSS (thể hiện qua các class như `bg-white`, `text-sage-green`).
*   **AI Integration:** Google Gemini AI SDK (`@google/genai`) để tạo kế hoạch du lịch thông minh.
*   **Bản đồ:** Leaflet (được khai báo global `L`).

## 2. Cấu Trúc Dự Án

Mã nguồn chính nằm trong thư mục `src/trailsexplorer`:

*   **`App.tsx`**: File chính chứa toàn bộ logic điều hướng và giao diện của ứng dụng (Single Page Application).
*   **`services/geminiService.ts`**: Module xử lý kết nối với Google Gemini API để tạo lịch trình và checklist.
*   **`types.ts`**: Định nghĩa các kiểu dữ liệu (Interfaces) cho `Trail`, `User`, `Review`, `ItineraryPlan`, v.v.
*   **`constants.tsx`**: Chứa dữ liệu giả lập (Mock Data) cho các tính năng chưa có Backend thực tế (Trails, Users, Social Feed, Weather...).
*   **`vite.config.ts`**: Cấu hình cho Vite.

## 3. Các Tính Năng Đã Triển Khai

### 3.1. Điều Hướng & Giao Diện (Navigation & UI)
*   Ứng dụng sử dụng cơ chế điều hướng nội bộ (state-based routing) với các màn hình chính:
    *   **Home:** Trang chủ.
    *   **Discover:** Khám phá các cung đường.
    *   **AI Planner:** Lập kế hoạch tự động.
    *   **Community:** Cộng đồng và chợ đồ cũ.
    *   **Profile:** Hồ sơ người dùng.
*   Có thanh **Header** điều hướng và menu responsive cho mobile.

### 3.2. Khám Phá Cung Đường (Discover)
*   Hiển thị danh sách các cung đường (Trails) dưới dạng thẻ (Card).
*   Thông tin hiển thị: Hình ảnh, tên, địa điểm, độ khó, đánh giá sao.
*   Chức năng xem chi tiết (Detail View) và yêu thích (Favorite).

### 3.3. AI Planner (Lập Kế Hoạch Thông Minh)
*   Tích hợp **Google Gemini AI**.
*   Người dùng nhập: Địa điểm, thời gian, độ khó, sở thích.
*   Hệ thống trả về:
    *   Lịch trình chi tiết theo ngày.
    *   Gợi ý thông minh (Smart Suggestions) về ăn uống, tham quan.
    *   Checklist đồ dùng cần thiết.
*   *Lưu ý:* Cần cấu hình `API_KEY` trong biến môi trường để hoạt động.

### 3.4. Cộng Đồng (Community)
*   **Social Feed:** Hiển thị bài đăng từ người dùng khác (Mock data).
*   **Marketplace:** Danh sách các vật dụng leo núi cần bán/trao đổi (Mock data).

### 3.5. Bản Đồ (Map)
*   Tích hợp bản đồ (Leaflet) để hiển thị vị trí cung đường.
*   Có chế độ xem bản đồ từ chi tiết cung đường.

### 3.6. Hồ Sơ & Nhóm (Profile & Group)
*   Hiển thị thống kê người dùng (số km đã đi, độ cao trung bình).
*   Quản lý nhóm leo núi (Group functionality).

## 4. Dữ Liệu (Data)
*   Hiện tại, ứng dụng hoạt động hoàn toàn dựa trên **Mock Data** (dữ liệu giả) được định nghĩa trong `constants.tsx`.
*   Chưa có kết nối tới Backend Database thực tế.

## 5. Yêu Cầu Cài Đặt
*   Cần có Node.js.
*   Cài đặt dependencies: `npm install`.
*   Chạy development server: `npm run dev`.
*   Cần file `.env` chứa key của Gemini API để tính năng AI hoạt động.

# Gemini AI Integration Development Log

## 1. Mục Tiêu (Objective)
Tích hợp Google Gemini AI vào hệ thống TrailsExplorer để cung cấp tính năng:
- **Tạo kế hoạch trekking (Itinerary Generation):** Gợi ý lịch trình chi tiết dựa trên địa điểm, độ khó, sở thích.
- **Tạo danh sách đồ đạc (Packing List Generation):** Gợi ý đồ cần mang theo.
- **Lưu trữ & Quản lý:** Người dùng có thể xem lại các plan đã tạo.

## 2. Thay Đổi Kiến Trúc (Architecture Changes)
Ban đầu, logic gọi AI nằm ở **Frontend** (`geminiService.ts` gọi trực tiếp Google API).
**Đề xuất & Thay đổi:** Chuyển toàn bộ logic sang **Backend** (`routes/ai.js`).
- **Lý do:**
  - Bảo mật `GEMINI_API_KEY` (không lộ key ở client).
  - Tự động lưu (Auto-save) vào database Backend ngay khi tạo xong.
  - Dễ dàng mở rộng, kiểm soát Quota tập trung.

## 3. Các Tính Năng Mới Được Đề Xuất (New Features)
Trong quá trình triển khai, chúng ta đã mở rộng thêm các tính năng so với yêu cầu ban đầu:
1.  **Unified Generation (Gộp tạo Plan & Checklist):** Thay vì gọi API 2 lần (tốn quota, chậm), Backend giờ gọi 1 lần trả về cả JSON lịch trình và checklist. UI Frontend gộp 2 nút thành 1.
2.  **Plan Refinement (Chỉnh sửa Plan):** Cho phép người dùng chat thêm ("Thêm ngày nghỉ", "Đổi sang cắm trại") để AI sửa lại plan cũ.
3.  **Saved Plans History:** Lưu lịch sử vào bảng `SavedPlan` (PostgreSQL) để xem lại trong Profile.

## 4. Nhật Ký Debugging & Sửa Lỗi (Bug Hunting & Fixes)
Đây là phần quan trọng nhất, ghi lại các lỗi hóc búa đã gặp và cách xử lý triệt để.

### 4.1. Lỗi Duplicate Identifier 'Favorite'
- **Hiện tượng:** Server crash với lỗi `SyntaxError: Identifier 'Favorite' has already been declared`.
- **Nguyên nhân:** Trong `routes/user.js`, dòng `require('../models/Favorite')` bị viết lặp lại 2 lần.
- **Khắc phục:** Xóa dòng duplicate.

### 4.2. Lỗi SDK Import (`SchemaType` undefined)
- **Hiện tượng:** Crash khi định nghĩa JSON Schema cho Gemini.
- **Nguyên nhân:** SDK `@google/genai` phiên bản mới không còn export `SchemaType`.
- **Khắc phục:** Đổi sang dùng `import { Type } from '@google/genai'` và sửa lại cú pháp schema (`type: Type.STRING`...).

### 4.3. Lỗi Schema Malformed
- **Hiện tượng:** AI trả về lỗi cấu trúc schema.
- **Nguyên nhân:** Định nghĩa `type: Type.STRING` trực tiếp cho một property object là sai cú pháp.
- **Khắc phục:** Sửa thành `type: { type: Type.STRING }` (bọc trong object).

### 4.4. Lỗi "Model Not Found" & Quota Exhausted
- **Hiện tượng:** Gọi `gemini-1.5-flash` bị lỗi `404 Not Found`. Sau đó đổi model khác thì bị `429 Resource Exhausted`.
- **Debug:**
  - Nghi ngờ tên model sai hoặc API Key không quyền.
  - Viết script `list_models.js` để liệt kê model thực tế mà Key đang có quyền truy cập.
- **Kết quả:** Key này không có `gemini-1.5-flash` nhưng có `gemini-2.0-flash`.
- **Khắc phục:** Chuyển code sang dùng `gemini-2.0-flash`.

### 4.5. Lỗi thay đổi cấu trúc Response SDK (`response.text is not a function`)
- **Hiện tượng:** Code crash với lỗi `response.text is not a function`.
- **Nguyên nhân:** SDK Google GenAI bản mới thay đổi cấu trúc object trả về, không còn method `.text()` trực tiếp trên response object nữa.
- **Debug:**
  - Viết script `debug_sdk.js` để in (console.log) toàn bộ object response.
  - Phát hiện dữ liệu nằm sâu trong: `response.candidates[0].content.parts[0].text`.
- **Khắc phục:** Viết lại logic parsing trong `routes/ai.js` để trích xuất dữ liệu từ đúng đường dẫn mới `candidates[...]`.

### 4.6. Lỗi Quota Limit 0 (`gemini-2.0-flash`)
- **Hiện tượng:** Gặp lỗi `429 Resource Exhausted` với chi tiết `limit: 0`. Điều này nghĩa là model này bị **chặn hoàn toàn** (không có quota) với key hiện tại, chứ không phải do dùng quá nhiều.
- **Nguyên nhân:** Có thể do vùng địa lý (VN) hoặc loại key.
- **Khắc phục:** Chuyển sang model `gemini-2.0-flash-exp` (bản experimental thường mở rộng hơn).

### 4.7. Lỗi Quota Limit 0 (`gemini-2.0-flash-exp`) & Final Solution
- **Hiện tượng:** `gemini-2.0-flash-exp` cũng bị lỗi `limit: 0`.
- **Debug:** Viết script `find_working_model.js` thử tự động tất cả các model trong danh sách.
- **Kết quả:** Tìm ra `gemini-2.5-flash` là model duy nhất hoạt động (API trả về 200 OK).
- **Khắc phục:** Cập nhật code dùng `gemini-2.5-flash`.

## 5. Kết Quả Cuối Cùng (Final Outcome)
- **Backend:** API `/generate-plan` và `/refine-plan` hoạt động ổn định (chờ reset Quota 429).
- **Frontend:** UI `Planner` đã được cập nhật hiện đại hơn, có tính năng Refine và History.
- **Dữ liệu:** Lưu trữ thành công cấu trúc phức tạp (JSONB) vào PostgreSQL.

Tài liệu này tổng hợp lại toàn bộ quá trình technical deep-dive cho tính năng AI.

# Bảng Đặc Tả Test Case (Top 15 Quan Trọng Nhất)

### TC01: Đăng ký tài khoản với Email mới

| Item | Description |
| :--- | :--- |
| **Test Case ID** | TC01 |
| **Related Use Case** | U001 - Đăng ký tài khoản |
| **Context** | Người dùng chưa có tài khoản, đang ở màn hình chào mừng. |
| **Input Data** | Email: 
ewuser@example.com<br>Password: Password123 |
| **Expected Output** | Hệ thống tạo tài khoản thành công, tự động đăng nhập và chuyển đến màn hình chính. |
| **Test Steps** | 1. Chọn "Đăng ký".<br>2. Nhập Email và Mật khẩu hợp lệ.<br>3. Nhấn "Đăng ký".<br>4. Nhập mã OTP xác thực. |
| **Actual Output** | |
| **Result** | |

### TC04: Đăng nhập với thông tin chính xác

| Item | Description |
| :--- | :--- |
| **Test Case ID** | TC04 |
| **Related Use Case** | U002 - Đăng nhập hệ thống |
| **Context** | Người dùng đã có tài khoản, đang ở màn hình đăng nhập. |
| **Input Data** | Email: user@example.com<br>Password: Password123 |
| **Expected Output** | Đăng nhập thành công, chuyển vào màn hình chính. |
| **Test Steps** | 1. Chọn "Đăng nhập".<br>2. Nhập Email và Mật khẩu đúng.<br>3. Nhấn "Đăng nhập". |
| **Actual Output** | |
| **Result** | |

### TC09: Tìm kiếm cung đường theo tên địa danh

| Item | Description |
| :--- | :--- |
| **Test Case ID** | TC09 |
| **Related Use Case** | U006 - Khám phá và Lập kế hoạch cung đường |
| **Context** | Người dùng đang ở màn hình tìm kiếm. |
| **Input Data** | Từ khóa: "Langbiang" |
| **Expected Output** | Kết quả trả về chứa cung đường "Langbiang". |
| **Test Steps** | 1. Chọn chức năng "Khám phá".<br>2. Nhập "Langbiang" vào thanh tìm kiếm.<br>3. Nhấn Enter/Tìm kiếm. |
| **Actual Output** | |
| **Result** | |

### TC10: Lọc cung đường theo mức độ "Khó"

| Item | Description |
| :--- | :--- |
| **Test Case ID** | TC10 |
| **Related Use Case** | U006 - Khám phá và Lập kế hoạch cung đường |
| **Context** | Người dùng đang ở màn hình danh sách cung đường. |
| **Input Data** | Bộ lọc Mức độ: "Khó" |
| **Expected Output** | Danh sách chỉ hiển thị các cung đường có độ khó là "Khó". |
| **Test Steps** | 1. Mở bộ lọc.<br>2. Chọn mức độ "Khó".<br>3. Nhấn "Áp dụng". |
| **Actual Output** | |
| **Result** | |

### TC12: Truy cập bài viết hướng dẫn sơ cứu

| Item | Description |
| :--- | :--- |
| **Test Case ID** | TC12 |
| **Related Use Case** | U007 - Tra cứu hướng dẫn (Guidebook) |
| **Context** | Người dùng đang ở mục Hướng dẫn. |
| **Input Data** | Chọn bài viết "Sơ cứu cơ bản" |
| **Expected Output** | Nội dung bài viết hiển thị đầy đủ (văn bản, hình ảnh). |
| **Test Steps** | 1. Vào mục "Guidebook".<br>2. Tìm và chọn bài "Sơ cứu cơ bản". |
| **Actual Output** | |
| **Result** | |

### TC13: Kiểm tra thời gian tải trang chi tiết

| Item | Description |
| :--- | :--- |
| **Test Case ID** | TC13 |
| **Related Use Case** | U006 - Khám phá và Lập kế hoạch cung đường |
| **Context** | Người dùng chọn xem chi tiết một cung đường. |
| **Input Data** | Cung đường ID: TR001 |
| **Expected Output** | Trang chi tiết tải xong trong vòng 3 giây (Yêu cầu phi chức năng). |
| **Test Steps** | 1. Nhấn vào một cung đường bất kỳ.<br>2. Đo thời gian từ lúc nhấn đến khi hiển thị đầy đủ. |
| **Actual Output** | |
| **Result** | |

### TC16: Tạo lịch trình tự động 3 ngày 2 đêm

| Item | Description |
| :--- | :--- |
| **Test Case ID** | TC16 |
| **Related Use Case** | U008 - Sử dụng Trợ lý lập kế hoạch thông minh |
| **Context** | Người dùng đang ở giao diện Trợ lý lập kế hoạch. |
| **Input Data** | Thời gian: "3 ngày 2 đêm"<br>Thể lực: "Trung bình" |
| **Expected Output** | Một lịch trình chi tiết cho 3 ngày được tạo ra tự động, bao gồm điểm nghỉ và quãng đường phù hợp. |
| **Test Steps** | 1. Chọn "Lập kế hoạch".<br>2. Nhập số ngày và thể lực.<br>3. Nhấn "Tạo lịch trình". |
| **Actual Output** | |
| **Result** | |

### TC17: Thêm vật dụng vào checklist cá nhân

| Item | Description |
| :--- | :--- |
| **Test Case ID** | TC17 |
| **Related Use Case** | U006 - Khám phá và Lập kế hoạch cung đường |
| **Context** | Người dùng đang ở màn hình Checklist trang bị. |
| **Input Data** | Tên vật dụng: "Đèn pin"<br>Số lượng: 1 |
| **Expected Output** | "Đèn pin" xuất hiện trong danh sách checklist cá nhân. |
| **Test Steps** | 1. Vào phần "Checklist".<br>2. Nhập tên vật dụng và số lượng.<br>3. Nhấn "Thêm". |
| **Actual Output** | |
| **Result** | |

### TC20: Khởi chạy bản đồ mô phỏng 3D

| Item | Description |
| :--- | :--- |
| **Test Case ID** | TC20 |
| **Related Use Case** | U009 - Xem trước lộ trình 3D |
| **Context** | Người dùng đang ở trang chi tiết cung đường (đã tải bản đồ). |
| **Input Data** | Chọn "Xem 3D" |
| **Expected Output** | Mô hình 3D của địa hình được hiển thị và có thể tương tác (xoay, zoom). |
| **Test Steps** | 1. Tại trang chi tiết, nhấn nút "Xem 3D".<br>2. Thao tác xoay và phóng to bản đồ. |
| **Actual Output** | |
| **Result** | |

### TC21: Hiển thị các homestay gần điểm kết thúc

| Item | Description |
| :--- | :--- |
| **Test Case ID** | TC21 |
| **Related Use Case** | U010 - Nhận gợi ý địa điểm lân cận |
| **Context** | Người dùng đã có kế hoạch chuyến đi với điểm kết thúc xác định. |
| **Input Data** | (Vị trí điểm kết thúc) |
| **Expected Output** | Danh sách các homestay gần điểm kết thúc được hiển thị. |
| **Test Steps** | 1. Mở kế hoạch chuyến đi.<br>2. Xem mục "Gợi ý lân cận".<br>3. Kiểm tra danh sách homestay. |
| **Actual Output** | |
| **Result** | |

### TC27: Phát cảnh báo khi đi sai đường mòn

| Item | Description |
| :--- | :--- |
| **Test Case ID** | TC27 |
| **Related Use Case** | U011 - Điều hướng trekking và Ghi nhật ký (Chế độ Offline) |
| **Context** | Người dùng đang sử dụng chế độ dẫn đường và đi lệch khỏi lộ trình quy định. |
| **Input Data** | Vị trí GPS lệch > 50m so với đường mòn |
| **Expected Output** | Thiết bị phát âm thanh cảnh báo và hiển thị thông báo "Bạn đang đi sai đường". |
| **Test Steps** | 1. Kích hoạt dẫn đường.<br>2. Giả lập hoặc thực hiện di chuyển lệch khỏi lộ trình.<br>3. Kiểm tra cảnh báo. |
| **Actual Output** | |
| **Result** | |

### TC29: Kiểm tra khoảng cách giữa các thành viên

| Item | Description |
| :--- | :--- |
| **Test Case ID** | TC29 |
| **Related Use Case** | U013 - Cảnh báo an toàn và Đồng bộ vị trí nhóm |
| **Context** | Một nhóm người dùng đang tham gia chuyến đi và đã kết nối với nhau trên ứng dụng. |
| **Input Data** | Thành viên A di chuyển xa trưởng nhóm > 500m |
| **Expected Output** | Hệ thống hiển thị khoảng cách và cảnh báo nếu vượt quá giới hạn an toàn cài đặt. |
| **Test Steps** | 1. Tạo nhóm và bắt đầu chuyến đi.<br>2. Di chuyển các thiết bị ra xa nhau.<br>3. Kiểm tra thông số khoảng cách hiển thị. |
| **Actual Output** | |
| **Result** | |

### TC33: Đăng tin bán balo cũ trên Chợ

| Item | Description |
| :--- | :--- |
| **Test Case ID** | TC33 |
| **Related Use Case** | U016 - Giao dịch trên Chợ đồ phượt |
| **Context** | Người dùng đang ở màn hình Chợ đồ phượt. |
| **Input Data** | Tiêu đề: "Bán Balo cũ", Giá: 500k, Ảnh: [File ảnh] |
| **Expected Output** | Tin đăng được tạo thành công và hiển thị trên danh sách chợ. |
| **Test Steps** | 1. Vào mục "Chợ".<br>2. Chọn "Đăng tin".<br>3. Nhập thông tin và đăng. |
| **Actual Output** | |
| **Result** | |

### TC36: Báo cáo một đoạn đường bị chặn mới

| Item | Description |
| :--- | :--- |
| **Test Case ID** | TC36 |
| **Related Use Case** | U018 - Đóng góp và chỉnh sửa lộ trình |
| **Context** | Người dùng phát hiện đường bị chặn trong quá trình di chuyển. |
| **Input Data** | Hình ảnh hiện trường, tọa độ, mô tả "Sạt lở đất chặn đường" |
| **Expected Output** | Báo cáo được gửi thành công về hệ thống và chờ duyệt. |
| **Test Steps** | 1. Chọn chức năng "Báo cáo sự cố".<br>2. Chụp ảnh và nhập thông tin.<br>3. Nhấn "Gửi". |
| **Actual Output** | |
| **Result** | |

### TC37: Đăng ký tham gia thử thách "100km đi bộ"

| Item | Description |
| :--- | :--- |
| **Test Case ID** | TC37 |
| **Related Use Case** | U019 - Tham gia Thử thách cộng đồng |
| **Context** | Người dùng đang xem danh sách thử thách. |
| **Input Data** | Chọn thử thách "100km đi bộ tháng này". |
| **Expected Output** | Trạng thái chuyển thành "Đã tham gia", hệ thống bắt đầu tính tracklog mới vào thử thách. |
| **Test Steps** | 1. Vào mục "Thử thách".<br>2. Chọn một thử thách đang mở.<br>3. Nhấn nút "Tham gia ngay". |
| **Actual Output** | |
| **Result** | |

# 3.3 Class Specifications

Dưới đây là đặc tả chi tiết cho 10 lớp quan trọng nhất trong hệ thống **TrailsExplorer**, được trình bày theo mẫu yêu cầu.

## 3.3.1 Class User

*   **Kế thừa từ:** None
*   **Mô tả:** Đại diện cho người dùng trong hệ thống, lưu trữ thông tin cá nhân, vai trò và các thiết lập ưu tiên.

**List of attributes:**
| Seq | Property | Modifier | Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `id` | Public | Unique, Not Null | Định danh duy nhất của người dùng (UUID). |
| 2 | `name` | Public | Not Null, Max 100 chars | Tên hiển thị của người dùng. |
| 3 | `role` | Public | Enum {Admin, User} | Vai trò của người dùng trong hệ thống. |
| 4 | `preferences` | Public | JSON Object | Lưu trữ sở thích trekking (độ khó, địa hình...). |

**List of the main methods/operations:**
| Seq | Operation | Modifier | Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `updateProfile()` | Public | Authenticated | Cập nhật thông tin cá nhân người dùng. |
| 2 | `viewHistory()` | Public | None | Xem lại lịch sử các hoạt động đã thực hiện. |

---

## 3.3.2 Class GeminiService

*   **Kế thừa từ:** None
*   **Mô tả:** Service chịu trách nhiệm tích hợp với Google Gemini AI để xử lý các tác vụ thông minh.

**List of attributes:**
| Seq | Property | Modifier | Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `apiKey` | Private | Not Null | Khóa API để xác thực với Google Cloud. |

**List of the main methods/operations:**
| Seq | Operation | Modifier | Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `generateTrekkingPlan(prompt)` | Public | Async | Tạo lịch trình trekking chi tiết dựa trên yêu cầu ngôn ngữ tự nhiên. |
| 2 | `generateChecklist(location)` | Public | Async | Tạo danh sách đồ cần mang theo dựa trên địa điểm và thời gian. |
| 3 | `getSmartSuggestions(context)` | Public | Async | Đưa ra các gợi ý về địa điểm ăn uống, tham quan lân cận. |

---

## 3.3.3 Class ItineraryPlan

*   **Kế thừa từ:** None
*   **Mô tả:** Model chứa dữ liệu chi tiết của một kế hoạch chuyến đi đã được tạo ra bởi AI hoặc người dùng.

**List of attributes:**
| Seq | Property | Modifier | Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `id` | Public | Unique, Not Null | Định danh duy nhất của kế hoạch. |
| 2 | `totalDistance` | Public | Positive Float | Tổng quãng đường di chuyển dự kiến (km). |
| 3 | `difficultyLevel` | Public | Enum {Easy, Medium, Hard} | Mức độ khó tổng thể của chuyến đi. |
| 4 | `days` | Public | List<ItineraryDay> | Danh sách chi tiết lịch trình từng ngày. |

**List of the main methods/operations:**
| Seq | Operation | Modifier | Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `exportToPDF()` | Public | None | Xuất kế hoạch ra file PDF để in ấn hoặc lưu trữ. |
| 2 | `sharePlan()` | Public | None | Chia sẻ kế hoạch cho người dùng khác hoặc nhóm. |

---

## 3.3.4 Class Group

*   **Kế thừa từ:** None
*   **Mô tả:** Đại diện cho một nhóm trekking cùng tham gia một chuyến đi cụ thể.

**List of attributes:**
| Seq | Property | Modifier | Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `id` | Public | Unique, Not Null | Định danh duy nhất của nhóm. |
| 2 | `name` | Public | Not Null | Tên hiển thị của nhóm. |
| 3 | `members` | Public | List<User> | Danh sách các thành viên trong nhóm. |
| 4 | `trailId` | Public | Foreign Key | ID của cung đường mà nhóm đang tham gia. |

**List of the main methods/operations:**
| Seq | Operation | Modifier | Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `addMember(user)` | Public | Max members limit | Thêm thành viên mới vào nhóm. |
| 2 | `removeMember(userId)` | Public | Leader only | Xóa thành viên khỏi nhóm (chỉ trưởng nhóm thực hiện được). |

---

## 3.3.5 Class MarketplaceItem

*   **Kế thừa từ:** None
*   **Mô tả:** Đại diện cho một món đồ được rao bán trên chợ đồ phượt.

**List of attributes:**
| Seq | Property | Modifier | Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `id` | Public | Unique, Not Null | Định danh món hàng. |
| 2 | `price` | Public | Positive Decimal | Giá bán của món hàng. |
| 3 | `condition` | Public | Enum {New, Used} | Tình trạng món hàng. |
| 4 | `sellerId` | Public | Foreign Key | ID của người bán. |

**List of the main methods/operations:**
| Seq | Operation | Modifier | Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `updateStatus(status)` | Public | Seller only | Cập nhật trạng thái món hàng (Đang bán/Đã bán). |

---

## 3.3.6 Class SafetyService

*   **Kế thừa từ:** None
*   **Mô tả:** Service quản lý các tính năng an toàn, theo dõi vị trí và xử lý tình huống khẩn cấp.

**List of attributes:**
| Seq | Property | Modifier | Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `activeTrackingSessions` | Private | Map | Danh sách các phiên theo dõi vị trí đang hoạt động. |

**List of the main methods/operations:**
| Seq | Operation | Modifier | Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `trackMemberLocation(userId)` | Public | Real-time, GPS req | Lấy tọa độ hiện tại của thành viên. |
| 2 | `sendSOSAlert(location)` | Public | High Priority | Gửi tín hiệu khẩn cấp tới toàn bộ nhóm và hệ thống. |
| 3 | `detectLaggingMembers(group)` | Public | Background Process | Tự động phát hiện thành viên bị tụt lại quá xa. |

---

## 3.3.7 Class OfflineMapService

*   **Kế thừa từ:** None
*   **Mô tả:** Service quản lý việc tải, lưu trữ và hiển thị bản đồ khi không có kết nối mạng.

**List of attributes:**
| Seq | Property | Modifier | Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `cachedRegions` | Private | List<RegionMap> | Danh sách các khu vực bản đồ đã tải về máy. |

**List of the main methods/operations:**
| Seq | Operation | Modifier | Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `downloadRegion(regionId)` | Public | Storage check req | Tải dữ liệu bản đồ của một khu vực cụ thể. |
| 2 | `syncDataWhenOnline()` | Public | Network req | Đồng bộ dữ liệu cục bộ lên server khi có mạng. |

---

## 3.3.8 Class AdminService

*   **Kế thừa từ:** None
*   **Mô tả:** Service cung cấp các chức năng nghiệp vụ dành riêng cho Quản trị viên.

**List of attributes:**
| Seq | Property | Modifier | Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `adminLog` | Private | List<Log> | Nhật ký các thao tác quản trị. |

**List of the main methods/operations:**
| Seq | Operation | Modifier | Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `banUser(userId, reason)` | Public | Admin Role Required | Khóa tài khoản người dùng vi phạm. |
| 2 | `approveTrail(trailId)` | Public | Admin Role Required | Duyệt và công khai một cung đường do người dùng đóng góp. |
| 3 | `deleteContent(contentId)` | Public | Admin Role Required | Xóa nội dung (bài đăng, bình luận) vi phạm tiêu chuẩn. |

---

## 3.3.9 Class ActivityLog

*   **Kế thừa từ:** None (Abstract Base Class)
*   **Mô tả:** Lớp trừu tượng đại diện cho các loại nhật ký hoạt động của người dùng.

**List of attributes:**
| Seq | Property | Modifier | Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `id` | Protected | Unique, Not Null | Định danh của nhật ký. |
| 2 | `timestamp` | Protected | Not Null | Thời điểm tạo nhật ký. |
| 3 | `ownerId` | Protected | Foreign Key | ID của người dùng tạo nhật ký. |

**List of the main methods/operations:**
| Seq | Operation | Modifier | Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `getDetails()` | Public | Abstract | Phương thức trừu tượng để lấy chi tiết nội dung nhật ký. |

---

## 3.3.10 Class VoiceRecorder

*   **Kế thừa từ:** React.Component
*   **Mô tả:** Component giao diện người dùng cho tính năng ghi âm nhật ký hành trình.

**List of attributes:**
| Seq | Property | Modifier | Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `isRecording` | Private | Boolean | Trạng thái hiện tại (đang ghi âm hay không). |
| 2 | `audioBlob` | Private | Binary Data | Dữ liệu âm thanh thô đã thu được. |

**List of the main methods/operations:**
| Seq | Operation | Modifier | Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `startRecording()` | Public | Mic Permission Req | Bắt đầu quá trình thu âm từ microphone. |
| 2 | `stopRecording()` | Public | None | Kết thúc thu âm và lưu dữ liệu thành file. |

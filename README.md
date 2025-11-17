# CSC13002 - Introduction to Software Engineering

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📖 Giới thiệu

Repository này chứa tài liệu và source code cho môn học **CSC13002 - Nhập môn Công nghệ Phần mềm** tại Trường Đại học Khoa học tự nhiên, ĐHQG-HCM.

## 🎯 Dự án: TrailsExplorer

**TrailsExplorer** là một ứng dụng web hiện đại giúp người dùng khám phá và lên kế hoạch cho các chuyến đi leo núi, trekking.

### ✨ Tính năng chính

- 🏔️ **Khám phá đường mòn**: Tìm kiếm và khám phá các tuyến đường leo núi
- 🤖 **AI Planner**: Lên kế hoạch trekking tự động với Google Gemini AI
- 📝 **Checklist thông minh**: Tạo danh sách đồ dùng cần thiết
- 🗺️ **Bản đồ tương tác**: Xem chi tiết tuyến đường trên bản đồ
- 👥 **Cộng đồng**: Kết nối với những người yêu thích leo núi
- ⭐ **Yêu thích**: Lưu trữ các tuyến đường yêu thích
- 📊 **Thống kê cá nhân**: Theo dõi thành tích và hoạt động

### 🛠️ Công nghệ sử dụng

- **Frontend**: React 19.2, TypeScript
- **Build Tool**: Vite 6.2
- **AI Integration**: Google Generative AI (Gemini)
- **Maps**: Leaflet
- **Styling**: Tailwind CSS (custom configuration)

## 📁 Cấu trúc thư mục

```
CSC13002-Intro2SE/
├── docs/                          # Tài liệu dự án
│   ├── requirements/              # Tài liệu yêu cầu phần mềm
│   ├── analysis_and_design/       # Phân tích và thiết kế
│   ├── management/                # Quản lý dự án
│   └── test/                      # Tài liệu kiểm thử
├── pa/                            # Project Assignments
│   ├── 1-Template0.pdf            # Template 0
│   ├── 1-Template1.pdf            # Template 1
│   └── ...
├── src/                           # Source code
│   └── trailsexplorer/            # Ứng dụng TrailsExplorer
│       ├── App.tsx                # Component chính
│       ├── constants.tsx          # Constants và mock data
│       ├── types.ts               # TypeScript type definitions
│       ├── services/              # Services
│       │   └── geminiService.ts   # Google Gemini AI service
│       ├── package.json           # Dependencies
│       └── ...
├── LICENSE                        # MIT License
└── README.md                      # File này
```

## 🚀 Cài đặt và Chạy ứng dụng

### Yêu cầu

- Node.js (phiên bản 16 trở lên)
- npm hoặc yarn
- Google Gemini API Key

### Các bước cài đặt

1. **Clone repository**
   ```bash
   git clone https://github.com/OxyzGiaHuy/CSC13002-Intro2SE.git
   cd CSC13002-Intro2SE
   ```

2. **Di chuyển vào thư mục ứng dụng**
   ```bash
   cd src/trailsexplorer
   ```

3. **Cài đặt dependencies**
   ```bash
   npm install
   ```

4. **Cấu hình API Key**
   
   Tạo file `.env.local` trong thư mục `src/trailsexplorer/` và thêm API key của bạn:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   Lấy API key miễn phí tại: https://ai.google.dev/

5. **Chạy ứng dụng**
   ```bash
   npm run dev
   ```

6. **Mở trình duyệt**
   
   Truy cập: `http://localhost:5173`

### Build cho Production

```bash
npm run build
npm run preview
```

## 📚 Tài liệu học phần

Các tài liệu liên quan đến môn học được lưu trữ trong thư mục `docs/`:

- **Requirements**: Tài liệu yêu cầu phần mềm, use cases, user stories
- **Analysis & Design**: Sơ đồ phân tích, thiết kế kiến trúc, class diagram, sequence diagram
- **Management**: Kế hoạch quản lý dự án, phân công công việc, timeline
- **Test**: Kế hoạch kiểm thử, test cases, báo cáo kiểm thử

## 👥 Nhóm phát triển

- **Owner**: [OxyzGiaHuy](https://github.com/OxyzGiaHuy)

## 📄 License

Dự án này được cấp phép theo giấy phép MIT - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng:
1. Fork repository
2. Tạo branch cho tính năng của bạn (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📞 Liên hệ

Nếu có bất kỳ câu hỏi nào, vui lòng tạo issue hoặc liên hệ qua GitHub.

---

<div align="center">
  <p>Made with ❤️ for CSC13002 - Introduction to Software Engineering</p>
  <p>University of Science - VNU-HCM</p>
</div>
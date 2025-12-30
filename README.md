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
│   ├── guides/                    # Hướng dẫn cài đặt và sử dụng
│   └── test/                      # Tài liệu kiểm thử
├── pa/                            # Project Assignments
├── src/
│   └── trailsexplorer/            # Ứng dụng TrailsExplorer
│       ├── index.html             # HTML entry point
│       ├── App.tsx                # Component chính
│       ├── vite.config.ts         # Cấu hình Vite
│       ├── tsconfig.json          # Cấu hình TypeScript
│       ├── package.json           # Dependencies
│       ├── .env                   # Environment variables (không commit)
│       ├── .gitignore
│       ├── src/                   # Source code
│       │   ├── index.tsx          # React entry point
│       │   ├── App.tsx            # Main App component
│       │   ├── components/        # React components
│       │   │   ├── common/        # Common components (TrailCard)
│       │   │   └── layout/        # Layout components (Header)
│       │   ├── context/           # React Context (AuthContext)
│       │   ├── pages/             # Page components
│       │   │   ├── Home.tsx
│       │   │   ├── Discover.tsx
│       │   │   ├── Planner.tsx
│       │   │   ├── Community.tsx
│       │   │   ├── Profile.tsx
│       │   │   └── TrailDetail.tsx
│       │   ├── services/          # API & AI services
│       │   │   ├── geminiService.ts   # Google Gemini AI service
│       │   │   └── trailService.ts    # Trail data service
│       │   ├── types/             # TypeScript type definitions
│       │   ├── data/              # Constants & static data
│       │   └── layouts/           # Layout templates
│       ├── assets/                # Static assets
│       └── services/              # Shared services
│           └── geminiService.ts
├── LICENSE
└── README.md
```

## 🚀 Cài đặt và Chạy ứng dụng

### Yêu cầu

- Node.js (phiên bản 16 trở lên)
- npm, pnpm hoặc yarn
- Google Gemini API Key (lấy miễn phí tại: https://ai.google.dev/)

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
   
   **Khuyến nghị: Sử dụng pnpm**
   ```bash
   pnpm install
   ```

4. **Cấu hình API Key**
   
   Tạo file `.env` trong thư mục `src/trailsexplorer/` và thêm API key của bạn:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   > **Lưu ý**: File `.env` sẽ bị ignore khi commit lên Git. Không nên hardcode API key vào code.

5. **Chạy ứng dụng**
   
   ```bash
   pnpm dev
   # hoặc
   npm run dev
   ```

6. **Mở trình duyệt**
   
   Ứng dụng sẽ chạy tại: `http://localhost:3000`

### Khắc phục lỗi

Nếu gặp lỗi khi cài đặt dependencies:

**Trên Windows:**
```bash
# Xóa node_modules và cài lại
Remove-Item -Recurse -Force node_modules
npm cache clean --force
npm install --legacy-peer-deps
```

**Hoặc chạy script khắc phục:**
```bash
.\fix-npm-install.ps1
```

Xem chi tiết tại: [docs/guides/huong_dan_cai_dat.md](docs/guides/huong_dan_cai_dat.md)

### Build cho Production

```bash
pnpm build
pnpm preview

# hoặc npm
npm run build
npm run preview
```

## 📚 Tài liệu học phần

Các tài liệu liên quan đến môn học được lưu trữ trong thư mục `docs/`:

- **Requirements**: Tài liệu yêu cầu phần mềm, use cases, user stories
- **Analysis & Design**: Sơ đồ phân tích, thiết kế kiến trúc, class diagram, sequence diagram
- **Management**: Kế hoạch quản lý dự án, phân công công việc, timeline
- **Guides**: Hướng dẫn sử dụng và phát triển (cài đặt, thêm logo, v.v.) - Xem [docs/guides/](docs/guides/)
- **Test**: Kế hoạch kiểm thử, test cases, báo cáo kiểm thử

## 👥 Nhóm phát triển

- **Owner**: [OxyzGiaHuy (Thái Gia Huy)](https://github.com/OxyzGiaHuy)
- **Member**: [Andra Crista (ACTrinh)](https://github.com/ACTrinh)
- **Member**: [Kimtri12](https://github.com/Kimtri12)
- **Member**: [Đỗ Trọng Huy (TrongHuy315)](https://github.com/TrongHuy315)

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
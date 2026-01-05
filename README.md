# CSC13002 - Introduction to Software Engineering

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📖 Giới thiệu

Repository này chứa tài liệu và source code cho môn học **CSC13002 - Nhập môn Công nghệ Phần mềm** tại Trường Đại học Khoa học tự nhiên, ĐHQG-HCM.

## 🎯 Dự án: TrailsExplorer

**TrailsExplorer** là một ứng dụng web hiện đại giúp người dùng khám phá và lên kế hoạch cho các chuyến đi leo núi, trekking.

### Tính năng chính

- **Khám phá đường mòn**: Tìm kiếm và khám phá các tuyến đường leo núi.
- **AI Planner**: Lên kế hoạch trekking tự động với Google Gemini AI.
- **Checklist thông minh**: Tạo danh sách đồ dùng cần thiết.
- **Bản đồ tương tác**: Xem chi tiết tuyến đường trên bản đồ.
- **Cộng đồng**: Kết nối với những người yêu thích leo núi.
- **Yêu thích & Thống kê**: Lưu trữ các tuyến đường và theo dõi thành tích cá nhân.

### Công nghệ sử dụng

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Leaflet.
- **Backend**: Node.js, Express, PostgreSQL, PostGIS.
- **AI Integration**: Google Generative AI (Gemini).

## 📁 Cấu trúc thư mục

```
CSC13002-Intro2SE/
├── docs/                          # Tài liệu dự án
│   ├── guides/                    # Hướng dẫn cài đặt và sử dụng
│   └── ...                        # Tài liệu yêu cầu, thiết kế, kiểm thử
├── src/
│   ├── trailsexplorer/            # Frontend Web App
│   └── trailsexplorer-backend/    # Backend API Server
└── ...
```

## 🚀 Cài đặt và Chạy ứng dụng

### Yêu cầu hệ thống

- Node.js (v18+)
- PostgreSQL & PostGIS (cho Backend)
- Google Gemini API Key

### 1. Chạy Frontend (Web App)

```bash
cd src/trailsexplorer
pnpm install
pnpm dev
```
*Truy cập: `http://localhost:3000`*

### 2. Chạy Backend (API Server)

```bash
cd src/trailsexplorer-backend
pnpm install
pnpm run db:seed    # Khởi tạo và nạp dữ liệu mẫu
pnpm dev             # Chạy server development
```
*Truy cập: `http://localhost:5000`*

> **Xem hướng dẫn chi tiết:** 
> - [Hướng dẫn Frontend](docs/guides/huong_dan_cai_dat.md)
> - [Hướng dẫn Backend & Database](docs/guides/backend-guide.md)

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
# Thư mục Assets

Thư mục này chứa các file ảnh và tài nguyên tĩnh cho ứng dụng TrailsExplorer.

## Logo

Để sử dụng ảnh logo thay vì SVG, xem hướng dẫn chi tiết tại: [docs/guides/huong_dan_them_logo.md](../../../docs/guides/huong_dan_them_logo.md)

### Tóm tắt nhanh:

1. **Đặt file ảnh logo vào thư mục này** với tên `logo.png` (hoặc `.jpg`, `.svg`, `.webp`)

2. **Import trong App.tsx:**
   ```tsx
   import logoImage from './assets/logo.png';
   ```

3. **Sử dụng:**
   ```tsx
   <Logo imageSrc={logoImage} size="md" showText={true} />
   ```

## Định dạng ảnh được hỗ trợ

- PNG (khuyến nghị cho logo có nền trong suốt)
- JPG/JPEG
- SVG
- WebP


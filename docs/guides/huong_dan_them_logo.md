# Hướng dẫn thêm ảnh Logo vào TrailsExplorer

## Bước 1: Thêm file ảnh logo

1. Đặt file ảnh logo của bạn vào thư mục: `src/trailsexplorer/assets/`
2. Đặt tên file là: `logo.png` (hoặc `logo.jpg`, `logo.svg`, `logo.webp`)

## Bước 2: Cập nhật App.tsx

Mở file `src/trailsexplorer/App.tsx` và làm theo các bước sau:

### 2.1. Bỏ comment dòng import logo (dòng 15-16):

**Tìm dòng này:**
```tsx
// import logoImage from './assets/logo.png'; // hoặc logo.jpg, logo.svg, logo.webp
```

**Thay bằng:**
```tsx
import logoImage from './assets/logo.png'; // Thay đổi đuôi file nếu cần (.jpg, .svg, .webp)
```

### 2.2. Cập nhật Header (dòng ~99-100):

**Tìm dòng này:**
```tsx
{/* <Logo imageSrc={logoImage} size="md" showText={true} /> */}
<Logo size="md" showText={true} />
```

**Thay bằng:**
```tsx
<Logo imageSrc={logoImage} size="md" showText={true} />
```

### 2.3. Cập nhật Login page (dòng ~732-733):

**Tìm dòng này:**
```tsx
{/* <Logo imageSrc={logoImage} size="lg" showText={true} /> */}
<Logo size="lg" showText={true} />
```

**Thay bằng:**
```tsx
<Logo imageSrc={logoImage} size="lg" showText={true} />
```

### 2.4. Cập nhật Register page (dòng ~769-770):

**Tìm dòng này:**
```tsx
{/* <Logo imageSrc={logoImage} size="lg" showText={true} /> */}
<Logo size="lg" showText={true} />
```

**Thay bằng:**
```tsx
<Logo imageSrc={logoImage} size="lg" showText={true} />
```

## Bước 3: Kiểm tra

1. Chạy ứng dụng: `pnpm dev`
2. Kiểm tra logo hiển thị ở:
   - Header (góc trên bên trái)
   - Trang Login
   - Trang Register

## Lưu ý

- Nếu file ảnh có tên khác, thay đổi tên file trong import
- Component Logo sẽ tự động resize ảnh theo size prop (sm, md, lg)
- Nếu không có file ảnh, component sẽ tự động dùng SVG logo làm fallback

## Ví dụ với các định dạng khác

```tsx
// PNG
import logoImage from './assets/logo.png';

// JPG
import logoImage from './assets/logo.jpg';

// SVG
import logoImage from './assets/logo.svg';

// WebP
import logoImage from './assets/logo.webp';
```


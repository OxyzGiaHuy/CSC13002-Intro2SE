# Hướng dẫn cài đặt và khắc phục lỗi

## Cài đặt Dependencies

### Sử dụng pnpm (Khuyến nghị)

```bash
cd src/trailsexplorer
pnpm install
```

### Sử dụng npm

Nếu gặp lỗi với npm, thử các cách sau:

1. **Xóa node_modules và cài lại:**
   ```bash
   Remove-Item -Recurse -Force node_modules
   npm cache clean --force
   npm install --legacy-peer-deps
   ```

2. **Sử dụng script khắc phục:**
   ```powershell
   .\fix-npm-install.ps1
   ```

3. **Hoặc sử dụng yarn:**
   ```bash
   yarn install
   ```

## Khắc phục lỗi đường dẫn dài trên Windows

Nếu gặp lỗi do đường dẫn quá dài trên Windows:

1. Tạo file `.npmrc` trong thư mục `src/trailsexplorer/`:
   ```
   cache=C:\npm-cache
   ```

2. Hoặc sử dụng pnpm (đã xử lý tốt hơn vấn đề này)

## Chạy ứng dụng

```bash
pnpm dev
# hoặc
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:3000`

## Build cho Production

```bash
pnpm build
pnpm preview
```


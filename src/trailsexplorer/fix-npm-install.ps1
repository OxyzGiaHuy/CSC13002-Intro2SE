# Script để khắc phục vấn đề npm install
# Chạy script này với quyền Administrator

Write-Host "Đang xóa node_modules và package-lock.json..." -ForegroundColor Yellow
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

Write-Host "Đang xóa npm cache..." -ForegroundColor Yellow
npm cache clean --force

Write-Host "Đang cài đặt lại dependencies..." -ForegroundColor Yellow
npm install --legacy-peer-deps --no-audit

if ($LASTEXITCODE -eq 0) {
    Write-Host "Cài đặt thành công!" -ForegroundColor Green
} else {
    Write-Host "Vẫn gặp lỗi. Hãy thử sử dụng pnpm hoặc yarn." -ForegroundColor Red
    Write-Host "Chạy: pnpm install hoặc yarn install" -ForegroundColor Yellow
}


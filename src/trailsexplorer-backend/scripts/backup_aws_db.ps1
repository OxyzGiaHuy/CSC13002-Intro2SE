# CẤU HÌNH AWS
$DB_HOST = "trailsexplorer-db.cj8eosqemji3.ap-southeast-2.rds.amazonaws.com"
$DB_USER = "postgres"
$DB_NAME = "trailsexplorer_prod"
$DB_PORT = "5432"
# Điền mật khẩu AWS của bạn vào đây
$env:PGPASSWORD = "andracrista.23" 

# CẤU HÌNH ĐƯỜNG DẪN PG_DUMP 
$PG_PATH = "C:\Program Files\PostgreSQL\18\bin\pg_dump.exe"

# CẤU HÌNH THƯ MỤC BACKUP
$BACKUP_DIR = "C:\backups\trailsexplorer"
$DATE = Get-Date -Format "yyyyMMdd_HHmmss"
$FILENAME = "$BACKUP_DIR\backup_$DATE.sql"

# Kiểm tra xem file pg_dump có tồn tại không
if (!(Test-Path -Path $PG_PATH)) {
    Write-Host "Error: Không tìm thấy file pg_dump tại: $PG_PATH" -ForegroundColor Red
    Write-Host "Hãy sửa lại đường dẫn trong file script cho đúng version PostgreSQL của bạn."
    exit
}

# Tạo thư mục nếu chưa có
if (!(Test-Path -Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Force -Path $BACKUP_DIR
    Write-Host "Created backup directory: $BACKUP_DIR"
}

# THỰC HIỆN BACKUP
Write-Host "Dang backup tu AWS RDS ve may..."
try {
    # Gọi trực tiếp file exe theo đường dẫn đầy đủ
    & $PG_PATH -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -F p -f $FILENAME
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Backup successful! File saved at:" -ForegroundColor Green
        Write-Host $FILENAME
    } else {
        Write-Host "Backup failed with exit code $LASTEXITCODE" -ForegroundColor Red
    }
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

# Xóa mật khẩu khỏi session sau khi chạy xong để bảo mật
Remove-Item Env:\PGPASSWORD
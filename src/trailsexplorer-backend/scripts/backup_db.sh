#!/bin/bash

# Cấu hình
BACKUP_DIR="./backups"
DB_NAME="trailsexplorer"
DB_USER="postgres"
DATE=$(date +"%Y%m%d_%H%M%S")
FILENAME="$BACKUP_DIR/db_backup_$DATE.sql"

# Tạo thư mục nếu chưa có
mkdir -p $BACKUP_DIR

# Thực hiện dump (Yêu cầu cài pg_dump)
# PGPASSWORD='password_cua_ban' pg_dump -U $DB_USER -h localhost $DB_NAME > $FILENAME

# Tự động xóa backup cũ hơn 7 ngày
find $BACKUP_DIR -type f -name "*.sql" -mtime +7 -delete

echo "Backup completed: $FILENAME"
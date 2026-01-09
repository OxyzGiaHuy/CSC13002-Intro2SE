# 🚀 Production Deployment Checklist

## 1. Server Information
- **OS:** Windows (Local Host running PM2)
- **Node Version:** v22.x
- **Port:** 8000
- **Process Manager:** PM2 (Instance Name: `trailsexplorer-api`)

## 2. Database (AWS RDS)
- **Host:** `trailsexplorer-db.cj8eosqemji3.ap-southeast-2.rds.amazonaws.com`
- **Engine:** PostgreSQL 16+
- **Database Name:** `trailsexplorer_prod`
- **SSL:** Enabled (Required by AWS)
- **Backup Strategy:** Manual script via `scripts/backup_aws_db.ps1`

## 3. Environment Variables (.env.production)
Đảm bảo các biến sau đã được thiết lập:
- `NODE_ENV=production`
- `DB_HOST`, `DB_USER`, `DB_PASS` (Trỏ về AWS)
- `JWT_SECRET` (Chuỗi ngẫu nhiên dài 64 byte)
- `CORS_ORIGIN` (Domain Frontend hoặc localhost:3000)

## 4. Maintenance Commands

### Khởi động/Restart Server
```powershell
pm2 start ecosystem.config.js --env production
pm2 restart trailsexplorer-api
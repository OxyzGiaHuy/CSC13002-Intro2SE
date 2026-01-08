# TrailsExplorer Backend Guide

Backend API for the TrailsExplorer project built with Node.js, Express, and PostgreSQL.

## 1. Installation

Install required dependencies, including the PostgreSQL database driver:

```bash
cd src/trailsexplorer-backend
pnpm install
```

## 2. Environment Configuration (.env)

Create a `.env` file in the `src/trailsexplorer-backend` directory.

### Generate JWT Secret

Create a secure random string for JWT encryption. Run this command in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the generated string and paste it into the `JWT_SECRET` variable in your `.env` file.

### Sample .env File

```env
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=postgres
DB_PASS=your_password
DB_NAME=trailsexplorer
DB_PORT=5432

# Paste your generated JWT secret here
JWT_SECRET=your_generated_jwt_secret_here
FRONTEND_URL=http://localhost:3000
```

## 3. Database Setup & Seeding

### Prerequisite: Install PostGIS
The database uses spatial data. You **must** have PostGIS installed on your PostgreSQL server.
- **Windows:** Use **Stack Builder** (included with PostgreSQL) -> Spatial Extensions -> Select PostGIS bundle and install.

### Initialize & Seed Data
This command will clean the database, create tables from `schema.sql`, and nạp dữ liệu mẫu từ `example-data.sql`.

```bash
pnpm run db:seed
```

**What it does:**
- Resets the `public` schema.
- Runs migrations (`migrations/schema.sql`).
- Inserts ~20 trails, 10 users, and 30 reviews.
- Verifies data counts automatically.

## 4. Starting the Server

Run the server in development mode (automatically restarts on code changes):

```bash
pnpm run dev
```

**Success Indicators:**
- Terminal displays: `Server is running on: http://localhost:5000`
- Terminal displays: `Đã kết nối thành công tới PostgreSQL: trailsexplorer`

## 5. Testing & Verification

### API Endpoints
Verify these endpoints in your browser or Postman:

- **Check Server Status:** `GET http://localhost:5000`
- **Health Check:** `GET http://localhost:5000/api/health`
- **Verify Seeded Data:** `GET http://localhost:5000/api/test-db`
  *(Returns a list of sample users and trails from the database)*

### Manual SQL Verification
You can also run this query in your SQL tool (pgAdmin, DBeaver, etc.) to verify data:

```sql
SELECT 
    (SELECT COUNT(*) FROM trails) as trail_count,
    (SELECT COUNT(*) FROM users) as user_count,
    (SELECT COUNT(*) FROM trail_reviews) as review_count;
```

---

**Ready to explore trails!** 🥾

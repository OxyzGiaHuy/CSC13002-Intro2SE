# Backend Merge Report: Phase 5 (Database & Auth)

This document details the changes made to the `phase-5/5.3-5.4-backend` branch to align it with the project structure and requirements, making it ready for merge into `main`.

## 1. Directory Structure Organization
**Issue:** The backend code was incorrectly placed in a `server/` folder at the root.
**Fix:** 
- Moved all contents from `server/` to `src/trailsexplorer-backend/`.
- Deleted the redundant `server/` directory.
- **Current Root:** `src/trailsexplorer-backend/`

## 2. Database & ORM Implementation
### Models (`src/trailsexplorer-backend/models/`)
- **User.js (`[MODIFIED]`):** 
  - Aligned properties with `schema.sql`.
  - Mapped `id` -> `user_id`.
  - Mapped `password` -> `password_hash`.
  - Added correct `ENUM` types for `role`.
- **Trail.js (`[NEW]`):** 
  - Created Sequelize model for the `trails` table.
  - Defined fields: `name`, `difficulty`, `length_km`, `estimated_duration_hours`, `location_region`, etc.
- **Review.js (`[NEW]`):**
  - Created Sequelize model for the `trail_reviews` table.
  - Defined associations with `User` and `Trail`.

### Configuration (`src/trailsexplorer-backend/config/`)
- Confirmed `database.js` correctly initializes Sequelize with environment variables.

### Initialization (`src/trailsexplorer-backend/index.js`)
- Updated to import and register all models (`User`, `Trail`, `Review`) before syncing.
- Changed success log message to exactly: `"Database connected successfully"` as per requirements.

## 3. Authentication & JWT
### Routes (`src/trailsexplorer-backend/routes/auth.js`)
- **Register (`/api/auth/register`):** Existing implementation retained.
- **Login (`/api/auth/login`):** Existing implementation retained.
- **Logout (`/api/auth/logout`) (`[NEW]`):** Added endpoint to handle client-side token clearance (returns success message).

### Middleware (`src/trailsexplorer-backend/middleware/authMiddleware.js`)
- **authenticateToken (`[NEW]`):** 
  - Implemented JWT verification.
  - check for `Authorization: Bearer <token>` header.
  - Returns `401` if token missing, `403` if invalid.
  - Attaches `user` object to `req`.

## 4. How to Verify
1. Navigate to the backend directory:
   ```bash
   cd src/trailsexplorer-backend
   ```
2. Install dependencies (if not already):
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Check console output for:
   ```
   Database connected successfully
   🚀 Server đang chạy tại http://localhost:5000
   ```

# TrailsExplorer Backend

Backend API for the TrailsExplorer project built with Node.js, Express, and PostgreSQL.

## Installation

Install required dependencies, including the PostgreSQL database driver:

```bash
npm install
npm install pg
```

## Environment Configuration (.env)

Create a `.env` file in the project root directory.

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
DB_NAME=demodb
DB_PORT=5432

# Paste your generated JWT secret here
JWT_SECRET=your_generated_jwt_secret_here
FRONTEND_URL=http://localhost:5000
```

## Starting the Server

Run the server in development mode (automatically restarts on code changes):

```bash
npm run dev
```

**Success Indicators:**
- Terminal displays: `Server is running on: http://localhost:5000`
- Successfully connected to PostgreSQL: `trailsexplorer`

## Testing & Verification

Once the server is running, verify these endpoints in your browser:

### Check Server Status (Root)

**URL:** `http://localhost:5000`

**Expected Result:** Displays message: `TrailsExplorer API is running...`

### API Health Check

**URL:** `http://localhost:5000/api/health`

**Expected Result:** Returns JSON response:

```json
{
  "status": "OK",
  "message": "Server is healthy and ready to rock!"
}
```

---

**Ready to explore trails!** 🥾

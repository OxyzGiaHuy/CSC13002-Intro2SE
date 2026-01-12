---
description: Guide to deploying the full stack application for free
---

# Free Deployment Guide (Vercel + Render + Neon)

This guide walks you through deploying the TrailsExplorer application using the best free-tier services available.

## 1. Database (PostgreSQL) -> **Neon Console**
Neon offers a generous free tier for PostgreSQL with branching support.

1.  Go to [Neon.tech](https://neon.tech/) and sign up.
2.  Create a new project (e.g., `trailsexplorer-db`).
3.  Copy the **Connection String** (Postgres URL).
    *   It looks like: `postgres://user:pass@ep-xyz.us-east-2.aws.neon.tech/dbname?sslmode=require`
4.  **Important:** You will need this URL for both your Backend and your local `.env` if you want to connect locally.

## 2. Backend (Node.js/Express) -> **Render**
Render provides a free Web Service tier that spins down after inactivity but works great for demos.

1.  Push your latest code to GitHub.
2.  Go to [Render Dashboard](https://dashboard.render.com/).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  **Settings:**
    *   **Root Directory:** `src/trailsexplorer-backend` (Important! Since your backend is in a subdir)
    *   **Runtime:** Node
    *   **Build Command:** `npm install` (or `pnpm install`)
    *   **Start Command:** `node server.js`
6.  **Environment Variables:**
    *   Add `DATABASE_URL`: Paste your Neon connection string here.
    *   Add `JWT_SECRET`: Generate a random secure string.
    *   Add `GEMINI_API_KEY`: Your Google Gemini API Key.
    *   Add `PORT`: `10000` (Render default).
    *   **Add `CLIENT_URL`**: The URL of your deployed Frontend (e.g., `https://your-frontend-project.vercel.app`).
        *   *Note: You may need to deploy Frontend first to get this URL, or guess it based on project name. You can update this later in Render.*
7.  Click **Deploy**.

## 3. Frontend (React/Vite) -> **Vercel**
Vercel is optimized for frontend frameworks and offers a seamless free tier.

1.  Go to [Vercel Dashboard](https://vercel.com/).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Framework Preset:** Vite
5.  **Root Directory:** Click "Edit" and select `src/trailsexplorer` (your frontend folder).
6.  **Environment Variables:**
    *   `VITE_API_URL`: The URL of your deployed Render backend with `/api` suffix (e.g., `https://trailsexplorer-api.onrender.com/api`).
        *   *Note: Ensure you include the `/api` at the end.*
7.  Click **Deploy**.

## 4. Final Verification
1.  Open your Vercel URL.
2.  Try to Register/Login.
3.  **Critical Check:** Open browser DevTools (F12) -> Network tab.
    *   Perform an action (like login or generate plan).
    *   Click the request.
    *   **Verify the Request URL** starts with your Render backend URL (e.g., `https://trailsexplorer-api.onrender.com/...`), NOT `localhost`.
4.  Test the AI features to ensure the Backend can talk to Gemini.

## 5. System Email & Admin Setup (Optional but Recommended)

### A. Setup Gmail for System Notifications
If you want the app to send registration or notification emails (using `trailsexplorer.system@gmail.com`):

1.  **Enable 2-Step Verification** on your Google Account.
2.  Go to **Google Account Settings > Security**.
3.  Search for **App Passwords**.
4.  Create a new app password (e.g., call it "TrailsExplorer").
5.  Copy the **16-character code**.
6.  **In Render Dashboard:**
    *   Add `EMAIL_SERVICE`: `gmail`
    *   Add `EMAIL_USER`: `trailsexplorer.system@gmail.com`
    *   Add `EMAIL_PASS`: `[Your 16-character App Password]` (No spaces)

### B. Promote a User to Admin
By default, everyone who registers is a `USER`. To make yourself an `ADMIN`:

1.  Register an account on your deployed app using your email.
2.  Go to **Neon Console > SQL Editor**.
3.  Run the following query:
    ```sql
    UPDATE users SET role = 'ADMIN' WHERE email = 'trailsexplorer.system@gmail.com';
    ```
4.  Log out and log back in on the app to see the Admin dashboard.


---
**Note:** Render free instances spin down after 15 mins of inactivity. The first request might take 30-50s to wake it up. This is normal for the free tier.

# Development Setup & Maintenance Scripts

This folder contains utility scripts for seeding, syncing, and maintaining the database during development.

## Prerequisites

Ensure you are in the `src/trailsexplorer-backend` directory and have dependencies installed:

```bash
cd src/trailsexplorer-backend
npm install
```

## Core Setup Scripts

### 1. Database Sync
**File:** `sync_models.js`
**Usage:** `node setup_scripts/sync_models.js`
**Description:** Forces a synchronization of Sequelize models with the database. Useful when you have changed model definitions (schema) and need to update the database tables.
*   **Warning:** can allow data loss if `force: true` is enabled (check script content).

### 2. Seeding Data
These scripts populate the database with mock data for testing.

*   **Users:** `node setup_scripts/seed_users.js` - Creates mock users with avatars and realistic names.
*   **Groups:** `node setup_scripts/seed_groups.js` - Creates community groups and adds members.
*   **Trails:** `node setup_scripts/seed_trails_english.js` - Seeds trail data (in English).
*   **Challenges:** `node setup_scripts/seed_challenges.js` - Seeds system challenges.

### 3. Visual & Data Refinement (Dashboard)

*   **Distribute User Stats:** `node setup_scripts/distribute_stats.js`
    *   **Purpose:** Randomizes `total_distance_km` and `total_elevation_gain` for users to make the "Top Trekkers" chart look realistic (instead of everyone having 0).
*   **Rename Top Users:** `node setup_scripts/rename_users.js`
    *   **Purpose:** Renames the top 5 users to realistic Vietnamese names (e.g., "Nguyễn Văn A") for better visual presentation on the Dashboard.
*   **Reset Pending Stats:** `node setup_scripts/reset_pending_stats.js`
    *   **Purpose:** Sets likes, comments, and shares to 0 for all posts that are in `PENDING` status. Run this if your seed data incorrectly gave engagement stats to unapproved posts.

## Maintenance & cleanup

*   **Reset Admin:** `node setup_scripts/reset_admin.js` - Resets or creates the default admin account.
*   **Clean Challenges:** `node setup_scripts/clean_challenges.js` - Removes challenge data.
*   **Patch SQL:** `node setup_scripts/patch_sql.js` - Applies specific SQL patches (check file for details).

## How to Full Reset (Recommended Flow)

To completely reset and prepare the database for a fresh demo/dev environment:

1.  `npm run db:reset` (if configured in package.json) OR `node seeds/seedDatabase.js` (Main seed script)
2.  `node setup_scripts/seed_users.js`
3.  `node setup_scripts/seed_groups.js`
4.  `node setup_scripts/distribute_stats.js` (For Dashboard visuals)
5.  `node setup_scripts/rename_users.js` (For Dashboard visuals)
6.  `node setup_scripts/reset_pending_stats.js` (Fix consistency)

#!/usr/bin/env node
/*
  seeds/seedDatabase.js

  - Generates SQL to create tables and insert sample data (trails, users, reviews, categories)
  - If env var DATABASE_URL is set and `psql` is available, it pipes SQL to psql to execute
  - Otherwise it writes seeds/seed.sql for manual execution and prints instructions

  Usage:
    DATABASE_URL="postgresql://user:pass@host:port/db" node seeds/seedDatabase.js

  Note: This script uses the system `psql` client when DATABASE_URL is provided. No additional Node DB libs required.
*/

const fs = require('fs');
const { spawnSync } = require('child_process');
const path = require('path');

const outSqlPath = path.resolve(__dirname, 'seed.sql');

// --- Sample data (derived from previous constants) ---
const trails = [
  { name: "Đỉnh Fansipan - Nóc nhà Đông Dương", location: "Lào Cai", difficulty: 'HARD', length_km: 12.5, duration_hr: 12, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1733821793652-e650876d9a7a?q=80&w=1200&h=800&auto=format&fit=crop', lat: 22.3067, lng: 103.8102 },
  { name: "Thung Lũng Tình Yêu - Đà Lạt", location: "Lâm Đồng", difficulty: 'EASY', length_km: 5.2, duration_hr: 3, rating: 4.2, imageUrl: 'https://images.unsplash.com/photo-1678099006439-dba9e4d3f9f5?q=80&w=1200&h=800&auto=format&fit=crop', lat: 11.9465, lng: 108.4419 },
  { name: "Vườn Quốc Gia Cúc Phương", location: "Ninh Bình", difficulty: 'MODERATE', length_km: 18.0, duration_hr: 8, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1713429647867-7c8c0cc369fb?q=80&w=1200&h=800&auto=format&fit=crop', lat: 20.2541, lng: 105.7131 },
  { name: "Bạch Mã - Đường Mòn Ngũ Hành", location: "Thừa Thiên Huế", difficulty: 'HARD', length_km: 16.8, duration_hr: 10, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1523224949444-170258978eef?q=80&w=1200&h=800&auto=format&fit=crop', lat: 16.1939, lng: 107.7992 },
  { name: "Đảo Cát Bà - Vườn Quốc Gia", location: "Hải Phòng", difficulty: 'MODERATE', length_km: 10.5, duration_hr: 6, rating: 4.3, imageUrl: 'https://images.unsplash.com/photo-1725701191382-ff47fc9f90c4?q=80&w=1200&h=800&auto=format&fit=crop', lat: 20.7994, lng: 106.9975 },
  { name: "Núi Chúa - Ninh Thuận", location: "Ninh Thuận", difficulty: 'HARD', length_km: 25.0, duration_hr: 14, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1524195958835-70f542b1924b?q=80&w=1200&h=800&auto=format&fit=crop', lat: 11.7008, lng: 109.2175 },
  { name: "Pù Luông - Thanh Hóa", location: "Thanh Hóa", difficulty: 'MODERATE', length_km: 15.3, duration_hr: 7, rating: 4.4, imageUrl: 'https://images.unsplash.com/photo-1695289566332-08eb1e223b6e?q=80&w=1200&h=800&auto=format&fit=crop', lat: 20.4333, lng: 105.1167 },
  { name: "Tà Năng - Phan Dũng", location: "Bình Thuận", difficulty: 'HARD', length_km: 55.0, duration_hr: 24, rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1565693235245-37dc4d88a60e?q=80&w=1200&h=800&auto=format&fit=crop', lat: 11.3167, lng: 107.8833 },
  { name: "Đèo Hải Vân", location: "Thừa Thiên Huế/Đà Nẵng", difficulty: 'EASY', length_km: 8.0, duration_hr: 4, rating: 4.1, imageUrl: 'https://images.unsplash.com/photo-1663856449506-a009e27878a9?q=80&w=1200&h=800&auto=format&fit=crop', lat: 16.1833, lng: 108.2000 },
  { name: "Vịnh Hạ Long - Hang Sửng Sốt", location: "Quảng Ninh", difficulty: 'EASY', length_km: 3.5, duration_hr: 2, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1200&h=800&auto=format&fit=crop', lat: 20.9500, lng: 107.0833 },
  { name: "Núi Lang Bian - Đà Lạt", location: "Lâm Đồng", difficulty: 'MODERATE', length_km: 7.5, duration_hr: 5, rating: 4.3, imageUrl: 'https://images.unsplash.com/photo-1678099006439-dba9e4d3f9f5?q=80&w=1200&h=800&auto=format&fit=crop', lat: 12.0500, lng: 108.4333 },
  { name: "Đèo Ô Quy Hồ - Lai Châu", location: "Lai Châu", difficulty: 'HARD', length_km: 20.0, duration_hr: 10, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1761218963784-39ef992a6da3?q=80&w=1200&h=800&auto=format&fit=crop', lat: 22.4167, lng: 103.6667 },
  { name: "Rừng Trà Sư - An Giang", location: "An Giang", difficulty: 'EASY', length_km: 4.2, duration_hr: 2.5, rating: 4.0, imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&h=800&auto=format&fit=crop', lat: 10.4167, lng: 105.0833 },
  { name: "Núi Bà Đen - Tây Ninh", location: "Tây Ninh", difficulty: 'MODERATE', length_km: 6.8, duration_hr: 4, rating: 4.2, imageUrl: 'https://images.unsplash.com/photo-1695442443973-40067c5f3d7a?q=80&w=1200&h=800&auto=format&fit=crop', lat: 11.3667, lng: 106.2000 },
  { name: "Vườn Quốc Gia Bái Tử Long", location: "Quảng Ninh", difficulty: 'EASY', length_km: 5.5, duration_hr: 3, rating: 4.4, imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=1200&h=800&auto=format&fit=crop', lat: 21.0833, lng: 107.4167 },
  { name: "Bidoup - Núi Bà National Park", location: "Lâm Đồng", difficulty: 'MODERATE', length_km: 25.0, duration_hr: 12, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1686242228254-ca3bedc1db57?q=80&w=1200&h=800&auto=format&fit=crop', lat: 12.1000, lng: 108.5000 },
  { name: "Núi Tây Côn Lĩnh - Hà Giang", location: "Hà Giang", difficulty: 'HARD', length_km: 30.0, duration_hr: 18, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1562920618-c427d9252d7a?q=80&w=1200&h=800&auto=format&fit=crop', lat: 22.7000, lng: 104.8000 },
  { name: "Cổng Trời Quản Bạ", location: "Hà Giang", difficulty: 'MODERATE', length_km: 5.0, duration_hr: 3, rating: 4.4, imageUrl: 'https://images.unsplash.com/photo-1686755660203-55781dbc2f24?q=80&w=1200&h=800&auto=format&fit=crop', lat: 23.0000, lng: 104.9000 },
  { name: "Hồ Ba Bể - Trekking ven hồ", location: "Bắc Kạn", difficulty: 'EASY', length_km: 12.0, duration_hr: 5, rating: 4.2, imageUrl: 'https://images.unsplash.com/photo-1595634840658-26e8575ded94?q=80&w=1200&h=800&auto=format&fit=crop', lat: 22.4000, lng: 105.6000 },
  { name: "Núi Dinh - Bà Rịa Vũng Tàu", location: "Bà Rịa - Vũng Tàu", difficulty: 'MODERATE', length_km: 10.0, duration_hr: 6, rating: 4.1, imageUrl: 'https://images.unsplash.com/photo-1462688681110-15bc88b1497c?q=80&w=1200&h=800&auto=format&fit=crop', lat: 10.5000, lng: 107.1000 },
];

const users = [
  { name: 'Gia Huy', email: 'giahuy@example.com' },
  { name: 'An Nguyen', email: 'an@example.com' },
  { name: 'Binh Le', email: 'binh@example.com' },
  { name: 'Chi Pham', email: 'chi@example.com' },
  { name: 'Dung Tran', email: 'dung@example.com' },
  { name: 'Hoa Mai', email: 'hoa@example.com' },
  { name: 'Long Vu', email: 'long@example.com' },
  { name: 'Mai Linh', email: 'maih@example.com' },
  { name: 'Quynh Le', email: 'quynh@example.com' },
  { name: 'Minh Hoang', email: 'minh@example.com' },
];

const sampleComments = [
  'Absolutely breathtaking! A must-do.',
  'Challenging but rewarding. Be prepared.',
  'Great for a day trip. Nice view.',
  'The summit was surreal, worth it.',
  'Family friendly and enjoyable.',
  'Watch out for muddy sections after rain.',
  'Bring warm clothes for high altitude.',
  'Good signage and trail maintenance.',
  'Busy on weekends, go early.',
  'Amazing sunrise from the ridge.',
];

// create ~30 reviews distributed across trails and users
const reviews = [];
for (let i = 0; i < 30; i++) {
  const trailId = (i % trails.length) + 1; // will map to inserted trail ids
  const userId = (i % users.length) + 1; // map to user ids
  reviews.push({ trailId, userId, rating: 3 + (i % 3), comment: sampleComments[i % sampleComments.length] });
}

const categories = ['Beginner', 'Intermediate', 'Expert'];

// build SQL
let sql = `-- Seed script generated by seeds/seedDatabase.js\n\n`;
sql += `BEGIN;\n\n`;

sql += `-- Create tables if they do not exist\n`;
sql += `CREATE TABLE IF NOT EXISTS users (\n  id SERIAL PRIMARY KEY,\n  name TEXT NOT NULL,\n  email TEXT UNIQUE,\n  avatar_url TEXT,\n  total_km INTEGER DEFAULT 0,\n  avg_altitude INTEGER DEFAULT 0,\n  avg_time_hr NUMERIC DEFAULT 0,\n  role TEXT DEFAULT 'user'\n);\n\n`;

sql += `CREATE TABLE IF NOT EXISTS trails (\n  id SERIAL PRIMARY KEY,\n  name TEXT NOT NULL,\n  location TEXT,\n  difficulty TEXT,\n  length_km NUMERIC,\n  duration_hr NUMERIC,\n  rating NUMERIC,\n  description TEXT,\n  image_url TEXT,\n  lat NUMERIC,\n  lng NUMERIC\n);\n\n`;

sql += `CREATE TABLE IF NOT EXISTS reviews (\n  id SERIAL PRIMARY KEY,\n  trail_id INTEGER REFERENCES trails(id) ON DELETE CASCADE,\n  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,\n  rating INTEGER,\n  comment TEXT\n);\n\n`;

sql += `CREATE TABLE IF NOT EXISTS trail_categories (\n  id SERIAL PRIMARY KEY,\n  name TEXT UNIQUE NOT NULL\n);\n\n`;

sql += `CREATE TABLE IF NOT EXISTS trail_category_map (\n  trail_id INTEGER REFERENCES trails(id) ON DELETE CASCADE,\n  category_id INTEGER REFERENCES trail_categories(id) ON DELETE CASCADE,\n  PRIMARY KEY(trail_id, category_id)\n);\n\n`;

// inserts for categories
categories.forEach((c) => {
  sql += `INSERT INTO trail_categories (name) VALUES ('${c.replace("'", "''")}') ON CONFLICT (name) DO NOTHING;\n`;
});
sql += '\n';

// insert users
users.forEach((u, idx) => {
  const avatar = `https://picsum.photos/seed/${encodeURIComponent(u.name)}/100/100`;
  sql += `INSERT INTO users (name, email, avatar_url) VALUES ('${u.name.replace("'", "''")}', '${u.email}', '${avatar}') ON CONFLICT (email) DO NOTHING;\n`;
});
sql += '\n';

// insert trails
trails.forEach((t, idx) => {
  const desc = (t.description || `${t.name} in ${t.location}`).replace("'", "''");
  sql += `INSERT INTO trails (name, location, difficulty, length_km, duration_hr, rating, description, image_url, lat, lng) VALUES ('${t.name.replace("'", "''")}', '${t.location.replace("'", "''")}', '${t.difficulty}', ${t.length_km}, ${t.duration_hr}, ${t.rating}, '${desc}', '${t.imageUrl}', ${t.lat}, ${t.lng});\n`;
});
sql += '\n';

// Map some trails to categories (simple round-robin)
sql += `-- Map trails to categories\n`;
sql += `WITH tc AS (SELECT id, name FROM trail_categories)\n`;
sql += `SELECT 1;\n`; // no-op to keep psql happy if needed
// We'll add mapping using procedural insertion after tables exist (we'll use simple inserts selecting IDs)
categories.forEach((c, idx) => {
  // assign every Nth trail to this category
  sql += `INSERT INTO trail_category_map (trail_id, category_id) SELECT t.id, tc.id FROM trails t, trail_categories tc WHERE tc.name = '${c.replace("'", "''")}' AND (t.id % ${categories.length}) = ${idx};\n`;
});
sql += '\n';

// Insert reviews (we will map user and trails by id order)
reviews.forEach((r) => {
  const safeComment = r.comment.replace("'", "''");
  sql += `INSERT INTO reviews (trail_id, user_id, rating, comment) VALUES (${r.trailId}, ${r.userId}, ${r.rating}, '${safeComment}');\n`;
});

sql += '\nCOMMIT;\n\n';

sql += `-- Verification queries\n`;
sql += `SELECT COUNT(*) AS trails_count FROM trails;\n`;
sql += `SELECT COUNT(*) AS users_count FROM users;\n`;
sql += `SELECT COUNT(*) AS reviews_count FROM reviews;\n`;

// write SQL to file first
fs.writeFileSync(outSqlPath, sql, 'utf8');
console.log(`Wrote SQL to ${outSqlPath}`);

const databaseUrl = process.env.DATABASE_URL || process.env.PGURI || process.env.PG_CONNECTION_STRING;

function which(cmd) {
  const res = spawnSync('which', [cmd]);
  return res.status === 0;
}

if (databaseUrl && which('psql')) {
  console.log('DATABASE_URL detected and psql available — executing SQL via psql...');
  // run: psql <DATABASE_URL> -v ON_ERROR_STOP=1 -f seeds/seed.sql
  const proc = spawnSync('psql', [databaseUrl, '-v', 'ON_ERROR_STOP=1', '-f', outSqlPath], { stdio: 'inherit' });
  if (proc.error || proc.status !== 0) {
    console.error('psql execution failed. See above output.');
    process.exit(proc.status || 1);
  } else {
    console.log('Seed executed successfully via psql.');
    process.exit(0);
  }
} else {
  if (!databaseUrl) console.log('No DATABASE_URL detected — not executing SQL automatically.');
  if (!which('psql')) console.log('`psql` not available on PATH — cannot execute SQL automatically.');
  console.log('\nYou can run the seed SQL manually with psql:');
  console.log('  psql <CONNECTION> -v ON_ERROR_STOP=1 -f', outSqlPath);
  console.log('or set DATABASE_URL and ensure psql is on PATH, then:');
  console.log('  DATABASE_URL="postgresql://user:pass@host:port/db" node seeds/seedDatabase.js');
  process.exit(0);
}

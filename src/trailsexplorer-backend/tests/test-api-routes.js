const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

const testUser = {
    username: "apitest_" + Date.now(),
    email: `api${Date.now()}@test.com`,
    password: "password123"
};

let token = null;
let userId = null;
let trailId = null; // Will pick one from list
let postId = null;

async function request(method, endpoint, body = null, authToken = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

    const options = {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
    };

    try {
        const res = await fetch(`${BASE_URL}${endpoint}`, options);
        const data = await res.json().catch(() => ({}));
        return { status: res.status, ok: res.ok, data };
    } catch (err) {
        console.error(`❌ Request failed: ${method} ${endpoint}`, err.message);
        return { status: 0, ok: false, data: null };
    }
}

async function runTests() {
    console.log("🛠️  STARTING API ROUTE TESTS...\n");

    // 1. Auth Setup
    console.log("🔹 1. Register & Login...");
    const regRes = await request('POST', '/auth/register', testUser);
    if (!regRes.ok) {
        console.error("❌ Register Failed:", regRes.data);
        return;
    } else {
        console.log("✅ Register Success");
    }

    const loginRes = await request('POST', '/auth/login', { email: testUser.email, password: testUser.password });

    if (loginRes.ok) {
        token = loginRes.data.token;
        userId = loginRes.data.user.id;
        console.log("✅ Login Success!");
    } else {
        console.error("❌ Login Failed", loginRes.data);
        return;
    }

    // 2. Trails API
    console.log("\n🔹 2. Testing Trails API...");
    // 2a. Get List
    const trailsRes = await request('GET', '/trails?limit=5');
    if (trailsRes.ok && trailsRes.data.data.length > 0) {
        console.log(`✅ Get Trails Success: Found ${trailsRes.data.data.length} trails`);
        trailId = trailsRes.data.data[0].trail_id; // Pick first trail
        console.log(`Select Trail ID: ${trailId} for testing`);
    } else if (trailsRes.ok) {
        console.log("⚠️ Get Trails returned empty list (Run seed first if needed)");
        // If empty, we can't test detailed operations effectively, but we'll try search
    } else {
        console.error("❌ Get Trails Failed", trailsRes.data);
    }

    // 2b. Search
    const searchRes = await request('GET', '/trails/search?q=a');
    console.log(`ℹ️  Search 'a' returned ${Array.isArray(searchRes.data) ? searchRes.data.length : 0} results`);

    if (trailId) {
        // 2c. Get Details
        const detailRes = await request('GET', `/trails/${trailId}`);
        if (detailRes.ok) console.log("✅ Get Trail Detail Success");
        else console.error("❌ Get Trail Detail Failed");

        // 2d. Post Review
        console.log("   > Posting Review...");
        const reviewRes = await request('POST', `/trails/${trailId}/reviews`, {
            overall_rating: 5,
            content: "Great trail! (Test)",
            difficulty_rating: 3
        }, token);
        if (reviewRes.ok) console.log("✅ Post Review Success");
        else console.error("❌ Post Review Failed", reviewRes.data);
    }

    // 3. Community API
    console.log("\n🔹 3. Testing Community API...");
    // 3a. Create Post
    const postRes = await request('POST', '/community/posts', {
        title: "Test Community Post",
        content: "Hello hikers!",
        content_type: "TEXT"
    }, token);

    if (postRes.ok) {
        console.log("✅ Create Post Success");
        postId = postRes.data.post_id;
    } else {
        console.error("❌ Create Post Failed", postRes.data);
    }

    // 3b. List Posts
    const listPostsRes = await request('GET', '/community/posts');
    if (listPostsRes.ok) console.log(`✅ List Posts Success: Found ${listPostsRes.data.data.length} posts`);
    else console.error("❌ List Posts Failed");

    // 3c. Delete Post
    if (postId) {
        const delPostRes = await request('DELETE', `/community/posts/${postId}`, null, token);
        if (delPostRes.ok) console.log("✅ Delete Post Success");
        else console.error("❌ Delete Post Failed");
    }

    // 4. Favorites API
    if (trailId) {
        console.log("\n🔹 4. Testing Favorites API...");
        // 4a. Add Favorite
        const addFavRes = await request('POST', `/user/favorites/${trailId}`, {}, token);
        if (addFavRes.ok) console.log("✅ Add Favorite Success");
        else console.error("❌ Add Favorite Failed", addFavRes.data);

        // 4b. List Favorites
        const listFavRes = await request('GET', '/user/favorites', null, token);
        if (listFavRes.ok) {
            const count = Array.isArray(listFavRes.data) ? listFavRes.data.length : 0;
            console.log(`✅ List Favorites Success: Found ${count} favorites`);
        } else console.error("❌ List Favorites Failed");

        // 4c. Remove Favorite
        const removeFavRes = await request('DELETE', `/user/favorites/${trailId}`, null, token);
        if (removeFavRes.ok) console.log("✅ Remove Favorite Success");
        else console.error("❌ Remove Favorite Failed");
    }

    console.log("\n🎉 TEST COMPLETE!");
}

runTests();

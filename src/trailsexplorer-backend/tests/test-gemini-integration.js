const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

const testUser = {
    username: "aitest_" + Date.now(),
    email: `ai${Date.now()}@test.com`,
    password: "password123"
};

let token = null;
let savedPlanId = null;

async function request(method, endpoint, body = null, authToken = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

    const options = { method, headers, body: body ? JSON.stringify(body) : null };

    try {
        const res = await fetch(`${BASE_URL}${endpoint}`, options);
        // Special handling for 500 created by JSON parsing error in backend if API key is invalid
        const text = await res.text();
        try {
            const data = JSON.parse(text);
            return { status: res.status, ok: res.ok, data };
        } catch (e) {
            return { status: res.status, ok: false, data: { error: text } };
        }
    } catch (err) {
        console.error(`❌ Request failed: ${method} ${endpoint}`, err.message);
        return { status: 0, ok: false, data: null };
    }
}

async function runTests() {
    console.log("🛠️  STARTING GEMINI AI INTEGRATION TESTS...\n");

    // 1. Auth Setup
    console.log("🔹 1. Register & Login...");
    await request('POST', '/auth/register', testUser);
    const loginRes = await request('POST', '/auth/login', { email: testUser.email, password: testUser.password });

    if (loginRes.ok) {
        token = loginRes.data.token;
        console.log("✅ Login Success!");
    } else {
        console.error("❌ Login Failed", loginRes.data);
        return;
    }

    // 2. Generate Plan
    console.log("\n🔹 2. Testing Generate Plan (Mocked or Real)...");
    // NOTE: This will fail if GEMINI_API_KEY is not set in backend .env
    // We expect it to potentially timeout or return 500 if no key.

    const planRes = await request('POST', '/ai/generate-plan', {
        location: "Sapa, Vietnam",
        duration: 2,
        difficulty: "MODERATE",
        interests: "Mountain views, Local culture"
    }, token);

    if (planRes.ok) {
        console.log("✅ Generate Plan Success!");
        console.log(`   Plan ID: ${planRes.data.plan_id}`);
        console.log(`   Checklist Items: ${planRes.data.checklist ? planRes.data.checklist.length : 0}`);
        savedPlanId = planRes.data.plan_id;
    } else {
        console.error("❌ Generate Plan Failed:", planRes.data.error || planRes.data);
        if (planRes.data.error && planRes.data.error.includes("API Key")) {
            console.warn("⚠️  SKIPPING remaining AI tests because API Key is missing.");
            return;
        }
    }

    // 3. Get Saved Plans
    if (savedPlanId) {
        console.log("\n🔹 3. Testing Get Saved Plans...");
        const listRes = await request('GET', '/user/saved-plans', null, token);
        if (listRes.ok && listRes.data.length > 0) {
            console.log(`✅ Get Saved Plans Success: Found ${listRes.data.length} plans`);
        } else {
            console.error("❌ Get Saved Plans Failed or Empty");
        }
    }

    // 4. Refine Plan (Bonus)
    if (savedPlanId) {
        console.log("\n🔹 4. Testing Refine Plan...");
        const refineRes = await request('POST', '/ai/refine-plan', {
            planId: savedPlanId,
            instruction: "Add a coffee shop visit on day 1"
        }, token);

        if (refineRes.ok) {
            console.log("✅ Refine Plan Success!");
        } else {
            console.error("❌ Refine Plan Failed:", refineRes.data);
        }
    }

    console.log("\n🎉 TEST COMPLETE!");
}

runTests();

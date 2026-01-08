const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}/api/auth`;

async function runTests() {
    console.log("🛠️  BẮT ĐẦU TEST BACKEND...\n");
    console.log("Lưu ý: Đảm bảo Server đang chạy ở cổng 5000 (npm start)\n");

    const testUser = {
        username: "testuser_" + Date.now(),
        email: `test${Date.now()}@example.com`,
        password: "password123"
    };

    // 1. Test Register
    console.log(`1️⃣  Test Register (Đăng ký user: ${testUser.email})...`);
    try {
        const regRes = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });

        const regData = await regRes.json();

        if (regRes.ok) {
            console.log("✅ Register thành công!", regData);
        } else {
            console.error("❌ Register thất bại:", regRes.status, regData);
            return;
        }
    } catch (err) {
        console.error("❌ Không thể kết nối tới server. Server đã bật chưa? Lỗi:", err.message);
        return;
    }

    // 2. Test Login
    console.log(`\n2️⃣  Test Login...`);
    let token = null;
    const loginRes = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: testUser.email,
            password: testUser.password
        })
    });

    const loginData = await loginRes.json();

    if (loginRes.ok && loginData.token) {
        token = loginData.token;
        console.log("✅ Login thành công! Token received.");
    } else {
        console.error("❌ Login thất bại:", loginRes.status, loginData);
        return;
    }

    // 3. Test Logout
    console.log(`\n3️⃣  Test Logout...`);
    const logoutRes = await fetch(`${BASE_URL}/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    // Logout might return 200 with text or json
    if (logoutRes.ok) {
        const logoutData = await logoutRes.json().catch(() => ({ message: "Logout OK (No JSON)" }));
        console.log("✅ Logout thành công!", logoutData);
    } else {
        console.log("⚠️ Logout trả về status:", logoutRes.status);
    }

    console.log("\n🎉 HOÀN THÀNH TEST CƠ BẢN!");
}

runTests();

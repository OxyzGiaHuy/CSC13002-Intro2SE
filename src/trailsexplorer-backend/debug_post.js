async function testPost() {
    try {
        console.log("1. Logging in...");
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@trailsexplorer.com',
                password: 'password123'
            })
        });

        const loginData = await loginRes.json();

        if (!loginRes.ok) {
            console.error("Login Failed:", loginData);
            return;
        }

        const token = loginData.data.token;
        console.log("Login successful.");

        console.log("2. Creating Post...");
        const postRes = await fetch('http://localhost:5000/api/community/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: "Debug Post",
                content: "This is a test post from debug script.",
                content_type: "TEXT"
            })
        });

        const postData = await postRes.json();

        if (postRes.ok) {
            console.log("Post created successfully:", postData);
        } else {
            console.error("Post Creation Failed:", postRes.status, postData);
        }

    } catch (err) {
        console.error("Runtime Error:", err);
    }
}

testPost();

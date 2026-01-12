const API_URL = 'http://localhost:5000/api';

async function testAdmin() {
    try {
        console.log('1. Logging in as admin...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@trailsexplorer.com',
                password: 'password123'
            })
        });

        const loginData = await loginRes.json();
        if (!loginRes.ok) throw new Error(loginData.message);

        const token = loginData.data.token;
        console.log('✅ Login successful. Token received.');

        console.log('2. Fetching Admin Reviews...');
        const reviewsRes = await fetch(`${API_URL}/admin/reviews`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const reviewsData = await reviewsRes.json();

        if (!reviewsRes.ok) {
            console.error('❌ Reviews Access Failed:', reviewsData);
        } else {
            console.log(`✅ Success! Fetched ${reviewsData.data ? reviewsData.data.length : 0} reviews.`);
            if (reviewsData.data && reviewsData.data.length > 0) {
                console.log('Sample review:', reviewsData.data[0]);
            }
        }

        console.log('3. Fetching Admin Posts...');
        const postsRes = await fetch(`${API_URL}/admin/posts`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const postsData = await postsRes.json();
        if (!postsRes.ok) {
            console.error('❌ Posts Access Failed:', postsData);
        } else {
            console.log(`✅ Success! Fetched ${postsData.data ? postsData.data.length : 0} posts.`);
        }

        console.log('4. Fetching Admin Stats...');
        const statsRes = await fetch(`${API_URL}/admin/stats`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const statsData = await statsRes.json();
        if (statsRes.ok) {
            console.log('✅ Admin Stats:', statsData);
        } else {
            console.error('❌ Admin Stats Failed:', statsData);
        }


    } catch (err) {
        console.error('❌ Error:', err.message);
    }
}

testAdmin();

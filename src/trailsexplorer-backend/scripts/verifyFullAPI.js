const API_URL = 'http://localhost:5000/api';

async function verifyEndpoints() {
    const endpoints = [
        { name: 'Posts', url: `${API_URL}/community/posts` },
        { name: 'Marketplace', url: `${API_URL}/marketplace` },
        { name: 'Groups', url: `${API_URL}/groups` },
        { name: 'Challenges', url: `${API_URL}/challenges` }
    ];

    console.log("Verifying API Endpoints...");

    for (const ep of endpoints) {
        try {
            console.log(`Checking ${ep.name}...`);
            const res = await fetch(ep.url);
            if (res.ok) {
                const data = await res.json();
                let count = 'N/A';
                if (Array.isArray(data)) count = data.length;
                else if (data.data && Array.isArray(data.data)) count = data.data.length;

                console.log(`✅ ${ep.name}: Status ${res.status}, Items: ${count}`);
            } else {
                console.error(`❌ ${ep.name}: FAILED with Status ${res.status}`);
                const text = await res.text();
                console.error('Response:', text);
            }
        } catch (error) {
            console.error(`❌ ${ep.name}: FAILED`);
            console.error('Error:', error.message);
            if (error.cause) console.error('Cause:', error.cause);
        }
        console.log('---');
    }
}

verifyEndpoints();

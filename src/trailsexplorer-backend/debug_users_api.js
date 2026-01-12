async function testGetUsers() {
    try {
        const response = await fetch('http://localhost:5000/api/user');
        console.log('StatusCode:', response.status);
        if (!response.ok) {
            console.error('Request failed with status:', response.status);
            const text = await response.text();
            console.error('Response Text:', text);
            return;
        }

        const data = await response.json();
        if (Array.isArray(data)) {
            console.log('Success: Data is an array of length', data.length);
            if (data.length > 0) {
                console.log('First user sample:', data[0]);
            }
        } else {
            console.error('Error: Data is not an array', data);
        }
    } catch (error) {
        console.error('Request Failed:', error.message);
    }
}

testGetUsers();

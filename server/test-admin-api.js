const fetch = require('node-fetch');

async function testAdminAPI() {
    try {
        console.log('Testing Admin API...\n');

        // Step 1: Login as admin
        console.log('Step 1: Logging in as admin...');
        const loginRes = await fetch('http://localhost:4000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@admin.com',
                password: 'admin@admin',
                role: 'ADMIN'
            })
        });

        const loginData = await loginRes.json();
        console.log('Login Response:', loginData);

        if (!loginData.token) {
            console.error('❌ Login failed!');
            return;
        }

        console.log('✅ Login successful!\n');

        // Step 2: Fetch users
        console.log('Step 2: Fetching users...');
        const usersRes = await fetch('http://localhost:4000/admin/users', {
            headers: {
                'Authorization': `Bearer ${loginData.token}`
            }
        });

        console.log('Status:', usersRes.status);
        const usersData = await usersRes.json();
        console.log('Users Response:', JSON.stringify(usersData, null, 2));

        if (usersData.users) {
            console.log(`\n✅ Found ${usersData.users.length} users!`);
            console.log('Stats:', usersData.stats);
        } else {
            console.log('❌ Error:', usersData);
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

testAdminAPI();

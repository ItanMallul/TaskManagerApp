// using native fetch

const BASE_URL = 'http://localhost:5000/api/auth';
const TEST_USER = {
    username: 'testuser_' + Date.now(),
    email: `test_${Date.now()}@example.com`,
    password: 'Password123'
};

async function testAuth() {
    console.log('--- Starting Auth Tests ---');

    // 1. Register
    console.log(`\n1. Testing Registration with: ${TEST_USER.username}`);
    try {
        const regRes = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(TEST_USER)
        });
        const regData = await regRes.json();
        console.log(`Status: ${regRes.status}`);
        console.log(`Response: ${JSON.stringify(regData)}`);

        if (regRes.status !== 201) {
            console.error('Registration failed!');
            process.exit(1);
        }
    } catch (error) {
        console.error('Registration Error:', error);
        process.exit(1);
    }

    // 2. Login
    console.log(`\n2. Testing Login with: ${TEST_USER.email}`);
    try {
        const loginRes = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: TEST_USER.email, password: TEST_USER.password })
        });
        const loginData = await loginRes.json();
        console.log(`Status: ${loginRes.status}`);
        console.log(`Response: ${JSON.stringify(loginData)}`); // Should contain token

        if (loginRes.status !== 200 || !loginData.token) {
            console.error('Login failed!');
            process.exit(1);
        }

    } catch (error) {
        console.error('Login Error:', error);
        process.exit(1);
    }

    // 3. Register Invalid Password
    console.log(`\n3. Testing Invalid Password Registration`);
    try {
        const invalidUser = { ...TEST_USER, username: 'fail', email: 'fail@test.com', password: 'weak' };
        const res = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(invalidUser)
        });
        const data = await res.json();
        console.log(`Status: ${res.status} (Expected 400)`);
        console.log(`Response: ${JSON.stringify(data)}`);
        if (res.status !== 400) {
            console.error('Invalid password test failed!');
        }
    } catch (error) {
        console.error('Error:', error);
    }

    console.log('\n--- Tests Completed ---');
}

testAuth();

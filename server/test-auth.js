const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testAuth() {
    try {
        // Get all users
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                password: true
            }
        });

        console.log('\n=== All Users in Database ===');
        for (const user of users) {
            console.log(`\nEmail: ${user.email}`);
            console.log(`Name: ${user.name}`);
            console.log(`Role: ${user.role}`);
            console.log(`Password Hash: ${user.password.substring(0, 20)}...`);

            // Test password comparison
            const testPassword = 'password123';
            const isValid = await bcrypt.compare(testPassword, user.password);
            console.log(`Password 'password123' valid: ${isValid}`);
        }

        console.log('\n=== Testing Latest User ===');
        const latestUser = users[users.length - 1];
        if (latestUser) {
            console.log(`\nTesting login for: ${latestUser.email}`);

            // Try different passwords
            const passwords = ['password123', 'Password123', 'test123', '123456'];
            for (const pwd of passwords) {
                const valid = await bcrypt.compare(pwd, latestUser.password);
                console.log(`Password '${pwd}': ${valid}`);
            }
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testAuth();

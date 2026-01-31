const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testNewSignup() {
    try {
        console.log('\n=== Testing New Signup Flow ===\n');

        // Simulate signup
        const testEmail = `test${Date.now()}@test.com`;
        const testPassword = 'testpass123';
        const hashedPassword = await bcrypt.hash(testPassword, 10);

        console.log('Creating test user...');
        console.log(`Email: ${testEmail}`);
        console.log(`Password: ${testPassword}`);
        console.log(`Hashed: ${hashedPassword.substring(0, 30)}...`);

        const user = await prisma.user.create({
            data: {
                name: 'Test User',
                email: testEmail,
                password: hashedPassword,
                role: 'PATIENT'
            }
        });

        console.log('\n✅ User created successfully!');
        console.log(`User ID: ${user.id}`);

        // Test login
        console.log('\n=== Testing Login ===\n');

        const foundUser = await prisma.user.findUnique({
            where: { email: testEmail }
        });

        if (!foundUser) {
            console.log('❌ User not found!');
            return;
        }

        console.log('User found in database');
        console.log(`Stored password hash: ${foundUser.password.substring(0, 30)}...`);

        // Test password comparison
        const isValid = await bcrypt.compare(testPassword, foundUser.password);
        console.log(`\nPassword comparison result: ${isValid ? '✅ VALID' : '❌ INVALID'}`);

        if (isValid) {
            console.log('\n✅ Login would succeed!');
        } else {
            console.log('\n❌ Login would fail!');
        }

        // Cleanup
        await prisma.user.delete({ where: { id: user.id } });
        console.log('\nTest user cleaned up.');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testNewSignup();

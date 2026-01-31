const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
    try {
        console.log('Creating admin account...\n');

        const hashedPassword = await bcrypt.hash('admin', 10);

        // Check if admin already exists
        const existingAdmin = await prisma.user.findUnique({
            where: { email: 'admin' }
        });

        if (existingAdmin) {
            console.log('✅ Admin account already exists!');
            console.log('Email: admin');
            console.log('Password: admin');
            console.log('Role: ADMIN\n');
            return;
        }

        const admin = await prisma.user.create({
            data: {
                name: 'Administrator',
                email: 'admin',
                password: hashedPassword,
                role: 'ADMIN'
            }
        });

        console.log('✅ Admin account created successfully!\n');
        console.log('Login Credentials:');
        console.log('==================');
        console.log('Email: admin');
        console.log('Password: admin');
        console.log('Role: ADMIN\n');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();

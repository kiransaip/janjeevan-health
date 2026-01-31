const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function updateAdmin() {
    try {
        console.log('Updating admin account...\n');

        const hashedPassword = await bcrypt.hash('admin@admin', 10);

        // Delete old admin if exists
        await prisma.user.deleteMany({
            where: {
                OR: [
                    { email: 'admin' },
                    { email: 'admin@admin.com' }
                ]
            }
        });

        // Create new admin with correct credentials
        const admin = await prisma.user.create({
            data: {
                name: 'Administrator',
                email: 'admin@admin.com',
                password: hashedPassword,
                role: 'ADMIN'
            }
        });

        console.log('✅ Admin account updated successfully!\n');
        console.log('Login Credentials:');
        console.log('==================');
        console.log('Email: admin@admin.com');
        console.log('Password: admin@admin');
        console.log('Role: ADMIN\n');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updateAdmin();

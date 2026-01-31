const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testDoctorLogin() {
    try {
        console.log('\n=== Testing Doctor Signup & Login Flow ===\n');

        const testEmail = `doctor${Date.now()}@test.com`;
        const testPassword = 'doctorpass123';
        const role = 'DOCTOR';

        console.log(`Creating doctor: ${testEmail}`);

        // 1. Register Doctor (Simulate register controller logic manually or call it if we could)
        // We will manually create to ensure DB state is correct as per controller
        const hashedPassword = await bcrypt.hash(testPassword, 10);

        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    name: 'Dr. Test',
                    email: testEmail,
                    password: hashedPassword,
                    role: role
                }
            });

            await tx.doctor.create({
                data: {
                    userId: user.id
                }
            });

            return user;
        });

        console.log(`✅ Doctor created with ID: ${result.id}`);

        // 2. Login Logic (Simulate login controller)
        console.log('\n--- Simulating Login Controller ---');

        const loginEmail = testEmail;
        const loginPassword = testPassword;
        const loginRole = role;

        const user = await prisma.user.findUnique({
            where: { email: loginEmail },
            include: {
                patientProfile: true,
                ashaProfile: true,
                doctorProfile: true,
                pharmacistProfile: true
            }
        });

        if (!user) {
            console.log('RESPONSE: 401 { error: "Invalid credentials" } (User not found)');
            return;
        }

        // Role check
        if (loginRole && user.role !== loginRole) {
            console.log(`RESPONSE: 401 { error: "Invalid role. This account is registered as a ${user.role}" }`);
            return;
        }

        const isValid = await bcrypt.compare(loginPassword, user.password);
        if (!isValid) {
            console.log('RESPONSE: 401 { error: "Invalid credentials" } (Password mismatch)');
            return;
        }

        console.log('✅ Login Successful!');
        console.log('User:', {
            id: user.id,
            email: user.email,
            role: user.role,
            doctorProfile: user.doctorProfile
        });

        // Cleanup
        await prisma.doctor.delete({ where: { userId: result.id } });
        await prisma.user.delete({ where: { id: result.id } });
        console.log('\nCleanup done.');

    } catch (error) {
        console.error('❌ EXCEPTION:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testDoctorLogin();

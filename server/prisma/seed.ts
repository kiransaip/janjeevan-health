import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('password123', 10);

    // 1. Create Patient
    const patientUser = await prisma.user.upsert({
        where: { email: 'patient@demo.com' },
        update: {},
        create: {
            email: 'patient@demo.com',
            password,
            name: 'Rahul Kumar',
            role: 'PATIENT',
            patientProfile: {
                create: {
                    dateOfBirth: new Date('1990-01-01'),
                    gender: 'Male',
                    address: 'Village Sector 4',
                    contact: '9876543210'
                }
            }
        },
    });

    // 2. Create ASHA Worker
    const ashaUser = await prisma.user.upsert({
        where: { email: 'asha@demo.com' },
        update: {},
        create: {
            email: 'asha@demo.com',
            password,
            name: 'Sunita Devi',
            role: 'ASHA',
            ashaProfile: {
                create: {}
            }
        },
    });

    // 3. Create Doctor
    const doctorUser = await prisma.user.upsert({
        where: { email: 'doctor@demo.com' },
        update: {},
        create: {
            email: 'doctor@demo.com',
            password,
            name: 'Dr. Sharma',
            role: 'DOCTOR',
            doctorProfile: {
                create: {}
            }
        },
    });

    // 4. Create Pharmacist
    const pharmacistUser = await prisma.user.upsert({
        where: { email: 'pharmacist@demo.com' },
        update: {},
        create: {
            email: 'pharmacist@demo.com',
            password,
            name: 'Rajesh Medicos',
            role: 'PHARMACIST',
            pharmacistProfile: {
                create: {}
            }
        },
    });

    // 5. Seed Inventory
    try {
        await prisma.inventory.createMany({
            data: [
                { name: 'Paracetamol 500mg', stock: 100, unit: 'strips', reorderThreshold: 20 },
                { name: 'Amoxicillin 250mg', stock: 50, unit: 'strips', reorderThreshold: 10 },
                { name: 'ORS Packets', stock: 200, unit: 'packets', reorderThreshold: 50 },
                { name: 'Cough Syrup', stock: 30, unit: 'bottles', reorderThreshold: 10 },
            ]
        });
    } catch (e) {
        // Ignore if already exists (createMany doesn't support skipDuplicates with sqlite in older prisma versions sometimes, or just to be safe)
        console.log('Inventory might already exist');
    }

    // 6. Seed Hospitals
    await prisma.hospital.createMany({
        data: [
            {
                name: 'City General Hospital',
                city: 'Delhi',
                address: 'Sector 12, Dwarka, Delhi',
                specialities: 'Cardiology, Orthopedics, General Medicine',
                openTime: '00:00',
                closeTime: '23:59',
                isOpen: true,
                contact: '+91 11 2345 6789'
            },
            {
                name: 'JanJeevan Village Clinic',
                city: 'Rampur',
                address: 'Main Road, Rampur Village',
                specialities: 'General Medicine, Pediatrics',
                openTime: '09:00',
                closeTime: '17:00',
                isOpen: true,
                contact: '+91 98765 12345'
            },
            {
                name: 'Sunrise Specialty Center',
                city: 'Mumbai',
                address: 'Andheri West, Mumbai',
                specialities: 'Neurology, Dermatology',
                openTime: '10:00',
                closeTime: '20:00',
                isOpen: true,
                contact: '+91 22 8765 4321'
            }
        ]
    });

    console.log('Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        // process.exit(1); 
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

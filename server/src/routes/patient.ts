import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get All Patients (ASHA/Doctor/Pharmacist)
router.get('/', authenticate, async (req: AuthRequest, res) => {
    try {
        const patients = await prisma.patient.findMany({
            include: {
                user: { select: { name: true, email: true } },
                ashaWorker: { include: { user: { select: { name: true } } } }
            }
        });
        res.json(patients);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch patients' });
    }
});

// Get Single Patient
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
    try {
        const patient = await prisma.patient.findUnique({
            where: { id: req.params.id },
            include: {
                user: { select: { name: true, email: true } },
                appointments: {
                    include: {
                        doctor: { include: { user: { select: { name: true } } } },
                        prescription: true
                    },
                    orderBy: { datetime: 'desc' }
                },
                symptoms: true
            }
        });
        if (!patient) return res.status(404).json({ error: 'Patient not found' });
        res.json(patient);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch patient' });
    }
});

// Create Patient (ASHA adds patient)
// Note: This creates a User + Patient profile if not exists, or links existing User?
// For hackathon simplicity, ASHA registers "offline" patients usually, so we create a new User account for them implicitly or explicitly.
// We'll trust the ASHA to provide details.
router.post('/', authenticate, async (req: AuthRequest, res) => {
    const { name, age, gender, contact, address, symptoms } = req.body;
    const ashaId = req.user.role === 'ASHA' ? req.user.profileId : null;

    try {
        // Create user first (mock email based on contact to ensure uniqueness)
        const mockEmail = `patient${contact}@janjeevan.local`;
        const existingUser = await prisma.user.findUnique({ where: { email: mockEmail } });

        let patientId;

        if (existingUser) {
            // If user exists, check if patient profile exists
            const existingPatient = await prisma.patient.findUnique({ where: { userId: existingUser.id } });
            if (existingPatient) {
                patientId = existingPatient.id;
            } else {
                return res.status(400).json({ error: 'User exists but not a patient' });
            }
        } else {
            // Create new
            const result = await prisma.$transaction(async (tx) => {
                const newUser = await tx.user.create({
                    data: {
                        name,
                        email: mockEmail,
                        password: 'defaultPassword123', // In real app, generate temp pass
                        role: 'PATIENT'
                    }
                });

                const newPatient = await tx.patient.create({
                    data: {
                        userId: newUser.id,
                        contact,
                        address,
                        gender,
                        dateOfBirth: new Date(new Date().getFullYear() - age, 0, 1), // Estimate DOB
                        ashaId: ashaId
                    }
                });
                return newPatient;
            });
            patientId = result.id;
        }

        // Helper to add initial symptoms if provided
        if (symptoms) {
            await prisma.symptomRecord.create({
                data: {
                    patientId,
                    symptoms: symptoms.description,
                    severity: symptoms.severity || 'MINOR',
                    advice: symptoms.advice
                }
            });
        }

        res.json({ message: 'Patient registered successfully', patientId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create patient' });
    }
});

export default router;

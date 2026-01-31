import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get Prescriptions (Pharmacist see PENDING, Patient see theirs)
router.get('/', authenticate, async (req: AuthRequest, res) => {
    const { role, profileId } = req.user;

    try {
        let where = {};
        if (role === 'PHARMACIST') {
            // See 'PENDING' usually
            where = {}; // All
        } else if (role === 'PATIENT') {
            where = { patientId: profileId };
        }

        const prescriptions = await prisma.prescription.findMany({
            where,
            include: {
                patient: { include: { user: true } },
                appointment: { include: { doctor: { include: { user: true } } } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(prescriptions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch prescriptions' });
    }
});

// Create Prescription (Doctor)
router.post('/', authenticate, async (req: AuthRequest, res) => {
    const { appointmentId, patientId, medications } = req.body;

    try {
        const prescription = await prisma.prescription.create({
            data: {
                appointmentId,
                patientId,
                medications: JSON.stringify(medications),
                status: 'PENDING'
            }
        });

        // Mark appointment as COMPLETED if needed, or kept separate
        await prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: 'COMPLETED' }
        });

        res.json(prescription);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create prescription' });
    }
});

// Fulfill Prescription (Pharmacist)
router.put('/:id/fulfill', authenticate, async (req: AuthRequest, res) => {
    const { id } = req.params;

    try {
        const prescription = await prisma.prescription.findUnique({ where: { id } });
        if (!prescription) return res.status(404).json({ error: 'Prescription not found' });

        // Parse medications and decrement stock
        const meds = JSON.parse(prescription.medications); // Array of {name, quantity}

        // Transaction to update stock and prescription status
        await prisma.$transaction(async (tx) => {
            for (const med of meds) {
                // Find inventory item by name
                const item = await tx.inventory.findUnique({ where: { name: med.name } });
                if (item) {
                    const newStock = item.stock - (med.quantity || 1);

                    await tx.inventory.update({
                        where: { name: med.name },
                        data: { stock: newStock }
                    });

                    // Check if reorder needed
                    if (newStock <= item.reorderThreshold) {
                        await tx.reorderRequest.create({
                            data: {
                                inventoryId: item.id,
                                quantity: 50,
                                status: 'PENDING',
                                requestedBy: req.user.userId
                            }
                        });
                    }
                }
            }

            await tx.prescription.update({
                where: { id },
                data: {
                    status: 'DISPENSED',
                    dispensedBy: req.user.userId,
                    dispensedAt: new Date()
                }
            });
        });

        res.json({ message: 'Prescription fulfilled and stock updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fulfill prescription' });
    }
});

export default router;

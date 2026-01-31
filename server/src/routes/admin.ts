import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all users (Admin only)
router.get('/users', authenticate, async (req: AuthRequest, res) => {
    try {
        if (req.user?.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Access denied. Admin only.' });
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                patientProfile: {
                    select: {
                        contact: true,
                        address: true,
                        gender: true
                    }
                },
                doctorProfile: true,
                ashaProfile: true,
                pharmacistProfile: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Get counts by role
        const stats = {
            total: users.length,
            patients: users.filter(u => u.role === 'PATIENT').length,
            doctors: users.filter(u => u.role === 'DOCTOR').length,
            asha: users.filter(u => u.role === 'ASHA').length,
            pharmacists: users.filter(u => u.role === 'PHARMACIST').length,
            admins: users.filter(u => u.role === 'ADMIN').length
        };

        res.json({
            users,
            stats
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Delete user (Admin only)
router.delete('/users/:id', authenticate, async (req: AuthRequest, res) => {
    try {
        if (req.user?.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Access denied. Admin only.' });
        }

        const { id } = req.params;

        // Delete related profiles first
        await prisma.$transaction(async (tx) => {
            await tx.patient.deleteMany({ where: { userId: id } });
            await tx.doctor.deleteMany({ where: { userId: id } });
            await tx.ashaWorker.deleteMany({ where: { userId: id } });
            await tx.pharmacist.deleteMany({ where: { userId: id } });
            await tx.user.delete({ where: { id } });
        });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

export default router;

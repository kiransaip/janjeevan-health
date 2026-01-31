import { Router } from 'express';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all follow-ups
router.get('/', async (req: Request, res: Response) => {
    try {
        const followUps = await prisma.followUp.findMany({
            include: {
                appointment: {
                    include: {
                        patient: {
                            include: {
                                user: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                scheduledDate: 'asc'
            }
        });
        res.json(followUps);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch follow-ups' });
    }
});

// Create follow-up
router.post('/', async (req: Request, res: Response) => {
    try {
        const { appointmentId, scheduledDate, notes } = req.body;

        const followUp = await prisma.followUp.create({
            data: {
                appointmentId,
                scheduledDate: new Date(scheduledDate),
                status: 'PENDING',
                notes
            }
        });

        res.json(followUp);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create follow-up' });
    }
});

// Update follow-up status
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        const followUp = await prisma.followUp.update({
            where: { id },
            data: {
                status,
                notes,
                completedAt: status === 'COMPLETED' ? new Date() : null
            }
        });

        res.json(followUp);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update follow-up' });
    }
});

export default router;

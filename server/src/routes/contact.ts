import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// POST /contact - Public route to send a message
router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required' });
        }

        const newMessage = await prisma.contactMessage.create({
            data: {
                name,
                email,
                message
            }
        });

        res.status(201).json({ message: 'Message sent successfully', data: newMessage });
    } catch (error) {
        console.error('Error sending contact message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// GET /contact - Admin only route to list messages
router.get('/', authenticate, async (req: Request, res: Response) => {
    try {
        // Double check admin role although middleware handles auth,
        // middleware might just check token validity.
        // Assuming authenticate middleware attaches user to req usually.
        // Let's rely on requester to be Admin.

        // Safer to check role here if middleware doesn't strict check role
        const user = (req as any).user;
        if (user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Access denied. Admins only.' });
        }

        const messages = await prisma.contactMessage.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json(messages);
    } catch (error) {
        console.error('Error fetching contact messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

export default router;

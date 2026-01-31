import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get Inventory
router.get('/', authenticate, async (req: AuthRequest, res) => {
    try {
        const items = await prisma.inventory.findMany();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch inventory' });
    }
});

// Update Inventory
router.post('/update', authenticate, async (req: AuthRequest, res) => {
    const { name, stock, unit, reorderThreshold } = req.body;

    try {
        const item = await prisma.inventory.upsert({
            where: { name },
            update: {
                stock,
                unit: unit || undefined,
                reorderThreshold: reorderThreshold !== undefined ? parseInt(reorderThreshold) : undefined
            },
            create: {
                name,
                stock: stock || 0,
                unit: unit || 'units',
                reorderThreshold: reorderThreshold !== undefined ? parseInt(reorderThreshold) : 10
            }
        });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update inventory' });
    }
});

// Get low stock items
router.get('/low-stock', authenticate, async (req: AuthRequest, res) => {
    try {
        const items = await prisma.inventory.findMany({
            where: {
                stock: {
                    lte: prisma.inventory.fields.reorderThreshold
                }
            }
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch low stock items' });
    }
});

// Create reorder request
router.post('/reorder', authenticate, async (req: AuthRequest, res) => {
    try {
        const { inventoryId, quantity } = req.body;

        const reorder = await prisma.reorderRequest.create({
            data: {
                inventoryId,
                quantity,
                status: 'PENDING',
                requestedBy: req.user?.userId || 'system'
            }
        });

        res.json(reorder);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create reorder request' });
    }
});

// Get reorder requests
router.get('/reorders', authenticate, async (req: AuthRequest, res) => {
    try {
        const reorders = await prisma.reorderRequest.findMany({
            include: {
                inventory: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(reorders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reorder requests' });
    }
});

// Update reorder status
router.put('/reorder/:id', authenticate, async (req: AuthRequest, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const reorder = await prisma.reorderRequest.update({
            where: { id },
            data: { status }
        });

        // If received, update inventory stock
        if (status === 'RECEIVED') {
            await prisma.inventory.update({
                where: { id: reorder.inventoryId },
                data: {
                    stock: {
                        increment: reorder.quantity
                    }
                }
            });
        }

        res.json(reorder);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update reorder' });
    }
});

export default router;


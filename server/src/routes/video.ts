import { Router, Request, Response } from 'express';

const router = Router();
// Twilio removed as per user request

// POST /invite - Send SMS with Jitsi Link
router.post('/invite', async (req: Request, res: Response) => {
    try {
        const { doctorPhone } = req.body;
        // Default to env doctor phone if not provided
        const targetPhone = doctorPhone || process.env.DOCTOR_PHONE;

        if (!targetPhone) {
            return res.status(500).json({ error: 'Doctor phone number not configured' });
        }

        // Generate Jitsi Link
        const roomId = `JanJeevan-${Date.now()}`;
        const videoLink = `https://meet.jit.si/${roomId}`;

        // SMS Invite removed as per request
        console.log(`[VIDEO] Generated invite for Room: ${roomId} (SMS disabled)`);

        res.json({
            success: true,
            link: videoLink,
            message: 'Invite sent to doctor'
        });

    } catch (error) {
        console.error('[VIDEO] Error sending invite:', error);
        res.status(500).json({ error: 'Failed to send SMS invite', details: (error as any).message });
    }
});

export default router;

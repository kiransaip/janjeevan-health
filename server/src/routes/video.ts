import { Router, Request, Response } from 'express';
import twilio from 'twilio';

const router = Router();

// Twilio Config
const client = twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_TOKEN
);

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

        console.log(`[VIDEO] Generating invite for Room: ${roomId}`);
        console.log(`[VIDEO] Sending SMS to: ${targetPhone}`);

        // Send SMS
        await client.messages.create({
            body: `🚨 URGENT: Video Consultation Requested by ASHA Worker.\n\nJoin Now: ${videoLink}`,
            from: process.env.TWILIO_PHONE,
            to: targetPhone
        });

        console.log('[VIDEO] SMS Invtite Sent Successfully');

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

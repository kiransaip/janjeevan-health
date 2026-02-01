import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';


const router = Router();
const prisma = new PrismaClient();

// Get Appointments
router.get('/', authenticate, async (req: AuthRequest, res) => {
    const { role, profileId } = req.user;

    try {
        let where = {};
        if (role === 'DOCTOR') where = { doctorId: profileId }; // Or unassigned for PENDING?
        else if (role === 'PATIENT') where = { patientId: profileId };
        // ASHA might see all their patients' appointments

        // Doctor receives all Pending appointments if they look at "Queue"
        // But here we might want a specific "queue" endpoint. 
        // Let's return all relevant appointments.

        if (role === 'DOCTOR') {
            // Doctors see their assigned + all PENDING (global queue)
            const appointments = await prisma.appointment.findMany({
                where: {
                    OR: [
                        { doctorId: profileId },
                        { status: 'PENDING' }
                    ]
                },
                include: {
                    patient: { include: { user: true } }
                },
                orderBy: { datetime: 'asc' }
            });
            return res.json(appointments);
        }

        const appointments = await prisma.appointment.findMany({
            where,
            include: {
                doctor: { include: { user: true } },
                patient: { include: { user: true } }
            },
            orderBy: { datetime: 'desc' }
        });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

// Update Appointment (Doctor accepts, completes, adds diagnosis)
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
    const { status, diagnosis, notes, symptoms, aiAnalysis, videoCallUrl } = req.body;
    const { id } = req.params;

    try {
        const updateData: any = {};
        if (status) updateData.status = status;
        if (diagnosis) updateData.diagnosis = diagnosis;
        if (notes) updateData.notes = notes;
        if (aiAnalysis) updateData.aiAnalysis = aiAnalysis;
        if (videoCallUrl) updateData.videoCallUrl = videoCallUrl;

        // If doctor accepts, assign them
        if (status === 'APPROVED' && req.user.role === 'DOCTOR') {
            updateData.doctorId = req.user.profileId;
        }

        const appointment = await prisma.appointment.update({
            where: { id },
            data: updateData
        });

        // Emit socket event (TODO: access io instance)
        // req.app.get('io').emit('appointment_updated', appointment);

        res.json(appointment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update appointment' });
    }
});

// Create Appointment
router.post('/', authenticate, async (req: AuthRequest, res) => {
    const { patientId, symptoms, datetime, status, aiAnalysis } = req.body;

    try {
        const appointment = await prisma.appointment.create({
            data: {
                patientId,
                status: status || 'PENDING',
                datetime: datetime ? new Date(datetime) : new Date(),
                symptoms: typeof symptoms === 'string' ? symptoms : JSON.stringify(symptoms),
                aiAnalysis: aiAnalysis || null
            }
        });

        // req.app.get('io').emit('new_appointment', appointment);

        res.json(appointment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create appointment' });
    }
});

// Get single appointment by ID
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
    try {
        const { id } = req.params;
        const appointment = await prisma.appointment.findUnique({
            where: { id },
            include: {
                patient: { include: { user: true } },
                doctor: { include: { user: true } },
                prescription: true
            }
        });

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        res.json(appointment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch appointment' });
    }
});

// Send urgent notification email for HIGH urgency cases
router.post('/send-urgent-notification', authenticate, async (req: AuthRequest, res) => {
    const {
        appointmentId,
        patientName,
        patientContact,
        symptoms,
        urgency,
        recommendations,
        doctorEmail,
        meetingLink
    } = req.body;

    try {
        // Log the urgent case notification
        console.log('\n🚨 ===== URGENT MEDICAL CASE ALERT ===== 🚨');
        console.log(`Appointment ID: ${appointmentId}`);
        console.log(`Patient: ${patientName}`);
        console.log(`Contact: ${patientContact}`);
        console.log(`Urgency Level: ${urgency}`);
        console.log(`Symptoms: ${symptoms}`);
        console.log(`Recommendations: ${recommendations?.join(', ')}`);
        console.log(`Meeting Link: ${meetingLink}`);
        console.log(`Doctor Email: ${doctorEmail}`);
        console.log('========================================\n');

        // In a production environment, you would send an actual email here
        // For now, we'll simulate it with a console log
        const emailContent = {
            to: doctorEmail,
            subject: `🚨 URGENT: High Priority Medical Case - ${patientName}`,
            body: `
URGENT MEDICAL CONSULTATION REQUIRED

Patient Information:
- Name: ${patientName}
- Contact: ${patientContact}
- Urgency Level: ${urgency}

Symptoms:
${symptoms}

AI Recommendations:
${recommendations?.map((r: string, i: number) => `${i + 1}. ${r}`).join('\n')}

IMMEDIATE ACTION REQUIRED:
Please join the video consultation immediately using the link below:

Meeting Link: ${meetingLink}

Appointment ID: ${appointmentId}

This is an automated alert from JanJeevan Health System.
            `
        };

        console.log('📧 Email Content:', emailContent);

        // TODO: Integrate with actual email service (SendGrid, AWS SES, etc.)
        // Example:
        // await sendEmail(emailContent);

        // SMS Removed as per request
        res.json({
            success: true,
            message: 'Urgent notification processed (Email-only log)',
            emailPreview: emailContent
        });

    } catch (error) {
        console.error('Failed to send urgent notification:', error);
        res.status(500).json({ error: 'Failed to send notification' });
    }
});

export default router;

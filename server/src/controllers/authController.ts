import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export const login = async (req: Request, res: Response) => {
    const { email, password, role } = req.body;
    console.log(`[LOGIN_DEBUG] Attempting login for: ${email}, role: ${role}`);

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                patientProfile: true,
                ashaProfile: true,
                doctorProfile: true,
                pharmacistProfile: true
            }
        });

        if (!user) {
            console.log('[LOGIN_DEBUG] User not found');
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log(`[LOGIN_DEBUG] User found: ID=${user.id}, Role=${user.role}`);

        // Optional: If role is provided, verify it matches
        if (role && user.role !== role) {
            console.log(`[LOGIN_DEBUG] Role mismatch: Expected ${role}, Found ${user.role}`);
            return res.status(401).json({ error: `Invalid role. This account is registered as a ${user.role}` });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            console.log('[LOGIN_DEBUG] Password mismatch');
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log('[LOGIN_DEBUG] Credentials valid. Generating token...');

        const token = jwt.sign(
            { userId: user.id, role: user.role, email: user.email },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Get specific profile ID
        let profileId = null;
        if (user.role === 'PATIENT' && user.patientProfile) profileId = user.patientProfile.id;
        if (user.role === 'ASHA' && user.ashaProfile) profileId = user.ashaProfile.id;
        if (user.role === 'DOCTOR' && user.doctorProfile) profileId = user.doctorProfile.id;
        if (user.role === 'PHARMACIST' && user.pharmacistProfile) profileId = user.pharmacistProfile.id;

        console.log(`[LOGIN_DEBUG] Sending success response with ProfileID=${profileId}`);

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileId
            }
        });
    } catch (error) {
        console.error('[LOGIN_DEBUG] Exception:', error);
        res.status(500).json({ error: 'Login failed', details: (error as any).message });
    }
};

export const register = async (req: Request, res: Response) => {
    const { name, email, password, role = 'PATIENT' } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Transaction to create user and profile
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role
                }
            });

            if (role === 'PATIENT') {
                await tx.patient.create({
                    data: {
                        userId: user.id,
                        contact: req.body.contact,
                        address: req.body.address,
                        gender: req.body.gender || 'Other',
                        dateOfBirth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : null
                    }
                });
            } else if (role === 'DOCTOR') {
                await tx.doctor.create({
                    data: {
                        userId: user.id
                    }
                });
            } else if (role === 'ASHA') {
                await tx.ashaWorker.create({
                    data: {
                        userId: user.id
                    }
                });
            } else if (role === 'PHARMACIST') {
                await tx.pharmacist.create({
                    data: {
                        userId: user.id
                    }
                });
            }

            return user;
        });

        // Generate token for immediate login
        const token = jwt.sign(
            { userId: result.id, role: result.role, email: result.email },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            message: 'User registered successfully',
            token,
            user: {
                id: result.id,
                name: result.name,
                email: result.email,
                role: result.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Registration failed or email exists' });
    }
};

export const deleteAccount = async (req: Request, res: Response) => {
    // Ideally use data from auth middleware (req.user)
    const userId = (req as any).user?.userId;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    try {
        // Find user to check roles and delete related profiles first if cascade isn't set
        // Start transaction
        await prisma.$transaction(async (tx) => {
            // Delete profiles (Prisma relation usually handles cascade if configured, but let's be safe)
            // Or just delete user and let cascading happen if schema supports it.
            // Our schema doesn't explicitly state onDelete: Cascade, so we might need manual cleanup or rely on SQLite constraints.
            // For Safety, delete profile first.

            await tx.patient.deleteMany({ where: { userId } });
            await tx.doctor.deleteMany({ where: { userId } });
            await tx.ashaWorker.deleteMany({ where: { userId } });
            await tx.pharmacist.deleteMany({ where: { userId } });

            await tx.user.delete({ where: { id: userId } });
        });

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Delete failed' });
    }
};

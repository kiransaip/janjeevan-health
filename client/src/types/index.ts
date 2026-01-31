export type Role = 'PATIENT' | 'ASHA' | 'DOCTOR' | 'PHARMACIST' | 'ADMIN';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    profileId?: string;
}

export interface Patient {
    id: string;
    userId: string;
    user: User;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
    contact?: string;
    history?: Record<string, unknown>;
}

export interface Appointment {
    id: string;
    patientId: string;
    patient: Patient;
    doctorId?: string;
    doctor?: { user: User };
    status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
    datetime: string;
    symptoms?: string;
    diagnosis?: string;
    notes?: string;
}

export interface Prescription {
    id: string;
    appointmentId: string;
    patientId: string;
    patient?: Patient;
    appointment?: Appointment;
    medications: string; // JSON
    status: 'PENDING' | 'DISPENSED';
    dispensedBy?: string;
    dispensedAt?: string;
    createdAt: string;
}

'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/utils/api';
import { useRouter } from 'next/navigation';

interface FollowUp {
    id: string;
    scheduledDate: string;
    status: string;
    notes?: string;
    appointment: {
        patient: {
            user: {
                name: string;
            };
            contact: string;
        };
        symptoms: string;
    };
}

export default function FollowUpPage() {
    const router = useRouter();
    const [followUps, setFollowUps] = useState<FollowUp[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFollowUps();
    }, []);

    const loadFollowUps = async () => {
        try {
            const data = await api.get('/followups');
            setFollowUps(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const completeFollowUp = async (id: string) => {
        try {
            await api.put(`/followups/${id}`, {
                status: 'COMPLETED',
                notes: 'Follow-up completed'
            });
            loadFollowUps();
            alert('Follow-up marked as completed');
        } catch (error) {
            console.error(error);
            alert('Failed to update follow-up');
        }
    };

    const cancelFollowUp = async (id: string) => {
        try {
            await api.put(`/followups/${id}`, {
                status: 'CANCELLED'
            });
            loadFollowUps();
        } catch (error) {
            console.error(error);
            alert('Failed to cancel follow-up');
        }
    };

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    const pendingFollowUps = followUps.filter(f => f.status === 'PENDING');
    const completedFollowUps = followUps.filter(f => f.status === 'COMPLETED');

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Follow-up Management</h1>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-blue-700">📅 Pending Follow-ups</h2>
                {pendingFollowUps.length === 0 ? (
                    <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
                        No pending follow-ups
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {pendingFollowUps.map((followUp) => (
                            <div key={followUp.id} className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-800">
                                            {followUp.appointment.patient.user.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Contact: {followUp.appointment.patient.contact}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-2">
                                            <strong>Original Symptoms:</strong> {followUp.appointment.symptoms}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-2">
                                            <strong>Scheduled:</strong> {new Date(followUp.scheduledDate).toLocaleDateString()}
                                        </p>
                                        {followUp.notes && (
                                            <p className="text-sm text-gray-600 mt-2">
                                                <strong>Notes:</strong> {followUp.notes}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => completeFollowUp(followUp.id)}
                                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            ✓ Complete
                                        </button>
                                        <button
                                            onClick={() => cancelFollowUp(followUp.id)}
                                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            ✗ Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-4 text-green-700">✓ Completed Follow-ups</h2>
                {completedFollowUps.length === 0 ? (
                    <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
                        No completed follow-ups yet
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {completedFollowUps.map((followUp) => (
                            <div key={followUp.id} className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-gray-700">
                                            {followUp.appointment.patient.user.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Completed on: {new Date(followUp.scheduledDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className="text-green-600 font-semibold">✓ Completed</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

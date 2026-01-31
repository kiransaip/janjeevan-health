'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import { useRouter, useParams } from 'next/navigation';

export default function VideoCallPage() {
    const router = useRouter();
    const params = useParams();
    const appointmentId = params.appointmentId as string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [appointment, setAppointment] = useState<any>(null);
    const [callStarted, setCallStarted] = useState(false);

    useEffect(() => {
        loadAppointment();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appointmentId]);

    const loadAppointment = async () => {
        try {
            const apt = await api.get(`/appointments/${appointmentId}`);
            setAppointment(apt);
        } catch (error) {
            console.error(error);
            alert('Failed to load appointment');
        }
    };

    const startCall = async () => {
        try {
            // Generate a simple video call URL (can be replaced with real WebRTC or Jitsi)
            const videoCallUrl = `https://meet.jit.si/janjeevan-${appointmentId}`;

            await api.put(`/appointments/${appointmentId}`, {
                videoCallUrl,
                status: 'APPROVED'
            });

            setCallStarted(true);

            // Open video call in new window
            window.open(videoCallUrl, '_blank');
        } catch (error) {
            console.error(error);
            alert('Failed to start video call');
        }
    };

    const endCall = () => {
        alert('Call ended. Doctor will provide prescription.');
        router.push('/dashboard/asha');
    };

    if (!appointment) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Video Consultation</h1>

            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-xl font-semibold mb-4">Patient Information</h2>
                <p><strong>Name:</strong> {appointment.patient?.user?.name}</p>
                <p><strong>Contact:</strong> {appointment.patient?.contact}</p>
                <p><strong>Symptoms:</strong> {appointment.symptoms}</p>
            </div>

            {appointment.aiAnalysis && (
                <div className="bg-red-50 p-6 rounded-lg shadow-lg mb-6 border-2 border-red-500">
                    <h2 className="text-xl font-semibold mb-4 text-red-800">⚠️ AI Analysis - Serious Condition</h2>
                    <div className="text-gray-700">
                        {JSON.parse(appointment.aiAnalysis).recommendations.map((rec: string, idx: number) => (
                            <p key={idx} className="mb-2">• {rec}</p>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-blue-50 p-8 rounded-lg shadow-lg text-center">
                {!callStarted ? (
                    <div>
                        <div className="mb-6">
                            <div className="w-32 h-32 bg-blue-600 rounded-full mx-auto flex items-center justify-center mb-4">
                                <span className="text-6xl">🎥</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Ready to Connect</h3>
                            <p className="text-gray-600">Click below to start video consultation with doctor</p>
                        </div>

                        <button
                            onClick={startCall}
                            className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors"
                        >
                            🎥 Start Video Call
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="mb-6">
                            <div className="w-32 h-32 bg-green-600 rounded-full mx-auto flex items-center justify-center mb-4 animate-pulse">
                                <span className="text-6xl">📞</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Call in Progress</h3>
                            <p className="text-gray-600">Video call window opened in new tab</p>
                            <p className="text-sm text-gray-500 mt-2">Doctor: {appointment.doctor?.user?.name || 'Waiting for doctor to join...'}</p>
                        </div>

                        <div className="bg-white p-4 rounded-lg mb-6">
                            <p className="text-sm text-gray-600">
                                <strong>Call URL:</strong> {appointment.videoCallUrl}
                            </p>
                        </div>

                        <button
                            onClick={endCall}
                            className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors"
                        >
                            End Call & Return to Dashboard
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-300">
                <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> After the consultation, the doctor will create a prescription.
                    You can then dispense medicines and schedule follow-up from the dashboard.
                </p>
            </div>
        </div>
    );
}

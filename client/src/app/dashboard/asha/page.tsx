'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/utils/api';
import { Patient } from '@/types';
import Link from 'next/link';

export default function AshaDashboard() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [followUpsCount, setFollowUpsCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [patientsData, followUpsData] = await Promise.all([
                api.get('/patients'),
                api.get('/followups')
            ]);
            setPatients(patientsData);
            setFollowUpsCount(followUpsData.filter((f: { status: string }) => f.status === 'PENDING').length);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickCall = async () => {
        if (!confirm('Start Emergency Video Call? This will send an SMS invite to the Doctor.')) return;
        try {
            const res = await api.post('/video/invite', {});
            // Open Jitsi link in new tab
            window.open(res.link, '_blank');
        } catch (err) {
            console.error(err);
            alert('Failed to send invite to doctor');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">ASHA Worker Dashboard</h1>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <button
                    onClick={handleQuickCall}
                    className="bg-red-600 text-white p-6 rounded-lg shadow-lg hover:bg-red-700 transition-colors text-left"
                >
                    <div className="text-4xl mb-2">📞</div>
                    <h3 className="text-lg font-semibold">Emergency Call</h3>
                    <p className="text-sm opacity-90">Instant Video Consult</p>
                </button>

                <Link href="/dashboard/asha/register" className="bg-blue-600 text-white p-6 rounded-lg shadow-lg hover:bg-blue-700 transition-colors">
                    <div className="text-4xl mb-2">➕</div>
                    <h3 className="text-lg font-semibold">Register Patient</h3>
                    <p className="text-sm opacity-90">Add new patient</p>
                </Link>

                <Link href="/dashboard/asha/symptom-checker" className="bg-green-600 text-white p-6 rounded-lg shadow-lg hover:bg-green-700 transition-colors">
                    <div className="text-4xl mb-2">🩺</div>
                    <h3 className="text-lg font-semibold">Symptom Checker</h3>
                    <p className="text-sm opacity-90">AI-powered analysis</p>
                </Link>

                <Link href="/dashboard/asha/followup" className="bg-purple-600 text-white p-6 rounded-lg shadow-lg hover:bg-purple-700 transition-colors relative">
                    <div className="text-4xl mb-2">📅</div>
                    <h3 className="text-lg font-semibold">Follow-ups</h3>
                    <p className="text-sm opacity-90">Manage patient care</p>
                    {followUpsCount > 0 && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                            {followUpsCount}
                        </span>
                    )}
                </Link>

                <div className="bg-gray-600 text-white p-6 rounded-lg shadow-lg">
                    <div className="text-4xl mb-2">👥</div>
                    <h3 className="text-lg font-semibold">Total Patients</h3>
                    <p className="text-3xl font-bold mt-2">{patients.length}</p>
                </div>
            </div>

            {/* Patients Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b">
                    <h2 className="text-xl font-bold text-gray-800">My Patients</h2>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Age
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Contact
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={4} className="p-4 text-center">Loading...</td></tr>
                        ) : patients.length === 0 ? (
                            <tr><td colSpan={4} className="p-4 text-center">No patients found.</td></tr>
                        ) : (
                            patients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{patient.user?.name || 'Unknown'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {patient.dateOfBirth ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {patient.contact}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link href={`/dashboard/asha/symptom-checker?patientId=${patient.id}`} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 inline-block">
                                            🩺 Check Symptoms
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

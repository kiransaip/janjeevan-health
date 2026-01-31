'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/utils/api';
import { Appointment } from '@/types';
import Link from 'next/link';

export default function DoctorDashboard() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const data = await api.get('/appointments');
            setAppointments(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Patient Queue</h1>

            <div className="bg-white rounded shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Time
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Patient
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Symptoms
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr>
                        ) : appointments.length === 0 ? (
                            <tr><td colSpan={5} className="p-4 text-center">No pending appointments.</td></tr>
                        ) : (
                            appointments.map((apt) => (
                                <tr key={apt.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(apt.datetime).toLocaleTimeString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{apt.patient?.user?.name || 'Unknown'}</div>
                                        <div className="text-xs text-gray-500">{apt.patient?.gender}, {apt.patient?.dateOfBirth && new Date().getFullYear() - new Date(apt.patient.dateOfBirth).getFullYear()}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                        {(() => {
                                            try {
                                                const parsed = JSON.parse(apt.symptoms);
                                                return parsed.description || parsed;
                                            } catch (e) {
                                                return apt.symptoms;
                                            }
                                        })()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${apt.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                            apt.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                            {apt.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {apt.status !== 'COMPLETED' && (
                                            <Link href={`/dashboard/doctor/consult/${apt.id}`} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded">
                                                Consult
                                            </Link>
                                        )}
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

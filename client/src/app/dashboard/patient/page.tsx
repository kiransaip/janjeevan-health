'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';

export default function PatientDashboard() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [appointments, setAppointments] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [prescriptions, setPrescriptions] = useState<any[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apts = await api.get('/appointments');
                const rx = await api.get('/prescriptions');
                setAppointments(apts);
                setPrescriptions(rx);
            } catch (e) {
                console.error(e);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}</h1>
                <p className="text-gray-600">Your health dashboard</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-bold mb-4 text-blue-800">Your Appointments</h2>
                    {appointments.length === 0 ? <p className="text-gray-500">No appointments found.</p> : (
                        <ul className="space-y-4">
                            {appointments.map(apt => (
                                <li key={apt.id} className="border-b last:border-0 pb-3">
                                    <div className="flex justify-between">
                                        <span className="font-semibold">{new Date(apt.datetime).toLocaleDateString()}</span>
                                        <span className={`text-sm px-2 rounded-full ${apt.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {apt.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">Dr. {apt.doctor?.user?.name || 'TBD'}</p>
                                    {apt.diagnosis && <p className="text-sm mt-1"><strong>Diagnosis:</strong> {apt.diagnosis}</p>}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-bold mb-4 text-green-800">Your Prescriptions</h2>
                    {prescriptions.length === 0 ? <p className="text-gray-500">No prescriptions found.</p> : (
                        <ul className="space-y-4">
                            {prescriptions.map(p => (
                                <li key={p.id} className="border-b last:border-0 pb-3">
                                    <div className="font-medium">Prescription from {new Date(p.createdAt).toLocaleDateString()}</div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        Status: <span className={p.status === 'ISSUED' ? 'text-green-600 font-bold' : 'text-orange-500'}>{p.status}</span>
                                    </div>
                                    <div className="mt-2 text-sm bg-gray-50 p-2 rounded">
                                        {JSON.parse(p.medications).map((m: { name: string; dosage: string }, i: number) => (
                                            <div key={i}>• {m.name} ({m.dosage})</div>
                                        ))}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

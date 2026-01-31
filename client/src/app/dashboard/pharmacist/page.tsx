'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/utils/api';

import { Prescription } from '@/types';

export default function PharmacistDashboard() {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const fetchPrescriptions = async () => {
        try {
            const data = await api.get('/prescriptions');
            setPrescriptions(data);
        } catch (_err) {
            console.error(_err);
        } finally {
            setLoading(false);
        }
    };

    const fulfillOrder = async (id: string) => {
        try {
            await api.put(`/prescriptions/${id}/fulfill`, {});
            fetchPrescriptions(); // Refresh
        } catch {
            alert('Failed to fulfill');
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Pharmacy Dashboard</h1>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <a href="/dashboard/pharmacist/inventory" className="bg-blue-600 text-white p-4 rounded-lg shadow hover:bg-blue-700 text-center">
                    <div className="text-3xl mb-2">📦</div>
                    <h3 className="font-semibold">Inventory</h3>
                </a>
                <a href="/dashboard/pharmacist/reorders" className="bg-orange-600 text-white p-4 rounded-lg shadow hover:bg-orange-700 text-center">
                    <div className="text-3xl mb-2">🔄</div>
                    <h3 className="font-semibold">Reorders</h3>
                </a>
                <div className="bg-gray-600 text-white p-4 rounded-lg shadow text-center">
                    <div className="text-3xl mb-2">📋</div>
                    <h3 className="font-semibold">Prescriptions</h3>
                    <p className="text-2xl font-bold mt-1">{prescriptions.length}</p>
                </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-4">Pending Prescriptions</h2>

            <div className="grid gap-6">
                {loading ? (
                    <div>Loading...</div>
                ) : prescriptions.length === 0 ? (
                    <div>No active prescriptions.</div>
                ) : (
                    prescriptions.map((p) => (
                        <div key={p.id} className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold">{p.patient?.user?.name}</h3>
                                    <p className="text-sm text-gray-500">Dr. {p.appointment?.doctor?.user?.name}</p>
                                    <div className="mt-4">
                                        <h4 className="font-semibold text-gray-700">Medications:</h4>
                                        <ul className="list-disc pl-5 mt-1 text-sm text-gray-600">
                                            {p.medications && JSON.parse(p.medications).map((m: { name: string; quantity: number; unit?: string; dosage?: string }, idx: number) => (
                                                <li key={idx}>{m.name} - {m.quantity} {m.unit || 'units'} ({m.dosage})</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-sm font-bold mb-4 ${p.status === 'DISPENSED' ? 'text-green-600' : 'text-orange-600'}`}>
                                        {p.status}
                                    </div>
                                    {p.status === 'PENDING' && (
                                        <button
                                            onClick={() => fulfillOrder(p.id)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                        >
                                            Fulfill Order
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

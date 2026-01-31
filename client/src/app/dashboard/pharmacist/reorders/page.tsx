'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/utils/api';

interface ReorderRequest {
    id: string;
    quantity: number;
    status: string;
    createdAt: string;
    inventory: {
        name: string;
        stock: number;
        unit: string;
    };
}

export default function ReorderManagementPage() {
    const [reorders, setReorders] = useState<ReorderRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReorders();
    }, []);

    const loadReorders = async () => {
        try {
            const data = await api.get('/inventory/reorders');
            setReorders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            await api.put(`/inventory/reorder/${id}`, { status });
            loadReorders();
            alert(`Reorder marked as ${status}`);
        } catch (error) {
            console.error(error);
            alert('Failed to update reorder status');
        }
    };

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    const pendingReorders = reorders.filter(r => r.status === 'PENDING');
    const orderedReorders = reorders.filter(r => r.status === 'ORDERED');
    const receivedReorders = reorders.filter(r => r.status === 'RECEIVED');

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Reorder Management</h1>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-red-700">🔴 Pending Reorders</h2>
                {pendingReorders.length === 0 ? (
                    <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
                        No pending reorders
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {pendingReorders.map((reorder) => (
                            <div key={reorder.id} className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-800">
                                            {reorder.inventory.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Current Stock: {reorder.inventory.stock} {reorder.inventory.unit}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Reorder Quantity: {reorder.quantity} {reorder.inventory.unit}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Requested: {new Date(reorder.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => updateStatus(reorder.id, 'ORDERED')}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Mark as Ordered
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-blue-700">📦 Ordered (In Transit)</h2>
                {orderedReorders.length === 0 ? (
                    <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
                        No orders in transit
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {orderedReorders.map((reorder) => (
                            <div key={reorder.id} className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-800">
                                            {reorder.inventory.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Quantity: {reorder.quantity} {reorder.inventory.unit}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => updateStatus(reorder.id, 'RECEIVED')}
                                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            Mark as Received
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-4 text-green-700">✓ Received</h2>
                {receivedReorders.length === 0 ? (
                    <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
                        No received orders yet
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {receivedReorders.map((reorder) => (
                            <div key={reorder.id} className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-gray-700">
                                            {reorder.inventory.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Quantity: {reorder.quantity} {reorder.inventory.unit}
                                        </p>
                                    </div>
                                    <span className="text-green-600 font-semibold">✓ Received & Stock Updated</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

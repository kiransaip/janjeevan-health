'use client';

import React, { useState } from 'react';
import { api } from '@/utils/api';
import { useRouter } from 'next/navigation';

export default function RegisterPatient() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: 'Male',
        contact: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/patients', {
                ...formData,
                age: parseInt(formData.age),
            });
            if (res.patientId) {
                router.push('/dashboard/asha');
            }
        } catch {
            alert('Failed to register');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
            <h1 className="text-2xl font-bold mb-6 text-black">Register New Patient</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-black">Full Name</label>
                        <input required className="w-full border p-2 rounded text-black font-medium" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-black">Age</label>
                        <input required type="number" className="w-full border p-2 rounded text-black font-medium" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-black">Gender</label>
                        <select className="w-full border p-2 rounded text-black font-medium" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-black">Contact Number</label>
                        <input required className="w-full border p-2 rounded text-black font-medium" value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-black">Address</label>
                    <textarea required className="w-full border p-2 rounded text-black font-medium" rows={3} value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                </div>

                <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700">
                    {loading ? 'Registering...' : 'Register Patient'}
                </button>
            </form>
        </div>
    );
}

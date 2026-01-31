'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import { useRouter, useParams } from 'next/navigation';

interface AIAnalysis {
    severity: 'MINOR' | 'SEVERE';
    recommendations: string[];
    urgency: 'LOW' | 'MEDIUM' | 'HIGH';
    suggestedMedications?: string[];
    requiresDoctorConsultation: boolean;
}

interface Medication {
    name: string;
    dosage: string;
    quantity: number;
}

export default function DispensePage() {
    const router = useRouter();
    const params = useParams();
    const appointmentId = params.appointmentId as string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [appointment, setAppointment] = useState<any>(null);
    const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [inventory, setInventory] = useState<any[]>([]);
    const [selectedMedications, setSelectedMedications] = useState<Medication[]>([]);
    const [advice, setAdvice] = useState('');
    const [followUpDate, setFollowUpDate] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appointmentId]);

    const loadData = async () => {
        try {
            const apt = await api.get(`/appointments/${appointmentId}`);
            setAppointment(apt);

            if (apt.aiAnalysis) {
                const analysis = JSON.parse(apt.aiAnalysis);
                setAiAnalysis(analysis);

                // Pre-populate advice from AI recommendations
                setAdvice(analysis.recommendations.join('\n'));

                // Pre-select suggested medications
                if (analysis.suggestedMedications) {
                    const invData = await api.get('/inventory');
                    setInventory(invData);

                    const preSelected = analysis.suggestedMedications.map((medName: string) => ({
                        name: medName,
                        dosage: '1 tablet',
                        quantity: 10
                    }));
                    setSelectedMedications(preSelected);
                }
            }

            const invData = await api.get('/inventory');
            setInventory(invData);
        } catch (error) {
            console.error(error);
            alert('Failed to load appointment data');
        }
    };

    const addMedication = () => {
        setSelectedMedications([...selectedMedications, { name: '', dosage: '', quantity: 1 }]);
    };

    const updateMedication = (index: number, field: keyof Medication, value: string | number) => {
        const updated = [...selectedMedications];
        updated[index] = { ...updated[index], [field]: value };
        setSelectedMedications(updated);
    };

    const removeMedication = (index: number) => {
        setSelectedMedications(selectedMedications.filter((_, i) => i !== index));
    };

    const checkInventory = async () => {
        const lowStock = [];
        for (const med of selectedMedications) {
            const item = inventory.find(i => i.name === med.name);
            if (item && item.stock < med.quantity) {
                lowStock.push(med.name);

                // Auto-create reorder request
                await api.post('/inventory/reorder', {
                    inventoryId: item.id,
                    quantity: 50 // Default reorder quantity
                });
            }
        }

        if (lowStock.length > 0) {
            alert(`Low stock detected for: ${lowStock.join(', ')}. Reorder requests created.`);
        }

        return lowStock.length === 0;
    };

    const completeDispensing = async () => {
        if (!advice) return alert('Please provide advice');
        if (selectedMedications.length === 0) return alert('Please select at least one medication');
        if (!followUpDate) return alert('Please schedule follow-up date');

        setLoading(true);

        try {
            // Check inventory
            await checkInventory();

            // Create prescription
            await api.post('/prescriptions', {
                appointmentId,
                patientId: appointment.patientId,
                medications: selectedMedications
            });

            // Update appointment with advice
            await api.put(`/appointments/${appointmentId}`, {
                status: 'COMPLETED',
                notes: advice
            });

            // Schedule follow-up
            await api.post('/followups', {
                appointmentId,
                scheduledDate: new Date(followUpDate),
                notes: 'Routine follow-up after treatment'
            });

            // Update inventory stock
            for (const med of selectedMedications) {
                const item = inventory.find(i => i.name === med.name);
                if (item) {
                    await api.post('/inventory/update', {
                        name: item.name,
                        stock: item.stock - med.quantity,
                        unit: item.unit
                    });
                }
            }

            alert('Treatment completed successfully! Follow-up scheduled.');
            router.push('/dashboard/asha');
        } catch (error) {
            console.error(error);
            alert('Failed to complete dispensing');
        } finally {
            setLoading(false);
        }
    };

    if (!appointment) {
        return <div className="p-6 text-black font-bold">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="inline-block text-4xl font-black tracking-tight text-[#0f172a] bg-[#d4ff00] py-3 px-8 rounded-2xl shadow-[0_4px_20px_0_rgba(212,255,0,0.4)] border-2 border-[#0f172a]/20 mb-8">
                Provide Advice & Medicines
            </h1>

            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-xl font-semibold mb-4 text-black border-b pb-2 border-[#0f172a]/10">Patient Information</h2>
                <p className="text-black mb-1"><strong>Name:</strong> {appointment.patient?.user?.name}</p>
                <p className="text-black"><strong>Symptoms:</strong> {appointment.symptoms}</p>
            </div>

            {aiAnalysis && (
                <div className="bg-blue-50 p-6 rounded-lg shadow mb-6 border-l-4 border-blue-600">
                    <h2 className="text-xl font-semibold mb-4 text-black">AI Analysis</h2>
                    <p className="mb-2 text-black font-medium"><strong>Severity:</strong> {aiAnalysis.severity}</p>
                    <p className="mb-2 text-black font-medium"><strong>Urgency:</strong> {aiAnalysis.urgency}</p>
                    <div className="text-black">
                        <strong className="block mb-2 text-sm uppercase tracking-wider text-black">Recommendations:</strong>
                        <ul className="list-disc list-inside mt-2 space-y-2">
                            {aiAnalysis.recommendations.map((rec, idx) => (
                                <li key={idx} className="text-black font-medium">{rec}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-xl font-semibold mb-4 text-black">Advice to Patient</h2>
                <textarea
                    value={advice}
                    onChange={(e) => setAdvice(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg h-32 text-black font-medium focus:ring-2 focus:ring-[#d4ff00] focus:border-black outline-none transition-all"
                    placeholder="Provide care instructions and advice..."
                />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-black">Medications</h2>
                    <button
                        onClick={addMedication}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-bold transition-all shadow-md"
                    >
                        + Add Medication
                    </button>
                </div>

                {selectedMedications.map((med, idx) => (
                    <div key={idx} className="flex gap-4 mb-4 items-center">
                        <select
                            value={med.name}
                            onChange={(e) => updateMedication(idx, 'name', e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded text-black font-medium"
                        >
                            <option value="">Select Medicine</option>
                            {inventory.map((item) => (
                                <option key={item.id} value={item.name}>
                                    {item.name} (Stock: {item.stock})
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            value={med.dosage}
                            onChange={(e) => updateMedication(idx, 'dosage', e.target.value)}
                            placeholder="Dosage"
                            className="w-32 p-2 border border-gray-300 rounded text-black"
                        />
                        <input
                            type="number"
                            value={med.quantity}
                            onChange={(e) => updateMedication(idx, 'quantity', parseInt(e.target.value))}
                            placeholder="Qty"
                            className="w-20 p-2 border border-gray-300 rounded text-black"
                            min="1"
                        />
                        <button
                            onClick={() => removeMedication(idx)}
                            className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 font-bold"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-xl font-semibold mb-4 text-black">Schedule Follow-up</h2>
                <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-black font-bold"
                    min={new Date().toISOString().split('T')[0]}
                />
            </div>

            <button
                onClick={completeDispensing}
                disabled={loading}
                className="w-full bg-green-700 text-white py-4 rounded-xl font-black text-lg hover:bg-green-800 disabled:bg-gray-400 transition-all shadow-lg"
            >
                {loading ? 'Processing...' : 'Complete Treatment & Schedule Follow-up'}
            </button>
        </div>
    );
}

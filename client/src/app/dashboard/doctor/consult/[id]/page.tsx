'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/utils/api';
import { useParams, useRouter } from 'next/navigation';

export default function ConsultationPage() {
    const { id } = useParams(); // Appointment ID
    const router = useRouter();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [appointment, setAppointment] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [inventory, setInventory] = useState<any[]>([]);

    const [diagnosis, setDiagnosis] = useState('');
    const [notes] = useState('');

    // Prescription Form
    const [selectedMed, setSelectedMed] = useState('');
    const [dosage, setDosage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [medsList, setMedsList] = useState<{ name: string; dosage: string; quantity: number }[]>([]);

    useEffect(() => {
        if (id) {
            // Fetch single appointment with patient details
            api.get(`/appointments/${id}`).then((apt) => {
                setAppointment(apt);
                // If already approved, good. If pending, auto approve
                if (apt && apt.status === 'PENDING') {
                    api.put(`/appointments/${id}`, { status: 'APPROVED' });
                }
            });
            api.get('/inventory').then(setInventory);
        }
    }, [id]);

    const addMedication = () => {
        if (!selectedMed || !dosage) return;
        setMedsList([...medsList, { name: selectedMed, dosage, quantity }]);
        setSelectedMed('');
        setDosage('');
        setQuantity(1);
    };

    const completeConsultation = async () => {
        try {
            // 1. Update Appointment
            await api.put(`/appointments/${id}`, {
                status: 'COMPLETED',
                diagnosis,
                notes
            });

            // 2. Create Prescription
            if (medsList.length > 0) {
                await api.post('/prescriptions', {
                    appointmentId: id,
                    patientId: appointment.patientId,
                    medications: medsList
                });
            }

            alert('Consultation Completed');
            router.push('/dashboard/doctor');
        } catch {
            alert('Failed to complete');
        }
    };

    if (!appointment) return <div className="p-6">Loading...</div>;

    const aiAnalysis = appointment.aiAnalysis ? JSON.parse(appointment.aiAnalysis) : null;

    return (
        <div className="grid grid-cols-3 gap-6 h-full">
            {/* Left: Patient Info */}
            <div className="col-span-1 bg-white p-6 rounded shadow space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Patient Details</h2>
                    <div className="mt-4 space-y-2">
                        <p><span className="font-semibold">Name:</span> {appointment.patient?.user?.name}</p>
                        <p><span className="font-semibold">Age/Gender:</span> {appointment.patient?.gender}</p>
                        <p><span className="font-semibold">Contact:</span> {appointment.patient?.contact}</p>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <h3 className="font-bold text-red-600">Reported Symptoms</h3>
                    <p className="mt-2 text-gray-700 bg-red-50 p-3 rounded">{appointment.symptoms}</p>
                </div>

                {aiAnalysis && (
                    <div className="border-t pt-4">
                        <h3 className="font-bold text-gray-800 mb-2">🤖 AI Analysis</h3>
                        <div className={`p-4 rounded-lg ${aiAnalysis.severity === 'SEVERE' ? 'bg-red-50 border-2 border-red-500' : 'bg-green-50 border-2 border-green-500'}`}>
                            <p className="font-semibold mb-2">
                                Severity: <span className={aiAnalysis.severity === 'SEVERE' ? 'text-red-700' : 'text-green-700'}>{aiAnalysis.severity}</span>
                            </p>
                            <p className="font-semibold mb-2">Urgency: {aiAnalysis.urgency}</p>
                            <div className="mt-2">
                                <p className="font-semibold text-sm">Recommendations:</p>
                                <ul className="list-disc list-inside text-sm mt-1">
                                    {aiAnalysis.recommendations?.map((rec: string, idx: number) => (
                                        <li key={idx}>{rec}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                <div className="border-t pt-4">
                    <h3 className="font-bold text-gray-800">Video Call</h3>
                    <div className="mt-2 h-48 bg-gray-900 rounded flex items-center justify-center text-white">
                        [Video Stream Placeholder]
                    </div>
                    <div className="mt-2 flex justify-center space-x-4">
                        <button className="p-2 bg-red-600 rounded-full text-white">End Call</button>
                        <button className="p-2 bg-gray-600 rounded-full text-white">Mute</button>
                    </div>
                </div>
            </div>

            {/* Right: Diagnosis & Prescription */}
            <div className="col-span-2 bg-white p-6 rounded shadow space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Diagnosis & Treatment</h2>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Clinical Diagnosis</label>
                    <textarea
                        className="w-full border p-2 rounded mt-1"
                        rows={2}
                        value={diagnosis}
                        onChange={e => setDiagnosis(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Digital Prescription</label>
                    <div className="flex gap-2 mt-1">
                        <select
                            className="border p-2 rounded flex-1"
                            value={selectedMed}
                            onChange={e => setSelectedMed(e.target.value)}
                        >
                            <option value="">Select Medicine</option>
                            {inventory.map(item => (
                                <option key={item.id} value={item.name}>{item.name} (Stock: {item.stock})</option>
                            ))}
                        </select>
                        <input
                            placeholder="Dosage (e.g. 1-0-1)"
                            className="border p-2 rounded w-32"
                            value={dosage}
                            onChange={e => setDosage(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Qty"
                            className="border p-2 rounded w-20"
                            value={quantity}
                            onChange={e => setQuantity(parseInt(e.target.value))}
                        />
                        <button
                            onClick={addMedication}
                            className="bg-blue-600 text-white px-4 rounded"
                        >
                            Add
                        </button>
                    </div>

                    {/* RX List */}
                    <div className="mt-4 bg-gray-50 p-4 rounded min-h-[100px]">
                        {medsList.length === 0 && <p className="text-gray-400 italic">No medicines added.</p>}
                        <ul>
                            {medsList.map((m, i) => (
                                <li key={i} className="flex justify-between border-b py-2">
                                    <span>{m.name} - {m.quantity} units ({m.dosage})</span>
                                    <button onClick={() => setMedsList(medsList.filter((_, idx) => idx !== i))} className="text-red-500">x</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-4 border-t flex justify-end">
                    <button
                        onClick={completeConsultation}
                        className="bg-green-600 text-white px-8 py-3 rounded font-bold hover:bg-green-700 shadow-lg"
                    >
                        Sign & Send Prescription
                    </button>
                </div>
            </div>
        </div>
    );
}

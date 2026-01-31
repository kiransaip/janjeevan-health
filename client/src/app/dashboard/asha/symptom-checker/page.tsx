'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import { useRouter, useSearchParams } from 'next/navigation';

interface Hospital {
    name: string;
    location: string;
    specialty: string;
    distance: string;
    mapUrl: string;
}

interface AIAnalysis {
    severity: 'MINOR' | 'SEVERE';
    recommendations: string[];
    urgency: 'LOW' | 'MEDIUM' | 'HIGH';
    suggestedMedications?: string[];
    requiresDoctorConsultation: boolean;
    suggestedHospitals?: Hospital[];
}

// Map symptoms to specialties
const specialtyMapping: { [key: string]: string } = {
    'heart': 'Cardiology',
    'chest': 'Cardiology',
    'breath': 'Pulmonology',
    'child': 'Pediatrics',
    'brain': 'Neurology',
    'mental': 'Psychiatry',
    'cancer': 'Oncology',
    'bone': 'Orthopaedics',
    'injury': 'Trauma',
    'surgery': 'Surgery'
};

const allHospitals: Hospital[] = [
    { name: 'AIIMS Delhi', location: 'New Delhi', specialty: 'General & Multi-specialty', distance: '2.4 km', mapUrl: 'https://maps.google.com/?q=AIIMS+Delhi&t=k&layer=t' },
    { name: 'Apollo Hospitals Greams Road', location: 'Chennai', specialty: 'Cardiology', distance: '3.1 km', mapUrl: 'https://maps.google.com/?q=Apollo+Chennai&t=k&layer=t' },
    { name: 'NIMHANS', location: 'Bengaluru', specialty: 'Neurology & Psychiatry', distance: '1.8 km', mapUrl: 'https://maps.google.com/?q=NIMHANS+Bangalore&t=k&layer=t' },
    { name: 'AIG Hospitals', location: 'Hyderabad', specialty: 'Gastroenterology', distance: '4.5 km', mapUrl: 'https://maps.google.com/?q=AIG+Hyderabad&t=k&layer=t' },
    { name: 'Aster Medcity', location: 'Kochi', specialty: 'Multi-specialty', distance: '5.2 km', mapUrl: 'https://maps.google.com/?q=Aster+Medcity+Kochi&t=k&layer=t' },
    { name: 'CMC Vellore', location: 'Vellore', specialty: 'Tertiary Care', distance: '6.0 km', mapUrl: 'https://maps.google.com/?q=CMC+Vellore&t=k&layer=t' },
    { name: 'Fortis Memorial', location: 'Gurugram', specialty: 'Oncology', distance: '2.9 km', mapUrl: 'https://maps.google.com/?q=Fortis+Memorial+Gurugram&t=k&layer=t' },
    { name: 'Tata Memorial', location: 'Mumbai', specialty: 'Oncology', distance: '3.5 km', mapUrl: 'https://maps.google.com/?q=Tata+Memorial+Mumbai&t=k&layer=t' },
    { name: 'Manipal Hospital', location: 'Bengaluru', specialty: 'Multi-specialty', distance: '1.2 km', mapUrl: 'https://maps.google.com/?q=Manipal+Hospital+Bangalore&t=k&layer=t' },
    { name: 'MIOT International', location: 'Chennai', specialty: 'Orthopaedics', distance: '4.8 km', mapUrl: 'https://maps.google.com/?q=MIOT+Chennai&t=k&layer=t' }
];

export default function SymptomChecker() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const patientIdParams = searchParams.get('patientId');

    const [patientId, setPatientId] = useState(patientIdParams || '');
    const [symptoms, setSymptoms] = useState('');
    const [userLocation, setUserLocation] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<AIAnalysis | null>(null);
    const [ambulanceStatus, setAmbulanceStatus] = useState<'IDLE' | 'CALLING' | 'DISPATCHED' | 'ARRIVING'>('IDLE');
    const [isEmergency, setIsEmergency] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [patients, setPatients] = useState<any[]>([]);

    useEffect(() => {
        // Load patients for dropdown if not pre-selected
        api.get('/patients').then(setPatients).catch(console.error);
    }, []);

    const handleCallAmbulance = (hospitalName: string) => {
        setAmbulanceStatus('CALLING');

        // Step 1: Connecting to Dispatch (1.5s)
        setTimeout(() => {
            setAmbulanceStatus('DISPATCHED');

            // Step 2: Ambulance on the way (3s)
            setTimeout(() => {
                setAmbulanceStatus('ARRIVING');
                alert(`🚨 AMBULANCE DISPATCHED!\n\nAn emergency vehicle from ${hospitalName} is on the way to your location: ${userLocation}`);
            }, 3000);
        }, 1500);
    };

    const analyzeSymptoms = async () => {
        if (!symptoms) return alert('Please enter symptoms');
        if (!userLocation) return alert('Please enter your current location');
        setAnalyzing(true);

        try {
            const analysis = await api.post('/ai/analyze-symptoms', { symptoms }) as AIAnalysis;
            setIsEmergency(false); // Reset on new analysis

            if (analysis.urgency === 'HIGH' || analysis.urgency === 'MEDIUM' || analysis.severity === 'SEVERE') {
                try {
                    // 1. Geocode User Location using Nominatim
                    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(userLocation)}&limit=1`);
                    const geoData = await geoRes.json();

                    if (geoData && geoData.length > 0) {
                        const { lat, lon } = geoData[0];

                        // 2. Find Nearest Hospitals using Overpass API
                        const radius = 40000; // 40km radius as requested
                        const overpassQuery = `[out:json];node(around:${radius},${lat},${lon})[amenity=hospital];out 10;`;
                        const overpassRes = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`);
                        const overpassData = await overpassRes.json();

                        if (overpassData.elements && overpassData.elements.length > 0) {
                            // Function to calculate distance in km using Haversine formula
                            const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
                                const R = 6371; // Radius of the earth in km
                                const dLat = (lat2 - lat1) * Math.PI / 180;
                                const dLon = (lon2 - lon1) * Math.PI / 180;
                                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                                return R * c;
                            };

                            const suggested = overpassData.elements
                                .map((el: any) => {
                                    const name = el.tags.name || 'Nearby Hospital';
                                    const addr = el.tags['addr:city'] || el.tags['addr:street'] || 'Nearby Area';
                                    const dist = getDistance(parseFloat(lat), parseFloat(lon), el.lat, el.lon);
                                    return {
                                        name: name,
                                        location: addr,
                                        specialty: el.tags.speciality || 'General & Multi-specialty',
                                        distance: dist.toFixed(1) + ' km',
                                        distNum: dist,
                                        mapUrl: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(userLocation)}&destination=${encodeURIComponent(name + ' ' + addr)}&destination_place_id=${el.id}&t=k&layer=t`
                                    };
                                })
                                .filter((h: any) => h.distNum < 40) // Double check distance is less than 40km
                                .sort((a: any, b: any) => a.distNum - b.distNum) // Sort by nearest
                                .slice(0, 5);

                            analysis.suggestedHospitals = suggested;
                        } else {
                            // Fallback to hardcoded list if no OSM results
                            analysis.suggestedHospitals = allHospitals.slice(0, 5).map(h => ({
                                ...h,
                                mapUrl: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(userLocation)}&destination=${encodeURIComponent(h.name + ' ' + h.location)}&t=k&layer=t`
                            }));
                        }
                    }
                } catch (apiError) {
                    console.error('OSM API Error:', apiError);
                    // Fallback to hardcoded list
                    analysis.suggestedHospitals = allHospitals.slice(0, 5).map(h => ({
                        ...h,
                        mapUrl: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(userLocation)}&destination=${encodeURIComponent(h.name + ' ' + h.location)}&t=k&layer=t`
                    }));
                }
            }

            setResult(analysis);
        } catch (error) {
            console.error(error);
            alert('Failed to analyze symptoms');
        } finally {
            setAnalyzing(false);
        }
    };

    const handleMinorCase = async () => {
        if (!patientId) return alert('Select a patient');

        try {
            // Create appointment with AI analysis
            const appointment = await api.post('/appointments', {
                patientId,
                symptoms,
                datetime: new Date(),
                status: 'COMPLETED',
                aiAnalysis: JSON.stringify(result)
            });

            // Redirect to dispensing page
            router.push(`/dashboard/asha/dispense/${appointment.id}`);
        } catch (error) {
            console.error(error);
            alert('Failed to create appointment');
        }
    };

    const handleSevereCase = async () => {
        if (!patientId) return alert('Select a patient');

        try {
            // Get patient details
            const patient = patients.find(p => p.id === patientId);
            const patientName = patient?.user?.name || 'Unknown Patient';
            const patientContact = patient?.contact || 'N/A';

            // Create appointment for doctor consultation
            const appointment = await api.post('/appointments', {
                patientId,
                symptoms,
                datetime: new Date(),
                status: 'PENDING',
                aiAnalysis: JSON.stringify(result)
            });

            // Send email notification for HIGH urgency cases
            if (result?.urgency === 'HIGH') {
                try {
                    await api.post('/appointments/send-urgent-notification', {
                        appointmentId: appointment.id,
                        patientName,
                        patientContact,
                        symptoms,
                        urgency: result.urgency,
                        recommendations: result.recommendations,
                        doctorEmail: 'lohithdaniel2804@gmail.com',
                        meetingLink: `${window.location.origin}/dashboard/asha/video-call/${appointment.id}`
                    });

                    alert('🚨 HIGH URGENCY CASE!\n\nAppointment created and urgent notification sent to doctor at lohithdaniel2804@gmail.com\n\nConnecting to video call...');
                } catch (emailError) {
                    console.error('Failed to send email notification:', emailError);
                    alert('Appointment created! Connecting to doctor...\n\n(Note: Email notification failed to send)');
                }
            } else {
                alert('Appointment created! Connecting to doctor...');
            }

            // Redirect to video call page
            router.push(`/dashboard/asha/video-call/${appointment.id}`);
        } catch (error) {
            console.error(error);
            alert('Failed to book appointment');
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="mb-8 text-center">
                <h1 className="inline-block text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 py-2 px-6 rounded-2xl bg-white shadow-sm border border-blue-50">
                    JanJeevan AI Symptom Checker
                </h1>
                <p className="text-gray-500 mt-2 font-medium italic">Instant Diagnosis & Emergency Referral</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-gray-900">Select Patient</label>
                    <select
                        value={patientId}
                        onChange={(e) => setPatientId(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                        disabled={!!patientIdParams}
                    >
                        <option value="">-- Select Patient --</option>
                        {patients.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.user?.name || 'Unknown'} - {p.contact}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-gray-900">
                        Current Location (for Emergency hospitals)
                    </label>
                    <input
                        type="text"
                        value={userLocation}
                        onChange={(e) => setUserLocation(e.target.value)}
                        placeholder="E.g., Gachibowli, Hyderabad"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-gray-900">
                        Describe Symptoms
                    </label>
                    <textarea
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder="E.g., fever, headache, cough, chest pain..."
                        className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                </div>

                <button
                    onClick={analyzeSymptoms}
                    disabled={analyzing || !symptoms}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {analyzing ? 'Analyzing...' : 'Analyze Symptoms'}
                </button>

                {result && (
                    <div className="mt-8 p-6 bg-gray-50 rounded-lg border-2" style={{
                        borderColor: result.severity === 'SEVERE' ? '#ef4444' : '#15803d'
                    }}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-4 h-4 rounded-full ${result.severity === 'SEVERE' ? 'bg-red-500' : 'bg-green-600'}`} />
                            <h3 className="text-xl font-bold" style={{
                                color: result.severity === 'SEVERE' ? '#ef4444' : '#15803d'
                            }}>
                                {result.severity === 'SEVERE' ? 'Serious Condition Detected' : '🩺 Provide Advice & Medicines'}
                            </h3>
                        </div>

                        <div className="mb-4 flex items-center gap-4">
                            <div>
                                <p className="text-sm font-semibold text-gray-900 mb-2">Urgency Level:</p>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${result.urgency === 'HIGH' ? 'bg-red-100 text-red-800' :
                                    result.urgency === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-green-100 text-green-800'
                                    }`}>
                                    {result.urgency}
                                </span>
                            </div>

                            {result.urgency === 'MEDIUM' && !isEmergency && (
                                <button
                                    onClick={() => setIsEmergency(true)}
                                    className="mt-6 px-4 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors flex items-center gap-2"
                                >
                                    ⚠️ Is this an Emergency?
                                </button>
                            )}
                        </div>

                        {(result.urgency === 'HIGH' || (result.urgency === 'MEDIUM' && isEmergency)) && result.suggestedHospitals && (
                            <div className="mb-6 bg-white p-4 rounded-lg border border-red-200">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-md font-bold text-red-600 flex items-center gap-2">
                                        🏥 Recommended Emergency Hospitals
                                    </h4>

                                    {/* Ambulance Simulation Button */}
                                    <button
                                        onClick={() => handleCallAmbulance(result.suggestedHospitals![0].name)}
                                        disabled={ambulanceStatus !== 'IDLE'}
                                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 shadow-sm ${ambulanceStatus === 'IDLE'
                                            ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse'
                                            : ambulanceStatus === 'ARRIVING'
                                                ? 'bg-green-600 text-white'
                                                : 'bg-yellow-100 text-yellow-700 cursor-wait'
                                            }`}
                                    >
                                        <span>🚑</span>
                                        {ambulanceStatus === 'IDLE' && 'Call Ambulance'}
                                        {ambulanceStatus === 'CALLING' && 'Connecting...'}
                                        {ambulanceStatus === 'DISPATCHED' && 'Ambulance En Route'}
                                        {ambulanceStatus === 'ARRIVING' && 'Arrived'}
                                    </button>
                                </div>

                                {/* Ambulance Status Progress Bar */}
                                {ambulanceStatus !== 'IDLE' && (
                                    <div className="mb-4 bg-gray-100 h-2 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-1000 ${ambulanceStatus === 'ARRIVING' ? 'w-full bg-green-500' :
                                                ambulanceStatus === 'DISPATCHED' ? 'w-2/3 bg-yellow-500' :
                                                    'w-1/3 bg-red-400'
                                                }`}
                                        />
                                    </div>
                                )}

                                <div className="space-y-3">
                                    {result.suggestedHospitals.map((h, i) => (
                                        <div
                                            key={i}
                                            className={`p-3 rounded-md border flex justify-between items-center transition-all ${i === 0
                                                ? 'bg-green-50 border-green-500 scale-[1.02] shadow-sm'
                                                : 'bg-gray-50 border-gray-200'
                                                }`}
                                        >
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className={`font-bold ${i === 0 ? 'text-green-700' : 'text-gray-800'}`}>
                                                        {h.name}
                                                    </p>
                                                    {i === 0 && (
                                                        <span className="text-[10px] bg-green-600 text-white px-2 py-0.5 rounded-full uppercase">Top Choice</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500">{h.specialty} • {h.location} • {h.distance}</p>
                                            </div>
                                            <a
                                                href={h.mapUrl}
                                                target="_blank"
                                                className={`text-xs font-bold px-3 py-1.5 rounded uppercase border transition-colors ${i === 0
                                                    ? 'bg-green-600 text-white border-green-700 hover:bg-green-700'
                                                    : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
                                                    }`}
                                            >
                                                Locate
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mb-4">
                            <p className="text-sm font-bold text-black mb-2 uppercase tracking-wide">Recommendations:</p>
                            <ul className="list-disc list-inside space-y-2">
                                {result.recommendations.map((rec, idx) => (
                                    <li key={idx} className="text-black font-medium">{rec}</li>
                                ))}
                            </ul>
                        </div>

                        {result.suggestedMedications && result.suggestedMedications.length > 0 && (
                            <div className="mb-4">
                                <p className="text-sm font-bold text-black mb-2 uppercase tracking-wide">Suggested Medications:</p>
                                <ul className="list-disc list-inside space-y-2">
                                    {result.suggestedMedications.map((med, idx) => (
                                        <li key={idx} className="text-black font-medium">{med}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="mt-6 flex gap-4">
                            {result.requiresDoctorConsultation ? (
                                <button
                                    onClick={handleSevereCase}
                                    className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg"
                                >
                                    🎥 Connect to Doctor
                                </button>
                            ) : (
                                <button
                                    onClick={handleMinorCase}
                                    className="flex-1 bg-[#d4ff00] text-[#0f172a] py-4 rounded-xl font-black text-lg hover:bg-[#c2eb00] transition-all shadow-[0_4px_20px_0_rgba(212,255,0,0.4)] flex items-center justify-center gap-3 border-2 border-[#0f172a]/20"
                                >
                                    <span className="text-2xl">💊</span> Provide Advice & Medicines
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

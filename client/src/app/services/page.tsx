'use client';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Services() {
    return (
        <main className="min-h-screen bg-white flex flex-col">
            <Navbar />
            <div className="flex-grow max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 w-full">
                <div className="text-center">
                    <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Our Services</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        Comprehensive Healthcare for Rural India
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                        JanJeevan connects you with essential medical services right from your village.
                    </p>
                </div>

                <div className="mt-16 grid gap-8 md:grid-cols-3">
                    <div className="bg-blue-50 p-8 rounded-lg shadow-sm border border-blue-100">
                        <div className="text-4xl mb-4">🩺</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">AI Symptom Analysis</h3>
                        <p className="text-gray-600">
                            Instant, AI-powered symptom checking to assess severity and provide immediate guidance through ASHA workers.
                        </p>
                    </div>

                    <div className="bg-green-50 p-8 rounded-lg shadow-sm border border-green-100">
                        <div className="text-4xl mb-4">🎥</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Tele-Consultations</h3>
                        <p className="text-gray-600">
                            Connect with specialized doctors via high-quality video calls when expert medical advice is needed.
                        </p>
                    </div>

                    <div className="bg-purple-50 p-8 rounded-lg shadow-sm border border-purple-100">
                        <div className="text-4xl mb-4">💊</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Digital Pharmacy</h3>
                        <p className="text-gray-600">
                            Smart inventory management and digital prescriptions ensure medicines are always available and dispensed correctly.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}

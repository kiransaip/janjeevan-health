'use client';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function About() {
    return (
        <main className="min-h-screen bg-white flex flex-col">
            <Navbar />
            <div className="flex-grow max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 w-full">
                <div className="lg:text-center mb-16">
                    <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">About Us</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        Bridging the Urban-Rural Healthcare Gap
                    </p>
                </div>

                <div className="prose prose-lg text-gray-500 mx-auto">
                    <p className="mb-6">
                        <strong>JanJeevan</strong> is a mission-driven initiative aimed at transforming healthcare delivery in rural India. We believe that quality healthcare is a fundamental right, not a privilege determined by geography.
                    </p>
                    <p className="mb-6">
                        By empowering <strong>ASHA workers</strong> with cutting-edge technology—including AI diagnostic tools and telemedicine capabilities—we verify that reliable medical care reaches the last mile.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Our Mission</h3>
                    <p className="mb-6">
                        To create a sustainable, technology-enabled healthcare ecosystem where every villager has access to timely diagnosis, expert consultation, and essential medicines.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Team</h3>
                    <p>
                        We are a team of passionate developers, designers, and healthcare advocates participating in this hackathon to build solutions that matter.
                    </p>
                </div>
            </div>
            <Footer />
        </main>
    );
}

'use client';

import { useState } from 'react';
import { api } from '@/utils/api';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        // Validate form
        if (!formData.name || !formData.email || !formData.message) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        // Send message via API
        try {
            const res = await api.post('/contact', formData);
            console.log('Contact form submitted:', res);
            setSuccess(true);
            setFormData({ name: '', email: '', message: '' });

            // Hide success message after 5 seconds
            setTimeout(() => setSuccess(false), 5000);
        } catch (err: any) {
            console.error('Submission error:', err);
            setError(err.response?.data?.error || 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <main className="min-h-screen bg-white flex flex-col">
            <Navbar />
            <div className="flex-grow max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-lg mx-auto md:max-w-none md:grid md:grid-cols-2 md:gap-8">
                    <div>
                        <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                            Get in Touch
                        </h2>
                        <p className="mt-3 text-lg text-gray-500">
                            Have questions about JanJeevan? Want to partner with us? We'd love to hear from you.
                        </p>

                        <div className="mt-9">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <span className="text-2xl">📍</span>
                                </div>
                                <div className="ml-3 text-base text-gray-500">
                                    <p>Hackathon Venue, India</p>
                                </div>
                            </div>
                            <div className="mt-6 flex">
                                <div className="flex-shrink-0">
                                    <span className="text-2xl">👥</span>
                                </div>
                                <div className="ml-3 text-base text-gray-500">
                                    <p>BREAKING BADX25</p>
                                </div>
                            </div>
                            <div className="mt-6 flex">
                                <div className="flex-shrink-0">
                                    <span className="text-2xl">📧</span>
                                </div>
                                <div className="ml-3 text-base text-gray-500">
                                    <p>lohithdaniel2804@gmail.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 sm:mt-16 md:mt-0">
                        <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl mb-6">
                            Send us a message
                        </h2>

                        {success && (
                            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
                                <strong className="font-bold">Success! </strong>
                                <span className="block sm:inline">Your message has been sent. We'll get back to you soon!</span>
                            </div>
                        )}

                        {error && (
                            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        <form className="grid grid-cols-1 gap-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md border text-gray-900"
                                        placeholder="Your Name"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <div className="mt-1">
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md border text-gray-900"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                <div className="mt-1">
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={4}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border border-gray-300 rounded-md text-gray-900"
                                        placeholder="How can we help?"
                                        required
                                    ></textarea>
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Sending...' : 'Send Message'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* Developer Team Section */}
            <div className="bg-gray-50 py-16 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">
                        Meet Team <span className="text-blue-600">BREAKING BADX25</span>
                    </h2>
                    <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
                        The minds behind JanJeevan, dedicated to transforming rural healthcare access.
                    </p>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            { name: 'P Lohith', email: 'lohithdaniel2804@gmail.com' },
                            { name: 'Sarath Canchi', email: 'sarathcanchi2007@gmail.com' },
                            { name: 'Karnam Snehith', email: 'snehitkarnam1@gmail.com' },
                            { name: 'N Sasi Kumar', email: 'sasi@gmail.com' },
                            { name: 'KiranSai P', email: 'kp6080810@gmail.com' },
                        ].map((dev, index) => (
                            <div key={index} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-semibold text-gray-900">{dev.name}</h3>
                                <a href={`mailto:${dev.email}`} className="text-blue-600 hover:text-blue-800 text-sm mt-1 block">
                                    {dev.email}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </main >
    );
}

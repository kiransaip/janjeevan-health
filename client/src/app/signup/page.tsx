'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/utils/api';
import Link from 'next/link';
import Navbar from "@/components/Navbar";

export default function SignupPage() {
    const router = useRouter();
    const [success, setSuccess] = useState(false);
    const [createdAccount, setCreatedAccount] = useState<any>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        contact: '',
        address: '',
        role: 'PATIENT'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                dateOfBirth: new Date().toISOString(),
                gender: 'Other',
                address: formData.address,
                contact: formData.contact
            });

            if (response.token) {
                // Show success message with account details
                setCreatedAccount({
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                    name: formData.name
                });
                setSuccess(true);

                // Auto-login after 3 seconds
                setTimeout(() => {
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('user', JSON.stringify(response.user));
                    redirectUser(response.user.role);
                }, 3000);
            }
        } catch (error: any) {
            console.error('Registration failed:', error);
            setError(error?.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const redirectUser = (role: string) => {
        if (role === 'PATIENT') router.push('/dashboard/patient');
        else if (role === 'ASHA') router.push('/dashboard/asha');
        else if (role === 'DOCTOR') router.push('/dashboard/doctor');
        else if (role === 'PHARMACIST') router.push('/dashboard/pharmacist');
        else router.push('/');
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                    {success && createdAccount ? (
                        // Success Message
                        <div className="text-center space-y-4">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Account Created Successfully!</h2>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                                <p className="text-sm font-semibold text-gray-700 mb-2">Your Login Credentials:</p>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <p><span className="font-medium">Name:</span> {createdAccount.name}</p>
                                    <p><span className="font-medium">Email:</span> {createdAccount.email}</p>
                                    <p><span className="font-medium">Password:</span> {createdAccount.password}</p>
                                    <p><span className="font-medium">Role:</span> {createdAccount.role}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">
                                Redirecting to dashboard in 3 seconds...
                            </p>
                            <div className="flex justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        </div>
                    ) : (
                        // Signup Form
                        <>
                            <div>
                                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                                    Create your account
                                </h2>
                                <p className="mt-2 text-center text-sm text-gray-600">
                                    Or{' '}
                                    <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                                        sign in to your existing account
                                    </Link>
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                                    <span className="block sm:inline">{error}</span>
                                </div>
                            )}

                            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                                <div className="rounded-md shadow-sm -space-y-px">
                                    <div className="mb-4">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                        <input id="name" type="text" required className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                                        <input id="email" type="email" required className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" placeholder="Email address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Account Type</label>
                                        <select id="role" required className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                                            <option value="PATIENT">Patient</option>
                                            <option value="DOCTOR">Doctor</option>
                                            <option value="ASHA">ASHA Worker</option>
                                            <option value="PHARMACIST">Pharmacist</option>
                                        </select>
                                    </div>
                                    <div className="mb-4 grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Phone</label>
                                            <input id="contact" type="tel" required className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" placeholder="Mobile Number" value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} />
                                        </div>
                                        <div>
                                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                                            <input id="address" type="text" required className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" placeholder="City/Village" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password (min 6 characters)</label>
                                        <input id="password" type="password" required className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                        <input id="confirmPassword" type="password" required className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" placeholder="Confirm Password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                                    >
                                        {loading ? 'Processing...' : 'Create Account'}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

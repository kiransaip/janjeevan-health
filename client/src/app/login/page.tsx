'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/utils/api';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('PATIENT');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        console.log('[LOGIN] Attempting login with:', { email, role });

        try {
            const res = await api.post('/auth/login', { email, password, role });

            console.log('[LOGIN] Response received:', res);

            if (res.error) {
                console.error('[LOGIN] Error in response:', res.error);
                setError(res.error);
            } else if (res.token) {
                console.log('[LOGIN] Success! Token received');
                login(res.token, res.user);
            } else {
                console.error('[LOGIN] Unexpected response format:', res);
                setError('Unexpected response from server');
            }
        } catch (err: any) {
            console.error('[LOGIN] Exception caught:', err);
            const errorMsg = err?.response?.data?.error || 'Login failed. Server might be offline.';
            console.error('[LOGIN] Error message:', errorMsg);
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Log in to your account
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Or{' '}
                            <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                                create a new account
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
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                                    placeholder="Email address"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                                    placeholder="Password"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Account Type</label>
                                <select
                                    id="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                                >
                                    <option value="PATIENT">Patient</option>
                                    <option value="DOCTOR">Doctor</option>
                                    <option value="ASHA">ASHA Worker</option>
                                    <option value="PHARMACIST">Pharmacist</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                            >
                                {loading ? 'Logging in...' : 'Log in'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

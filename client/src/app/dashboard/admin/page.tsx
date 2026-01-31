'use client';

import { useEffect, useState } from 'react';
import { api } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface UserData {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    patientProfile?: any;
    doctorProfile?: any;
    ashaProfile?: any;
    pharmacistProfile?: any;
}

interface Stats {
    total: number;
    patients: number;
    doctors: number;
    asha: number;
    pharmacists: number;
    admins: number;
}

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<UserData[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            router.push('/login');
            return;
        }
        fetchUsers();
    }, [user, router]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await api.get('/admin/users');
            setUsers(data.users);
            setStats(data.stats);
        } catch (err: any) {
            setError(err?.response?.data?.error || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            await api.delete(`/admin/users/${userId}`);
            fetchUsers(); // Refresh list
        } catch (err: any) {
            alert(err?.response?.data?.error || 'Failed to delete user');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => router.push('/dashboard/admin/messages')}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            View Messages
                        </button>
                        <button
                            onClick={logout}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
                            <div className="text-sm text-gray-600">Total Users</div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="text-3xl font-bold text-green-600">{stats.patients}</div>
                            <div className="text-sm text-gray-600">Patients</div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="text-3xl font-bold text-purple-600">{stats.doctors}</div>
                            <div className="text-sm text-gray-600">Doctors</div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="text-3xl font-bold text-yellow-600">{stats.asha}</div>
                            <div className="text-sm text-gray-600">ASHA Workers</div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="text-3xl font-bold text-pink-600">{stats.pharmacists}</div>
                            <div className="text-sm text-gray-600">Pharmacists</div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="text-3xl font-bold text-red-600">{stats.admins}</div>
                            <div className="text-sm text-gray-600">Admins</div>
                        </div>
                    </div>
                )}

                {/* Users Table */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">All Users</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((userData) => (
                                    <tr key={userData.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {userData.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {userData.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${userData.role === 'ADMIN' ? 'bg-red-100 text-red-800' : ''}
                                                ${userData.role === 'DOCTOR' ? 'bg-purple-100 text-purple-800' : ''}
                                                ${userData.role === 'PATIENT' ? 'bg-green-100 text-green-800' : ''}
                                                ${userData.role === 'ASHA' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                ${userData.role === 'PHARMACIST' ? 'bg-pink-100 text-pink-800' : ''}
                                            `}>
                                                {userData.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(userData.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {userData.role !== 'ADMIN' && (
                                                <button
                                                    onClick={() => handleDelete(userData.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

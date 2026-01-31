'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/utils/api';

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: string;
}

export default function AdminMessages() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const data = await api.get('/contact');
            setMessages(data);
        } catch (err) {
            console.error('Error fetching messages:', err);
            setError('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading messages...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Contact Messages</h1>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {messages.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                                    No messages received yet.
                                </td>
                            </tr>
                        ) : (
                            messages.map((msg) => (
                                <tr key={msg.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(msg.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{msg.name}</div>
                                        <div className="text-sm text-gray-500">{msg.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xl break-words">
                                        {msg.message}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

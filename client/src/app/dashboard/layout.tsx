'use client';

import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
    if (!user) return null;

    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto p-8">
                {children}
            </main>
        </div>
    );
}

'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    if (!user) return null;

    const links = {
        ASHA: [
            { name: 'Dashboard', href: '/dashboard/asha' },
            { name: 'Register Patient', href: '/dashboard/asha/register' },
            { name: 'Symptom Checker', href: '/dashboard/asha/symptom-checker' },
        ],
        DOCTOR: [
            { name: 'Appointments', href: '/dashboard/doctor' },
            { name: 'Patient History', href: '/dashboard/doctor/history' },
        ],
        PHARMACIST: [
            { name: 'Orders', href: '/dashboard/pharmacist' },
            { name: 'Inventory', href: '/dashboard/pharmacist/inventory' },
        ],
        PATIENT: [
            { name: 'My Health', href: '/dashboard/patient' },
            { name: 'Prescriptions', href: '/dashboard/patient/prescriptions' },
        ]
    };

    const roleLinks = links[user.role as keyof typeof links] || [];

    return (
        <div className="w-64 h-screen bg-gray-900 text-white flex flex-col">
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-xl font-bold">JanJeevan Health</h1>
                <p className="text-sm text-gray-400 mt-1">{user.name}</p>
                <span className="text-xs font-semibold px-2 py-1 bg-blue-600 rounded mt-2 inline-block">
                    {user.role}
                </span>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {roleLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`block px-4 py-2 rounded transition-colors ${pathname === link.href ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                            }`}
                    >
                        {link.name}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 transition-colors"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

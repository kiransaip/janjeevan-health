
import Link from 'next/link';
import React from 'react';

const Navbar = () => {
    return (
        <nav className="w-full h-16 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-50">
            <Link href="/" className="flex items-center gap-2">
                <div className="w-14 h-14 relative">
                    <img src="/logo.jpg" alt="JanJeevan Health Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                    JanJeevan Health
                </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
                <Link href="/" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors">
                    Home
                </Link>
                <Link href="/services" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors">
                    Services
                </Link>
                <Link href="/about" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors">
                    About Us
                </Link>
                <Link href="/contact" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors">
                    Contact
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <Link href="/login" className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
                    Login
                </Link>
                <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all">
                    Sign Up
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;

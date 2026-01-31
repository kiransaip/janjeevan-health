
import React from 'react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 py-12 px-6 lg:px-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-1">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-14 h-14 relative">
                            <img src="/logo.jpg" alt="JanJeevan Health Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                            JanJeevan Health
                        </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Making healthcare accessible and affordable for everyone.
                    </p>
                </div>

                <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                        <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
                        <li><Link href="/about" className="hover:text-blue-600">About Us</Link></li>
                        <li><Link href="/services" className="hover:text-blue-600">Services</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
                    <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                        <li><Link href="/privacy" className="hover:text-blue-600">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="hover:text-blue-600">Terms of Service</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Contact</h3>
                    <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                        <li>BREAKING BADX25</li>
                        <li>lohithdaniel2804@gmail.com</li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <p>&copy; {new Date().getFullYear()} JanJeevan Health. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer;

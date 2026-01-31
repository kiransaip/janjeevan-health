'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/utils/api';

export default function InventoryPage() {
    interface InventoryItem {
        id: string;
        name: string;
        stock: number;
        unit: string;
        reorderThreshold?: number;
    }

    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [editItem, setEditItem] = useState<string | null>(null);
    const [newItem, setNewItem] = useState({
        name: '',
        stock: 0,
        unit: 'tablets',
        threshold: 10
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchInventory = async () => {
        try {
            const data = await api.get('/inventory');
            setInventory(data);
        } catch {
            console.error('Fetch failed');
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const updateStock = async (name: string, newStock: number) => {
        try {
            await api.post('/inventory/update', { name, stock: newStock });
            fetchInventory();
            setEditItem(null);
        } catch {
            alert('Update failed');
        }
    };

    const handleAddMedicine = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItem.name) return alert('Name is required');

        setSubmitting(true);
        try {
            await api.post('/inventory/update', {
                name: newItem.name,
                stock: newItem.stock,
                unit: newItem.unit,
                reorderThreshold: newItem.threshold
            });
            setNewItem({ name: '', stock: 0, unit: 'tablets', threshold: 10 });
            fetchInventory();
            alert('Medicine added successfully');
        } catch {
            alert('Failed to add medicine');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8 text-[#0f172a]">Pharmacy Inventory</h1>

            {/* Quick Add Form */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
                <h2 className="text-xl font-bold mb-4 text-[#0f172a] flex items-center gap-2">
                    <span className="text-2xl">➕</span> Add New Medicine to Inventory
                </h2>
                <form onSubmit={handleAddMedicine} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-black mb-1">Medicine Name</label>
                        <input
                            type="text"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            className="w-full p-2.5 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#d4ff00] outline-none"
                            placeholder="e.g. Paracetamol"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-black mb-1">Stock</label>
                        <input
                            type="number"
                            value={newItem.stock}
                            onChange={(e) => setNewItem({ ...newItem, stock: parseInt(e.target.value) || 0 })}
                            className="w-full p-2.5 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#d4ff00] outline-none"
                            placeholder="0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-black mb-1">Unit</label>
                        <select
                            value={newItem.unit}
                            onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                            className="w-full p-2.5 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#d4ff00] outline-none"
                        >
                            <option value="tablets">tablets</option>
                            <option value="capsules">capsules</option>
                            <option value="bottles">bottles</option>
                            <option value="vials">vials</option>
                            <option value="tubes">tubes</option>
                            <option value="units">units</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-black mb-1 text-xs">Min Threshold</label>
                        <input
                            type="number"
                            value={newItem.threshold}
                            onChange={(e) => setNewItem({ ...newItem, threshold: parseInt(e.target.value) || 0 })}
                            className="w-full p-2.5 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#d4ff00] outline-none"
                            placeholder="10"
                        />
                    </div>
                    <div className="md:col-span-5 flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-[#d4ff00] text-[#0f172a] px-8 py-3 rounded-xl font-black text-lg hover:bg-[#c2eb00] transition-all shadow-md active:scale-95 disabled:bg-gray-200"
                        >
                            {submitting ? 'Adding...' : '⚡ Add to Inventory'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">Medicine Name</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">Storage / Unit</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">Current Stock</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-black uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {inventory.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-bold text-black">{item.name}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        {item.unit}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {item.stock <= (item.reorderThreshold || 10) ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                                            ⚠️ Low Stock
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                            ✅ Sufficient
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {editItem === item.id ? (
                                        <input
                                            type="number"
                                            className="border-2 border-[#d4ff00] rounded-lg w-24 p-1.5 font-bold text-black outline-none"
                                            defaultValue={item.stock}
                                            autoFocus
                                            onBlur={(e) => updateStock(item.name, parseInt(e.target.value) || 0)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') updateStock(item.name, parseInt((e.target as HTMLInputElement).value) || 0);
                                                if (e.key === 'Escape') setEditItem(null);
                                            }}
                                        />
                                    ) : (
                                        <div className={`text-lg font-black ${item.stock <= (item.reorderThreshold || 10) ? 'text-red-600' : 'text-black'}`}>
                                            {item.stock}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => setEditItem(item.id)}
                                        className="text-blue-600 hover:text-blue-800 font-bold text-sm uppercase tracking-tighter"
                                    >
                                        Edit Stock
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {inventory.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-gray-500 italic">
                                    No medicines found in inventory. Add your first stock above.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

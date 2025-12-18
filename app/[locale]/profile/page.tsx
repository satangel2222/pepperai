'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, Generation, Transaction } from '@/lib/supabase';
import Image from 'next/image';

export default function ProfilePage() {
    const { user } = useAuth();
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [activeTab, setActiveTab] = useState<'generations' | 'transactions'>('generations');

    useEffect(() => {
        if (user) {
            fetchGenerations();
            fetchTransactions();
        }
    }, [user]);

    const fetchGenerations = async () => {
        if (!user) return;

        const { data } = await supabase
            .from('generations')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(20);

        if (data) setGenerations(data);
    };

    const fetchTransactions = async () => {
        if (!user) return;

        const { data } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (data) setTransactions(data);
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h2>
                    <p className="text-gray-600">You need to be signed in to view your profile</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <h1 className="text-3xl font-bold mb-4">Profile</h1>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="text-lg font-semibold">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Credit Balance</p>
                            <p className="text-lg font-semibold text-primary-600">
                                {user.credits.toFixed(2)} credits
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white rounded-lg shadow-md p-1 inline-flex">
                        <button
                            onClick={() => setActiveTab('generations')}
                            className={`px-6 py-2 rounded-md font-medium transition-all ${activeTab === 'generations'
                                    ? 'bg-gradient-purple text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Generation History
                        </button>
                        <button
                            onClick={() => setActiveTab('transactions')}
                            className={`px-6 py-2 rounded-md font-medium transition-all ${activeTab === 'transactions'
                                    ? 'bg-gradient-purple text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Transactions
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    {activeTab === 'generations' && (
                        <div className="space-y-4">
                            {generations.length === 0 ? (
                                <p className="text-center text-gray-600 py-8">No generations yet</p>
                            ) : (
                                generations.map((gen) => (
                                    <div
                                        key={gen.id}
                                        className="border border-gray-200 rounded-lg p-4 flex gap-4"
                                    >
                                        {gen.result_url && (
                                            <div className="flex-shrink-0">
                                                {gen.type === 'img2video' ? (
                                                    <video
                                                        src={gen.result_url}
                                                        className="w-32 h-32 object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <Image
                                                        src={gen.result_url}
                                                        alt="Generated"
                                                        width={128}
                                                        height={128}
                                                        className="w-32 h-32 object-cover rounded-lg"
                                                    />
                                                )}
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded">
                                                    {gen.type}
                                                </span>
                                                <span className="text-sm text-gray-600">
                                                    {gen.cost} credits
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-900 mb-1">{gen.prompt}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(gen.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'transactions' && (
                        <div className="space-y-4">
                            {transactions.length === 0 ? (
                                <p className="text-center text-gray-600 py-8">No transactions yet</p>
                            ) : (
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2">Date</th>
                                            <th className="text-left py-2">Amount</th>
                                            <th className="text-left py-2">Credits</th>
                                            <th className="text-left py-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((txn) => (
                                            <tr key={txn.id} className="border-b">
                                                <td className="py-2">
                                                    {new Date(txn.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="py-2">${txn.amount.toFixed(2)}</td>
                                                <td className="py-2">{txn.credits}</td>
                                                <td className="py-2">
                                                    <span
                                                        className={`px-2 py-1 rounded text-xs font-medium ${txn.status === 'completed'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                            }`}
                                                    >
                                                        {txn.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

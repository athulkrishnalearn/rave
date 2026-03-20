"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PiggyBank, Heart, ArrowUpRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function BenefitsTab() {
    // In a fully deployed system, this would fetch from a defined Benefit/Vault model
    // For now, this is a functional UI shell anticipating the Phase 4.5 data layer implementation.
    const [loading, setLoading] = useState(false);

    return (
        <div className="p-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-1 flex items-center gap-2">
                        <Heart size={24} className="text-pink-500 fill-pink-500/20" /> Benefits & Vault Manager
                    </h2>
                    <p className="text-sm font-mono text-zinc-500">Oversight over Creator Emergency Funds and long-term Savings Vaults.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-pink-50 text-pink-600 font-bold uppercase text-[11px] rounded-lg border border-pink-100 hover:bg-pink-100 transition-colors">
                        Issue Emergency Grant
                    </button>
                    <button className="px-4 py-2 bg-zinc-950 text-white font-bold uppercase text-[11px] rounded-lg hover:bg-zinc-800 transition-colors">
                        Allocate Platform Yield
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-2xl border border-pink-100">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm text-pink-500">
                        <PiggyBank size={20} />
                    </div>
                    <div className="text-sm font-bold text-pink-900 mb-1">Total Vault Holdings</div>
                    <div className="text-3xl font-black text-pink-600">$42,500<span className="text-lg opacity-50">.00</span></div>
                    <div className="text-xs font-mono text-pink-700/70 mt-4 flex items-center gap-1">
                        <TrendingUp size={12} /> +$1,200 this month (Creator deposits)
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#E8E8E8] shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center mb-4 text-zinc-600">
                        <Heart size={20} />
                    </div>
                    <div className="text-sm font-bold text-zinc-600 mb-1">Emergency Grants Issued</div>
                    <div className="text-3xl font-black text-zinc-900">$5,000<span className="text-lg opacity-50">.00</span></div>
                    <div className="text-xs font-mono text-zinc-400 mt-4">
                        2 grants deployed YTD
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#E8E8E8] shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center mb-4 text-zinc-600">
                        <TrendingUp size={20} />
                    </div>
                    <div className="text-sm font-bold text-zinc-600 mb-1">Vault APY Dividend</div>
                    <div className="text-3xl font-black text-zinc-900">4.15<span className="text-lg opacity-50">%</span></div>
                    <div className="text-xs font-mono text-zinc-400 mt-4">
                        Current projected yield applied to creator vaults
                    </div>
                </div>
            </div>

            <div className="bg-white border border-[#E8E8E8] rounded-2xl overflow-hidden shadow-sm">
                <div className="p-5 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-sm">Recent Vault Activity</h3>
                </div>
                <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 mb-4">
                        <PiggyBank size={24} className="text-zinc-400" />
                    </div>
                    <h4 className="text-zinc-900 font-bold mb-2">Vault Subsystem Initializing</h4>
                    <p className="text-sm text-zinc-500 max-w-sm mx-auto font-mono">
                        Individual creator vault tracking and API bindings will come online once the Benefit model is fully deployed in production.
                    </p>
                </div>
            </div>
        </div>
    );
}

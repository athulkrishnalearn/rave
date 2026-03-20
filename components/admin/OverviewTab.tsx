"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Activity, Users, FileText, CheckCircle, ShieldAlert } from 'lucide-react';

export default function OverviewTab() {
    const { token } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        fetch('/api/admin/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setStats(data.stats);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load stats", err);
                setLoading(false);
            });
    }, [token]);

    if (loading) return <div className="p-8 animate-pulse font-mono text-zinc-500">Retrieving Telemetry...</div>;
    if (!stats) return <div className="p-8 text-red-500 font-bold uppercase">System Error: Telemetry Offline</div>;

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-1 flex items-center gap-2">
                    <Activity size={24} className="text-purple-600" /> Platform Telemetry
                </h2>
                <p className="text-sm font-mono text-zinc-500">Live operational and financial metrics.</p>
            </div>

            {/* Financial & Operational Volume */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-zinc-950 text-white rounded-2xl p-6 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Total Escrow Volume</p>
                    <h3 className="text-4xl font-black">${stats.totalEscrowVolume?.toLocaleString() || 0}</h3>
                    <p className="text-xs font-mono text-green-400 mt-2">Platform Lifetime</p>
                </div>
                <div className="bg-white border border-[#E8E8E8] rounded-2xl p-6 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Settled Volume</p>
                    <h3 className="text-4xl font-black">${stats.settledVolume?.toLocaleString() || 0}</h3>
                    <p className="text-xs font-mono text-zinc-400 mt-2">Successfully paid to creators</p>
                </div>
                <div className="bg-white border border-[#E8E8E8] rounded-2xl p-6 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Total Projects</p>
                    <h3 className="text-4xl font-black">{stats.totalProjects || 0}</h3>
                    <p className="text-xs font-mono text-zinc-400 mt-2">{stats.completedProjects || 0} Completed</p>
                </div>
                <div className="bg-white border border-[#E8E8E8] rounded-2xl p-6 shadow-sm border-l-4 border-l-red-500">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 flex items-center gap-1"><ShieldAlert size={12} /> Open Disputes</p>
                    <h3 className="text-4xl font-black">{stats.openDisputes || 0}</h3>
                    <p className="text-xs font-mono text-zinc-400 mt-2">Requires admin attention</p>
                </div>
            </div>

            {/* User Base Metrics */}
            <h3 className="text-sm font-black uppercase tracking-tighter text-zinc-400 mt-8 mb-4 border-b border-zinc-100 pb-2">User Demographics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-[#E8E8E8] rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                    <Users size={24} className="text-zinc-400 mb-2" />
                    <h4 className="text-3xl font-black">{stats.totalUsers || 0}</h4>
                    <p className="text-xs font-bold uppercase text-zinc-500">Total Users</p>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                    <CheckCircle size={24} className="text-green-500 mb-2" />
                    <h4 className="text-3xl font-black text-green-700">{stats.verifiedUsers || 0}</h4>
                    <p className="text-xs font-bold uppercase text-green-600">Verified Profiles</p>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                    <FileText size={24} className="text-amber-500 mb-2" />
                    <h4 className="text-3xl font-black text-amber-700">{stats.pendingVerifications || 0}</h4>
                    <p className="text-xs font-bold uppercase text-amber-600">Pending Verification</p>
                </div>
            </div>
        </div>
    );
}

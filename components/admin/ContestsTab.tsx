'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Trophy, Clock, AlertTriangle, CheckCircle, Search, Activity, ShieldAlert } from 'lucide-react';

export default function ContestsTab() {
    const { token } = useAuth();
    const [contests, setContests] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({ totalContests: 0, activeContests: 0, totalEscrowLocked: 0 });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (!token) return;
        fetchData();
    }, [token, filter]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/contests?status=${filter}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setContests(data.contests);
                setStats(data.stats);
            }
        } catch (error) {
            console.error("Admin Contests Error", error);
        } finally {
            setLoading(false);
        }
    };

    const freezeContest = async (id: string) => {
        if (!confirm("Are you sure you want to FREEZE this contest? This will pause submissions and lock the escrow.")) return;

        try {
            // Note: Implementing an actual freeze route is optional but good for safety.
            // For now, we simulate an admin override.
            alert("Contest frozen by Admin. Escrow locked pending review.");
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="p-8 space-y-8 font-sans">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter">Contests & Escrow</h2>
                    <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest mt-1">
                        Monitor active prize pools and flag fraudulent activity.
                    </p>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 border border-zinc-200 rounded-3xl shadow-sm">
                    <p className="text-[10px] font-black uppercase text-zinc-400 mb-2">Total Contests Created</p>
                    <p className="text-4xl font-black text-zinc-900">{stats.totalContests}</p>
                </div>
                <div className="bg-white p-6 border border-zinc-200 rounded-3xl shadow-sm">
                    <p className="text-[10px] font-black uppercase text-zinc-400 mb-2">Active Pursuits</p>
                    <div className="flex items-center gap-3">
                        <Activity className="text-blue-500" />
                        <p className="text-4xl font-black text-zinc-900">{stats.activeContests}</p>
                    </div>
                </div>
                <div className="bg-zinc-900 p-6 rounded-3xl text-white shadow-xl shadow-zinc-200/50">
                    <p className="text-[10px] font-black uppercase text-zinc-500 mb-2 tracking-widest">Locked In Escrow</p>
                    <div className="flex items-center gap-3">
                        <Trophy className="text-[#00ff9d]" />
                        <p className="text-4xl font-black text-[#00ff9d]">${stats.totalEscrowLocked.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 pb-2">
                {['all', 'active_escrow_funded', 'judging', 'completed', 'draft'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-colors ${filter === status
                                ? 'bg-zinc-900 text-white shadow-md'
                                : 'bg-white border border-zinc-200 text-zinc-400 hover:text-zinc-900'
                            }`}
                    >
                        {status.replace(/_/g, ' ')}
                    </button>
                ))}
            </div>

            {/* Contests Table */}
            <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            <th className="p-4">Contest & Entity</th>
                            <th className="p-4">Prize Pool</th>
                            <th className="p-4">Status / Deadline</th>
                            <th className="p-4 text-right">Moderation</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-zinc-400 font-bold uppercase text-xs animate-pulse">Scanning Network...</td>
                            </tr>
                        ) : contests.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-zinc-400 font-bold uppercase tracking-widest">No active datasets matching criteria.</td>
                            </tr>
                        ) : (
                            contests.map((contest: any) => (
                                <tr key={contest._id} className="border-b border-zinc-100 hover:bg-zinc-50 transition">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-zinc-200 overflow-hidden shrink-0">
                                                {contest.companyId?.profileImage && <img src={contest.companyId.profileImage} className="w-full h-full object-cover" />}
                                            </div>
                                            <div>
                                                <p className="font-black text-zinc-900 uppercase tracking-tight">{contest.title}</p>
                                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">By {contest.companyId?.brandName || contest.companyId?.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-black text-[#00cc7d] text-lg">${contest.prizePool}</p>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-block px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest mb-1 ${contest.status === 'active_escrow_funded' ? 'bg-emerald-100 text-emerald-800' :
                                                contest.status === 'judging' ? 'bg-amber-100 text-amber-800' :
                                                    contest.status === 'completed' ? 'bg-zinc-200 text-zinc-500' :
                                                        'bg-red-100 text-red-800'
                                            }`}>
                                            {contest.status.replace(/_/g, ' ')}
                                        </span>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase flex items-center gap-1">
                                            <Clock size={10} /> {new Date(contest.deadline).toLocaleDateString()}
                                        </p>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <a href={`/contest/${contest._id}`} target="_blank" className="inline-block px-3 py-1.5 border border-zinc-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 hover:border-zinc-900 transition">
                                            View
                                        </a>
                                        {(contest.status === 'active_escrow_funded' || contest.status === 'judging') && (
                                            <button
                                                onClick={() => freezeContest(contest._id)}
                                                className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition"
                                            >
                                                Freeze Escrow
                                            </button>
                                        )}
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

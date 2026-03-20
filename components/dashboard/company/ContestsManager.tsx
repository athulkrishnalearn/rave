'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Clock, Users, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContestsManager() {
    const [contests, setContests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContests();
    }, []);

    const fetchContests = async () => {
        try {
            const token = localStorage.getItem('rave_token');
            const res = await fetch('/api/dashboard/company/contests', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setContests(data.contests);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="animate-pulse flex space-x-4 p-6"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-zinc-800 rounded w-3/4"></div><div className="space-y-2"><div className="h-4 bg-zinc-800 rounded"></div><div className="h-4 bg-zinc-800 rounded w-5/6"></div></div></div></div>;
    }

    if (contests.length === 0) {
        return (
            <div className="py-16 bg-white rounded-3xl border-2 border-dashed border-zinc-200 text-center">
                <Trophy size={40} className="mx-auto mb-4 text-zinc-300" />
                <h3 className="text-xl font-black text-zinc-900 uppercase tracking-tighter mb-2">No Active Contests</h3>
                <p className="text-sm text-zinc-500 max-w-sm mx-auto mb-6">Crowdsource high-quality drops by launching an escrowed contest.</p>
                <Link href="/dashboard/company/contests/create" className="bg-[#00ff9d] text-zinc-900 font-bold px-6 py-3 rounded-xl uppercase tracking-widest text-xs hover:bg-[#00cc7d] transition">
                    Create Contest
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-zinc-900 uppercase tracking-tighter flex items-center gap-3">
                    <Trophy className="text-[#00ff9d]" /> Active Contests
                </h2>
                <Link href="/dashboard/company/contests/create" className="bg-zinc-900 text-white font-bold px-4 py-2 rounded-xl uppercase tracking-widest text-[10px] hover:bg-zinc-800 flex items-center gap-2">
                    New Contest <ArrowRight size={14} />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contests.map((contest) => (
                    <div key={contest._id} className="bg-white p-6 rounded-3xl border border-[#E8E8E8] shadow-sm hover:border-zinc-900 transition-all group">

                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${contest.status === 'active_escrow_funded' ? 'bg-[#00ff9d]/20 text-emerald-700' :
                                        contest.status === 'judging' ? 'bg-amber-100 text-amber-700' :
                                            contest.status === 'completed' ? 'bg-zinc-100 text-zinc-500' :
                                                'bg-red-100 text-red-700'
                                    }`}>
                                    {contest.status.replace(/_/g, ' ')}
                                </span>
                                <h3 className="text-xl font-black text-zinc-900 uppercase tracking-tighter mt-3 group-hover:underline">{contest.title}</h3>
                                <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Campaign: {contest.campaignId?.title || 'Unknown'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Prize Pool</p>
                                <p className="text-2xl font-black text-[#00ff9d]">${contest.prizePool}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-zinc-100">
                            <div className="flex items-center gap-2 text-zinc-500">
                                <Clock size={16} />
                                <span className="text-xs font-medium">{new Date(contest.deadline).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-zinc-500">
                                <Users size={16} />
                                <span className="text-xs font-medium">{contest.judgingType === 'community_hybrid' ? 'Hybrid Scoring' : 'Direct Judging'}</span>
                            </div>
                        </div>

                        {contest.status === 'active_escrow_funded' && new Date(contest.deadline) < new Date() && (
                            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                                <AlertCircle className="text-amber-500 shrink-0" size={18} />
                                <div>
                                    <p className="text-xs font-bold text-amber-900 uppercase">Deadline Reached</p>
                                    <button className="text-[10px] font-black uppercase bg-amber-500 text-white px-3 py-1.5 rounded-lg mt-2 hover:bg-amber-600 transition">
                                        Begin Judging
                                    </button>
                                </div>
                            </div>
                        )}

                        {contest.status === 'judging' && (
                            <div className="mt-4">
                                <Link href={`/contest/${contest._id}/judge`} className="w-full bg-zinc-900 text-white font-bold py-3 rounded-xl uppercase tracking-widest text-[11px] hover:bg-zinc-800 transition flex justify-center items-center gap-2">
                                    Judge Submissions <ArrowRight size={16} />
                                </Link>
                            </div>
                        )}

                        {contest.status === 'completed' && (
                            <div className="mt-4 flex justify-between items-center text-zinc-500 px-2">
                                <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> Escrow Released</span>
                                <Link href={`/contest/${contest._id}`} className="text-xs font-bold uppercase hover:text-zinc-900 underline">View Hub</Link>
                            </div>
                        )}

                    </div>
                ))}
            </div>
        </div>
    );
}

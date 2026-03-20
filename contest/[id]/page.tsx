'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import { Trophy, Clock, Users, ShieldCheck, ArrowUpRight, PlusCircle, CheckCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ContestHub() {
    const { id } = useParams();
    const { user, token } = useAuth();

    const [contest, setContest] = useState<any>(null);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // MODAL STATE
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [userDrops, setUserDrops] = useState<any[]>([]);
    const [selectedDropId, setSelectedDropId] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        if (!id) return;
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            // Fetch Contest Info
            const resC = await fetch(`/api/contests/${id}`);
            const dataC = await resC.json();
            if (dataC.success) setContest(dataC.contest);

            // Fetch Leaderboard
            const resL = await fetch(`/api/contests/${id}/leaderboard`);
            const dataL = await resL.json();
            if (dataL.success) setLeaderboard(dataL.leaderboard);

        } catch (error) {
            console.error("Hub Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyDropsForSubmission = async () => {
        if (!token || !user) return;
        try {
            // Using /api/posts with author filter instead of non-existent archives route
            const res = await fetch(`/api/posts?author=${(user as any).id}&type=DROP`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.posts) {
                setUserDrops(data.posts);
            }
        } catch (error) {
            console.error("Drop fetch error:", error);
        }
    };

    const openSubmissionModal = () => {
        setIsSubmitModalOpen(true);
        fetchMyDropsForSubmission();
    };

    const handleSubmission = async () => {
        setSubmitError('');
        setSubmitting(true);
        try {
            const res = await fetch(`/api/contests/${id}/entries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ dropId: selectedDropId })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            // Success! Close modal and refresh Leaderboard
            setIsSubmitModalOpen(false);
            fetchData();
        } catch (err: any) {
            setSubmitError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <p className="text-[#00ff9d] font-black uppercase text-xs animate-pulse tracking-[0.2em]">Synchronizing Escrow Network...</p>
        </div>
    );

    if (!contest) return <div className="min-h-screen bg-black text-white p-10 text-center">404 - Contest Not Found</div>;

    const isEndingSoon = new Date(contest.deadline).getTime() - new Date().getTime() < 86400000 * 3;
    const isClosed = contest.status !== 'active_escrow_funded';

    return (
        <div className="min-h-screen pb-24 md:pb-0 font-sans bg-[#F7F7F8]">
            <Sidebar />

            <div className="md:pl-16">
                <main className="max-w-7xl mx-auto px-6 py-10">

                    {/* ── HEADER BANNER ──── */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 md:p-16 relative overflow-hidden mb-12 shadow-2xl">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00ff9d]/10 rounded-full blur-[120px] pointer-events-none opacity-50"></div>
                        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col lg:flex-row gap-12 justify-between items-stretch">
                            <div className="flex-1 flex flex-col">
                                <div className="flex flex-wrap items-center gap-3 mb-8">
                                    <span className="px-4 py-1.5 bg-zinc-800/80 backdrop-blur-md border border-zinc-700 text-[#00ff9d] rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                        <ShieldCheck size={14} className="fill-current/20" /> Escrow Active
                                    </span>
                                    {isClosed && (
                                        <span className="px-4 py-1.5 bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                                            Signal Closed
                                        </span>
                                    )}
                                    <span className="px-4 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 text-zinc-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                                        Network Verified
                                    </span>
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-6 drop-shadow-2xl">
                                    {contest.title}
                                </h1>
                                <p className="text-zinc-400 text-lg mb-10 leading-relaxed max-w-2xl font-medium">
                                    {contest.description}
                                </p>

                                <div className="flex flex-wrap gap-4 mt-auto">
                                    {user?.role === 'rave_head' && !isClosed ? (
                                        <button
                                            onClick={openSubmissionModal}
                                            className="px-10 py-5 bg-[#00ff9d] text-black rounded-3xl text-[12px] font-black uppercase tracking-widest hover:bg-[#00cc7d] transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(0,255,157,0.3)] hover:scale-[1.02] active:scale-95"
                                        >
                                            <PlusCircle size={20} /> Deploy Submission
                                        </button>
                                    ) : (
                                        !user && <Link href="/login" className="px-10 py-5 bg-white text-black rounded-3xl text-[12px] font-black uppercase tracking-widest shadow-xl shadow-black/20 hover:bg-zinc-100 transition-all flex items-center gap-2">
                                            Login to Participate <ArrowUpRight size={18} />
                                        </Link>
                                    )}

                                    <Link href={`/campaign/${contest.campaignId?._id}`} className="px-10 py-5 bg-zinc-800/50 backdrop-blur-md text-white rounded-3xl text-[12px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all border border-zinc-700/50 flex items-center gap-2">
                                        View Campaign Signal <ArrowUpRight size={18} />
                                    </Link>
                                </div>
                            </div>

                            <div className="w-full lg:w-[400px] p-10 rounded-[2.5rem] bg-black/40 border border-zinc-800/50 backdrop-blur-xl flex flex-col shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Trophy size={120} />
                                </div>
                                <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-2 relative z-10">Escrow Total</h3>
                                <p className="text-6xl font-black text-[#00ff9d] tracking-tighter mb-10 relative z-10 drop-shadow-[0_0_20px_rgba(0,255,157,0.3)]">${contest.prizePool}</p>

                                <div className="space-y-4 mb-10 relative z-10">
                                    {contest.prizes.map((p: any) => (
                                        <div key={p.rank} className="flex justify-between text-sm items-center border-b border-zinc-800/50 pb-3 group/item">
                                            <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] group-hover/item:text-zinc-300 transition-colors">{p.title}</span>
                                            <span className="text-white font-black tracking-widest text-lg">${p.amount}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-auto space-y-4 relative z-10">
                                    <div className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/80 mb-2">
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} className={isEndingSoon ? 'text-red-400 animate-pulse' : 'text-zinc-500'} />
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${isEndingSoon ? 'text-red-400' : 'text-zinc-400'}`}>
                                                {isEndingSoon ? 'Ending Soon' : 'Signal Active'}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{new Date(contest.deadline).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-zinc-500 bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800/40">
                                        <Users size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Hybrid Protocol Validation</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── SPLIT LAYOUT: LEADERBOARD & MASONRY ──── */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                        {/* LEADERBOARD SIDEBAR */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                                    <Trophy className="text-[#00ff9d]" /> Live Leaderboard
                                </h3>
                                <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest bg-zinc-900 px-2 py-1 rounded">Top {leaderboard.length}</span>
                            </div>

                            <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden p-3 space-y-3 shadow-xl shadow-zinc-200">
                                {leaderboard.length === 0 ? (
                                    <div className="p-12 text-center text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] bg-black/20 rounded-3xl border border-dashed border-zinc-800">
                                        No signals deployed. Be the first!
                                    </div>
                                ) : (
                                    leaderboard.map((entry, idx) => (
                                        <div key={entry._id} className="p-5 bg-black rounded-[1.5rem] border border-zinc-800/50 flex items-center gap-4 hover:border-zinc-500 transition-all group relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-800/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                            {/* Rank Badge */}
                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs relative z-10 transition-transform group-hover:scale-110 ${idx === 0 ? 'bg-[#00ff9d] text-black shadow-[0_0_20px_rgba(0,255,157,0.4)]' :
                                                idx === 1 ? 'bg-zinc-200 text-black' :
                                                    idx === 2 ? 'bg-zinc-700 text-white' :
                                                        'bg-zinc-800 text-zinc-400'
                                                }`}>
                                                {idx + 1}
                                            </div>

                                            <div className="flex-1 min-w-0 relative z-10">
                                                <p className="text-[12px] font-black uppercase tracking-tight truncate group-hover:text-[#00ff9d] transition-colors leading-none mb-1">
                                                    {entry.raveHeadId?.name}
                                                </p>
                                                <div className="flex items-center gap-3">
                                                    <p className="text-[9px] text-zinc-500 font-black tracking-[0.2em] uppercase">
                                                        SCORE: {entry.currentLeaderboardScore}
                                                    </p>
                                                    {(entry.dropId?.metrics?.likes || 0) > 0 && (
                                                        <div className="text-[9px] text-emerald-500 font-black flex items-center gap-1">
                                                            <Sparkles size={8} /> +{entry.dropId.metrics.likes}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="p-3 bg-zinc-900/50 rounded-xl text-zinc-400 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                <ArrowUpRight size={16} />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* MASONRY FEED OF DROPS */}
                        <div className="lg:col-span-2 space-y-6">
                            <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2 mb-6">
                                Recent Submissions
                            </h3>

                            {leaderboard.length === 0 ? (
                                <div className="h-64 border-2 border-dashed border-zinc-800 rounded-3xl flex items-center justify-center">
                                    <p className="text-zinc-600 font-bold uppercase tracking-widest text-sm">Awaiting Signals</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {leaderboard.map((entry) => {
                                        const drop = entry.dropId;
                                        if (!drop) return null;
                                        return (
                                            <div key={drop._id} className="relative group overflow-hidden rounded-[2.5rem] border border-[#E8E8E8] bg-white hover:border-zinc-900 transition-all hover:shadow-2xl hover:shadow-zinc-200/50">
                                                {/* Preview Area (Simulated Media Render) */}
                                                <div className="aspect-[4/3] bg-zinc-900 flex flex-col items-center justify-center text-center overflow-hidden relative">
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                                    {/* If there was an image, render it, else render text */}
                                                    {drop.content?.mediaUrl ? (
                                                        <img src={drop.content.mediaUrl} alt="Drop Media" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                    ) : (
                                                        <div className="p-10 relative z-10">
                                                             <Sparkles size={32} className="text-zinc-800 mb-4 mx-auto opacity-20" />
                                                             <p className="font-bold text-zinc-300 break-words w-full italic uppercase tracking-widest text-[11px] leading-relaxed">{drop.content.text}</p>
                                                        </div>
                                                    )}

                                                    <div className="absolute bottom-6 right-6 z-20 translate-y-10 group-hover:translate-y-0 transition-transform">
                                                        <Link href={`/drop/${drop._id}`} className="p-4 bg-[#00ff9d] text-black rounded-2xl shadow-xl shadow-black/20">
                                                            <ArrowUpRight size={20} />
                                                        </Link>
                                                    </div>
                                                </div>

                                                <div className="p-8">
                                                    <div className="flex items-center gap-4 mb-6">
                                                        <div className="w-12 h-12 rounded-2xl bg-zinc-100 overflow-hidden flex-shrink-0 border-2 border-zinc-50 shadow-sm relative">
                                                            {entry.raveHeadId?.profileImage ? (
                                                                <img src={entry.raveHeadId.profileImage} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full bg-zinc-100 flex items-center justify-center font-black text-zinc-300 uppercase text-xs">
                                                                    {entry.raveHeadId?.name?.[0]}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[12px] font-black text-zinc-900 uppercase truncate tracking-tight">{entry.raveHeadId?.name}</p>
                                                            <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest">Signal Author</p>
                                                        </div>
                                                        <div className="px-3 py-1 bg-zinc-900 text-[#00ff9d] rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                            Rank {leaderboard.indexOf(entry) + 1}
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-6 items-center border-t border-zinc-100 pt-6">
                                                        <div className="flex items-center gap-2 text-zinc-400 group-hover:text-zinc-900 transition-colors">
                                                            <div className="p-2 bg-zinc-50 rounded-xl">👍</div>
                                                            <span className="text-[11px] font-black uppercase tracking-widest">{drop.metrics?.likes || 0}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-zinc-400 group-hover:text-zinc-900 transition-colors">
                                                            <div className="p-2 bg-zinc-50 rounded-xl">💬</div>
                                                            <span className="text-[11px] font-black uppercase tracking-widest">{drop.metrics?.comments || 0}</span>
                                                        </div>
                                                        <div className="ml-auto">
                                                             <span className="text-[10px] text-zinc-300 font-black uppercase tracking-[0.2em]">VALIDATED</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                </main>

                {/* ── SUBMISSION MODAL ──── */}
                {isSubmitModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-8 shadow-2xl relative">
                            <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Submit Drop</h2>
                            <p className="text-zinc-400 text-sm mb-6">Select a recent Drop from your portfolio to enter into the <span className="text-[#00ff9d]">{contest.title}</span> contest.</p>

                            {submitError && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl mb-4 text-sm font-bold">
                                    {submitError}
                                </div>
                            )}

                            <div className="max-h-96 overflow-y-auto space-y-3 mb-6 pr-2 custom-scrollbar">
                                {userDrops.length === 0 ? (
                                    <p className="text-zinc-500 text-center py-6">You have no eligible Drops in your portfolio. Create a Drop first!</p>
                                ) : (
                                    userDrops.map(drop => (
                                        <div
                                            key={drop._id}
                                            onClick={() => setSelectedDropId(drop._id)}
                                            className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedDropId === drop._id
                                                ? 'bg-[#00ff9d]/10 border-[#00ff9d] text-white'
                                                : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-700'
                                                }`}
                                        >
                                            <p className="text-sm font-bold truncate">{drop.content.text || drop.content.title || 'Visual Drop'}</p>
                                            {selectedDropId === drop._id && <CheckCircle size={16} className="text-[#00ff9d] absolute right-8 mt-[-18px]" />}
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsSubmitModalOpen(false)}
                                    className="flex-1 px-4 py-3 border border-zinc-700 text-zinc-300 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-zinc-800 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmission}
                                    disabled={!selectedDropId || submitting}
                                    className="flex-[2] px-4 py-3 bg-[#00ff9d] text-black rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#00cc7d] transition disabled:opacity-50 flex justify-center items-center"
                                >
                                    {submitting ? 'Authenticating...' : 'Lock In Submission'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

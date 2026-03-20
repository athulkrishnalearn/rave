"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AlertTriangle, MessagesSquare, CheckCircle, RotateCcw, Lock } from 'lucide-react';

export default function DisputesTab() {
    const { token } = useAuth();
    const [disputes, setDisputes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [acting, setActing] = useState<string | null>(null);

    const fetchDisputes = () => {
        setLoading(true);
        fetch('/api/admin/disputes', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => { setDisputes(data.disputes || []); setLoading(false); })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        if (token) fetchDisputes();
    }, [token]);

    const handleResolve = async (disputeId: string, decision: 'release' | 'refund') => {
        if (!confirm(`Are you absolutely sure you want to FORCE ${decision.toUpperCase()} this escrow? This action is irreversible.`)) return;
        setActing(disputeId);
        try {
            await fetch(`/api/dispute/${disputeId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ decision })
            });
            fetchDisputes();
        } catch (e) {
            alert('Failed to resolve dispute.');
        } finally {
            setActing(null);
        }
    };

    return (
        <div className="p-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-1 flex items-center gap-2">
                    <AlertTriangle size={24} className="text-red-500" /> Dispute Resolution Center
                </h2>
                <p className="text-sm font-mono text-zinc-500">Adjudicate active conflicts and manage locked funds.</p>
            </div>

            <div className="grid gap-6">
                {loading ? (
                    <div className="p-12 text-center animate-pulse font-mono text-zinc-400 border-2 border-dashed border-zinc-200 rounded-2xl">
                        Loading Conflict Data...
                    </div>
                ) : disputes.length === 0 ? (
                    <div className="p-16 text-center border-2 border-dashed border-zinc-200 rounded-2xl bg-white">
                        <CheckCircle className="mx-auto mb-4 text-green-500 opacity-50" size={48} />
                        <h3 className="text-xl font-black uppercase text-zinc-400">Zero Active Disputes</h3>
                        <p className="text-sm font-mono text-zinc-400 mt-2">All escrow contracts are operating nominally.</p>
                    </div>
                ) : disputes.map(dispute => (
                    <div key={dispute._id} className="bg-white border border-[#E8E8E8] rounded-2xl p-6 shadow-sm border-l-4 border-l-red-500 flex flex-col xl:flex-row gap-6">
                        <div className="flex-1 space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded text-white ${dispute.status === 'open' ? 'bg-red-500' : 'bg-emerald-500'}`}>
                                            {dispute.status}
                                        </span>
                                        <span className="text-xs font-mono text-zinc-400">ID: {dispute._id}</span>
                                    </div>
                                    <h3 className="text-xl font-black">Reason: {dispute.reason.replace(/_/g, ' ')}</h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] uppercase font-bold text-zinc-500">Locked Funds</p>
                                    <p className="text-2xl font-black flex items-center gap-1 justify-end"><Lock size={16} className="text-zinc-400" /> ${dispute.project?.agreedAmount || '?'}</p>
                                </div>
                            </div>

                            <div className="bg-red-50 text-red-900 p-4 rounded-xl text-sm border border-red-100">
                                <p className="font-bold mb-1">Initiator Claim ({dispute.raisedBy?.name}):</p>
                                <p className="font-mono text-xs">{dispute.description || 'No description provided.'}</p>
                            </div>

                            {dispute.evidence && (
                                <div className="text-sm">
                                    <span className="font-bold text-zinc-600">Attached Evidence:</span>{' '}
                                    <a href={dispute.evidence} target="_blank" className="text-blue-600 underline hover:text-blue-800 break-all">
                                        View File
                                    </a>
                                </div>
                            )}
                        </div>

                        <div className="flex xl:flex-col gap-3 justify-center border-t xl:border-t-0 xl:border-l border-zinc-100 pt-6 xl:pt-0 xl:pl-6 min-w-[200px]">
                            {dispute.status === 'open' ? (
                                <>
                                    <button
                                        disabled={acting === dispute._id}
                                        onClick={() => handleResolve(dispute._id, 'release')}
                                        className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-50 text-emerald-700 font-black uppercase text-[11px] tracking-wider rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                                    >
                                        <CheckCircle size={16} /> Rule in favor of Creator
                                    </button>
                                    <button
                                        disabled={acting === dispute._id}
                                        onClick={() => handleResolve(dispute._id, 'refund')}
                                        className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-zinc-950 text-white font-black uppercase text-[11px] tracking-wider rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50"
                                    >
                                        <RotateCcw size={16} /> Rule in favor of Brand
                                    </button>
                                </>
                            ) : (
                                <div className="text-center p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                                    <CheckCircle size={24} className="mx-auto text-emerald-500 mb-2" />
                                    <span className="text-xs font-bold uppercase text-zinc-500">Resolution Applied at:<br /> {new Date(dispute.updatedAt).toLocaleString()}</span>
                                </div>
                            )}

                            <a href={`/project/${dispute.project?._id}`} target="_blank" className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-zinc-600 font-black uppercase text-[11px] tracking-wider rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-colors">
                                <MessagesSquare size={16} /> Read Full Project Chat
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

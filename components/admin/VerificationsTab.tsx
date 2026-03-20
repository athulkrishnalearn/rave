"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Check, X, ShieldAlert, FileText, Building2 } from 'lucide-react';

export default function VerificationsTab() {
    const { token } = useAuth();
    const [pending, setPending] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [acting, setActing] = useState<string | null>(null);

    const fetchPending = () => {
        setLoading(true);
        fetch('/api/admin/verification', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => { setPending(data.users || []); setLoading(false); })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        if (token) fetchPending();
    }, [token]);

    const handleAction = async (userId: string, status: 'verified' | 'rejected') => {
        setActing(userId);
        try {
            await fetch('/api/admin/verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ userId, status })
            });
            fetchPending();
        } catch (e) {
            alert('Failed to process verification.');
        } finally {
            setActing(null);
        }
    };

    return (
        <div className="p-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-1 flex items-center gap-2">
                    <ShieldAlert size={24} className="text-amber-500" /> Identity Verification Queue
                </h2>
                <p className="text-sm font-mono text-zinc-500">{pending.length} profiles awaiting review.</p>
            </div>

            {loading ? (
                <div className="p-12 text-center animate-pulse font-mono text-zinc-400 border-2 border-dashed border-zinc-200 rounded-2xl">
                    Querying Verification Database...
                </div>
            ) : pending.length === 0 ? (
                <div className="p-16 text-center border-2 border-dashed border-zinc-200 rounded-2xl bg-zinc-50">
                    <Check className="mx-auto mb-4 text-zinc-300" size={48} />
                    <h3 className="text-xl font-black uppercase text-zinc-400">Queue Clear</h3>
                    <p className="text-sm font-mono text-zinc-400 mt-2">All pending profiles have been processed.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {pending.map(user => (
                        <div key={user._id} className="bg-white border border-[#E8E8E8] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded text-white ${user.role === 'og_vendor' ? 'bg-blue-600' : 'bg-pink-600'}`}>
                                            {user.role === 'og_vendor' ? 'VENDOR' : 'RAVE HEAD'}
                                        </span>
                                        {user.vendorType === 'company' && (
                                            <span className="bg-zinc-800 text-white px-2 py-0.5 text-[10px] font-black uppercase rounded flex items-center gap-1">
                                                <Building2 size={10} /> Company
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-black uppercase">{user.brandName || user.name}</h3>
                                    <p className="text-sm font-mono text-zinc-500">{user.email}</p>
                                </div>

                                <div className="bg-zinc-50 p-4 rounded-xl text-xs font-mono space-y-2 border border-zinc-100">
                                    <div className="flex justify-between items-center text-zinc-600">
                                        <span className="font-bold">Submitted:</span>
                                        <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-zinc-600">
                                        <span className="font-bold flex items-center gap-1"><FileText size={12} /> ID Document:</span>
                                        {user.idDocument ? (
                                            <a href={user.idDocument} target="_blank" className="text-blue-600 underline truncate max-w-[150px] hover:text-blue-800">Review File</a>
                                        ) : (
                                            <span className="text-red-500">Missing</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex md:flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-zinc-100 pt-6 md:pt-0 md:pl-6">
                                <button
                                    disabled={acting === user._id}
                                    onClick={() => handleAction(user._id, 'verified')}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-green-500 text-black font-black uppercase text-[11px] tracking-wider rounded-xl hover:bg-green-400 transition-colors disabled:opacity-50"
                                >
                                    <Check size={16} /> Approve Profile
                                </button>
                                <button
                                    disabled={acting === user._id}
                                    onClick={() => handleAction(user._id, 'rejected')}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-red-50 text-red-600 font-black uppercase text-[11px] tracking-wider rounded-xl border border-red-100 hover:bg-red-100 transition-colors disabled:opacity-50"
                                >
                                    <X size={16} /> Reject & Suspend
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

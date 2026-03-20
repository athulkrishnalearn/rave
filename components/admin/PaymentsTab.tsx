"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DollarSign, ArrowUpRight, ArrowDownRight, ShieldCheck, AlertOctagon, Clock } from 'lucide-react';
import Link from 'next/link';

export default function PaymentsTab() {
    const { token } = useAuth();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        fetch('/api/admin/projects', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => { setProjects(data.projects || []); setLoading(false); })
            .catch(() => setLoading(false));
    }, [token]);

    const escrowLedger = projects.filter(p => p.status !== 'CANCELLED' && p.status !== 'REJECTED');

    return (
        <div className="p-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-1 flex items-center gap-2">
                    <DollarSign size={24} className="text-emerald-500" /> Escrow Ledger & Payments
                </h2>
                <p className="text-sm font-mono text-zinc-500">Monitor all frozen and settled fiat channels.</p>
            </div>

            <div className="bg-white border border-[#E8E8E8] rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-50 border-b border-zinc-200 uppercase text-[11px] font-black tracking-wider text-zinc-500">
                            <tr>
                                <th className="p-4 w-48">Hash (Project)</th>
                                <th className="p-4">Gross Vol</th>
                                <th className="p-4">Platform Fee (15%)</th>
                                <th className="p-4">Net Payout</th>
                                <th className="p-4">Ledger State</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 font-mono text-xs">
                            {loading ? (
                                <tr><td colSpan={5} className="p-8 text-center text-zinc-400">Syncing with banking layer...</td></tr>
                            ) : escrowLedger.map(proj => {
                                const isSettled = proj.paymentStatus === 'RELEASED';
                                const fee = proj.agreedAmount * 0.15;
                                const net = proj.agreedAmount - fee;

                                return (
                                    <tr key={proj._id} className="hover:bg-zinc-50/50 transition-colors">
                                        <td className="p-4">
                                            <Link href={`/project/${proj._id}`} className="text-blue-600 hover:underline truncate block max-w-[120px]" title={proj._id}>{proj._id}</Link>
                                            <div className="text-[10px] text-zinc-400 mt-1">{new Date(proj.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold font-sans text-sm">${proj.agreedAmount.toFixed(2)}</div>
                                            <div className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5"><ArrowDownRight size={10} className="text-emerald-500" /> Captured</div>
                                        </td>
                                        <td className="p-4 text-purple-600 font-bold">
                                            ${fee.toFixed(2)}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold font-sans text-sm">${net.toFixed(2)}</div>
                                            <div className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5"><ArrowUpRight size={10} className="text-blue-500" /> To: {proj.raveHeadId?.name || 'Creator'}</div>
                                        </td>
                                        <td className="p-4">
                                            {isSettled ? (
                                                <span className="flex items-center gap-1 text-[11px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded w-max">
                                                    <ShieldCheck size={12} /> Settled
                                                </span>
                                            ) : proj.status === 'DISPUTED' ? (
                                                <span className="flex items-center gap-1 text-[11px] font-black uppercase text-red-600 bg-red-50 px-2 py-1 rounded w-max">
                                                    <AlertOctagon size={12} /> Frozen
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-[11px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-1 rounded w-max">
                                                    <Clock size={12} /> Pending Delivery
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ArrowUpRight, DollarSign, Download, ExternalLink, Zap, ShieldAlert, CreditCard, Activity, CheckCircle } from "lucide-react";

export default function VendorPaymentsPage() {
    const { token } = useAuth();
    const [metrics, setMetrics] = useState<any>({ totalSpent: 0, inEscrow: 0, pendingFunding: 0, totalTransactions: 0 });
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        fetch("/api/dashboard/company/payments", {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setMetrics(data.metrics);
                    setHistory(data.history);
                }
                setLoading(false);
            })
            .catch(e => {
                console.error(e);
                setLoading(false);
            });
    }, [token]);

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'PAYOUT': return <CheckCircle size={16} className="text-green-500" />;
            case 'ESCROW': return <ShieldAlert size={16} className="text-amber-500" />;
            case 'PENDING': return <CreditCard size={16} className="text-zinc-400" />;
            default: return <Zap size={16} className="text-violet-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-[#F7F7F8] font-sans pb-24 md:pb-0">
            <Sidebar />

            <div className="md:pl-16">
                <main className="max-w-7xl mx-auto px-6 py-10">
                    <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black text-zinc-900 uppercase tracking-tighter leading-none mb-2">
                                Financials <span className="text-zinc-300 italic">Money Out</span>
                            </h1>
                            <p className="text-[12px] text-zinc-400 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                                <Activity size={14} className="text-zinc-900" /> Tracking {metrics.totalTransactions} Network Transactions
                            </p>
                        </div>
                        <button className="px-8 py-4 bg-white border border-[#E8E8E8] text-zinc-900 rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-all flex items-center gap-2">
                            <Download size={14} /> Export CSV
                        </button>
                    </div>

                    {loading ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[1, 2, 3].map(i => <div key={i} className="h-40 bg-white rounded-[2rem] border border-[#E8E8E8] animate-pulse" />)}
                            </div>
                            <div className="h-96 bg-white rounded-[3rem] border border-[#E8E8E8] animate-pulse" />
                        </div>
                    ) : (
                        <>
                            {/* METRICS ROW */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                <div className="bg-white rounded-[2rem] border border-[#E8E8E8] p-8 shadow-sm">
                                    <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center mb-6">
                                        <DollarSign size={20} />
                                    </div>
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-1">Total Lifetime Escrowed & Released</h4>
                                    <p className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tighter">${(metrics.totalSpent + metrics.inEscrow).toLocaleString()}</p>
                                </div>
                                <div className="bg-amber-50 rounded-[2rem] border border-amber-200 p-8 shadow-sm">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20">
                                        <ShieldAlert size={20} />
                                    </div>
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-amber-600 mb-1">Currently Locked in Escrow</h4>
                                    <p className="text-4xl md:text-5xl font-black text-amber-900 tracking-tighter">${metrics.inEscrow.toLocaleString()}</p>
                                </div>
                                <div className="bg-white rounded-[2rem] border border-[#E8E8E8] p-8 shadow-sm">
                                    <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-500 flex items-center justify-center mb-6">
                                        <CreditCard size={20} />
                                    </div>
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-1">Action Required (Unfunded)</h4>
                                    <p className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tighter">${metrics.pendingFunding.toLocaleString()}</p>
                                </div>
                            </div>

                            {/* TRANSACTION HISTORY */}
                            <div className="bg-white border border-[#E8E8E8] rounded-[3rem] p-8 md:p-10 shadow-sm overflow-hidden">
                                <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-tighter mb-8">Transaction Log</h3>
                                
                                {history.length === 0 ? (
                                    <div className="text-center py-10">
                                        <p className="text-zinc-400 font-bold">No financial history available yet.</p>
                                        <Link href="/create/campaign" className="text-violet-500 font-bold uppercase text-[10px] tracking-widest hover:underline mt-2 inline-block">Deploy a brief to start</Link>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto no-scrollbar">
                                        <table className="w-full text-left border-collapse min-w-[600px]">
                                            <thead>
                                                <tr className="border-b border-zinc-100">
                                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Date</th>
                                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Invoice ID</th>
                                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Recipient</th>
                                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Entity / Amount</th>
                                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Type</th>
                                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {history.map((tx: any) => (
                                                    <tr key={tx._id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors group">
                                                        <td className="py-5 text-[12px] font-bold text-zinc-500">{new Date(tx.createdAt).toLocaleDateString()}</td>
                                                        <td className="py-5 text-[12px] font-mono text-zinc-400 break-all pr-4">RAVE-{String(tx._id).slice(-8).toUpperCase()}</td>
                                                        <td className="py-5 text-[14px] font-bold text-zinc-900 min-w-[150px]">{tx.creator?.brandName || tx.creator?.name || "Unknown"}</td>
                                                        <td className="py-5 text-lg font-black text-zinc-900 tracking-tighter">${tx.dealAmount?.toLocaleString()}</td>
                                                        <td className="py-5">
                                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest ${
                                                                tx.transactionType === 'PAYOUT' ? 'bg-green-50 text-green-700 border-green-200' :
                                                                tx.transactionType === 'ESCROW' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                                'bg-zinc-100 text-zinc-500 border-zinc-200'
                                                            }`}>
                                                                {tx.transactionType === 'PAYOUT' && <Zap size={10} />}
                                                                {tx.transactionType === 'ESCROW' && <ShieldAlert size={10} />}
                                                                {tx.transactionType}
                                                            </div>
                                                        </td>
                                                        <td className="py-5 text-right">
                                                            <Link href={`/project/${tx._id}`} className="inline-flex w-8 h-8 rounded-full bg-white border border-[#E8E8E8] items-center justify-center text-zinc-400 hover:text-zinc-900 hover:border-zinc-300 transition-colors">
                                                                <ArrowUpRight size={14} />
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}



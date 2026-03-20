"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FileText, Download, Clock, CheckCircle, ShieldCheck, User } from 'lucide-react';

export default function InvoicesTab() {
    const { token } = useAuth();
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        fetch('/api/invoices', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setInvoices(data.invoices || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [token]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PAID': return <CheckCircle size={14} className="text-emerald-500" />;
            case 'SENT': return <Clock size={14} className="text-blue-500" />;
            default: return <FileText size={14} className="text-zinc-400" />;
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4">
            <div className="mb-8">
                <h2 className="text-lg font-black text-zinc-900 uppercase tracking-tighter flex items-center gap-3">
                    <FileText size={20} className="text-zinc-300" /> Financial Records
                </h2>
                <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Platform Invoices & Service Receipts</p>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="py-12 text-center text-zinc-300 font-black uppercase text-[10px] tracking-widest">Retrieving Ledger...</div>
                ) : invoices.length > 0 ? (
                    invoices.map((inv) => (
                        <div key={inv._id} className="bg-white p-6 rounded-3xl border border-[#E8E8E8] hover:border-zinc-900 transition-all shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-2xl ${inv.type === 'PLATFORM' ? 'bg-zinc-950 text-white' : 'bg-amber-50 text-amber-600'}`}>
                                    {inv.type === 'PLATFORM' ? <ShieldCheck size={24} /> : <User size={24} />}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{inv.invoiceNumber}</span>
                                        <div className="flex items-center gap-1 px-2 py-0.5 bg-zinc-50 rounded-full text-[9px] font-black uppercase text-zinc-400 border border-zinc-100">
                                            {getStatusIcon(inv.status)} {inv.status}
                                        </div>
                                    </div>
                                    <h4 className="text-base font-black text-zinc-900 uppercase tracking-tight truncate max-w-[240px]">
                                        {inv.description || (inv.type === 'PLATFORM' ? 'RAVE Platform Fee' : 'Creator Service')}
                                    </h4>
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
                                        {new Date(inv.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between w-full md:w-auto gap-8">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Amount Due</p>
                                    <h3 className="text-2xl font-black text-zinc-900 tracking-tighter">₹{inv.totalAmount.toLocaleString()}</h3>
                                </div>
                                <button 
                                    onClick={() => window.open(`/api/invoices/${inv._id}?download=true`)}
                                    className="p-4 bg-zinc-50 text-zinc-300 rounded-2xl hover:bg-zinc-900 hover:text-white transition-all shadow-sm"
                                >
                                    <Download size={20} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 bg-white rounded-3xl border-2 border-dashed border-zinc-100 text-center">
                        <FileText size={40} className="mx-auto text-zinc-100 mb-4" />
                        <p className="text-[12px] font-black text-zinc-300 uppercase tracking-widest">No invoices generated yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}

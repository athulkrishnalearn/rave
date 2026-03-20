"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LifeBuoy, Plus, MessageCircle, AlertCircle, FileText, ChevronRight, X, Send } from "lucide-react";

export default function SupportPage() {
    const { token, user } = useAuth();
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [isCreating, setIsCreating] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [newPriority, setNewPriority] = useState('MEDIUM');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!token) return;
        fetch("/api/support", {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) setTickets(data.tickets);
                setLoading(false);
            })
            .catch(e => {
                console.error(e);
                setLoading(false);
            });
    }, [token]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch("/api/support", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ title: newTitle, description: newDesc, priority: newPriority })
            });
            const data = await res.json();
            if (data.success) {
                setTickets([data.ticket, ...tickets]);
                setIsCreating(false);
                setNewTitle('');
                setNewDesc('');
                setNewPriority('MEDIUM');
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error(error);
        }
        setSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-[#F7F7F8] font-sans pb-24 md:pb-0">
            <Sidebar />

            <div className="md:pl-16">
                <main className="max-w-7xl mx-auto px-6 py-10">
                    <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black text-zinc-900 uppercase tracking-tighter leading-none mb-2">
                                RAVE <span className="text-zinc-300 italic">Support</span>
                            </h1>
                            <p className="text-[12px] text-zinc-400 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                                <LifeBuoy size={14} className="text-zinc-900" /> Help Center & Ticketing
                            </p>
                        </div>
                        <button onClick={() => setIsCreating(true)} className="px-8 py-4 bg-zinc-900 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-xl shadow-zinc-900/20">
                            <Plus size={14} /> Open Ticket
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* LEFT: Tickets List */}
                        <div className="col-span-1 lg:col-span-2 space-y-4">
                            <h2 className="text-[12px] font-black uppercase tracking-widest text-zinc-500 mb-6">Your Recent Tickets</h2>
                            
                            {loading ? (
                                [1, 2, 3].map(i => <div key={i} className="bg-white h-24 rounded-[1.5rem] border border-[#E8E8E8] animate-pulse" />)
                            ) : tickets.length === 0 ? (
                                <div className="bg-white rounded-[2rem] border border-dashed border-zinc-200 p-12 text-center">
                                    <MessageCircle size={32} className="text-zinc-300 mx-auto mb-4" />
                                    <p className="text-zinc-500 font-bold tracking-tighter">No active tickets.</p>
                                    <p className="text-zinc-400 text-sm mt-2">If you need help, open a new ticket.</p>
                                </div>
                            ) : (
                                tickets.map(ticket => (
                                    <div key={ticket._id} className="bg-white rounded-[1.5rem] border border-[#E8E8E8] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-lg hover:shadow-zinc-200/50 transition-all cursor-pointer group">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                                    ticket.status === 'OPEN' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                    ticket.status === 'RESOLVED' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                                                }`}>
                                                    {ticket.status}
                                                </span>
                                                <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-zinc-100 text-zinc-500 border border-zinc-200">
                                                    {ticket.priority} PRIORITY
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-black text-zinc-900 tracking-tighter truncate max-w-md group-hover:text-violet-600 transition-colors">{ticket.title}</h3>
                                            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                                                Created {new Date(ticket.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all shrink-0">
                                            <ChevronRight size={16} />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* RIGHT: Quick Links / KB */}
                        <div className="col-span-1 border border-[#E8E8E8] rounded-[2rem] p-6 bg-white self-start sticky top-10">
                            <h2 className="text-[12px] font-black uppercase tracking-widest text-zinc-500 mb-6">Knowledge Base</h2>
                            <div className="space-y-3">
                                <Link href="#" className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 hover:bg-zinc-100 transition-colors border border-zinc-100">
                                    <div className="flex items-center gap-3">
                                        <FileText size={16} className="text-zinc-400" />
                                        <span className="text-[13px] font-bold text-zinc-900">How Escrow works</span>
                                    </div>
                                    <ChevronRight size={14} className="text-zinc-400" />
                                </Link>
                                <Link href="#" className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 hover:bg-zinc-100 transition-colors border border-zinc-100">
                                    <div className="flex items-center gap-3">
                                        <FileText size={16} className="text-zinc-400" />
                                        <span className="text-[13px] font-bold text-zinc-900">Ranking & OG Score</span>
                                    </div>
                                    <ChevronRight size={14} className="text-zinc-400" />
                                </Link>
                                <Link href="#" className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 hover:bg-zinc-100 transition-colors border border-zinc-100">
                                    <div className="flex items-center gap-3">
                                        <AlertCircle size={16} className="text-amber-500" />
                                        <span className="text-[13px] font-bold text-zinc-900">Dispute Policy</span>
                                    </div>
                                    <ChevronRight size={14} className="text-zinc-400" />
                                </Link>
                            </div>

                            <div className="mt-8 p-5 bg-violet-50 rounded-xl border border-violet-100 text-center">
                                <p className="text-[12px] font-bold text-violet-900 mb-2">Need immediate assistance?</p>
                                <a href="mailto:support@rave.network" className="text-xs font-black uppercase tracking-widest text-violet-600 hover:text-violet-800 underline">support@rave.network</a>
                            </div>
                        </div>
                    </div>

                    {/* CREATE TICKET MODAL */}
                    {isCreating && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in">
                            <div className="bg-white w-full max-w-lg rounded-[2.5rem] border border-[#E8E8E8] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                                <div className="p-6 md:p-8">
                                    <div className="flex items-start justify-between mb-8">
                                        <div>
                                            <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 leading-none">Open Ticket</h2>
                                            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mt-2">A RAVE agent will respond shortly.</p>
                                        </div>
                                        <button onClick={() => setIsCreating(false)} className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400 hover:bg-zinc-200 hover:text-zinc-900 transition-colors">
                                            <X size={16} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleCreate} className="space-y-5">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5 block">Subject / Issue Title</label>
                                            <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)}
                                                placeholder="e.g. Payment failed for Neon Project" required autoFocus
                                                className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl text-[14px] font-bold text-zinc-900 placeholder:text-zinc-300 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5 block">Description</label>
                                            <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)}
                                                placeholder="Provide as much detail as possible..." rows={4} required
                                                className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl text-[14px] font-medium text-zinc-900 placeholder:text-zinc-300 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all resize-none" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5 block">Priority</label>
                                            <select value={newPriority} onChange={e => setNewPriority(e.target.value)}
                                                className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl text-[12px] font-bold uppercase tracking-widest text-zinc-900 outline-none focus:border-zinc-900 transition-all">
                                                <option value="LOW">Low - General Inquiry</option>
                                                <option value="MEDIUM">Medium - Need help</option>
                                                <option value="HIGH">High - Payment / Blocking issue</option>
                                            </select>
                                        </div>

                                        <button type="submit" disabled={submitting} 
                                            className="w-full py-4 mt-4 bg-zinc-900 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-[#00ff9d] hover:text-black hover:shadow-xl hover:shadow-[#00ff9d]/20 transition-all flex items-center justify-center gap-2">
                                            {submitting ? 'Submitting...' : <><Send size={14} /> Send Ticket</>}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import {
    Handshake, MessageSquare, Clock, CheckCircle,
    AlertTriangle, DollarSign, ChevronRight, Search
} from "lucide-react";

type TabType = 'Ongoing' | 'Pending' | 'History';

export default function CollaborationsPage() {
    const { user, token } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>('Ongoing');
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCollabs() {
            try {
                const res = await fetch("/api/project/list", {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();

                // Merge Projects and Applications
                const projects = (data.projects || []).map((p: any) => ({ ...p, _kind: 'PROJECT' }));
                const applications = (data.applications || []).map((a: any) => ({ ...a, _kind: 'APPLICATION' }));

                setItems([...projects, ...applications]);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        if (token) fetchCollabs();
    }, [token]);

    if (!user) return (
        <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center p-4">
            <div className="text-center">
                <p className="text-zinc-400 font-black uppercase text-xl mb-6 italic tracking-tighter italic">Join the collab network</p>
                <Link href="/login" className="px-8 py-4 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-800 transition-all">
                    Inbound Access Required
                </Link>
            </div>
        </div>
    );

    const filtered = items.filter(item => {
        if (activeTab === 'Pending') {
            return (item._kind === 'APPLICATION' && item.status === 'PENDING');
        }
        if (activeTab === 'Ongoing') {
            return (item._kind === 'PROJECT' && (item.status === 'ACTIVE' || item.status === 'SUBMITTED' || item.status === 'REVISION' || item.status === 'AWAITING_FUNDS'));
        }
        if (activeTab === 'History') {
            return (item._kind === 'PROJECT' && (item.status === 'COMPLETED' || item.status === 'CANCELLED'));
        }
        return true;
    });

    return (
        <div className="min-h-screen pb-20 md:pb-0 font-sans bg-[#F7F7F8]">
            <Sidebar />

            <div className="md:pl-16">
                <main className="max-w-4xl mx-auto px-4 py-8">

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-zinc-900 uppercase tracking-tighter leading-tight">
                                Workspace
                            </h1>
                            <p className="text-[13px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
                                Managing {items.length} Active & Past Collabs
                            </p>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <Link href="/explore" className="flex-1 md:flex-none px-5 py-3 bg-white border border-[#E8E8E8] text-zinc-900 rounded-xl text-[12px] font-black uppercase tracking-widest hover:border-zinc-400 transition-all text-center">
                                Browse Drops
                            </Link>
                            <Link href="/create" className="flex-1 md:flex-none px-5 py-3 bg-zinc-900 text-white rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all text-center">
                                New Request
                            </Link>
                        </div>
                    </div>

                    {/* ── TABS ──── */}
                    <div className="flex gap-2 mb-8 bg-white p-1 rounded-2xl border border-[#E8E8E8] w-fit">
                        {(['Ongoing', 'Pending', 'History'] as TabType[]).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${activeTab === tab ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200" : "text-zinc-400 hover:text-zinc-600"}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* ── PROJECT LIST ──── */}
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-40 bg-white rounded-3xl border border-[#E8E8E8] animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filtered.length === 0 ? (
                                <div className="py-24 bg-white rounded-3xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-center">
                                    <Search className="text-zinc-200 mb-4" size={48} />
                                    <p className="text-zinc-400 text-[14px] font-black uppercase">No {activeTab.toLowerCase()} projects found</p>
                                    <p className="text-[11px] text-zinc-300 font-bold uppercase tracking-widest mt-1">Start collaborating to see them here</p>
                                </div>
                            ) : (
                                filtered.map(item => {
                                    if (item._kind === 'APPLICATION') {
                                        const c = item.campaign;
                                        const isOwner = (user as any).id === (c?.author?._id || c?.author || c?.vendorId?._id || c?.vendorId);

                                        return (
                                            <div key={item._id} className="bg-white p-6 rounded-3xl border border-[#E8E8E8] shadow-sm relative overflow-hidden">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider bg-amber-50 text-amber-600 border border-amber-100 italic">
                                                                PENDING PROPOSAL
                                                            </span>
                                                            <span className="text-[9px] font-black uppercase text-zinc-300 tracking-widest">
                                                                #APP-{item._id.slice(-6).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-xl font-black text-zinc-900 uppercase tracking-tighter leading-none mb-4">
                                                            {item.campaign?.content?.title || item.campaign?.title || "Custom Collaboration"}
                                                        </h3>
                                                        <div className="flex items-center gap-6">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center font-black text-zinc-400 text-xs uppercase overflow-hidden">
                                                                    {item.applicant?.profileImage ? (
                                                                         <img src={item.applicant.profileImage} alt="" className="w-full h-full object-cover" />
                                                                     ) : (item.applicant?.name?.[0] || item.applicant?.[0] || "U")}
                                                                </div>
                                                                <span className="text-[12px] font-black text-zinc-700 uppercase">{item.applicant?.brandName || item.applicant?.name}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 font-black text-zinc-900 text-[13px] italic">
                                                                <DollarSign size={14} className="text-green-600" /> ${item.quote}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        {isOwner ? (
                                                            <Link href={`/applicants/${item.campaign?._id || item.campaign}`} className="px-5 py-2.5 bg-zinc-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all">
                                                                Review Proposal
                                                            </Link>
                                                        ) : (
                                                            <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-100">
                                                                Waiting for Response
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 -rotate-45 translate-x-12 -translate-y-12" />
                                            </div>
                                        );
                                    }

                                    const isVendor = (user as any).id === (item.vendor?._id || item.vendor);
                                    const partner = isVendor ? item.creator : item.vendor;
                                    const statusLabel = item.status.replace("_", " ");

                                    return (
                                        <Link key={item._id} href={`/project/${item._id}`} className="block group">
                                            <div className="bg-white p-6 rounded-3xl border border-[#E8E8E8] hover:border-zinc-900 transition-all shadow-sm group-hover:shadow-xl group-hover:shadow-zinc-200/50">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider ${item.status === 'ACTIVE' ? 'bg-zinc-900 text-white italic' :
                                                                item.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-700' :
                                                                    item.status === 'REVISION' ? 'bg-amber-100 text-amber-700' :
                                                                        item.status === 'AWAITING_FUNDS' ? 'bg-indigo-100 text-indigo-700' :
                                                                            'bg-zinc-100 text-zinc-400'
                                                                }`}>
                                                                {statusLabel}
                                                            </span>
                                                            <span className="text-[9px] font-black uppercase text-zinc-300 tracking-widest">
                                                                #RAVE-{item._id.slice(-6).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-xl font-black text-zinc-900 uppercase tracking-tighter leading-none mb-4 group-hover:underline">
                                                            {item.campaign?.content?.title || item.campaign?.title || "Custom Collaboration"}
                                                        </h3>
                                                        <div className="flex items-center gap-6">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center font-black text-zinc-400 text-xs">
                                                                    {(partner?.profileImage || partner?.image) ? (
                                                                        <img src={partner?.profileImage || partner?.image} alt={partner?.name} className="w-full h-full object-cover" />
                                                                    ) : partner?.brandName?.[0] || partner?.name?.[0]}
                                                                </div>
                                                                <span className="text-[12px] font-black text-zinc-700 uppercase">{partner?.brandName || partner?.name}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 font-black text-zinc-900 text-[13px] italic">
                                                                <DollarSign size={14} className="text-green-600" /> ${item.agreedAmount}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 md:pl-6 md:border-l border-zinc-100">
                                                        <div className="hidden md:block text-right mr-4">
                                                            <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mb-1">Last Sync</p>
                                                            <p className="text-[11px] text-zinc-900 font-bold uppercase">{new Date(item.updatedAt).toLocaleDateString()}</p>
                                                        </div>
                                                        <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-300 group-hover:bg-zinc-900 group-hover:text-white transition-all">
                                                            <ChevronRight size={20} />
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })
                            )}
                        </div>
                    )}

                    {/* Support Link */}
                    <div className="mt-12 text-center p-8 bg-zinc-900 rounded-3xl text-white">
                        <Handshake size={32} className="mx-auto mb-4 text-zinc-700" />
                        <h4 className="text-[13px] font-black uppercase tracking-widest mb-2">Mediation & Support</h4>
                        <p className="text-[11px] text-zinc-400 font-bold italic max-w-xs mx-auto mb-6">In case of a dispute, our smart-meditation team is ready to intervene manually.</p>
                        <Link href="/dispute/create" className="px-6 py-2.5 bg-white/10 border border-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all inline-block">
                            Open Dispute Claim
                        </Link>
                    </div>

                </main>
            </div>
        </div>
    );
}

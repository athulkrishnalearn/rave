"use client";

import { useEffect, useState, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import ContestsManager from "@/components/dashboard/company/ContestsManager";
import InvoicesTab from "@/components/dashboard/InvoicesTab";
import {
    Briefcase, MessageSquare, CheckCircle, Clock,
    ArrowRight, DollarSign, Zap, Bell, Plus,
    ChevronRight, TrendingUp, Users, Trophy,
    Sparkles, BookOpen, FileText
} from "lucide-react";

function DashboardContent() {
    const { user, token, isLoading: authLoading } = useAuth();
    const searchParams = useSearchParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const initialTab = (searchParams.get('tab') as 'campaigns' | 'contests' | 'invoices') || 'campaigns';
    const [activeTab, setActiveTab] = useState<'campaigns' | 'contests' | 'invoices'>(initialTab);

    useEffect(() => {
        if (searchParams.get('tab')) {
            setActiveTab(searchParams.get('tab') as any);
        }
    }, [searchParams]);

    useEffect(() => {
        if (!token) return;
        async function fetchDashboard() {
            try {
                const res = await fetch('/api/dashboard', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const jsonData = await res.json();
                setData(jsonData);
            } catch (error) {
                console.error("Dashboard fetch error", error);
            } finally {
                setLoading(false);
            }
        }
        fetchDashboard();
    }, [token]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center">
                <p className="text-zinc-400 font-black uppercase text-xs animate-pulse tracking-[0.2em]">Synchronizing Network Data...</p>
            </div>
        );
    }

    if (!user) return (
        <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center">
            <Link href="/login" className="px-8 py-4 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest">Login Required</Link>
        </div>
    );

    const stats = data?.stats || { activeProjects: 0, totalSpend: 0, totalEarnings: 0, campaignCount: 0, applicationCount: 0 };
    const isVendor = user.role === 'og_vendor';

    return (
        <div className="min-h-screen pb-20 md:pb-0 font-sans bg-[#F7F7F8]">
            <Sidebar />

            <div className="md:pl-16">
                <main className="max-w-6xl mx-auto px-6 py-10">

                    {/* ── HEADER ──── */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-zinc-900 uppercase tracking-tighter leading-tight">
                                {isVendor ? "Command Center" : "Creator Hub"}
                            </h1>
                            <p className="text-[14px] text-zinc-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                                <Zap size={14} className="text-zinc-900" /> System Active: {user.name}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Link href="/create" className="px-6 py-3.5 bg-zinc-900 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 flex items-center gap-2">
                                <Plus size={18} /> {isVendor ? "New Campaign" : "New Drop"}
                            </Link>
                        </div>
                    </div>

                    {/* ── ANALYTICS GRID ──── */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                        <div className="bg-white p-6 rounded-3xl border border-[#E8E8E8] shadow-sm">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Active Collabs</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-4xl font-black text-zinc-900 tracking-tighter">{stats.activeProjects}</h3>
                                <div className="p-2 bg-zinc-50 rounded-xl text-zinc-900">
                                    <TrendingUp size={20} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-[#E8E8E8] shadow-sm">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{isVendor ? "Total Spend" : "Total Earnings"}</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-4xl font-black text-zinc-900 tracking-tighter">${(isVendor ? stats.totalSpend : stats.totalEarnings).toLocaleString()}</h3>
                                <div className="p-2 bg-green-50 rounded-xl text-green-600">
                                    <DollarSign size={20} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-[#E8E8E8] shadow-sm">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{isVendor ? "Total Campaigns" : "Active Applications"}</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-4xl font-black text-zinc-900 tracking-tighter">{isVendor ? stats.campaignCount : stats.applicationCount}</h3>
                                <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                                    <Users size={20} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* ── MAIN ACTIONS / LISTS ──── */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Role Specific List / Tabs */}
                            <section>
                                {isVendor && (
                                    <div className="flex gap-4 border-b border-zinc-200 mb-6 px-2">
                                        <button
                                            onClick={() => setActiveTab('campaigns')}
                                            className={`pb-3 text-sm font-black uppercase tracking-widest transition-colors ${activeTab === 'campaigns' ? 'border-b-2 border-zinc-900 text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                                        >
                                            <Briefcase size={16} className="inline mr-2" />
                                            Campaigns
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('contests')}
                                            className={`pb-3 text-sm font-black uppercase tracking-widest transition-colors ${activeTab === 'contests' ? 'border-b-2 border-zinc-900 text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                                        >
                                            <Trophy size={16} className="inline mr-2" />
                                            Contests
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('invoices')}
                                            className={`pb-3 text-sm font-black uppercase tracking-widest transition-colors ${activeTab === 'invoices' ? 'border-b-2 border-zinc-900 text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                                        >
                                            <FileText size={16} className="inline mr-2" />
                                            Invoices
                                        </button>
                                    </div>
                                )}

                                {!isVendor && (
                                    <div className="flex justify-between items-center mb-6 border-b border-zinc-100 pb-2">
                                        <div className="flex gap-6">
                                            <button
                                                onClick={() => setActiveTab('campaigns')}
                                                className={`pb-2 text-[11px] font-black uppercase tracking-widest transition-colors ${activeTab === 'campaigns' ? 'text-zinc-900 border-b-2 border-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                                            >
                                                My Applications
                                            </button>
                                            <button
                                                onClick={() => setActiveTab('invoices')}
                                                className={`pb-2 text-[11px] font-black uppercase tracking-widest transition-colors ${activeTab === 'invoices' ? 'text-zinc-900 border-b-2 border-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                                            >
                                                Invoices
                                            </button>
                                        </div>
                                        <Link href="/collaborations" className="text-[10px] font-black uppercase text-zinc-400 hover:text-zinc-900 transition-colors">View All Archive</Link>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    {activeTab === 'invoices' ? (
                                        <InvoicesTab />
                                    ) : isVendor ? (
                                        activeTab === 'contests' ? (
                                            <ContestsManager />
                                        ) : data.campaigns?.length > 0 ? (
                                            data.campaigns.map((camp: any) => (
                                                <div key={camp._id} className="bg-white p-5 rounded-3xl border border-[#E8E8E8] hover:border-zinc-900 transition-all group shadow-sm">
                                                    <div className="flex items-center justify-between gap-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-[9px] font-black uppercase bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full">{camp.status}</span>
                                                                <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest">{camp.appCount} APPLICANTS</span>
                                                            </div>
                                                            <h4 className="text-base font-black text-zinc-900 uppercase tracking-tight group-hover:underline-offset-4 group-hover:underline">{camp.title}</h4>
                                                            <div className="mt-3 flex gap-2">
                                                                <Link href={`/dashboard/company/contests/create?campaignId=${camp._id}`} className="text-[9px] font-black uppercase bg-[#00ff9d] text-zinc-900 px-3 py-1.5 rounded-full hover:bg-[#00cc7d] transition-colors flex items-center gap-1 shadow-sm">
                                                                    🏆 Launch Contest
                                                                </Link>
                                                            </div>
                                                        </div>
                                                        <Link href={`/applicants/${camp._id}`} className="p-3 bg-zinc-50 text-zinc-300 rounded-2xl group-hover:bg-zinc-900 group-hover:text-white transition-all ml-2">
                                                            <ChevronRight size={20} />
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-12 bg-white rounded-3xl border-2 border-dashed border-zinc-100 text-center">
                                                <p className="text-[12px] font-black text-zinc-300 uppercase">No active campaigns</p>
                                                <Link href="/create" className="text-[10px] font-black uppercase text-zinc-900 underline mt-2 inline-block">Post First Project</Link>
                                            </div>
                                        )
                                    ) : (
                                        data.applications?.length > 0 ? (
                                            data.applications.map((app: any) => (
                                                <div key={app._id} className="bg-white p-5 rounded-3xl border border-[#E8E8E8] hover:border-zinc-900 transition-all group shadow-sm">
                                                    <div className="flex items-center justify-between gap-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${app.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                                                                    app.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                                        'bg-zinc-100 text-zinc-500'
                                                                    }`}>{app.status}</span>
                                                                <p className="text-[9px] text-zinc-300 font-bold uppercase tracking-widest">{new Date(app.createdAt).toLocaleDateString()}</p>
                                                            </div>
                                                            <h4 className="text-base font-black text-zinc-900 uppercase tracking-tight group-hover:underline">{app.campaign?.title}</h4>
                                                        </div>
                                                        {app.project ? (
                                                            <Link href={`/project/${app.project._id}`} className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Workspace</Link>
                                                        ) : (
                                                            <div className="p-3 bg-zinc-50 text-zinc-300 rounded-2xl">
                                                                <Clock size={18} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-12 bg-white rounded-3xl border-2 border-dashed border-zinc-100 text-center">
                                                <p className="text-[12px] font-black text-zinc-300 uppercase">No active applications</p>
                                                <Link href="/" className="text-[10px] font-black uppercase text-zinc-900 underline mt-2 inline-block">Browse Opportunities</Link>
                                            </div>
                                        )
                                    )}
                                </div>
                            </section>

                            <section>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-lg font-black text-zinc-900 uppercase tracking-tighter flex items-center gap-3">
                                        <Sparkles size={20} className="text-zinc-300" /> Creator Accelerator
                                    </h2>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Link href="/ai-tools" className="relative overflow-hidden p-6 bg-white border border-[#E8E8E8] rounded-[2.5rem] group hover:border-zinc-900 transition-all shadow-sm">
                                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                                            <Sparkles size={80} />
                                        </div>
                                        <Sparkles className="text-zinc-900 mb-4" size={32} />
                                        <h4 className="text-xl font-black uppercase tracking-tighter text-zinc-900">AI Command Center</h4>
                                        <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Marketing & Programming Copilots</p>
                                        <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase bg-zinc-900 text-white w-fit px-3 py-1.5 rounded-full">
                                            Sync Now <ArrowRight size={12} />
                                        </div>
                                    </Link>
                                    <Link href="/learning-hub" className="relative overflow-hidden p-6 bg-white border border-[#E8E8E8] rounded-[2.5rem] group hover:border-zinc-900 transition-all shadow-sm">
                                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                                            <BookOpen size={80} />
                                        </div>
                                        <BookOpen className="text-zinc-900 mb-4" size={32} />
                                        <h4 className="text-xl font-black uppercase tracking-tighter text-zinc-900">RAVE Playbooks</h4>
                                        <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Creator & Freelancing Skills</p>
                                        <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase bg-amber-500 text-white w-fit px-3 py-1.5 rounded-full">
                                            Start Library <ArrowRight size={12} />
                                        </div>
                                    </Link>
                                </div>
                            </section>

                            <section>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-lg font-black text-zinc-900 uppercase tracking-tighter flex items-center gap-3">
                                        <Zap size={20} className="text-zinc-300" /> Quick Discovery
                                    </h2>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Link href="/" className="p-6 bg-zinc-900 rounded-[2.5rem] text-white group hover:bg-zinc-800 transition-all">
                                        <Users className="text-zinc-600 mb-4 group-hover:text-white transition-colors" size={32} />
                                        <h4 className="text-xl font-black uppercase tracking-tighter">Explore Network</h4>
                                        <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Discover new creative drops</p>
                                    </Link>
                                    <Link href="/create" className="p-6 bg-white border border-[#E8E8E8] rounded-[2.5rem] text-zinc-900 group hover:border-zinc-900 transition-all">
                                        <Plus className="text-zinc-200 mb-4 group-hover:text-zinc-900 transition-colors" size={32} />
                                        <h4 className="text-xl font-black uppercase tracking-tighter">New Transmission</h4>
                                        <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Post a brief or work drop</p>
                                    </Link>
                                </div>
                            </section>
                        </div>

                        {/* ── SIDEBAR SNIPPETS ──── */}
                        <div className="space-y-8">

                            {/* Recent Briefs (Messages) */}
                            <section>
                                <h2 className="text-sm font-black text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <MessageSquare size={16} className="text-zinc-300" /> Recent Briefs
                                </h2>
                                <div className="bg-white rounded-3xl border border-[#E8E8E8] overflow-hidden shadow-sm">
                                    {data.inbox?.length > 0 ? (
                                        data.inbox.map((msg: any) => (
                                            <Link key={msg._id} href={`/inbox?u=${msg.sender?._id || msg.sender}`} className="p-4 border-b border-zinc-50 flex gap-3 hover:bg-zinc-50 transition-colors group">
                                                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center font-black text-zinc-400 overflow-hidden shrink-0">
                                                    {msg.sender?.image ? <img src={msg.sender.image} className="w-full h-full object-cover" /> : msg.sender?.name?.[0]}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[12px] font-black text-zinc-900 uppercase truncate leading-none mb-1">{msg.sender?.name}</p>
                                                    <p className="text-[11px] text-zinc-400 truncate font-medium">{msg.content}</p>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-zinc-200">
                                            <MessageSquare size={24} className="mx-auto mb-2 opacity-50" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">Quiet in the network</p>
                                        </div>
                                    )}
                                    <Link href="/inbox" className="p-3 bg-zinc-50 flex items-center justify-center text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-zinc-900 transition-colors">
                                        Open Full Secure Inbox
                                    </Link>
                                </div>
                            </section>

                            {/* Synchronization Alerts (Notifications) */}
                            <section>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-sm font-black text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                                        <Bell size={16} className="text-zinc-300" /> Synchronization
                                    </h2>
                                    <Link href="/notifications" className="text-[9px] font-black uppercase text-zinc-400 hover:text-zinc-900 transition-colors">Alerts Log</Link>
                                </div>
                                <div className="space-y-3">
                                    {data.notifications?.length > 0 ? (
                                        data.notifications.slice(0, 3).map((notif: any) => (
                                            <Link key={notif._id} href={notif.link || "/notifications"} className={`p-4 border rounded-2xl block transition-all hover:border-zinc-900 ${notif.read ? "bg-white border-[#E8E8E8]" : "bg-zinc-900 text-white border-zinc-900"}`}>
                                                <div className="flex gap-3">
                                                    <Zap size={14} className={notif.read ? "text-zinc-300" : "text-zinc-500"} />
                                                    <div>
                                                        <p className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${notif.read ? "text-zinc-400" : "text-zinc-500"}`}>Signal Recvd</p>
                                                        <p className={`text-[12px] font-medium leading-tight ${notif.read ? "text-zinc-600" : "text-zinc-200"}`}>{notif.message}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="p-4 border border-[#E8E8E8] bg-white rounded-2xl text-center py-8">
                                            <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">No active signals</p>
                                        </div>
                                    )}
                                </div>
                            </section>

                        </div>

                    </div>

                </main>
            </div>
        </div>
    );
}

export default function Dashboard() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center">
                <p className="text-zinc-400 font-black uppercase text-xs animate-pulse tracking-[0.2em]">Initializing Dashboard...</p>
            </div>
        }>
            <DashboardContent />
        </Suspense>
    );
}

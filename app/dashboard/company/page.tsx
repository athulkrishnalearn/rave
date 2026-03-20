"use client";

import { useEffect, useState, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import {
    Briefcase, MessageSquare, Clock, Zap, Plus, ChevronRight, 
    TrendingUp, Users, AlertCircle, Calendar, CreditCard, ShieldCheck
} from "lucide-react";

function VendorDashboardHub() {
    const { user, token, isLoading: authLoading } = useAuth();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
                <p className="text-zinc-400 font-black uppercase text-xs animate-pulse tracking-[0.2em]">Loading Command Center...</p>
            </div>
        );
    }

    if (!user) return null;

    const stats = data?.stats || { activeProjects: 0, totalSpend: 0, campaignCount: 0, pendingApplicants: 0, ogScore: 0, avgResponseTime: "N/A" };
    const actionRequired = data?.actionRequired || [];
    const recentActivity = data?.notifications || [];

    return (
        <div className="min-h-screen pb-20 md:pb-0 font-sans bg-[#F7F7F8]">
            <Sidebar />

            <div className="md:pl-16">
                <main className="max-w-6xl mx-auto px-6 py-10">
                    
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-zinc-900 uppercase tracking-tighter leading-tight">
                                Vendor Dashboard
                            </h1>
                            <p className="text-[14px] text-zinc-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                                <Zap size={14} className="text-zinc-900" /> Command Center: {user.name}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Link href="/create" className="px-6 py-3.5 bg-zinc-900 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 flex items-center gap-2">
                                <Plus size={18} /> New Campaign
                            </Link>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                        {/* Active Collabs */}
                        <div className="bg-white p-5 rounded-3xl border border-[#E8E8E8] shadow-sm flex flex-col justify-between">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 flex items-center justify-between">
                                Active Projects <Briefcase size={14} className="text-zinc-300" />
                            </p>
                            <h3 className="text-3xl font-black text-zinc-900 tracking-tighter mt-4">{stats.activeProjects}</h3>
                        </div>

                        {/* Open Posts / Campaigns */}
                        <div className="bg-white p-5 rounded-3xl border border-[#E8E8E8] shadow-sm flex flex-col justify-between">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 flex items-center justify-between">
                                Open Posts <TrendingUp size={14} className="text-zinc-300" />
                            </p>
                            <h3 className="text-3xl font-black text-zinc-900 tracking-tighter mt-4">{stats.campaignCount}</h3>
                        </div>
                        
                        {/* Pending Applicants */}
                        <div className="bg-white p-5 rounded-3xl border border-[#E8E8E8] shadow-sm flex flex-col justify-between">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 flex items-center justify-between">
                                Pending Applicants <Users size={14} className="text-zinc-300" />
                            </p>
                            <h3 className="text-3xl font-black text-zinc-900 tracking-tighter mt-4">{stats.pendingApplicants}</h3>
                        </div>

                        {/* Total Spent */}
                        <div className="bg-white p-5 rounded-3xl border border-[#E8E8E8] shadow-sm flex flex-col justify-between">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 flex items-center justify-between">
                                Total Spent <CreditCard size={14} className="text-zinc-300" />
                            </p>
                            <h3 className="text-3xl font-black text-green-600 tracking-tighter mt-4">${stats.totalSpend.toLocaleString()}</h3>
                        </div>
                        
                        {/* OG Score */}
                        <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800 shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 flex items-center justify-between">
                                OG Score <ShieldCheck size={14} className="text-zinc-400" />
                            </p>
                            <div className="flex items-end gap-2 mt-4">
                                <h3 className="text-3xl font-black text-white tracking-tighter">{stats.ogScore}</h3>
                                <span className="text-[12px] text-zinc-500 font-bold mb-1">/ 100</span>
                            </div>
                        </div>

                        {/* Avg Response Time */}
                        <div className="bg-white p-5 rounded-3xl border border-[#E8E8E8] shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 flex items-center justify-between">
                                Avg Response <Clock size={14} className="text-zinc-300" />
                            </p>
                            <h3 className="text-2xl font-black text-zinc-900 tracking-tighter mt-4">{stats.avgResponseTime}</h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* LEFT COLUMN: Middle Data Fields */}
                        <div className="lg:col-span-2 space-y-8">
                            
                            {/* Action Required Widget */}
                            <section>
                                <h2 className="text-sm font-black text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <AlertCircle size={16} className="text-red-500" /> Action Required
                                </h2>
                                <div className="bg-red-50/50 rounded-3xl border border-red-100 overflow-hidden shadow-sm p-2 space-y-2">
                                    {actionRequired.length > 0 ? (
                                        actionRequired.map((action: any) => (
                                            <div key={action.id} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-red-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-red-100 text-red-600 rounded-xl">
                                                        <AlertCircle size={16} />
                                                    </div>
                                                    <p className="text-[13px] font-black text-zinc-900 tracking-tight">{action.text}</p>
                                                </div>
                                                <Link href={action.link} className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors">
                                                    Resolve
                                                </Link>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center bg-white rounded-2xl border border-red-50">
                                            <ShieldCheck size={24} className="mx-auto mb-2 text-green-400" />
                                            <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">You're all caught up</p>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Recent Activity Feed */}
                            <section>
                                <h2 className="text-sm font-black text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Zap size={16} className="text-zinc-300" /> Recent Activity
                                </h2>
                                <div className="bg-white rounded-3xl border border-[#E8E8E8] shadow-sm overflow-hidden p-2 space-y-1">
                                    {recentActivity.length > 0 ? recentActivity.map((notif: any) => (
                                        <div key={notif._id} className="p-4 flex gap-3 hover:bg-zinc-50 transition-colors rounded-2xl">
                                            <div className="w-10 h-10 rounded-xl flex-shrink-0 bg-zinc-100 flex items-center justify-center font-black text-zinc-400 overflow-hidden">
                                                {notif.sender?.image ? <img src={notif.sender.image} className="w-full h-full object-cover" /> : notif.sender?.name?.[0]}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <p className="text-[13px] font-medium text-zinc-800 leading-snug">
                                                        <span className="font-black text-zinc-900">{notif.sender?.name}</span> {notif.message}
                                                    </p>
                                                    <Link href={notif.link || "/notifications"} className="text-zinc-400 hover:text-zinc-900 transition-colors ml-4 p-1">
                                                        <ChevronRight size={16} />
                                                    </Link>
                                                </div>
                                                <p className="text-[11px] text-zinc-400 font-black uppercase tracking-widest mt-1">Just now</p>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="p-8 text-center text-zinc-200">
                                            <Clock size={24} className="mx-auto mb-2 opacity-50" />
                                            <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">No recent activity</p>
                                        </div>
                                    )}
                                    <Link href="/notifications" className="block text-center pt-3 pb-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors border-t border-zinc-100 mt-2">
                                        View Full Log
                                    </Link>
                                </div>
                            </section>
                        </div>

                        {/* RIGHT COLUMN: Deadlines & Quick actions */}
                        <div className="space-y-8">
                            
                            {/* Quick Actions */}
                            <section>
                                <h2 className="text-sm font-black text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Zap size={16} className="text-zinc-300" /> Quick Actions
                                </h2>
                                <div className="grid grid-cols-1 gap-2">
                                    <Link href="/create" className="p-4 bg-zinc-900 text-white rounded-2xl flex items-center gap-3 hover:bg-zinc-800 transition-colors group">
                                        <div className="bg-white/10 p-2 rounded-xl group-hover:scale-110 transition-transform">
                                            <Plus size={16} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-black text-[13px] uppercase tracking-wide">Post New Campaign</p>
                                            <p className="text-[10px] text-zinc-400 font-medium">Source new talent</p>
                                        </div>
                                    </Link>
                                    <Link href="/explore" className="p-4 bg-white border border-[#E8E8E8] rounded-2xl text-zinc-900 flex items-center gap-3 hover:border-zinc-300 transition-colors group">
                                        <div className="bg-zinc-50 p-2 rounded-xl group-hover:scale-110 transition-transform text-zinc-400">
                                            <Users size={16} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-black text-[13px] uppercase tracking-wide">Scout Talent</p>
                                            <p className="text-[10px] text-zinc-500 font-medium">Browse creator network</p>
                                        </div>
                                    </Link>
                                    <Link href="/dashboard/company/contests" className="p-4 bg-white border border-[#E8E8E8] rounded-2xl text-zinc-900 flex items-center gap-3 hover:border-zinc-300 transition-colors group">
                                        <div className="bg-zinc-50 p-2 rounded-xl group-hover:scale-110 transition-transform text-zinc-400">
                                            <TrendingUp size={16} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-black text-[13px] uppercase tracking-wide">Manage Contests</p>
                                            <p className="text-[10px] text-zinc-500 font-medium">View submissions</p>
                                        </div>
                                    </Link>
                                </div>
                            </section>

                            {/* Upcoming Deadlines */}
                            <section>
                                <h2 className="text-sm font-black text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Calendar size={16} className="text-zinc-300" /> Upcoming Deadlines
                                </h2>
                                <div className="bg-white rounded-3xl border border-[#E8E8E8] overflow-hidden p-4">
                                   <div className="flex flex-col gap-4">
                                       <div className="flex gap-3">
                                            <div className="flex flex-col items-center justify-center p-2 bg-red-50 text-red-600 rounded-xl min-w-[50px]">
                                                <span className="text-[10px] uppercase font-black uppercase">Oct</span>
                                                <span className="text-lg font-black leading-none">24</span>
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center">
                                                <p className="text-[13px] font-black text-zinc-900 leading-tight">Concept Review Due</p>
                                                <p className="text-[11px] text-zinc-500 mt-0.5">Project: Winter Campaign</p>
                                            </div>
                                       </div>
                                       <div className="flex gap-3">
                                            <div className="flex flex-col items-center justify-center p-2 bg-zinc-50 text-zinc-600 rounded-xl min-w-[50px]">
                                                <span className="text-[10px] uppercase font-black uppercase">Oct</span>
                                                <span className="text-lg font-black leading-none">28</span>
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center">
                                                <p className="text-[13px] font-black text-zinc-900 leading-tight">Escrow Release</p>
                                                <p className="text-[11px] text-zinc-500 mt-0.5">Project: 3D Animations</p>
                                            </div>
                                       </div>
                                   </div>
                                </div>
                            </section>

                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}

export default function VendorDashboard() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center">
                <p className="text-zinc-400 font-black uppercase text-xs animate-pulse tracking-[0.2em]">Initializing Vendor Dashboard...</p>
            </div>
        }>
            <VendorDashboardHub />
        </Suspense>
    );
}

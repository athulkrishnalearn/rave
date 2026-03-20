"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Clock, CheckCircle, AlertCircle, FileText, Download, MessageSquare, ArrowRight, Zap, MoreVertical } from "lucide-react";
import Image from "next/image";

export default function VendorCollaborationsPage() {
    const { token, user } = useAuth();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        fetch("/api/dashboard/company/collab", {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) setProjects(data.projects);
                setLoading(false);
            })
            .catch(e => {
                console.error(e);
                setLoading(false);
            });
    }, [token]);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'AWAITING_FUNDS': return 'bg-amber-100 text-amber-900 border-amber-200';
            case 'ACTIVE': return 'bg-blue-100 text-blue-900 border-blue-200';
            case 'SUBMITTED': return 'bg-purple-100 text-purple-900 border-purple-200';
            case 'REVISION': return 'bg-orange-100 text-orange-900 border-orange-200';
            case 'COMPLETED': return 'bg-green-100 text-green-900 border-green-200';
            case 'CANCELLED': return 'bg-red-100 text-red-900 border-red-200';
            default: return 'bg-zinc-100 text-zinc-900 border-zinc-200';
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
                                Active <span className="text-zinc-300 italic">Collabs</span>
                            </h1>
                            <p className="text-[12px] text-zinc-400 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                                <Zap size={14} className="text-zinc-900" /> Tracking {projects.length} Ongoing Engagements
                            </p>
                        </div>
                        <Link href="/create/campaign" className="px-8 py-4 bg-zinc-900 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/20">
                            New Project
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-[2rem] p-6 h-64 animate-pulse border border-[#E8E8E8]" />
                            ))}
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="bg-white rounded-[3rem] border border-dashed border-zinc-200 p-20 text-center flex flex-col items-center justify-center">
                            <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
                                <FileText size={32} className="text-zinc-300" />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter text-zinc-900 mb-2">No Active Projects</h3>
                            <p className="text-zinc-400 font-medium mb-8 max-w-sm">You haven't initiated any collaborations yet. Post a brief or discover talent to begin.</p>
                            <div className="flex gap-4">
                                <Link href="/explore" className="px-8 py-4 bg-white border border-[#E8E8E8] text-zinc-900 hover:bg-zinc-50 transition-all rounded-2xl text-[12px] font-black uppercase tracking-widest">
                                    Discover Creators
                                </Link>
                                <Link href="/create/campaign" className="px-8 py-4 bg-zinc-900 text-white hover:bg-zinc-800 transition-all rounded-2xl text-[12px] font-black uppercase tracking-widest">
                                    Deploy Brief
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <div key={project._id} className="bg-white rounded-[2.5rem] border border-[#E8E8E8] overflow-hidden hover:shadow-xl hover:shadow-zinc-200/50 transition-all group flex flex-col h-full">
                                    
                                    {/* Card Header & Meta */}
                                    <div className="p-6 pb-0 mb-4 flex justify-between items-start">
                                        <div className={`px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest ${getStatusStyles(project.status)}`}>
                                            {project.status.replace('_', ' ')}
                                        </div>
                                        <button className="text-zinc-400 hover:text-zinc-900 transition-colors p-2 -mr-2">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>

                                    {/* Project Details */}
                                    <div className="px-6 flex-1">
                                        <Link href={`/project/${project._id}`} className="block group-hover:opacity-80 transition-opacity">
                                            <h3 className="text-2xl md:text-3xl font-black text-zinc-900 uppercase tracking-tighter leading-none mb-2 line-clamp-2">
                                                {project.campaign?.content?.title || "Direct Collaboration"}
                                            </h3>
                                        </Link>
                                        <div className="flex items-center gap-3 mt-6">
                                            <Link href={`/profile/${project.creator.username || project.creator._id}`} className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                                                {project.creator.profileImage ? (
                                                    <img src={project.creator.profileImage} alt={project.creator.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-white font-black text-xs">
                                                        {project.creator.name?.[0]}
                                                    </div>
                                                )}
                                            </Link>
                                            <div>
                                                <p className="text-[9px] text-zinc-400 font-black uppercase tracking-widest mb-0.5">Creator</p>
                                                <Link href={`/profile/${project.creator.username || project.creator._id}`} className="text-[13px] font-bold text-zinc-900 hover:underline">
                                                    {project.creator.brandName || project.creator.name}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Bar Bottom */}
                                    <div className="mt-8 p-6 bg-zinc-50 border-t border-[#E8E8E8] flex justify-between items-center">
                                        <div>
                                            <p className="text-[9px] text-zinc-400 font-black uppercase tracking-widest mb-1">Deal Value</p>
                                            <p className="text-xl font-black text-zinc-900 leading-none">${project.dealAmount}</p>
                                        </div>

                                        <div className="flex gap-2">
                                            <Link href={`/inbox?u=${project.creator._id}`} className="w-10 h-10 bg-white border border-[#E8E8E8] rounded-xl flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 transition-all shadow-sm">
                                                <MessageSquare size={16} />
                                            </Link>
                                            <Link href={`/project/${project._id}`} className="h-10 px-4 bg-zinc-900 text-white rounded-xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest hover:bg-[#00ff9d] hover:text-black transition-all shadow-sm">
                                                Manage <ArrowRight size={14} className="ml-2" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

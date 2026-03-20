"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    ArrowLeft, Share2, Clock, DollarSign, CheckCircle,
    AlertCircle, Play, FileText, LayoutGrid, MessageSquare
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default function CampaignDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCampaign() {
            try {
                const res = await fetch(`/api/campaign/${params.id}`);
                const json = await res.json();
                if (json.campaign) setData(json);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchCampaign();
    }, [params.id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F7F7F8]">
            <p className="text-zinc-400 font-mono text-xs animate-pulse uppercase tracking-widest">Loading Brief...</p>
        </div>
    );

    if (!data) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F7F8]">
            <p className="text-zinc-600 font-black mb-4 uppercase">Campaign not found</p>
            <button onClick={() => router.back()} className="text-xs font-bold underline uppercase">Go Back</button>
        </div>
    );

    const { campaign, vendor, similar, postId } = data;

    return (
        <div className="min-h-screen pb-20 md:pb-0 font-sans bg-[#F7F7F8]">
            <Sidebar />

            <div className="md:pl-16">
                {/* ── HEADER / VIDEO SECTION ──── */}
                <div className="relative w-full h-[30vh] md:h-[50vh] bg-zinc-900 group overflow-hidden">
                    {/* Background Visual */}
                    <div className="absolute inset-0 opacity-40 bg-gradient-to-t from-black to-transparent z-10" />
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform cursor-pointer">
                            <Play size={24} className="text-white fill-white ml-1" />
                        </div>
                    </div>
                    {/* Info Overlay */}
                    <div className="absolute bottom-6 left-6 right-6 z-30 flex justify-between items-end max-w-5xl mx-auto">
                        <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-[11px] font-black uppercase tracking-wider border border-white/10 hover:bg-white hover:text-black transition-all">
                            <ArrowLeft size={14} /> Back to Feed
                        </Link>
                        <button className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/10 hover:bg-white hover:text-black transition-all">
                            <Share2 size={18} />
                        </button>
                    </div>
                </div>

                <main className="max-w-5xl mx-auto px-4 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* ── LEFT CONTENT: THE BRIEF ──── */}
                        <div className="flex-1 space-y-8">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-[10px] font-black bg-zinc-900 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Active Req</span>
                                    <span className="text-[10px] font-black bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase tracking-wider">{campaign.type || 'CREATOR'}</span>
                                </div>
                                <h1 className="text-3xl md:text-5xl font-black text-zinc-900 uppercase tracking-tighter leading-tight mb-4">
                                    {campaign.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-6 text-[13px] font-bold text-zinc-400 uppercase tracking-wide">
                                    <span className="flex items-center gap-2 text-zinc-900"><DollarSign size={16} className="text-zinc-400" /> ${campaign.payAmount} / Delivery</span>
                                    <span className="flex items-center gap-2"><Clock size={16} /> 2 Weeks Left</span>
                                    <span className="flex items-center gap-2"><LayoutGrid size={16} /> 3 Slots Open</span>
                                </div>
                            </div>

                            {/* Vendor Card */}
                            <div className="p-4 bg-white rounded-2xl border border-[#E8E8E8] flex items-center justify-between">
                                <Link href={`/profile/${vendor.username}`} className="flex items-center gap-3 group">
                                    <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-[#E8E8E8] overflow-hidden">
                                        {vendor.profileImage ? (
                                            <img src={vendor.profileImage} alt={vendor.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-white font-black">{vendor.brandName?.[0] || vendor.name?.[0]}</div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black uppercase text-zinc-900 group-hover:underline">{vendor.brandName || vendor.name}</p>
                                        <p className="text-[11px] text-zinc-400 flex items-center gap-1 uppercase font-bold tracking-widest">
                                            {vendor.verificationStatus === 'verified' && <CheckCircle size={10} className="text-blue-500" />} Verified Vendor
                                        </p>
                                    </div>
                                </Link>
                                <button className="px-4 py-2 border border-[#E8E8E8] rounded-xl text-[12px] font-black uppercase tracking-wider text-zinc-600 hover:bg-zinc-50 transition-colors flex items-center gap-2">
                                    <MessageSquare size={14} /> Contact
                                </button>
                            </div>

                            {/* Brief Sections */}
                            <div className="space-y-6">
                                <section>
                                    <h3 className="text-[12px] font-black uppercase text-zinc-400 tracking-widest mb-3 flex items-center gap-2">
                                        <FileText size={14} /> The Brief
                                    </h3>
                                    <div className="bg-white p-6 rounded-2xl border border-[#E8E8E8] text-zinc-600 text-[14px] leading-relaxed whitespace-pre-wrap font-medium">
                                        {campaign.description || "No description provided."}
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-[12px] font-black uppercase text-zinc-400 tracking-widest mb-3 flex items-center gap-2">
                                        <AlertCircle size={14} /> Requirements
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {(campaign.requirements?.length > 0 ? campaign.requirements : ["High production quality", "Native English speaker", "30-60s Duration"]).map((req: string, i: number) => (
                                            <div key={i} className="flex items-start gap-3 p-4 bg-white border border-[#E8E8E8] rounded-xl">
                                                <div className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 mt-0.5">
                                                    <span className="text-[10px] font-black">{i + 1}</span>
                                                </div>
                                                <span className="text-[13px] font-bold text-zinc-700">{req}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-[12px] font-black uppercase text-zinc-400 tracking-widest mb-3">Assets</h3>
                                    <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                                        {[1, 2].map(i => (
                                            <div key={i} className="w-40 h-24 bg-zinc-100 rounded-2xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center shrink-0 text-zinc-400">
                                                <span className="text-[11px] font-black uppercase mb-1">Brief_Doc_{i}.PDF</span>
                                                <span className="text-[9px] font-mono">2.4 MB</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </div>

                        {/* ── RIGHT CONTENT: APPLY & SIMILAR ──── */}
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-zinc-900 p-6 rounded-3xl shadow-xl shadow-zinc-200 sticky top-8">
                                <div className="text-center mb-6">
                                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Payment on Approval</p>
                                    <h3 className="text-4xl font-black text-white italic tracking-tighter">${campaign.payAmount}</h3>
                                </div>
                                <Link
                                    href={`/collaborate/${postId || campaign._id}`}
                                    className="block w-full py-4 bg-white text-zinc-900 rounded-2xl font-black uppercase text-center tracking-widest hover:bg-zinc-100 transition-all mb-4"
                                >
                                    Apply Now
                                </Link>
                                <p className="text-[10px] text-zinc-500 text-center leading-relaxed font-bold uppercase tracking-wider">
                                    By applying, you agree to the RAVE smart-escrow agreement.
                                </p>
                            </div>

                            {/* Similar Campaigns */}
                            {similar?.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-[12px] font-black uppercase text-zinc-400 tracking-widest">Explore Similar</h3>
                                    {similar.map((sim: any) => (
                                        <Link key={sim._id} href={`/campaign/${sim._id}`} className="block group">
                                            <div className="bg-white border border-[#E8E8E8] rounded-2xl overflow-hidden group-hover:border-zinc-400 transition-all">
                                                <div className="h-24 bg-zinc-100 relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-50 opacity-50" />
                                                </div>
                                                <div className="p-3">
                                                    <h4 className="text-[13px] font-black uppercase text-zinc-900 truncate">{sim.title}</h4>
                                                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mt-1">${sim.payAmount} / Task</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

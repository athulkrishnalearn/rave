"use client";

import { useEffect, useState } from "react";
import { Search, ArrowUpRight, Filter, Zap, TrendingUp, Sparkles, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import ContestCard from "@/components/explore/ContestCard";
import SignalCard from "@/components/explore/SignalCard";
import TalentDiscovery from "@/components/explore/TalentDiscovery";
import { useAuth } from "@/context/AuthContext";

export default function ExplorePage() {
    const { user, isLoading: authLoading } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All Drops");
    const [feed, setFeed] = useState<any[]>([]);

    const FILTERS = ["All Drops", "Campaigns", "Contests 🏆", "3D Motion", "Video Edit", "Branding", "Audio"];

    // Find the contest with the highest prize pool for the featured section
    const topContest = feed
        .filter(i => i.prizePool)
        .reduce((max, curr) => (curr.prizePool > (max?.prizePool || 0) ? curr : max), null as any);

    useEffect(() => {
        const fetchFeed = async () => {
            if (activeFilter === "Contests 🏆") {
                const res = await fetch(`/api/contests`);
                const data = await res.json();
                if (data.success) setFeed(data.contests);
            } else {
                const tab = activeFilter === "Campaigns" ? "requirements" : "foryou";
                const res = await fetch(`/api/feed?tab=${tab}`);
                const data = await res.json();
                if (data.feed) setFeed(data.feed);
            }
        };
        fetchFeed();
    }, [activeFilter]);

    if (authLoading) {
        return <div className="min-h-screen bg-[#F7F7F8]" />;
    }

    // Render vendor talent discovery instead of regular explore
    if ((user as any)?.role === 'og_vendor') {
        return (
            <div className="min-h-screen pb-24 md:pb-0 font-sans bg-[#F7F7F8]">
                <Sidebar />
                <div className="md:pl-16">
                    <main className="max-w-7xl mx-auto px-6 py-10">
                        <TalentDiscovery />
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-24 md:pb-0 font-sans bg-[#F7F7F8]">
            <Sidebar />

            <div className="md:pl-16">
                <main className="max-w-7xl mx-auto px-6 py-10">

                    {/* ── HEADER & SEARCH ──── */}
                    <div className="mb-12">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                            <div>
                                <h1 className="text-4xl md:text-6xl font-black text-zinc-900 uppercase tracking-tighter leading-none">
                                    Network <span className="text-zinc-300 italic">Feed</span>
                                </h1>
                                <p className="text-[14px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-3 flex items-center gap-2">
                                    <Zap size={14} className="text-zinc-900" /> Discovering 1.2k Active Signals
                                </p>
                            </div>
                        </div>

                        <div className="max-w-4xl mx-auto">
                            <div className="search-bar-container rounded-[2.5rem] px-8 py-4 shadow-sm group">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search drops, creative talent, or active campaigns..."
                                    className="search-bar-input text-lg font-bold tracking-tight text-zinc-900 placeholder:text-zinc-300 h-12"
                                />
                                <div className="flex items-center gap-4 shrink-0">
                                    <div className="w-px h-8 bg-zinc-100" />
                                    <Search className="text-zinc-300 group-focus-within:text-zinc-900 transition-colors" size={22} />
                                    <button className="p-3 bg-zinc-50 hover:bg-zinc-100 rounded-2xl text-zinc-400 transition-all border border-zinc-100">
                                        <Filter size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Quick Filters */}
                        <div className="flex gap-2 overflow-x-auto mt-6 pb-2 no-scrollbar">
                            {FILTERS.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => setActiveFilter(tag)}
                                    className={`px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeFilter === tag ? "bg-zinc-900 text-white shadow-lg" : "bg-white text-zinc-400 border border-[#E8E8E8] hover:border-zinc-900 hover:text-zinc-900"}`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── DISCOVERY GRID ──── */}
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-8">

                        {/* FEATURED MEGA CARD (Dynamics: Show Top Contest) */}
                        <div className="md:col-span-2 lg:col-span-3 lg:row-span-2 relative group overflow-hidden rounded-[3rem] bg-white shadow-2xl shadow-zinc-200/50 border border-[#E8E8E8] hover:border-zinc-900 transition-all">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#00ff9d]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="relative h-[45%] w-full overflow-hidden">
                                <Image
                                    src={topContest?.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=90"}
                                    alt={topContest?.title || "Featured Vision"}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                            </div>

                            <div className="p-10 flex flex-col justify-end relative z-10 flex-1">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                                        {topContest ? "Featured Contest" : "Featured Signal"}
                                        {topContest ? <Trophy size={14} className="text-[#00ff9d]" /> : <Sparkles size={14} />}
                                    </div>
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Prize Pool</span>
                                </div>

                                <h3 className="text-6xl md:text-8xl font-black text-zinc-900 uppercase leading-none tracking-tighter mb-4 italic">
                                    {topContest ? `$${topContest.prizePool}` : "Max Vision"}
                                </h3>
                                
                                <p className="text-zinc-500 text-lg font-black uppercase tracking-tight max-w-md mb-8 leading-tight">
                                    {topContest 
                                        ? topContest.title
                                        : "The future of high-fidelity 3D creative synchronization."}
                                </p>

                                <div className="flex items-center gap-4">
                                    <Link 
                                        href={topContest ? `/contest/${topContest._id}` : "/onboarding"} 
                                        className="px-10 py-5 bg-zinc-900 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-[#00ff9d] hover:text-black transition-all flex items-center gap-3 shadow-2xl shadow-zinc-200"
                                    >
                                        {topContest ? "Join Competition" : "Get Started"} <ArrowUpRight size={18} />
                                    </Link>
                                    {topContest?.author && (
                                        <div className="flex items-center gap-3 ml-4">
                                            <div className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-100 overflow-hidden relative">
                                                {topContest.author.image ? (
                                                    <Image src={topContest.author.image} alt="Host" fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-zinc-300 font-black text-xs uppercase">
                                                        {topContest.author.name?.[0]}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Hosted By</p>
                                                <p className="text-[11px] font-black text-zinc-900 uppercase">{topContest.author.brandName || topContest.author.name}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* TRENDING SMALL CARD */}
                        <div className="md:col-span-2 lg:col-span-3 bg-white border border-[#E8E8E8] rounded-[2.5rem] p-8 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 transition-all border-b-4 border-b-zinc-900">
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-zinc-900 text-white rounded-2xl shadow-lg">
                                        <TrendingUp size={24} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase text-zinc-300 tracking-[0.2em]">Active Sync</span>
                                </div>
                                <h4 className="text-2xl font-black text-zinc-900 uppercase tracking-tighter leading-none mb-2">Network Trending</h4>
                                <p className="text-zinc-400 text-sm font-medium leading-relaxed">Most synchronized creative modules this hour across the RAVE network.</p>
                            </div>
                            <div className="flex -space-x-3 mt-8">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-zinc-100 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?u=${i}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-zinc-900 flex items-center justify-center text-[10px] font-black text-white">+12</div>
                            </div>
                        </div>

                        {/* DISCOVERY GRID TILES / Campaigns / Contests */}
                        {feed.length === 0 ? (
                            <div className="col-span-full text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-zinc-200 shadow-sm">
                                <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                    <Zap size={24} className="text-zinc-200" />
                                </div>
                                <p className="text-zinc-400 font-black uppercase tracking-[0.2em] text-[10px]">Processing real-time signals...</p>
                            </div>
                        ) : activeFilter === "Contests 🏆" ? (
                            <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {feed.map((contest: any) => (
                                    <ContestCard key={contest._id} contest={contest} />
                                ))}
                            </div>
                        ) : activeFilter === "All Drops" ? (
                            <div className="col-span-full space-y-16">
                                {/* SECTION: CONTESTS */}
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h2 className="text-2xl font-black text-zinc-900 uppercase tracking-tighter flex items-center gap-3">
                                                <Trophy size={20} className="text-[#00ff9d]" /> Active Contests
                                            </h2>
                                            <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mt-1">High-stakes creative competitions</p>
                                        </div>
                                        <button onClick={() => setActiveFilter("Contests 🏆")} className="text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1">
                                            View All <ArrowUpRight size={14} />
                                        </button>
                                    </div>
                                    <div className="flex gap-6 overflow-x-auto pb-8 pt-2 no-scrollbar scroll-smooth snap-x">
                                        {feed.filter(i => i.prizePool).map((contest: any) => (
                                            <div key={contest._id} className="w-[350px] shrink-0 snap-start">
                                                <ContestCard contest={contest} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* SECTION: RECENT SIGNALS */}
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h2 className="text-2xl font-black text-zinc-900 uppercase tracking-tighter flex items-center gap-3">
                                                <Sparkles size={20} className="text-zinc-300" /> Recent Signals
                                            </h2>
                                            <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mt-1">Direct opportunities from the network</p>
                                        </div>
                                        <button onClick={() => setActiveFilter("Campaigns")} className="text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1">
                                            View All <ArrowUpRight size={14} />
                                        </button>
                                    </div>
                                    <div className="flex gap-6 overflow-x-auto pb-8 pt-2 no-scrollbar scroll-smooth snap-x">
                                        {feed.filter(i => !i.prizePool).map((post: any) => (
                                            <div key={post._id} className="snap-start">
                                                <SignalCard post={post} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {feed.map((post: any) => (
                                    <SignalCard key={post._id} post={post} />
                                ))}
                            </div>
                        )}

                    </div>

                    {/* Secondary Discover Section */}
                    <div className="mt-12 p-10 bg-white border border-[#E8E8E8] rounded-[3rem] shadow-sm flex flex-col md:flex-row items-center gap-10">
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-3xl font-black text-zinc-900 uppercase tracking-tighter leading-none mb-4 italic">The Global Talent Pool</h3>
                            <p className="text-zinc-500 font-medium leading-relaxed max-w-md">Our algorithm ensures high-fidelity matching between creative talent and premium brand campaigns.</p>
                        </div>
                        <div className="flex gap-4">
                            <Link href="/onboarding/rave-head" className="px-8 py-4 bg-zinc-900 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all">Join Network</Link>
                            <Link href="/onboarding/company" className="px-8 py-4 bg-white border border-zinc-900 text-zinc-900 rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-zinc-100 transition-all">Post Brief</Link>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}

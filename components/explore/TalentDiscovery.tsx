"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, ShieldCheck, MapPin, Zap, MessageSquare, Briefcase, Star, Clock } from "lucide-react";

export default function TalentDiscovery() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [talents, setTalents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const FILTERS = ["All", "3D Motion", "Video Editing", "VFX", "Branding", "Audio Sound", "PRO Only"];

    useEffect(() => {
        async function fetchTalent() {
            try {
                const searchParam = searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : '';
                const res = await fetch(`/api/explore/talent${searchParam}`);
                const data = await res.json();
                if (data.success) {
                    setTalents(data.talents);
                }
            } catch (error) {
                console.error("Talent fetch error", error);
            } finally {
                setLoading(false);
            }
        }
        
        // Debounce search slightly
        const timer = setTimeout(() => {
            fetchTalent();
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Apply local category filter since not all data is cleanly categorized on the backend
    const filteredTalents = talents.filter(t => {
        if (activeFilter === "All") return true;
        if (activeFilter === "PRO Only") return t.isPro;
        // Check if skills include the filter term approximately
        const filterStr = activeFilter.toLowerCase();
        return t.skills?.some((s: string) => s.toLowerCase().includes(filterStr));
    });

    return (
        <div className="pt-10">
            {/* Header & Search */}
            <div className="mb-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black text-zinc-900 uppercase tracking-tighter leading-none">
                            Talent <span className="text-zinc-300 italic">Discovery</span>
                        </h1>
                        <p className="text-[14px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-3 flex items-center gap-2">
                            <Zap size={14} className="text-zinc-900" /> Scouting {talents.length} verified creators
                        </p>
                    </div>
                </div>

                <div className="max-w-4xl">
                    <div className="search-bar-container rounded-[2rem] px-6 py-3 shadow-sm group">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by skills, software, or name..."
                            className="search-bar-input text-[16px] font-bold tracking-tight text-zinc-900 placeholder:text-zinc-300 h-10 w-full"
                        />
                        <div className="flex items-center gap-4 shrink-0">
                            <div className="w-px h-8 bg-zinc-100" />
                            <Search className="text-zinc-300 group-focus-within:text-zinc-900 transition-colors" size={20} />
                            <button className="p-2.5 bg-zinc-50 hover:bg-zinc-100 rounded-xl text-zinc-400 transition-all border border-zinc-100 flex items-center gap-2">
                                <Filter size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Filters</span>
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
                            className={`px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                activeFilter === tag 
                                ? "bg-zinc-900 text-white shadow-lg" 
                                : "bg-white text-zinc-400 border border-[#E8E8E8] hover:border-zinc-900 hover:text-zinc-900"
                            }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* TALENT LIST */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <Zap size={24} className="text-zinc-200" />
                        </div>
                        <p className="text-zinc-400 font-black uppercase tracking-[0.2em] text-[10px]">Scanning database...</p>
                    </div>
                ) : filteredTalents.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-zinc-200">
                        <Search size={32} className="mx-auto text-zinc-300 mb-4" />
                        <p className="text-zinc-500 font-bold">No creators found matching your criteria.</p>
                        <button onClick={() => {setSearchQuery(""); setActiveFilter("All");}} className="mt-4 text-[12px] font-black uppercase tracking-widest text-violet-600">Clear Filters</button>
                    </div>
                ) : (
                    filteredTalents.map((creator) => (
                        <div key={creator._id} className="bg-white rounded-[2rem] border border-[#E8E8E8] p-6 hover:shadow-xl hover:shadow-zinc-200/50 hover:border-zinc-300 transition-all flex flex-col md:flex-row gap-6">
                            
                            {/* Left Col: Core Identity */}
                            <div className="flex gap-5 md:w-1/3 shrink-0 relative">
                                <Link href={`/profile/${creator.username || creator._id}`} className="w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-zinc-100 shrink-0 overflow-hidden relative border-2 border-[#E8E8E8]">
                                    {creator.profileImage ? (
                                        <img src={creator.profileImage} alt={creator.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-white font-black text-2xl">
                                            {creator.name?.[0] || "?"}
                                        </div>
                                    )}
                                    {creator.isPro && (
                                        <div className="absolute bottom-1 right-1 bg-violet-600 text-white p-1 rounded-lg">
                                            <Zap size={12} fill="currentColor" />
                                        </div>
                                    )}
                                </Link>
                                <div className="flex flex-col justify-center">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Link href={`/profile/${creator.username || creator._id}`} className="text-lg font-black text-zinc-900 hover:underline line-clamp-1 break-all">
                                            {creator.name}
                                        </Link>
                                        {creator.verificationStatus === 'verified' && <ShieldCheck size={16} className="text-blue-500 shrink-0" />}
                                    </div>
                                    <p className="text-[12px] text-zinc-500 font-bold mb-2">@{creator.username}</p>
                                    
                                    <div className="flex flex-col gap-1.5 mt-auto">
                                        {creator.location && (
                                            <div className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5">
                                                <MapPin size={12} /> {creator.location}
                                            </div>
                                        )}
                                        {creator.rating > 0 && (
                                            <div className="text-[11px] font-bold text-zinc-600 flex items-center gap-1.5">
                                                <Star className="text-amber-400 fill-amber-400" size={12} /> {creator.rating.toFixed(1)} Avg Rating
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Middle Col: Value Prop & Skills */}
                            <div className="flex-1 border-y md:border-y-0 md:border-x border-[#E8E8E8] py-4 md:py-1 md:px-6">
                                <p className="text-[13px] text-zinc-700 leading-relaxed line-clamp-2 md:line-clamp-3 mb-4">
                                    {creator.headline || "Content creator on the RAVE network."}
                                </p>
                                
                                {creator.skills && creator.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {creator.skills.slice(0, 5).map((skill: string, i: number) => (
                                            <span key={i} className="px-2 py-1 bg-zinc-50 border border-zinc-200 text-zinc-600 text-[10px] font-black uppercase tracking-wider rounded-lg">
                                                {skill}
                                            </span>
                                        ))}
                                        {creator.skills.length > 5 && (
                                            <span className="px-2 py-1 bg-zinc-50 border border-zinc-200 text-zinc-400 text-[10px] font-black uppercase tracking-wider rounded-lg">
                                                +{creator.skills.length - 5}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Right Col: Actions & Rates */}
                            <div className="md:w-48 flex flex-col justify-between items-start md:items-end shrink-0 py-2">
                                <div className="w-full flex md:flex-col justify-between md:items-end mb-4 md:mb-0">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Indicative Rate</p>
                                    <div className="text-right">
                                        <p className="text-xl font-black text-green-600 leading-none">
                                            {creator.hourlyRate ? `$${creator.hourlyRate}` : "Negotiable"}
                                        </p>
                                        {creator.hourlyRate && <span className="text-[10px] text-zinc-400 font-bold uppercase">/ hour</span>}
                                    </div>
                                </div>

                                <div className="w-full flex flex-col gap-2">
                                    <Link href={`/create/campaign?invite=${creator._id}`} className="w-full py-2.5 bg-zinc-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
                                        <Briefcase size={14} /> Invite to Job
                                    </Link>
                                    <Link href={`/inbox?u=${creator._id}`} className="w-full py-2.5 border border-[#E8E8E8] bg-white text-zinc-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-all flex items-center justify-center gap-2">
                                        <MessageSquare size={14} /> Message
                                    </Link>
                                </div>
                            </div>

                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

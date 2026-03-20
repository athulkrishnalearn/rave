"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { 
    BookOpen, 
    Sparkles, 
    GraduationCap, 
    PenTool, 
    Smartphone, 
    Terminal, 
    Library, 
    ArrowRight,
    Search,
    Clock,
    Award
} from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
    { id: "creator", label: "Creator Skills", icon: PenTool, color: "bg-pink-50 text-pink-600" },
    { id: "freelance", label: "Freelancing", icon: BookOpen, color: "bg-indigo-50 text-indigo-600" },
    { id: "programming", label: "Programming", icon: Terminal, color: "bg-zinc-100 text-zinc-900" },
    { id: "career", label: "Career Growth", icon: GraduationCap, color: "bg-amber-50 text-amber-600" },
];



export default function LearningHubPage() {
    const [playbooks, setPlaybooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [activeCat, setActiveCat] = useState("all");

    useEffect(() => {
        fetch('/api/learning/playbooks')
            .then(res => res.json())
            .then(data => {
                setPlaybooks(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filteredPlaybooks = playbooks.filter(pb => {
        const matchesSearch = pb.title.toLowerCase().includes(search.toLowerCase());
        const matchesCat = activeCat === "all" || pb.cat === activeCat || pb.category === activeCat;
        return matchesSearch && matchesCat;
    });

    return (
        <div className="min-h-screen bg-[#F7F7F8] font-sans pb-20 md:pb-0">
            <Sidebar />

            <div className="md:pl-16">
                <main className="max-w-7xl mx-auto px-4 py-8">
                    
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-amber-500 text-white p-2.5 rounded-2xl shadow-lg shadow-amber-200">
                                    <Library size={24} />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black text-zinc-900 uppercase tracking-tighter leading-tight">Learning Hub</h1>
                                    <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Master your creative evolution</p>
                                </div>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-80">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                            <input 
                                type="text"
                                placeholder="Search Playbooks..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-11 pr-5 py-3.5 bg-white border border-[#EBEBEB] rounded-2xl text-[13px] font-medium outline-none focus:border-zinc-900 shadow-sm transition-all"
                            />
                        </div>
                    </div>

                    {/* Tutor Copilot CTA */}
                    <Link href="/learning-hub/tutor" className="block p-8 rounded-[40px] bg-zinc-900 text-white shadow-2xl shadow-zinc-200 mb-12 relative overflow-hidden group">
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="max-w-xl">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-6 h-6 rounded-lg bg-amber-500 flex items-center justify-center">
                                        <Sparkles size={12} />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">RAVE AI SYNCED</span>
                                </div>
                                <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Synchronize with Tutor Copilot</h2>
                                <p className="text-zinc-400 text-[14px] font-medium leading-relaxed">
                                    Need a personalized learning roadmap? Ask your Tutor AI to explain complex concepts, 
                                    create quizzes, or build a custom curriculum just for you.
                                </p>
                            </div>
                            <div className="shrink-0 flex items-center gap-4">
                                <div className="text-right hidden md:block">
                                    <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Current Status</p>
                                    <p className="text-[14px] font-bold">Latency: 28ms</p>
                                </div>
                                <div className="w-16 h-16 rounded-full bg-white text-zinc-900 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                                    <ArrowRight size={24} />
                                </div>
                            </div>
                        </div>
                        {/* Abstract Background element */}
                        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
                    </Link>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-8 pb-2">
                        <button 
                            onClick={() => setActiveCat("all")}
                            className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                activeCat === 'all' ? 'bg-zinc-900 text-white shadow-xl shadow-zinc-200' : 'bg-white text-zinc-400 hover:text-zinc-900'
                            }`}
                        >
                            All Playbooks
                        </button>
                        {CATEGORIES.map(cat => (
                            <button 
                                key={cat.id}
                                onClick={() => setActiveCat(cat.id)}
                                className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
                                    activeCat === cat.id ? 'bg-zinc-900 text-white shadow-xl shadow-zinc-200' : 'bg-white text-zinc-400 hover:text-zinc-900'
                                }`}
                            >
                                <cat.icon size={14} />
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Playbook Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPlaybooks.map(pb => (
                            <Link 
                                key={pb._id}
                                href={`/learning-hub/playbook/${pb._id}`}
                                className="group bg-white rounded-[32px] overflow-hidden border border-[#EBEBEB] shadow-sm hover:shadow-2xl hover:shadow-zinc-200/50 transition-all hover:-translate-y-1 flex flex-col h-full"
                            >
                                <div className="h-48 relative overflow-hidden">
                                    <img 
                                        src={pb.image} 
                                        alt={pb.title} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg ${
                                            CATEGORIES.find(c => c.id === pb.category)?.color || 'bg-white'
                                        }`}>
                                            {CATEGORIES.find(c => c.id === pb.category)?.label}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="text-lg font-black text-zinc-900 uppercase tracking-tight mb-2 group-hover:text-amber-500 transition-colors">
                                        {pb.title}
                                    </h3>
                                    <p className="text-[13px] text-zinc-500 font-medium mb-6 line-clamp-2">
                                        {pb.desc}
                                    </p>
                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={12} className="text-zinc-400" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{pb.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Award size={12} className="text-zinc-400" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{pb.level}</span>
                                            </div>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                                            <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {filteredPlaybooks.length === 0 && (
                        <div className="py-20 text-center bg-white rounded-[40px] border border-dashed border-[#EBEBEB]">
                            <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-300">
                                <Search size={32} />
                            </div>
                            <h3 className="text-lg font-black text-zinc-900 uppercase">No Playbooks Synced</h3>
                            <p className="text-zinc-400 text-[13px] mt-1">Try adjusting your search or filters.</p>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}

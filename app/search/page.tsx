"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { Search, Users, FileText, Briefcase, Filter, X } from "lucide-react";

type TabType = "Drops" | "Profiles" | "Requirements";

interface SearchResult {
    _id: string;
    type?: string;
    name?: string;
    username?: string;
    role?: string;
    bio?: string;
    skills?: string[];
    profileImage?: string;
    content?: { text: string; title?: string };
    author?: { name: string; username?: string; profileImage?: string };
    hashtags?: string[];
    metrics?: { likes: number; comments: number; reposts: number };
    createdAt?: string;
}

function timeAgo(date?: string) {
    if (!date) return "";
    const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (s < 3600) return `${Math.floor(s / 60)}m`;
    if (s < 86400) return `${Math.floor(s / 3600)}h`;
    return `${Math.floor(s / 86400)}d`;
}

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialQuery = searchParams.get("q") || "";

    const [query, setQuery] = useState(initialQuery);
    const [inputValue, setInputValue] = useState(initialQuery);
    const [activeTab, setActiveTab] = useState<TabType>("Drops");
    const [results, setResults] = useState<Record<TabType, SearchResult[]>>({ Drops: [], Profiles: [], Requirements: [] });
    const [loading, setLoading] = useState(false);

    const doSearch = async (q: string) => {
        if (!q.trim()) { setResults({ Drops: [], Profiles: [], Requirements: [] }); return; }
        setLoading(true);
        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
            if (res.ok) {
                const data = await res.json();
                setResults({
                    Drops: (data.drops || []).filter((p: any) => p.type !== "CAMPAIGN"),
                    Profiles: data.users || [],
                    Requirements: (data.drops || []).filter((p: any) => p.type === "CAMPAIGN"),
                });
            } else {
                // Fallback — search via feed
                const feedRes = await fetch(`/api/feed`);
                if (feedRes.ok) {
                    const feedData = await feedRes.json();
                    const posts = feedData.posts || feedData || [];
                    const filtered = posts.filter((p: any) =>
                        p.content?.text?.toLowerCase().includes(q.toLowerCase()) ||
                        p.content?.title?.toLowerCase().includes(q.toLowerCase()) ||
                        p.hashtags?.some((h: string) => h.toLowerCase().includes(q.toLowerCase()))
                    );
                    setResults({
                        Drops: filtered.filter((p: any) => p.type !== "CAMPAIGN"),
                        Profiles: [],
                        Requirements: filtered.filter((p: any) => p.type === "CAMPAIGN"),
                    });
                }
            }
        } catch { }
        setLoading(false);
    };

    useEffect(() => { doSearch(query); }, [query]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setQuery(inputValue);
        router.replace(`/search?q=${encodeURIComponent(inputValue)}`);
    };

    const TAB_ICONS: Record<TabType, React.ElementType> = { Drops: FileText, Profiles: Users, Requirements: Briefcase };
    const currentResults = results[activeTab];

    return (
        <div className="md:pl-16 max-w-2xl mx-auto px-4 pt-6 pb-20 md:pb-8">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={17} />
                <input
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    placeholder="Search drops, talent, requirements…"
                    className="w-full pl-11 pr-10 py-3 bg-white text-zinc-900 text-[14px]"
                    autoFocus
                />
                {inputValue && (
                    <button type="button" onClick={() => { setInputValue(""); setQuery(""); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                    >
                        <X size={16} />
                    </button>
                )}
            </form>

            {/* Tabs */}
            <div className="flex border-b border-[#E8E8E8] mb-5">
                {(["Drops", "Profiles", "Requirements"] as TabType[]).map(tab => {
                    const Icon = TAB_ICONS[tab];
                    const count = results[tab].length;
                    return (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`flex items-center gap-2 px-4 py-3 text-[12px] font-black uppercase tracking-wider border-b-2 -mb-px transition-colors ${activeTab === tab ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-400 hover:text-zinc-700"}`}
                        >
                            <Icon size={13} />
                            {tab}
                            {query && <span className="text-[10px] bg-zinc-100 px-1.5 py-0.5 rounded-full font-mono">{count}</span>}
                        </button>
                    );
                })}
            </div>

            {/* Results */}
            {!query ? (
                <div className="text-center py-16">
                    <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Search size={26} className="text-zinc-300" />
                    </div>
                    <p className="font-bold text-zinc-400 text-[15px]">Search RAVE</p>
                    <p className="text-[13px] text-zinc-300 mt-1">Find drops, talent, and campaigns</p>

                    {/* Suggestions */}
                    <div className="mt-6 text-left">
                        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-3">Try searching for</p>
                        <div className="flex flex-wrap gap-2">
                            {["Video Editor", "Brand Campaign", "Designer", "#content", "Figma", "After Effects"].map(s => (
                                <button key={s} onClick={() => { setInputValue(s); setQuery(s); router.replace(`/search?q=${encodeURIComponent(s)}`); }}
                                    className="px-3 py-1.5 bg-white border border-[#E8E8E8] rounded-full text-[12px] font-bold text-zinc-600 hover:border-zinc-400 transition-colors"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            ) : loading ? (
                <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white rounded-2xl border border-[#E8E8E8] p-4 animate-pulse h-20" />
                    ))}
                </div>
            ) : currentResults.length === 0 ? (
                <div className="text-center py-16">
                    <p className="font-bold text-zinc-400">No {activeTab.toLowerCase()} found for "{query}"</p>
                    <p className="text-[13px] text-zinc-300 mt-1">Try a different search term or tab</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {/* DROPS */}
                    {activeTab === "Drops" && currentResults.map(post => (
                        <Link key={post._id} href={`/drop/${post._id}`}
                            className="block bg-white rounded-2xl border border-[#E8E8E8] p-4 hover:border-zinc-300 transition-all"
                        >
                            <div className="flex gap-3">
                                <div className="w-9 h-9 rounded-full bg-zinc-100 shrink-0 flex items-center justify-center text-[12px] font-bold text-zinc-500">
                                    {post.author?.name?.[0] || "?"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[13px] font-bold text-zinc-800">{post.author?.name}</span>
                                        <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded-full ${post.type === "WORK" ? "bg-amber-50 text-amber-700" : "bg-zinc-100 text-zinc-500"}`}>{post.type}</span>
                                        <span className="text-[11px] text-zinc-400 ml-auto">{timeAgo(post.createdAt)}</span>
                                    </div>
                                    {post.content?.title && <p className="text-[13px] font-bold text-zinc-800 mb-0.5">{post.content.title}</p>}
                                    <p className="text-[13px] text-zinc-500 line-clamp-2">{post.content?.text}</p>
                                    {post.hashtags?.slice(0, 3).map(h => (
                                        <span key={h} className="text-[11px] text-blue-500 mr-2">#{h}</span>
                                    ))}
                                </div>
                            </div>
                        </Link>
                    ))}

                    {/* PROFILES */}
                    {activeTab === "Profiles" && currentResults.map(user => (
                        <Link key={user._id} href={`/profile/${user.username || user._id}`}
                            className="flex items-center gap-4 bg-white rounded-2xl border border-[#E8E8E8] p-4 hover:border-zinc-300 transition-all"
                        >
                            <div className="w-11 h-11 rounded-full bg-zinc-200 flex items-center justify-center shrink-0 text-[14px] font-bold text-zinc-500">
                                {user.name?.[0] || "?"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[14px] font-bold text-zinc-900">{user.name}</p>
                                <p className="text-[12px] text-zinc-400">@{user.username || user._id?.slice(-6)}</p>
                                {user.skills && user.skills.length > 0 && (
                                    <div className="flex gap-1.5 mt-1 flex-wrap">
                                        {user.skills.slice(0, 3).map(s => (
                                            <span key={s} className="text-[10px] bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full font-bold">{s}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full shrink-0 ${user.role === "og_vendor" ? "bg-blue-50 text-blue-700" : "bg-zinc-100 text-zinc-500"}`}>
                                {user.role === "og_vendor" ? "Company" : "Rave Head"}
                            </span>
                        </Link>
                    ))}

                    {/* REQUIREMENTS */}
                    {activeTab === "Requirements" && currentResults.map(req => (
                        <Link key={req._id} href={`/drop/${req._id}`}
                            className="block bg-white rounded-2xl border border-[#E8E8E8] p-4 hover:border-zinc-300 transition-all"
                        >
                            <div className="flex gap-3">
                                <div className="w-9 h-9 rounded-full bg-blue-100 shrink-0 flex items-center justify-center text-[12px] font-bold text-blue-600">
                                    {req.author?.name?.[0] || "?"}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[13px] font-bold text-zinc-800">{req.author?.name}</span>
                                        <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700">Requirement</span>
                                        <span className="text-[11px] text-zinc-400 ml-auto">{timeAgo(req.createdAt)}</span>
                                    </div>
                                    {req.content?.title && <p className="text-[13px] font-bold text-zinc-800 mb-0.5">{req.content.title}</p>}
                                    <p className="text-[13px] text-zinc-500 line-clamp-2">{req.content?.text}</p>
                                    {req.hashtags?.slice(0, 3).map(h => (
                                        <span key={h} className="text-[11px] text-blue-500 mr-2">#{h}</span>
                                    ))}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <div className="min-h-screen font-sans" style={{ backgroundColor: "#F7F7F8" }}>
            <Sidebar />
            <Suspense fallback={<div className="md:pl-16 flex items-center justify-center h-screen text-zinc-400">Loading…</div>}>
                <SearchContent />
            </Suspense>
        </div>
    );
}

"use client";

import FeedPost from "@/components/FeedPost";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Search, TrendingUp, Users, Plus, Zap } from "lucide-react";

const TABS = ["For You", "Contests", "Requirements", "Services", "Trending"];
const TAB_MAP: Record<string, string> = {
    "For You": "foryou",
    "Contests": "contests",
    "Requirements": "requirements",
    "Services": "services",
    "Trending": "trending",
};

const TRENDING_TAGS = [
    { tag: "VideoEditing", count: 412 },
    { tag: "BrandStrategy", count: 284 },
    { tag: "Photography", count: 371 },
    { tag: "Copywriting", count: 198 },
    { tag: "MotionGraphics", count: 156 },
    { tag: "UIUX", count: 223 },
    { tag: "ContentCreation", count: 309 },
];

const FEATURED_HEADS = [
    { name: "Alex Raven", role: "Video Editor", slug: "alexraven", rating: 4.8 },
    { name: "Noor Jihan", role: "Brand Designer", slug: "noorjihan", rating: 4.7 },
    { name: "Dev Xero", role: "Full-Stack Dev", slug: "devxero", rating: 4.9 },
];

function SkeletonCard() {
    return (
        <div className="bg-white rounded-xl border border-[#E8E8E8] mb-4 p-4 animate-pulse">
            <div className="flex items-center gap-3 mb-4" style={{ height: "48px" }}>
                <div className="w-10 h-10 rounded-full bg-zinc-100 shrink-0" />
                <div className="space-y-2 flex-1">
                    <div className="h-3 bg-zinc-100 rounded w-28" />
                    <div className="h-2 bg-zinc-100 rounded w-16" />
                </div>
                <div className="h-4 w-16 bg-zinc-100 rounded" />
            </div>
            <div className="space-y-2 mb-4">
                <div className="h-3.5 bg-zinc-100 rounded w-full" />
                <div className="h-3.5 bg-zinc-100 rounded w-5/6" />
                <div className="h-3.5 bg-zinc-100 rounded w-4/6" />
            </div>
            <div className="flex items-center gap-4 pt-2 border-t border-zinc-100">
                <div className="h-4 w-10 bg-zinc-100 rounded" />
                <div className="h-4 w-10 bg-zinc-100 rounded" />
                <div className="h-4 w-10 bg-zinc-100 rounded" />
                <div className="ml-auto h-8 w-24 bg-zinc-100 rounded-lg" />
            </div>
        </div>
    );
}

export default function Home() {
    const { user } = useAuth();
    const [feedItems, setFeedItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("For You");

    useEffect(() => {
        async function fetchFeed() {
            setLoading(true);
            try {
                const tab = TAB_MAP[activeTab];
                const res = await fetch(`/api/feed?tab=${tab}`);
                const data = await res.json();
                if (data.feed) setFeedItems(data.feed);
            } catch (e) {
                console.error("Feed fetch error", e);
            } finally {
                setLoading(false);
            }
        }
        fetchFeed();
    }, [activeTab]);

    return (
        /* ── ROOT — background #F7F7F8 ───────────────────────────── */
        <div className="min-h-screen pb-20 md:pb-0 font-sans" style={{ backgroundColor: "#F7F7F8" }}>
            <Sidebar />

            {/* Public top nav — guests only */}
            {!user && (
                <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E8E8E8]">
                    <div className="max-w-[1280px] mx-auto flex items-center justify-between px-6 py-3">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 relative shrink-0">
                                <Image
                                    src="/logo-black.png"
                                    alt="RAVE"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <span className="text-2xl font-black italic tracking-tighter text-zinc-900">RAVE</span>
                        </Link>
                        <div className="hidden md:flex items-center gap-2 flex-1 max-w-xs mx-8">
                            <div className="search-bar-container rounded-full px-4 py-1.5 bg-zinc-100 border-none w-full group">
                                <input
                                    type="text"
                                    placeholder="Search RAVE…"
                                    className="search-bar-input text-sm text-zinc-700 font-medium h-7"
                                />
                                <Search size={14} className="text-zinc-400 group-focus-within:text-zinc-900 transition-colors shrink-0" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link href="/explore" className="text-xs font-bold uppercase px-3 py-2 text-zinc-500 hover:text-zinc-900 transition-colors">Explore</Link>
                            <Link href="/login" className="text-xs font-bold uppercase px-3 py-2 border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-colors">Login</Link>
                            <Link href="/signup" className="text-xs font-black uppercase px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-700 transition-colors">Join</Link>
                        </div>
                    </div>
                </header>
            )}

            {/* ── 3-COLUMN LAYOUT ───────────────────────────────────── */}
            {/*   Left: 260px | Center: 640px | Right: 300px           */}
            {/*   Total max: 1280px, offset 64px for sidebar rail       */}
            <div
                className="mx-auto flex gap-8 px-4 md:px-6 md:pl-20"
                style={{
                    maxWidth: "1100px",
                    paddingTop: !user ? "72px" : "24px",
                }}
            >
                {/* ── CENTER FEED — Expanded ─────────────────────────────── */}
                <main
                    className="flex-1 min-w-0 pt-8"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-5 sticky top-2 z-20 bg-[#F7F7F8]/90 backdrop-blur-md py-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 relative shrink-0">
                                <Image
                                    src="/logo-black.png"
                                    alt="RAVE"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <h1 className="text-[22px] font-black italic tracking-tighter text-zinc-900">RAVE</h1>
                        </div>
                        {user && (
                            <Link
                                href="/create"
                                className="flex items-center gap-1.5 bg-zinc-900 text-white text-[12px] font-black uppercase tracking-wider px-4 py-2 rounded-lg hover:bg-zinc-700 transition-colors"
                            >
                                <Plus size={13} /> Drop
                            </Link>
                        )}
                    </div>

                    {/* Filter tabs */}
                    <div className="flex gap-2 mb-5 overflow-x-auto pb-1 no-scrollbar">
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${activeTab === tab
                                    ? "bg-zinc-900 text-white border-zinc-900"
                                    : "bg-white border-[#E8E8E8] text-zinc-500 hover:border-zinc-400 hover:text-zinc-700"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Feed stream */}
                    {loading ? (
                        <>{[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}</>
                    ) : feedItems.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-[#E8E8E8]">
                            <p className="text-zinc-400 font-bold uppercase tracking-wider text-sm">No drops yet</p>
                            {user && (
                                <Link href="/create" className="mt-4 inline-block bg-zinc-900 text-white text-xs font-black uppercase px-6 py-2.5 rounded-lg hover:bg-zinc-700 transition-colors">
                                    Be the first to drop
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div>
                            {feedItems.map(item => (
                                <FeedPost
                                    key={item._id}
                                    id={item._id}
                                    type={item.type || "DROP"}
                                    author={{
                                        id: item.author?._id,
                                        name: item.author?.name || "Unknown",
                                        image: item.author?.image,
                                        role: item.author?.role,
                                        brandName: item.author?.brandName,
                                        verified: item.author?.verified,
                                        skills: item.author?.skills,
                                    }}
                                    content={{
                                        title: item.content?.title,
                                        text: item.content?.text || "",
                                        mediaUrl: item.content?.mediaUrl,
                                        hashtags: item.hashtags || item.content?.hashtags || [],
                                    }}
                                    workDetails={item.workDetails}
                                    campaignDetails={item.campaignDetails}
                                    metrics={{
                                        likes: item.metrics?.likes || 0,
                                        comments: item.metrics?.comments || 0,
                                        reposts: item.metrics?.reposts || 0,
                                    }}
                                    applicantCount={item.applicantCount || 0}
                                    createdAt={item.createdAt}
                                    isPublic={!user}
                                />
                            ))}
                        </div>
                    )}
                </main>

                {/* ── RIGHT SIDEBAR — 300px (hidden under lg) ─────────── */}
                <aside
                    className="hidden lg:flex flex-col gap-4 shrink-0 pt-8"
                    style={{ width: "300px" }}
                >
                    {/* Search */}
                    <div className="search-bar-container rounded-xl px-3.5 py-2.5 bg-white border border-[#E8E8E8] group">
                        <input
                            type="text"
                            placeholder="Search drops, people…"
                            className="search-bar-input text-[13px] text-zinc-700 font-medium"
                        />
                        <Search size={14} className="text-zinc-400 group-focus-within:text-zinc-900 transition-colors shrink-0" />
                    </div>

                    {/* Live collab counter */}
                    <div className="bg-white rounded-xl border border-[#E8E8E8] px-4 py-3 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
                        <p className="text-[13px] font-bold text-zinc-700">
                            <span className="text-zinc-900">38</span> active collaborations right now
                        </p>
                    </div>

                    {/* Trending hashtags */}
                    <div className="bg-white rounded-xl border border-[#E8E8E8] p-4">
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2">
                            <TrendingUp size={12} /> Trending
                        </h3>
                        <div className="space-y-2">
                            {TRENDING_TAGS.map(({ tag, count }) => (
                                <Link
                                    key={tag}
                                    href={`/explore?tag=${tag}`}
                                    className="flex items-center justify-between group py-0.5"
                                >
                                    <span className="text-[13px] font-semibold text-zinc-400 group-hover:text-zinc-900 transition-colors">#{tag}</span>
                                    <span className="text-[11px] text-zinc-300 font-mono group-hover:text-zinc-500 transition-colors">{count} drops</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Suggested Rave Heads */}
                    <div className="bg-white rounded-xl border border-[#E8E8E8] p-4">
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2">
                            <Users size={12} /> Suggested Rave Heads
                        </h3>
                        <div className="space-y-3">
                            {FEATURED_HEADS.map(head => (
                                <div key={head.slug} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[12px] font-black shrink-0">
                                            {head.name[0]}
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-bold text-zinc-800 leading-tight">{head.name}</p>
                                            <p className="text-[11px] text-zinc-400">{head.role} · ⭐ {head.rating}</p>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/profile/${head.slug}`}
                                        className="text-[11px] font-black uppercase border border-zinc-200 px-2.5 py-1 rounded-lg hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all"
                                    >
                                        View
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Post Your Drop CTA */}
                    {user && (
                        <div className="bg-zinc-900 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap size={14} className="text-amber-400" />
                                <p className="text-[13px] font-black text-white">Ready to drop?</p>
                            </div>
                            <p className="text-[12px] text-zinc-400 mb-3">Share your work. Get discovered. Collaborate.</p>
                            <Link
                                href="/create"
                                className="block w-full bg-white text-zinc-900 text-[12px] font-black uppercase tracking-wider text-center py-2 rounded-lg hover:bg-zinc-100 transition-colors"
                            >
                                Post Your Drop
                            </Link>
                        </div>
                    )}

                    {/* Join CTA for guests */}
                    {!user && (
                        <div className="bg-zinc-900 rounded-xl p-4 space-y-3">
                            <p className="text-[14px] font-black text-white">Join the RAVE</p>
                            <p className="text-[12px] text-zinc-400">Get paid for your skills. Connect with top companies.</p>
                            <Link href="/signup" className="block w-full bg-white text-zinc-900 text-[12px] font-black uppercase text-center py-2 rounded-lg hover:bg-zinc-100 transition-colors">
                                Get Started →
                            </Link>
                            <Link href="/login" className="block text-center text-[11px] text-zinc-500 hover:text-white transition-colors">
                                Already a member? Login
                            </Link>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}

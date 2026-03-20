"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import {
    MapPin, Calendar, Settings, MessageSquare, UserPlus, CheckCircle,
    Star, ExternalLink, Share2, Copy, Check, Zap, Globe, Twitter,
    Instagram, Linkedin, Phone, Briefcase, Trophy, BookOpen,
    Grid3X3, Clock, ChevronRight, BarChart3, Users, Award, Quote, Plus, ShieldCheck, CreditCard
} from "lucide-react";

import { ExperienceCard } from "@/components/profile/ExperienceCard";
import { EducationCard } from "@/components/profile/EducationCard";
import { RecommendationCard } from "@/components/profile/RecommendationCard";
import { ProfileSectionEditor } from "@/components/profile/ProfileSectionEditor";

/* ─────────────────────────────── helpers ─────────────────────────────── */
function timeAgo(date: string) {
    const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (s < 60) return `${s}s`;
    if (s < 3600) return `${Math.floor(s / 60)}m`;
    if (s < 86400) return `${Math.floor(s / 3600)}h`;
    return `${Math.floor(s / 86400)}d`;
}

function fmtDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/* ─────────────────────────── stat card ──────────────────────────────── */
function StatCard({ value, label, icon: Icon }: { value: number | string; label: string; icon: any }) {
    return (
        <div className="flex flex-col items-center gap-0.5 py-3 px-2 flex-1">
            <div className="flex items-center gap-1">
                <Icon size={13} className="text-violet-500" />
                <span className="text-[18px] font-black text-zinc-900 tracking-tighter">{value}</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{label}</p>
        </div>
    );
}

/* ─────────────────────────── main component ─────────────────────────── */
export default function ProfilePage() {
    const params = useParams();
    const router = useRouter();
    const username = params.username as string;
    const { user: currentUser, token } = useAuth();

    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const toggleExpand = (section: string) => setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
    const [experience, setExperience] = useState<any[]>([]);
    const [education, setEducation] = useState<any[]>([]);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    
    // Editor State
    const [editorState, setEditorState] = useState<{isOpen: boolean, type: "experience" | "education" | "skills", initialData: any}>({ isOpen: false, type: "experience", initialData: null });
    const [isSaving, setIsSaving] = useState(false);

    const [following, setFollowing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const shareRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch(`/api/users/${username}`);
                const data = await res.json();
                if (data.user) setProfile(data);
            } catch (e) {
                console.error("Profile fetch error:", e);
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, [username]);

    // Fetch secondary data once profile is loaded
    const fetchSecondaryData = () => {
        Promise.all([
            fetch(`/api/users/${username}/experience`).then(r => r.json()),
            fetch(`/api/users/${username}/education`).then(r => r.json()),
            fetch(`/api/users/${username}/recommendations`).then(r => r.json()),
        ]).then(([exp, edu, rec]) => {
            setExperience(exp.experiences || []);
            setEducation(edu.education || []);
            setRecommendations(rec.recommendations || []);
        }).catch(() => {});
    };

    useEffect(() => {
        if (!profile?.user?._id) return;
        fetchSecondaryData();
    }, [profile?.user?._id]);

    const handleSaveSection = async (data: any) => {
        setIsSaving(true);
        try {
            if (editorState.type === "skills") {
                const skillsArray = typeof data.skills === "string" 
                    ? data.skills.split(",").map((s: string) => s.trim()).filter(Boolean)
                    : data.skills || [];
                const res = await fetch(`/api/users/${username}`, {
                    method: "PATCH",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` 
                    },
                    body: JSON.stringify({ skills: skillsArray }),
                });
                if (res.ok) {
                    setEditorState({ ...editorState, isOpen: false });
                    window.location.reload();
                } else {
                    alert("Failed to save skills");
                }
                setIsSaving(false);
                return;
            }

            const isEdit = !!data._id;
            const url = isEdit 
                ? `/api/users/${username}/${editorState.type}/${data._id}`
                : `/api/users/${username}/${editorState.type}`;
            
            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setEditorState({ ...editorState, isOpen: false });
                fetchSecondaryData();
            } else {
                alert("Failed to save entry");
            }
        } catch (e) {
            console.error("Save error:", e);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteSection = async () => {
        if (!editorState.initialData?._id) return;
        if (!confirm(`Are you sure you want to delete this ${editorState.type} entry?`)) return;
        
        setIsSaving(true);
        try {
            const url = `/api/users/${username}/${editorState.type}/${editorState.initialData._id}`;
            const res = await fetch(url, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                setEditorState({ ...editorState, isOpen: false });
                fetchSecondaryData();
            } else {
                alert("Failed to delete entry");
            }
        } catch (e) {
            console.error("Delete error:", e);
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleRecommendationVisibility = async (recId: string, currentVisibility: boolean) => {
        try {
            const res = await fetch(`/api/users/${username}/recommendations/${recId}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ isVisible: !currentVisibility }),
            });
            if (res.ok) {
                fetchSecondaryData();
            }
        } catch (error) {
            console.error("Toggle visibility error:", error);
        }
    };

    const handleDeleteRecommendation = async (recId: string) => {
        if (!confirm("Are you sure you want to delete this recommendation?")) return;
        try {
            const res = await fetch(`/api/users/${username}/recommendations/${recId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) fetchSecondaryData();
        } catch (error) {
            console.error("Delete recommendation error:", error);
        }
    };

    // Close share dropdown on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
                setShowShare(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}/profile/${username}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleFollow = () => setFollowing(f => !f);

    if (loading) return (
        <div className="min-h-screen bg-[#F7F7F8] font-sans">
            <Sidebar />
            <div className="md:pl-16 max-w-6xl mx-auto px-4 pt-8">
                <div className="flex gap-6 animate-pulse">
                    <div className="w-72 shrink-0 space-y-4">
                        <div className="bg-white rounded-3xl h-96 border border-[#E8E8E8]" />
                    </div>
                    <div className="flex-1 space-y-4">
                        <div className="bg-white rounded-3xl h-48 border border-[#E8E8E8]" />
                        <div className="bg-white rounded-3xl h-64 border border-[#E8E8E8]" />
                    </div>
                </div>
            </div>
        </div>
    );

    if (!profile) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F7F7F8]">
            <Sidebar />
            <div className="text-center">
                <p className="font-bold text-zinc-700 text-lg mb-2">User not found</p>
                <button onClick={() => router.back()} className="text-[13px] text-zinc-400 underline">← Go back</button>
            </div>
        </div>
    );

    const { user, stats, workHistory = [], featuredDrops = [], recentDrops = [] } = profile;
    const isVendor = user.role === "og_vendor";
    const isOwnProfile = (currentUser as any)?.id === user._id?.toString();
    const isVerified = user.verificationStatus === "verified";
    const isPro = user.role === 'og_vendor' || user.role === 'admin' ? true : (user.isPro && user.proExpiry ? new Date(user.proExpiry) > new Date() : user.isPro);
    const displayName = isVendor ? (user.brandName || user.name) : user.name;
    const allSkills = [...(user.skills || []), ...(user.interests || [])];
    const drops = recentDrops.filter((p: any) => p.type === "DROP" || p.type === "WORK" || p.type === "CAMPAIGN");

    return (
        <div className="min-h-screen bg-[#F7F7F8] pb-20 md:pb-0 font-sans">
            <Sidebar />

            <ProfileSectionEditor 
                isOpen={editorState.isOpen}
                type={editorState.type}
                initialData={editorState.initialData}
                onClose={() => setEditorState({ ...editorState, isOpen: false })}
                onSave={handleSaveSection}
                onDelete={handleDeleteSection}
                isLoading={isSaving}
            />

            <div className="md:pl-16">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div className="flex flex-col lg:flex-row gap-5">

                        {/* ════════════════════════════════════════
                            LEFT COLUMN (sticky on desktop)
                        ════════════════════════════════════════ */}
                        <div className="lg:w-72 xl:w-80 shrink-0">
                            <div className="lg:sticky lg:top-6 space-y-4">

                                {/* ── PROFILE CARD ── */}
                                <div className="bg-white rounded-3xl border border-[#E8E8E8] overflow-visible">
                                    {/* Cover – no overflow-hidden so avatar can peek above */}
                                    <div className="h-28 relative rounded-t-3xl overflow-hidden">
                                        {user.coverImage ? (
                                            <img src={user.coverImage} alt="cover" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full" style={{
                                                background: isPro
                                                    ? "linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #1e1b4b 100%)"
                                                    : isVendor
                                                        ? "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)"
                                                        : "linear-gradient(135deg, #18181b 0%, #3f3f46 100%)"
                                            }}>
                                                <div className="absolute inset-0 opacity-10"
                                                    style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                                            </div>
                                        )}
                                        {/* Share button on cover */}
                                        <div className="absolute top-3 right-3" ref={shareRef}>
                                            <button onClick={() => setShowShare(s => !s)}
                                                className="p-2 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-white transition-all">
                                                <Share2 size={14} className="text-zinc-700" />
                                            </button>
                                            {showShare && (
                                                <div className="absolute right-0 mt-1 bg-white rounded-2xl border border-[#E8E8E8] shadow-lg p-2 min-w-[180px] z-20">
                                                    <button onClick={handleCopyLink}
                                                        className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-bold text-zinc-700 hover:bg-zinc-50 rounded-xl transition-all">
                                                        {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                                                        {copied ? "Copied!" : "Copy profile link"}
                                                    </button>
                                                    <a href={`https://twitter.com/intent/tweet?text=Check out ${displayName} on RAVE&url=${encodeURIComponent(`${typeof window !== 'undefined' ? window.location.origin : ''}/profile/${username}`)}`}
                                                        target="_blank" rel="noreferrer"
                                                        className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-bold text-zinc-700 hover:bg-zinc-50 rounded-xl transition-all">
                                                        <Twitter size={13} className="text-sky-500" /> Share on Twitter
                                                    </a>
                                                    <a href={`https://wa.me/?text=Check out ${displayName} on RAVE: ${typeof window !== 'undefined' ? window.location.origin : ''}/profile/${username}`}
                                                        target="_blank" rel="noreferrer"
                                                        className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-bold text-zinc-700 hover:bg-zinc-50 rounded-xl transition-all">
                                                        <MessageSquare size={13} className="text-green-500" /> Share on WhatsApp
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="px-5 pb-5">
                                        {/* Avatar – z-10 ensures it sits above the cover */}
                                        <div className="flex items-end justify-between -mt-10 mb-3 relative z-10">
                                            <div className="w-20 h-20 rounded-2xl border-4 border-white bg-zinc-200 overflow-hidden shadow-lg shrink-0">
                                                {user.profileImage || user.image ? (
                                                    <img src={user.profileImage || user.image} alt={displayName} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                                                        <span className="text-2xl font-black text-white">{displayName?.[0] || "?"}</span>
                                                    </div>
                                                )}
                                            </div>
                                            {/* Pro badge */}
                                            {isPro && (
                                                <div className="flex items-center gap-1 px-2.5 py-1 bg-violet-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                                                    <Zap size={10} /> PRO
                                                </div>
                                            )}
                                        </div>

                                        {/* Name + handle + badges */}
                                        <div className="mb-3">
                                            <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                                                <h1 className="text-[18px] font-black text-zinc-900 leading-tight">{displayName}</h1>
                                                {isVerified && (
                                                    <CheckCircle size={16} className="text-blue-500 fill-blue-500 shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-[12px] text-zinc-400 font-bold mb-1">@{user.username || username}</p>
                                            {user.headline && (
                                                <p className="text-[13px] text-zinc-600 leading-snug">{user.headline}</p>
                                            )}
                                        </div>

                                        {/* Meta */}
                                        <div className="space-y-1.5 mb-4 text-[12px] text-zinc-500">
                                            {user.location && (
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin size={12} className="text-zinc-400 shrink-0" />
                                                    <span>{user.location}</span>
                                                </div>
                                            )}
                                            {user.website && (
                                                <div className="flex items-center gap-1.5">
                                                    <Globe size={12} className="text-zinc-400 shrink-0" />
                                                    <a href={user.website} target="_blank" rel="noreferrer" className="text-violet-600 hover:underline truncate">
                                                        {user.website.replace(/https?:\/\//, "")}
                                                    </a>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={12} className="text-zinc-400 shrink-0" />
                                                <span>Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        {isOwnProfile ? (
                                            <Link href="/settings"
                                                className="w-full flex items-center justify-center gap-1.5 py-2.5 border border-[#E8E8E8] rounded-xl text-[12px] font-black uppercase tracking-wider text-zinc-700 hover:bg-zinc-50 transition-colors">
                                                <Settings size={13} /> Edit Profile
                                            </Link>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button onClick={handleFollow}
                                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-wider transition-all ${following ? "border border-zinc-300 text-zinc-600 hover:bg-zinc-50" : "bg-zinc-900 text-white hover:bg-zinc-700"}`}>
                                                    {following ? <><CheckCircle size={13} /> Following</> : <><UserPlus size={13} /> Follow</>}
                                                </button>
                                                <Link href={`/inbox?u=${user._id}`}
                                                    className="p-2.5 border border-[#E8E8E8] rounded-xl text-zinc-600 hover:bg-zinc-50 transition-colors flex items-center justify-center">
                                                    <MessageSquare size={15} />
                                                </Link>
                                            </div>
                                        )}
                                        {!isOwnProfile && !isVendor && (
                                            <Link href={`/create/campaign`}
                                                className="w-full mt-2 flex items-center justify-center gap-1.5 py-2.5 bg-amber-400 text-zinc-900 rounded-xl text-[12px] font-black uppercase tracking-wider hover:bg-amber-300 transition-colors">
                                                <Briefcase size={13} /> Collaborate
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                {/* ── STATS CARD ── */}
                                <div className="bg-white rounded-3xl border border-[#E8E8E8] overflow-hidden">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-5 pt-4 pb-2">Stats</p>
                                    {isVendor ? (
                                        <>
                                            <div className="grid grid-cols-3 divide-x divide-[#F0F0F0] border-t border-[#F0F0F0]">
                                                <StatCard value={stats.rating || 0} label="OG Score" icon={ShieldCheck} />
                                                <StatCard value={`$${(stats.totalSpend || 0).toLocaleString()}`} label="Spent" icon={CreditCard} />
                                                <StatCard value={stats.activeContests || 0} label="Active" icon={Zap} />
                                            </div>
                                            <div className="grid grid-cols-3 divide-x divide-[#F0F0F0] border-t border-[#F0F0F0]">
                                                <StatCard value={stats.campaignsPosted || 0} label="Posted" icon={Briefcase} />
                                                <StatCard value={stats.avgResponseTime || "—"} label="Response" icon={Clock} />
                                                <StatCard value={stats.completionRate || "—"} label="Complete" icon={CheckCircle} />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-3 divide-x divide-[#F0F0F0] border-t border-[#F0F0F0]">
                                                <StatCard value={stats.followers} label="Followers" icon={Users} />
                                                <StatCard value={stats.drops} label="Drops" icon={Grid3X3} />
                                                <StatCard value={stats.completedCollabs} label="Collabs" icon={Briefcase} />
                                            </div>
                                            <div className="grid grid-cols-3 divide-x divide-[#F0F0F0] border-t border-[#F0F0F0]">
                                                <StatCard value={stats.rating > 0 ? stats.rating.toFixed(1) : "—"} label="Rating" icon={Star} />
                                                <StatCard value={stats.completedCourses} label="Courses" icon={BookOpen} />
                                                <StatCard value={0} label="Wins" icon={Trophy} />
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* ── SOCIAL LINKS ── */}
                                {user.socialLinks && Object.values(user.socialLinks).some(Boolean) && (
                                    <div className="bg-white rounded-3xl border border-[#E8E8E8] p-5">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">Links</p>
                                        <div className="space-y-2">
                                            {user.socialLinks?.twitter && (
                                                <a href={`https://twitter.com/${user.socialLinks.twitter}`} target="_blank" rel="noreferrer"
                                                    className="flex items-center gap-2.5 text-[13px] text-zinc-700 hover:text-sky-500 transition-colors font-bold">
                                                    <Twitter size={15} className="text-sky-400 shrink-0" /> @{user.socialLinks.twitter}
                                                </a>
                                            )}
                                            {user.socialLinks?.instagram && (
                                                <a href={`https://instagram.com/${user.socialLinks.instagram}`} target="_blank" rel="noreferrer"
                                                    className="flex items-center gap-2.5 text-[13px] text-zinc-700 hover:text-pink-500 transition-colors font-bold">
                                                    <Instagram size={15} className="text-pink-400 shrink-0" /> @{user.socialLinks.instagram}
                                                </a>
                                            )}
                                            {user.socialLinks?.linkedin && (
                                                <a href={user.socialLinks.linkedin} target="_blank" rel="noreferrer"
                                                    className="flex items-center gap-2.5 text-[13px] text-zinc-700 hover:text-blue-600 transition-colors font-bold">
                                                    <Linkedin size={15} className="text-blue-500 shrink-0" /> LinkedIn
                                                </a>
                                            )}
                                            {user.socialLinks?.phone && (
                                                <div className="flex items-center gap-2.5 text-[13px] text-zinc-700 font-bold">
                                                    <Phone size={15} className="text-zinc-400 shrink-0" /> {user.socialLinks.phone}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* ── ROLE BADGE ── */}
                                <div className="bg-white rounded-3xl border border-[#E8E8E8] px-5 py-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">Role</p>
                                        <p className="text-[13px] font-black text-zinc-900">{isVendor ? "Company / Brand" : "Rave Head (Creator)"}</p>
                                    </div>
                                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${isVendor ? "bg-blue-50 text-blue-700" : "bg-zinc-100 text-zinc-600"}`}>
                                        {isVendor ? "Brand" : "Creator"}
                                    </span>
                                </div>

                            </div>
                        </div>

                        {/* ════════════════════════════════════════
                            RIGHT COLUMN (main content)
                        ════════════════════════════════════════ */}
                        <div className="flex-1 min-w-0 space-y-4">

                            {/* ── ABOUT ── */}
                            {(user.bio || user.description) && (
                                <div className="bg-white rounded-3xl border border-[#E8E8E8] p-6">
                                    <h2 className="text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-3">About</h2>
                                    <p className="text-[14px] text-zinc-700 leading-relaxed">{user.bio || user.description}</p>
                                </div>
                            )}

                            {/* ── FEATURED WORK ── */}
                            {!isVendor && featuredDrops.length > 0 && (
                                <div className="bg-white rounded-3xl border border-[#E8E8E8] p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Featured Work</h2>
                                        <Link href="#drops" className="text-[11px] font-black text-zinc-400 hover:text-zinc-700 flex items-center gap-1">
                                            View all <ChevronRight size={12} />
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {featuredDrops.slice(0, 6).map((drop: any) => (
                                            <Link key={drop._id} href={`/drop/${drop._id}`}
                                                className="group block rounded-2xl overflow-hidden border border-[#E8E8E8] hover:border-zinc-300 transition-all">
                                                <div className="aspect-square bg-zinc-100 relative">
                                                    {drop.content?.mediaUrl ? (
                                                        <img src={drop.content.mediaUrl} alt={drop.content?.title || "drop"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-zinc-50">
                                                            <Grid3X3 size={20} className="text-zinc-300" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-end p-2 opacity-0 group-hover:opacity-100">
                                                        <p className="text-white text-[11px] font-black line-clamp-2">{drop.content?.title || drop.content?.text?.slice(0, 40)}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ── ACTIVITY FEED ── */}
                            {recentDrops.length > 0 && (
                                <div className="bg-white rounded-3xl border border-[#E8E8E8] p-6 mb-4">
                                    <h2 className="text-[16px] font-black text-zinc-900 flex items-center gap-2 mb-5">
                                        <BarChart3 className="text-zinc-400" size={18} /> Activity
                                    </h2>
                                    <div className="space-y-4">
                                        {(expanded.activity ? recentDrops : recentDrops.slice(0, 3)).map((post: any) => (
                                            <Link key={post._id} href={`/drop/${post._id}`}
                                                className="block p-4 border border-[#E8E8E8] rounded-2xl hover:border-zinc-300 hover:shadow-sm transition-all bg-white relative">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-zinc-100 mt-1 flex-shrink-0">
                                                        {user.profileImage ? (
                                                            <img src={user.profileImage} alt={displayName} className="w-full h-full rounded-xl object-cover" />
                                                        ) : (
                                                            <div className="flex items-center justify-center w-full h-full font-black text-zinc-400">
                                                                {displayName?.[0]}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <div className="flex items-center gap-1.5 break-all line-clamp-1">
                                                                <span className="font-black text-zinc-900 text-[14px]">{displayName}</span>
                                                                <span className="text-[12px] text-zinc-500 font-medium">@{user.username || username}</span>
                                                            </div>
                                                            <span className="text-[11px] text-zinc-400 shrink-0">{timeAgo(post.createdAt)}</span>
                                                        </div>
                                                        {post.type && (
                                                            <span className="inline-block mb-2 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500">
                                                                {post.type}
                                                            </span>
                                                        )}
                                                        {post.content?.title && <p className="text-[14px] font-black text-zinc-800 mb-1">{post.content.title}</p>}
                                                        <p className="text-[13px] text-zinc-600 leading-snug break-words mb-3">
                                                            {post.content?.text}
                                                        </p>
                                                        {post.content?.mediaUrl && (
                                                            <div className="rounded-xl overflow-hidden mb-3 bg-zinc-100 max-h-64 flex">
                                                                <img src={post.content.mediaUrl} alt="" className="w-full h-full object-cover" />
                                                            </div>
                                                        )}
                                                        <div className="flex gap-4 text-[12px] text-zinc-500 font-bold border-t border-[#E8E8E8] pt-3">
                                                            <span className="flex items-center gap-1 hover:text-red-500 transition-colors">♥ {post.metrics?.likes || 0}</span>
                                                            <span className="flex items-center gap-1 hover:text-blue-500 transition-colors">💬 {post.metrics?.comments || 0}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    {recentDrops.length > 3 && (
                                        <button onClick={() => toggleExpand("activity")} className="w-full mt-4 py-3 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 font-black uppercase tracking-widest text-[11px] rounded-xl transition-colors">
                                            {expanded.activity ? "Show less" : `Show all activity (${recentDrops.length})`}
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* ── DROPS / PORTFOLIO ── */}
                            {drops.length > 0 && (
                                <div className="bg-white rounded-3xl border border-[#E8E8E8] p-6 mb-4" id="drops">
                                    <h2 className="text-[16px] font-black text-zinc-900 flex items-center gap-2 mb-5">
                                        <Grid3X3 className="text-zinc-400" size={18} /> Drops
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {(expanded.drops ? drops : drops.slice(0, 4)).map((post: any) => (
                                            <Link key={post._id} href={`/drop/${post._id}`}
                                                className="block p-4 border border-[#E8E8E8] rounded-2xl hover:border-zinc-300 hover:shadow-sm transition-all">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full ${post.type === "CAMPAIGN" ? "bg-amber-50 text-amber-700" : post.type === "WORK" ? "bg-blue-50 text-blue-700" : "bg-zinc-100 text-zinc-500"}`}>
                                                        {post.type}
                                                    </span>
                                                    <span className="text-[11px] text-zinc-400">{timeAgo(post.createdAt)}</span>
                                                </div>
                                                {post.content?.mediaUrl && (
                                                    <div className="rounded-xl overflow-hidden mb-2 aspect-video bg-zinc-100">
                                                        <img src={post.content.mediaUrl} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                                {post.content?.title && <p className="text-[13px] font-black text-zinc-800 mb-0.5 line-clamp-1">{post.content.title}</p>}
                                                <p className="text-[12px] text-zinc-500 line-clamp-2">{post.content?.text}</p>
                                                <div className="flex gap-3 mt-2 text-[11px] text-zinc-400">
                                                    <span>♥ {post.metrics?.likes || 0}</span>
                                                    <span>💬 {post.metrics?.comments || 0}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    {drops.length > 4 && (
                                        <button onClick={() => toggleExpand("drops")} className="w-full mt-4 py-3 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 font-black uppercase tracking-widest text-[11px] rounded-xl transition-colors">
                                            {expanded.drops ? "Show less" : `Show all drops (${drops.length})`}
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* ── WORK HISTORY ── */}
                            {(workHistory.length > 0) && (
                                <div className="bg-white rounded-3xl border border-[#E8E8E8] p-6 mb-4">
                                    <h2 className="text-[16px] font-black text-zinc-900 flex items-center gap-2 mb-5">
                                        <Clock className="text-zinc-400" size={18} /> Work History
                                    </h2>
                                    <div className="relative">
                                        <div className="absolute left-5 top-0 bottom-0 w-px bg-[#E8E8E8]" />
                                        <div className="space-y-5">
                                            {(expanded.work ? workHistory : workHistory.slice(0, 3)).map((entry: any, i: number) => (
                                                <div key={i} className="flex gap-4 pl-12 relative">
                                                    <div className="absolute left-3.5 top-1.5 w-3 h-3 rounded-full border-2 border-white bg-violet-500 shadow-sm" />
                                                    <div className="flex-1 bg-zinc-50 rounded-2xl p-4 hover:border-zinc-200 border border-transparent transition-all">
                                                        <div className="flex items-start justify-between gap-2 mb-1">
                                                            <div>
                                                                <div className="flex items-center gap-1.5 mb-0.5">
                                                                    <span className="text-[9px] font-black uppercase tracking-widest bg-violet-50 text-violet-700 px-1.5 py-0.5 rounded-full">
                                                                        {entry.type === "COLLABORATION" ? "Collaboration" : entry.type}
                                                                    </span>
                                                                </div>
                                                                <p className="text-[14px] font-black text-zinc-900">{entry.title}</p>
                                                            </div>
                                                            <span className="text-[11px] text-zinc-400 shrink-0">{fmtDate(entry.date)}</span>
                                                        </div>
                                                        {entry.amount && (
                                                            <p className="text-[12px] text-green-600 font-black">₹{entry.amount?.toLocaleString()}</p>
                                                        )}
                                                        {entry.id && (
                                                            <Link href={`/project/${entry.id}`}
                                                                className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-700 mt-2 font-bold">
                                                                <ExternalLink size={11} /> View project
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {workHistory.length > 3 && (
                                        <button onClick={() => toggleExpand("work")} className="w-full mt-5 py-3 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 font-black uppercase tracking-widest text-[11px] rounded-xl transition-colors">
                                            {expanded.work ? "Show less" : `Show all work history (${workHistory.length})`}
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* ── EXPERIENCE ── */}
                            {!isVendor && (experience.length > 0 || isOwnProfile) && (
                                <div className="bg-white rounded-3xl border border-[#E8E8E8] p-6 mb-4">
                                    <div className="flex items-center justify-between mb-5">
                                        <h2 className="text-[16px] font-black text-zinc-900 flex items-center gap-2">
                                            <Briefcase className="text-zinc-400" size={18} /> Experience
                                        </h2>
                                        {isOwnProfile && (
                                            <button onClick={() => setEditorState({ isOpen: true, type: "experience", initialData: null })}
                                                className="p-2 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 rounded-xl transition-colors">
                                                <Plus size={16} />
                                            </button>
                                        )}
                                    </div>
                                    {experience.length === 0 ? (
                                        <div className="text-center py-8">
                                            <p className="text-zinc-400 font-medium text-[13px]">No experience added yet.</p>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <div className="absolute left-5 top-0 bottom-0 w-px bg-[#E8E8E8]" />
                                            <div className="space-y-5">
                                                {(expanded.experience ? experience : experience.slice(0, 3)).map((exp: any, i: number) => (
                                                    <ExperienceCard 
                                                        key={i} 
                                                        exp={exp} 
                                                        isOwnProfile={isOwnProfile}
                                                        onEdit={() => setEditorState({ isOpen: true, type: "experience", initialData: exp })}
                                                        onDelete={() => setEditorState({ isOpen: true, type: "experience", initialData: exp })}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {experience.length > 3 && (
                                        <button onClick={() => toggleExpand("experience")} className="w-full mt-5 py-3 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 font-black uppercase tracking-widest text-[11px] rounded-xl transition-colors">
                                            {expanded.experience ? "Show less" : `Show all experience (${experience.length})`}
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* ── EDUCATION ── */}
                            {!isVendor && (education.length > 0 || isOwnProfile) && (
                                <div className="bg-white rounded-3xl border border-[#E8E8E8] p-6 mb-4">
                                    <div className="flex items-center justify-between mb-5">
                                        <h2 className="text-[16px] font-black text-zinc-900 flex items-center gap-2">
                                            <BookOpen className="text-zinc-400" size={18} /> Education
                                        </h2>
                                        {isOwnProfile && (
                                            <button onClick={() => setEditorState({ isOpen: true, type: "education", initialData: null })}
                                                className="p-2 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 rounded-xl transition-colors">
                                                <Plus size={16} />
                                            </button>
                                        )}
                                    </div>
                                    {education.length === 0 ? (
                                        <div className="text-center py-8">
                                            <p className="text-zinc-400 font-medium text-[13px]">No education added yet.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {(expanded.education ? education : education.slice(0, 3)).map((edu: any, i: number) => (
                                                <EducationCard 
                                                    key={i} 
                                                    edu={edu} 
                                                    isOwnProfile={isOwnProfile}
                                                    onEdit={() => setEditorState({ isOpen: true, type: "education", initialData: edu })}
                                                    onDelete={() => setEditorState({ isOpen: true, type: "education", initialData: edu })}
                                                />
                                            ))}
                                        </div>
                                    )}
                                    {education.length > 3 && (
                                        <button onClick={() => toggleExpand("education")} className="w-full mt-4 py-3 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 font-black uppercase tracking-widest text-[11px] rounded-xl transition-colors">
                                            {expanded.education ? "Show less" : `Show all education (${education.length})`}
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* ── RECOMMENDATIONS ── */}
                            {(recommendations.length > 0) && (
                                <div className="bg-white rounded-3xl border border-[#E8E8E8] p-6 mb-4">
                                    <h2 className="text-[16px] font-black text-zinc-900 flex items-center gap-2 mb-5">
                                        <Quote className="text-zinc-400" size={18} /> Recommendations
                                    </h2>
                                    <div className="space-y-4">
                                        {(expanded.recommendations ? recommendations : recommendations.slice(0, 3)).map((rec: any, i: number) => (
                                            <RecommendationCard 
                                                key={i} 
                                                rec={rec} 
                                                isOwnProfile={isOwnProfile}
                                                onToggleVisibility={() => handleToggleRecommendationVisibility(rec._id, rec.isVisible)}
                                                onDelete={() => handleDeleteRecommendation(rec._id)}
                                            />
                                        ))}
                                    </div>
                                    {recommendations.length > 3 && (
                                        <button onClick={() => toggleExpand("recommendations")} className="w-full mt-4 py-3 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 font-black uppercase tracking-widest text-[11px] rounded-xl transition-colors">
                                            {expanded.recommendations ? "Show less" : `Show all recommendations (${recommendations.length})`}
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* ── SKILLS ── */}
                            {!isVendor && (allSkills.length > 0 || isOwnProfile) && (
                                <div className="bg-white rounded-3xl border border-[#E8E8E8] p-6 mb-4">
                                    <div className="flex items-center justify-between mb-5">
                                        <h2 className="text-[16px] font-black text-zinc-900 flex items-center gap-2">
                                            <Award className="text-zinc-400" size={18} /> Skills
                                        </h2>
                                        {isOwnProfile && (
                                            <button onClick={() => setEditorState({ isOpen: true, type: "skills", initialData: { skills: allSkills } })}
                                                className="p-2 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 rounded-xl transition-colors">
                                                <Plus size={16} />
                                            </button>
                                        )}
                                    </div>
                                    {allSkills.length === 0 ? (
                                        <div className="text-center py-6">
                                            <p className="text-zinc-400 font-medium text-[13px] mb-2">No skills listed yet.</p>
                                            {isOwnProfile && (
                                                <button onClick={() => setEditorState({ isOpen: true, type: "skills", initialData: { skills: allSkills } })}
                                                className="p-2 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 rounded-xl transition-colors">
                                                <Plus size={16} />
                                            </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex flex-wrap gap-2 mb-5">
                                                {allSkills.map((skill: string) => (
                                                    <span key={skill}
                                                        className="px-4 py-2 bg-zinc-50 border border-[#E8E8E8] text-zinc-800 text-[13px] font-bold rounded-2xl hover:border-zinc-300 hover:bg-zinc-100 transition-all cursor-default">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── LEARNING COMPLETIONS ── */}
                            {stats.completedCourses > 0 && (
                                <div className="bg-white rounded-3xl border border-[#E8E8E8] p-6">
                                    <h2 className="text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-4">Courses Completed</h2>
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center shrink-0">
                                            <BookOpen size={24} className="text-violet-600" />
                                        </div>
                                        <div>
                                            <p className="text-[20px] font-black text-zinc-900">{stats.completedCourses}</p>
                                            <p className="text-[12px] text-zinc-500">RAVE Learning Hub playbooks completed</p>
                                        </div>
                                        <Link href="/learning-hub" className="ml-auto flex items-center gap-1 text-[11px] font-black text-violet-600 hover:text-violet-800">
                                            View Hub <ChevronRight size={12} />
                                        </Link>
                                    </div>
                                </div>
                            )}

                        </div>
                        {/* END right column */}
                    </div>
                </div>
            </div>
        </div>
    );
}

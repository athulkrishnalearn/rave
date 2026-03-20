"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageSquare, Repeat2, Share2, Handshake, DollarSign, Hash, ChevronDown, CheckCircle2, Send, Trash2, MoreHorizontal, MessageCircle, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface FeedPostProps {
    id: string;
    type: "DROP" | "WORK" | "CAMPAIGN" | string;
    author: {
        id: string;
        name: string;
        image?: string;
        role?: string;
        brandName?: string;
        verified?: boolean;
        skills?: string[];
    };
    content: {
        title?: string;
        text: string;
        mediaUrl?: string;
        hashtags?: string[];
    };
    workDetails?: { tags: string[]; category?: string };
    campaignDetails?: { budget?: string; requirements?: string[]; status?: string };
    metrics: {
        likes: number;
        comments: number;
        reposts?: number;
    };
    isPublic?: boolean;
    applicantCount?: number;
    createdAt?: string;
}

function timeAgo(date?: string) {
    if (!date) return "now";
    const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (s < 60) return `${s}s`;
    if (s < 3600) return `${Math.floor(s / 60)}m`;
    if (s < 86400) return `${Math.floor(s / 3600)}h`;
    return `${Math.floor(s / 86400)}d`;
}

const TYPE_CONFIG: Record<string, { label: string; textColor: string; bgColor: string }> = {
    DROP: { label: "Drop", textColor: "text-zinc-100", bgColor: "bg-zinc-800" },
    WORK: { label: "Service", textColor: "text-white", bgColor: "bg-blue-600" },
    CAMPAIGN: { label: "Requirement", textColor: "text-zinc-900", bgColor: "bg-amber-400" },
    CONTEST: { label: "Contest", textColor: "text-zinc-900", bgColor: "bg-[#00ff9d]" },
};

export default function FeedPost({
    id, type, author, content, workDetails, campaignDetails,
    metrics, isPublic = false, applicantCount = 0, createdAt
}: any) {
    const { user, token } = useAuth();
    const router = useRouter();

    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(metrics?.likes || 0);
    const [expanded, setExpanded] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [fetchedComments, setFetchedComments] = useState<{ text: string; name: string }[]>([]);
    const [hasFetchedComments, setHasFetchedComments] = useState(false);
    const [localComments, setLocalComments] = useState<{ text: string; name: string }[]>([]);
    const [visibleHashtags, setVisibleHashtags] = useState(3);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);

    const isLoggedIn = !!user;
    const isOwner = user && (user as any).id === author?.id;
    const isPro = (user as any)?.isPro === true;
    const [showDmGate, setShowDmGate] = useState(false);

    const handleDmClick = () => {
        if (!isLoggedIn) { router.push('/login'); return; }
        if (!isPro) { setShowDmGate(true); return; }
        router.push(`/inbox?u=${author?.id}`);
    };

    // Pull hashtags from content or scan text
    const rawHashtags = content?.hashtags?.length
        ? content.hashtags
        : (content?.text?.match(/#\w+/g) || []);
    const allHashtags = rawHashtags.map((t: string) => t.replace(/^#/, ""));
    const hiddenCount = allHashtags.length - visibleHashtags;

    const currentType = (type || "DROP").toUpperCase();
    let badge = TYPE_CONFIG[currentType] || TYPE_CONFIG.DROP;
    if (currentType === 'WORK' && workDetails?.workType === 'REQUIREMENT') {
        badge = { label: "Requirement", textColor: "text-zinc-900", bgColor: "bg-amber-400" };
    }
    const authorName = author?.brandName || author?.name || "RAVE User";
    const authorSlug = authorName.toLowerCase().replace(/\s+/g, "");

    // Strip hashtags from body text for clean display
    const cleanText = (content?.text || "").replace(/#\w+/g, "").trim();
    const isLong = cleanText.length > 280;
    const displayText = expanded ? cleanText : cleanText.slice(0, 280);

    const handleLike = async () => {
        if (!isLoggedIn) { router.push("/login"); return; }
        const next = !liked;
        setLiked(next);
        setLikeCount((c: number) => next ? c + 1 : c - 1);
        try {
            await fetch(`/api/drops/${id}/like`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch { }
    };

    const handleComment = async () => {
        if (!isLoggedIn) { router.push("/login"); return; }
        if (!commentText.trim()) return;
        setLocalComments(prev => [...prev, { text: commentText, name: user!.name }]);
        const currentText = commentText;
        setCommentText("");
        try {
            await fetch(`/api/drops/${id}/comment`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ text: currentText })
            });
        } catch (error) {
            console.error("Comment failed", error);
        }
    };

    const loadComments = async () => {
        if (hasFetchedComments) return;
        try {
            const res = await fetch(`/api/drops/${id}/comment`);
            const data = await res.json();
            if (data.comments) {
                const mapped = data.comments.map((c: any) => ({
                    text: c.text,
                    name: c.author?.name || c.author?.brandName || "Unknown"
                }));
                setFetchedComments(mapped);
            }
        } catch { } finally {
            setHasFetchedComments(true);
        }
    };

    const toggleComments = () => {
        if (!isLoggedIn) { router.push("/login"); return; }
        if (!showComments) loadComments();
        setShowComments(c => !c);
    };

    const handleShare = async () => {
        const shareData = {
            title: content?.title || "Check out this Drop on RAVE",
            text: cleanText.slice(0, 100) + "...",
            url: `${window.location.origin}/drop/${id}`,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.url);
                alert("Link copied to clipboard!");
            }
        } catch (err) {
            console.error("Error sharing:", err);
        }
    };

    const handleRepost = async () => {
        if (!isLoggedIn) { router.push("/login"); return; }
        // For now, reposting behaves similarly to liking (metrics increment + basic API)
        try {
            await fetch(`/api/drops/${id}/repost`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Reposted!");
        } catch { }
    };

    const handleDelete = async () => {
        if (!isOwner || isDeleting) return;
        if (!confirm("Are you sure you want to delete this drop? This action cannot be undone.")) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/drops/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                setIsDeleted(true);
                // If we are on the detail page, redirect back
                if (window.location.pathname.includes(`/drop/${id}`)) {
                    router.push("/");
                }
            } else {
                const data = await res.json();
                alert(data.error || "Failed to delete post.");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("An error occurred while deleting.");
        } finally {
            setIsDeleting(false);
        }
    };

    if (isDeleted) return null;

    // ── Pro DM Gate Modal ──
    const DmGateModal = showDmGate ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowDmGate(false)}>
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center" onClick={e => e.stopPropagation()}>
                <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Lock size={24} className="text-violet-600" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-zinc-900 mb-2">Pro Feature</h3>
                <p className="text-[13px] text-zinc-500 mb-6 leading-relaxed">Direct messaging from the feed is exclusively for RAVE Pro subscribers. Upgrade to message any creator or brand instantly.</p>
                <Link href="/pro" className="block w-full py-3 bg-violet-600 text-white rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-violet-500 transition-all mb-3">
                    Upgrade to Pro – ₹649/mo
                </Link>
                <button onClick={() => setShowDmGate(false)} className="text-[11px] text-zinc-400 hover:text-zinc-600 font-bold uppercase tracking-wider">
                    Maybe later
                </button>
            </div>
        </div>
    ) : null;

    const isVideo = content?.mediaUrl?.match(/\.(mp4|webm|mov)$/i);

    // Render Contest variation if type is CONTEST
    if (currentType === 'CONTEST') {
        // For contests, we use props slightly differently or expect them in a specific shape
        // In the feed, the 'item' itself is passed as props if we use {...item}
        const contestData = (id as any);
        return (
            <motion.article
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-xl border border-[#00ff9d] border-b-4 mb-4 overflow-hidden hover:shadow-lg transition-all duration-200"
                style={{ padding: "16px" }}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-[#00ff9d] font-black border-2 border-[#00ff9d]">
                            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                                <Heart size={18} className="fill-current" />
                            </motion.div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#00ff9d] bg-zinc-900 px-2 py-0.5 rounded w-fit">Active Contest</p>
                            <h4 className="font-black text-zinc-900 uppercase italic">Limited Time Signal</h4>
                        </div>
                    </div>
                </div>

                <Link href={`/contest/${id}`}>
                    <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-tighter mb-2 line-clamp-2 hover:text-[#00c57a] transition-colors">
                        {content?.title || contestData.title}
                    </h3>
                </Link>

                <p className="text-sm text-zinc-500 mb-6 line-clamp-3">
                    {content?.text || contestData.description}
                </p>

                <div className="flex items-center justify-between bg-zinc-50 rounded-xl p-4 border border-zinc-100 mb-4">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">Prize Pool</p>
                        <p className="text-2xl font-black text-zinc-900 tracking-tighter">${contestData.prizePool || 0}</p>
                    </div>
                    <Link
                        href={`/contest/${id}`}
                        className="bg-zinc-900 text-white font-black uppercase text-[11px] tracking-wider px-6 py-2.5 rounded-lg hover:bg-zinc-800 transition-all flex items-center gap-2"
                    >
                        Join Now <DollarSign size={14} className="text-[#00ff9d]" />
                    </Link>
                </div>
            </motion.article>
        );
    }

    return (
        <>
        <motion.article
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-xl border border-[#E8E8E8] mb-4 overflow-hidden hover:shadow-sm transition-shadow duration-200"
            style={{ padding: "12px 16px" }}
        >
            {/* ── PROFILE ROW (48px) ─────────────────────────────────── */}
            <div className="flex items-center justify-between mb-3" style={{ height: "48px" }}>
                <Link href={`/profile/${authorSlug}`} className="flex items-center gap-2.5 group">
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-zinc-100">
                        {author.image ? (
                            <Image src={author.image} alt={authorName} width={40} height={40} className="object-cover w-full h-full" />
                        ) : (
                            <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-white font-black text-base">
                                {authorName?.[0]?.toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-1">
                            <span className="font-bold text-[14px] text-zinc-900 group-hover:underline leading-tight">{authorName}</span>
                            {author.verified && (
                                <CheckCircle2 size={13} className="text-blue-500 shrink-0" />
                            )}
                        </div>
                        <p className="text-[11px] text-zinc-400 font-mono leading-tight mt-0.5">
                            {author.role === "og_vendor" ? "Company" : "Rave Head"} · {timeAgo(createdAt)}
                        </p>
                    </div>
                </Link>

                {/* Right side: Badge + Delete */}
                <div className="flex items-center gap-3">
                    {isOwner && (
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="p-1.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete Drop"
                        >
                            <Trash2 size={16} className={isDeleting ? "animate-pulse" : ""} />
                        </button>
                    )}
                    <span className={`${badge.bgColor} ${badge.textColor} text-[9px] font-black px-2 py-0.5 rounded tracking-widest uppercase`}>
                        {badge.label}
                    </span>
                </div>
            </div>

            {/* ── TITLE ──────────────────────────────────────────────── */}
            {content.title && (
                <Link href={`/drop/${id}`}>
                    <h3 className="font-black text-[20px] text-zinc-900 leading-snug mb-1.5 hover:underline">
                        {content.title}
                    </h3>
                </Link>
            )}

            {/* ── TEXT BLOCK (max 4–6 lines, See More) ───────────────── */}
            <div className="mb-3">
                <p
                    className="text-[15px] text-zinc-700 leading-[1.55]"
                    style={{ wordBreak: "break-word" }}
                >
                    {displayText}
                    {!expanded && isLong && "…"}
                </p>
                {isLong && (
                    <button
                        onClick={() => setExpanded(e => !e)}
                        className="text-[13px] font-bold text-zinc-400 hover:text-zinc-700 mt-1 transition-colors"
                    >
                        {expanded ? "See less" : "See more"}
                    </button>
                )}
            </div>

            {/* ── IMAGE (1:1 ratio) ──────────────────────────────────── */}
            {content.mediaUrl && (
                <Link href={`/drop/${id}`} className="block mb-3">
                    <div className="rounded-lg overflow-hidden bg-zinc-100 relative aspect-square">
                        {isVideo ? (
                            <video src={content.mediaUrl} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                        ) : (
                            <Image
                                src={content.mediaUrl}
                                alt="Post media"
                                fill
                                className="object-cover hover:scale-[1.02] transition-transform duration-500"
                            />
                        )}
                    </div>
                </Link>
            )}

            {/* ── BUDGET pill ────────────────────────────────────────── */}
            {campaignDetails?.budget && (
                <div className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-[12px] px-2.5 py-0.5 rounded-full mb-3">
                    <DollarSign size={11} /> {campaignDetails.budget}
                </div>
            )}

            {/* ── SKILL / REQUIREMENT TAGS ───────────────────────────── */}
            {type === "CAMPAIGN" && campaignDetails?.requirements && campaignDetails.requirements.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {campaignDetails.requirements.slice(0, 4).map((r: string) => (
                        <span key={r} className="text-[11px] bg-amber-50 border border-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-mono">
                            {r}
                        </span>
                    ))}
                </div>
            )}
            {type === "WORK" && workDetails?.tags && workDetails.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {workDetails.tags.slice(0, 4).map((t: string) => (
                        <span key={t} className="text-[11px] bg-blue-50 border border-blue-200 text-blue-800 px-2 py-0.5 rounded-full font-mono">
                            {t}
                        </span>
                    ))}
                </div>
            )}

            {/* ── HASHTAGS (max 3 + overflow) ────────────────────────── */}
            {allHashtags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    {allHashtags.slice(0, visibleHashtags).map((tag: string, i: number) => (
                        <Link
                            key={i}
                            href={`/explore?tag=${tag}`}
                            className="text-[12px] font-bold text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-0.5"
                        >
                            <Hash size={10} />{tag}
                        </Link>
                    ))}
                    {hiddenCount > 0 && (
                        <button
                            onClick={() => setVisibleHashtags(v => v + hiddenCount)}
                            className="text-[11px] text-zinc-400 hover:text-zinc-600 font-bold"
                        >
                            +{hiddenCount} more
                        </button>
                    )}
                </div>
            )}

            {/* ── SOCIAL PROOF (Applicant count for requirements) ───── */}
            {type === "CAMPAIGN" && applicantCount > 0 && (
                <p className="text-[12px] text-zinc-400 mb-2 font-medium">
                    <span className="text-zinc-700 font-bold">{applicantCount}</span> Rave Head{applicantCount > 1 ? "s" : ""} applied
                </p>
            )}

            {/* ── ENGAGEMENT ROW ─────────────────────────────────────── */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                <div className="flex items-center gap-5">
                    {/* Like */}
                    <motion.button
                        onClick={handleLike}
                        whileTap={{ scale: 1.35 }}
                        className={`flex items-center gap-1.5 transition-colors ${liked ? "text-red-500" : "text-zinc-400 hover:text-red-400"}`}
                    >
                        <Heart size={18} className={liked ? "fill-red-500" : ""} />
                        <span className="text-[12px] font-bold font-mono">{likeCount}</span>
                    </motion.button>

                    {/* Comment — inline expand */}
                    <button
                        onClick={toggleComments}
                        className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-700 transition-colors"
                    >
                        <MessageSquare size={18} />
                        <span className="text-[12px] font-bold font-mono">{metrics.comments + localComments.length}</span>
                    </button>

                    {/* Repost */}
                    <button
                        onClick={handleRepost}
                        className="flex items-center gap-1.5 text-zinc-400 hover:text-green-600 transition-colors"
                    >
                        <Repeat2 size={18} />
                        <span className="text-[12px] font-bold font-mono">{metrics.reposts || 0}</span>
                    </button>

                    {/* Share */}
                    <button onClick={handleShare} className="text-zinc-400 hover:text-zinc-700 transition-colors">
                        <Share2 size={18} />
                    </button>
                </div>

                {/* ── ACTION BUTTONS ─────────────────────── */}
                <div className="flex items-center gap-2">
                    {!isOwner && (
                        <button
                            onClick={handleDmClick}
                            className="flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 border-b-[3px] active:border-b active:translate-y-[2px] text-zinc-800 text-[11px] sm:text-[12px] font-black px-3 sm:px-4 rounded-lg transition-all uppercase tracking-wider"
                            style={{ height: '36px' }}
                            title={isPro ? 'Message' : 'Pro Feature – Unlock DM from Feed'}
                        >
                            {isPro ? <MessageCircle size={14} /> : <Lock size={14} className="text-violet-500" />}
                            <span className="hidden sm:inline">{isPro ? 'Message' : 'Pro'}</span>
                        </button>
                    )}
                    {!isOwner && currentType === "CAMPAIGN" && (user as any)?.role === 'rave_head' && (
                        <Link
                            href={isLoggedIn ? `/collaborate/${id}` : "/login"}
                            className="flex items-center gap-1.5 bg-zinc-900 text-white border-zinc-900 border-b-[3px] active:border-b active:translate-y-[2px] text-[11px] sm:text-[12px] font-black px-3 sm:px-4 rounded-lg hover:bg-zinc-700 transition-all uppercase tracking-wider"
                            style={{ height: "36px" }}
                        >
                            <Handshake size={14} /> Collaborate
                        </Link>
                    )}
                    {!isOwner && currentType === "WORK" && workDetails?.workType !== 'REQUIREMENT' && (user as any)?.role === 'og_vendor' && (
                        <Link
                            href={isLoggedIn ? `/collaborate/${id}` : "/login"}
                            className="flex items-center gap-1.5 border-2 border-zinc-900 border-b-[4px] active:border-b-2 active:translate-y-[2px] text-zinc-900 text-[11px] sm:text-[12px] font-black px-3 sm:px-4 rounded-lg hover:bg-zinc-900 hover:text-white transition-all uppercase tracking-wider"
                            style={{ height: "36px" }}
                        >
                            <Handshake size={14} /> Hire
                        </Link>
                    )}
                    {!isOwner && currentType === "WORK" && workDetails?.workType === 'REQUIREMENT' && (user as any)?.role === 'rave_head' && (
                        <Link
                            href={isLoggedIn ? `/collaborate/${id}` : "/login"}
                            className="flex items-center gap-1.5 bg-zinc-900 text-white border-zinc-900 border-b-[3px] active:border-b active:translate-y-[2px] text-[11px] sm:text-[12px] font-black px-3 sm:px-4 rounded-lg hover:bg-zinc-700 transition-all uppercase tracking-wider"
                            style={{ height: "36px" }}
                        >
                            <Handshake size={14} /> Apply
                        </Link>
                    )}
                </div>
            </div>

            {/* ── INLINE COMMENT THREAD ────────────────────────────────── */}
            <AnimatePresence>
                {showComments && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-3 mt-3 border-t border-zinc-100 space-y-2">
                            {[...fetchedComments, ...localComments].map((c, i) => (
                                <div key={i} className="flex gap-2">
                                    <div className="w-6 h-6 rounded-full bg-zinc-800 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                                        {c.name?.[0] || "?"}
                                    </div>
                                    <div className="bg-zinc-50 rounded-lg px-3 py-1.5 text-[13px] text-zinc-700 flex-1">
                                        <span className="font-bold text-zinc-900 mr-1">{c.name}</span>
                                        {c.text}
                                    </div>
                                </div>
                            ))}

                            {/* Input */}
                            <div className="flex gap-2 items-center pt-1">
                                <div className="w-6 h-6 rounded-full bg-zinc-800 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                                    {user?.name[0]}
                                </div>
                                <div className="flex-1 flex gap-2">
                                    <input
                                        type="text"
                                        value={commentText}
                                        onChange={e => setCommentText(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && handleComment()}
                                        placeholder="Add a comment…"
                                        style={{ backgroundColor: "#F4F4F5", color: "#18181B", border: "1.5px solid #D1D5DB" }}
                                        className="flex-1 text-[13px] rounded-full px-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-zinc-300 transition-all placeholder:text-zinc-400"
                                    />
                                    <button
                                        onClick={handleComment}
                                        className="p-1.5 bg-zinc-900 text-white rounded-full hover:bg-zinc-700 transition-colors disabled:opacity-40"
                                        disabled={!commentText.trim()}
                                    >
                                        <Send size={13} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.article>
        {DmGateModal}
        </>
    );
}

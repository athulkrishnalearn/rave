"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import { Heart, MessageSquare, Repeat2, Share2, Handshake, ArrowLeft, DollarSign, Hash, Send, Users } from 'lucide-react';

export default function DropDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const { user, token } = useAuth();
    const router = useRouter();

    const [drop, setDrop] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        async function fetchDrop() {
            try {
                const res = await fetch(`/api/drops/${id}`);
                const data = await res.json();
                if (data.drop) {
                    setDrop(data.drop);
                    setComments(data.comments || []);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchDrop();
    }, [id]);

    const handleComment = async () => {
        if (!user) { router.push('/login'); return; }
        if (!commentText.trim()) return;
        setSubmitting(true);
        try {
            const res = await fetch(`/api/drops/${id}/comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ text: commentText }),
            });
            const data = await res.json();
            if (data.comment) {
                setComments(prev => [data.comment, ...prev]);
                setCommentText('');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground font-mono uppercase tracking-widest">Loading Drop...</div>
            </div>
        );
    }

    if (!drop) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <p className="font-black uppercase text-xl mb-4">Drop Not Found</p>
                    <Link href="/" className="tactile-btn text-xs px-6 py-3">Return to Feed</Link>
                </div>
            </div>
        );
    }

    const authorName = drop.author?.brandName || drop.author?.name || 'Unknown';
    const authorSlug = authorName.toLowerCase().replace(/\s+/g, '');
    const isOwner = user && (user as any).id === (drop.author?._id?.toString() || drop.author?.toString());

    const typeConfig: Record<string, { label: string; color: string; bg: string }> = {
        DROP: { label: "Drop", color: "text-white", bg: "bg-zinc-800" },
        WORK: { label: "Service", color: "text-white", bg: "bg-blue-600" },
        CAMPAIGN: { label: "Requirement", color: "text-black", bg: "bg-yellow-400" },
    };
    const currentType = (drop.type || 'DROP').toUpperCase();
    const badge = typeConfig[currentType] || typeConfig.DROP;

    return (
        <div className="min-h-screen bg-background text-foreground pb-20 md:pb-0 font-sans">
            <Sidebar />

            <main className="md:pl-20 max-w-2xl mx-auto pt-6 px-4">
                {/* Back */}
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6 hover:text-foreground transition-colors">
                    <ArrowLeft size={16} /> Back to Feed
                </Link>

                {/* Main Drop Card */}
                <article className="border border-border rounded-2xl overflow-hidden mb-6 bg-card">
                    {/* Author Header */}
                    <div className="p-5 flex items-center justify-between border-b border-border">
                        <Link href={`/profile/${authorSlug}`} className="flex items-center gap-3 group">
                            <div className="w-12 h-12 rounded-full bg-black border border-[#E8E8E8] overflow-hidden">
                                {drop.author?.image ? (
                                    <Image src={drop.author.image} alt={authorName} width={48} height={48} className="object-cover w-full h-full" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white font-black text-xl">
                                        {authorName?.[0]?.toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold group-hover:underline">{authorName}</span>
                                    {drop.author?.verified && (
                                        <span className="text-[9px] bg-green-500 text-black font-black px-1.5 py-0.5 rounded">✓ VERIFIED</span>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-mono">
                                    {drop.author?.role === 'og_vendor' ? 'Company' : 'Rave Head'}
                                </p>
                            </div>
                        </Link>
                        <span className={`${badge.bg} ${badge.color} text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider`}>
                            {badge.label}
                        </span>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                        {drop.content?.title && (
                            <h1 className="text-2xl font-black uppercase tracking-tight mb-3">{drop.content.title}</h1>
                        )}
                        <p className="text-base leading-relaxed mb-4">{drop.content?.text}</p>

                        {/* Budget */}
                        {(currentType === 'CAMPAIGN' || currentType === 'WORK') && drop.campaignDetails?.budget && (
                            <div className="inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 font-bold text-sm px-3 py-1.5 rounded-full mb-4">
                                <DollarSign size={13} />
                                Budget: {drop.campaignDetails.budget}
                            </div>
                        )}

                        {/* Media */}
                        {drop.content?.mediaUrl && (
                            <div className="rounded-xl overflow-hidden border border-border aspect-video relative bg-black mb-4">
                                <Image src={drop.content.mediaUrl} alt="Media" fill className="object-cover" />
                            </div>
                        )}

                        {/* Hashtags */}
                        {drop.content?.hashtags && drop.content.hashtags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {drop.content.hashtags.map((tag: string, i: number) => (
                                    <Link key={i} href={`/explore?tag=${tag.replace('#', '')}`}
                                        className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline">
                                        <Hash size={11} />{tag.replace('#', '')}
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Tags for services */}
                        {currentType === 'WORK' && drop.workDetails?.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {drop.workDetails.tags.map((tag: string) => (
                                    <span key={tag} className="text-xs bg-muted border border-border px-2 py-1 rounded-full font-mono">{tag}</span>
                                ))}
                            </div>
                        )}

                        <p className="text-[11px] text-muted-foreground font-mono mt-2">
                            {drop.createdAt ? new Date(drop.createdAt).toLocaleString() : ''}
                        </p>
                    </div>

                    {/* Engagement */}
                    <div className="p-5 border-t border-border flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => setLiked(!liked)}
                                className={`flex items-center gap-1.5 transition-colors ${liked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
                            >
                                <Heart size={20} className={liked ? 'fill-red-500' : ''} />
                                <span className="text-sm font-bold">{(drop.metrics?.likes || 0) + (liked ? 1 : 0)}</span>
                            </button>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <MessageSquare size={20} />
                                <span className="text-sm font-bold">{comments.length}</span>
                            </div>
                            <button className="flex items-center gap-1.5 text-muted-foreground hover:text-green-600">
                                <Repeat2 size={20} />
                                <span className="text-sm font-bold">{drop.metrics?.reposts || 0}</span>
                            </button>
                            <button className="text-muted-foreground hover:text-foreground">
                                <Share2 size={20} />
                            </button>
                        </div>

                        {isOwner && currentType === 'CAMPAIGN' && (
                            <Link
                                href={`/applicants/${id}`}
                                className="flex items-center gap-2 bg-zinc-900 text-white font-black text-xs uppercase px-4 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors"
                            >
                                <Users size={15} /> Manage Applicants
                            </Link>
                        )}
                        {!isOwner && currentType === 'CAMPAIGN' && (
                            <Link
                                href={user ? `/collaborate/${id}` : '/login'}
                                className="flex items-center gap-2 bg-black text-white font-black text-xs uppercase px-4 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors"
                            >
                                <Handshake size={15} /> {drop.applicantCount && drop.applicantCount > 0 ? 'Apply Now' : 'Collaborate'}
                            </Link>
                        )}
                        {!isOwner && currentType === 'WORK' && (
                            <Link
                                href={user ? `/collaborate/${id}` : '/login'}
                                className="flex items-center gap-2 border-2 border-black font-black text-xs uppercase px-4 py-2.5 rounded-lg hover:bg-black hover:text-white transition-colors"
                            >
                                <Handshake size={15} /> Hire
                            </Link>
                        )}
                    </div>
                </article>

                {/* Comments Section */}
                <section className="mb-10">
                    <h2 className="text-lg font-black uppercase tracking-tight mb-4">
                        Replies ({comments.length})
                    </h2>

                    {/* Reply Box */}
                    <div className="flex gap-3 mb-6">
                        <div className="w-9 h-9 rounded-full bg-muted border border-border shrink-0 overflow-hidden">
                            {user?.image ? (
                                <Image src={user.image} alt="You" width={36} height={36} className="object-cover w-full h-full" />
                            ) : (
                                <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-xs font-black">
                                    {user?.name?.[0]?.toUpperCase() || '?'}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 flex gap-2">
                            <input
                                type="text"
                                value={commentText}
                                onChange={e => setCommentText(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleComment()}
                                placeholder={user ? "Add a reply..." : "Login to reply..."}
                                className="flex-1 bg-muted border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                                disabled={!user}
                                onClick={() => !user && router.push('/login')}
                            />
                            <button
                                onClick={handleComment}
                                disabled={submitting || !user || !commentText.trim()}
                                className="p-2.5 bg-black text-white rounded-full hover:bg-zinc-800 transition-colors disabled:opacity-40"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Comment List */}
                    {comments.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            <p className="font-bold uppercase tracking-wider text-sm">No replies yet.</p>
                            <p className="text-xs mt-1">Be the first to reply.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {comments.map((comment: any) => (
                                <div key={comment._id} className="flex gap-3">
                                    <div className="w-9 h-9 rounded-full bg-muted border border-border shrink-0 overflow-hidden">
                                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-white text-xs font-black">
                                            {comment.author?.name?.[0]?.toUpperCase() || '?'}
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-muted/50 rounded-2xl rounded-tl-none px-4 py-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold">{comment.author?.name || 'User'}</span>
                                            <span className="text-[10px] text-muted-foreground font-mono">
                                                {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'now'}
                                            </span>
                                        </div>
                                        <p className="text-sm">{comment.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

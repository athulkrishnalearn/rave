"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Trash2, Link as LinkIcon, AlertTriangle, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function ModerationTab() {
    const { token } = useAuth();
    const [drops, setDrops] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [acting, setActing] = useState<string | null>(null);

    const fetchDrops = () => {
        setLoading(true);
        fetch('/api/admin/content', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => { setDrops(data.posts || []); setLoading(false); })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        if (token) fetchDrops();
    }, [token]);

    const handleDelete = async (postId: string) => {
        if (!confirm("Are you sure you want to permanently delete this Drop? This cannot be undone.")) return;
        setActing(postId);
        try {
            await fetch('/api/admin/content', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ postId })
            });
            fetchDrops();
        } catch (e) {
            alert('Failed to delete content.');
        } finally {
            setActing(null);
        }
    };

    return (
        <div className="p-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-1 flex items-center gap-2">
                    <AlertTriangle size={24} className="text-red-500" /> Platform Content Moderation
                </h2>
                <p className="text-sm font-mono text-zinc-500">Global feed of all drops and campaigns. {drops.length} active.</p>
            </div>

            <div className="bg-white border border-[#E8E8E8] rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-50 border-b border-zinc-200 uppercase text-[11px] font-black tracking-wider text-zinc-500">
                            <tr>
                                <th className="p-4 w-32">Type</th>
                                <th className="p-4">Author</th>
                                <th className="p-4 w-1/3">Synopsis</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {loading ? (
                                <tr><td colSpan={4} className="p-8 text-center font-mono text-zinc-400">Loading Content Lexicon...</td></tr>
                            ) : drops.map(post => (
                                <tr key={post._id} className="hover:bg-zinc-50/50 transition-colors">
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${post.type === 'CAMPAIGN' ? 'bg-purple-100 text-purple-700' : 'bg-zinc-100 text-zinc-700'}`}>
                                            {post.type}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-[13px]">{post.author?.name || 'Unknown User'}</div>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-[12px] truncate max-w-xs text-zinc-600">
                                            {post.content?.title || post.content?.text || 'No text content'}
                                        </p>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/drop/${post._id}`}
                                                target="_blank"
                                                className="p-1.5 hover:bg-zinc-100 text-zinc-500 rounded transition-colors"
                                            >
                                                <LinkIcon size={16} />
                                            </Link>
                                            <button
                                                disabled={acting === post._id}
                                                onClick={() => handleDelete(post._id)}
                                                className="p-1.5 hover:bg-red-100 text-red-600 rounded transition-colors disabled:opacity-50"
                                                title="Delete Drop Permanently"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

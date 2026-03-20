"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import {
    Bell, Heart, MessageSquare, Repeat2,
    Handshake, DollarSign, Check, ChevronRight,
    Circle, Archive, Trash2, Clock
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
    like: Heart,
    comment: MessageSquare,
    repost: Repeat2,
    collaborate: Handshake,
    payment: DollarSign,
    accept: Check,
    reject: Bell,
};

const COLOR_MAP: Record<string, string> = {
    like: "text-rose-500 bg-rose-50",
    comment: "text-sky-500 bg-sky-50",
    repost: "text-emerald-500 bg-emerald-50",
    collaborate: "text-purple-500 bg-purple-50",
    payment: "text-amber-500 bg-amber-50",
    accept: "text-green-500 bg-green-50",
    reject: "text-zinc-500 bg-zinc-50",
};

export default function NotificationsPage() {
    const { user, token } = useAuth();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        async function fetchNotifs() {
            try {
                const res = await fetch("/api/notifications", {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.notifications) {
                    setNotifications(data.notifications);
                    setUnreadCount(data.unread);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        if (token) fetchNotifs();
    }, [token]);

    const markAllRead = async () => {
        try {
            const res = await fetch("/api/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ all: true }),
            });
            if (res.ok) {
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                setUnreadCount(0);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const markRead = async (id: string) => {
        try {
            await fetch("/api/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ ids: [id] }),
            });
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (e) {
            console.error(e);
        }
    };

    if (!user) return (
        <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center p-4">
            <div className="text-center">
                <p className="text-zinc-400 font-black uppercase text-xl mb-6 italic tracking-tighter">Stay updated on the collab feed</p>
                <Link href="/login" className="px-8 py-4 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-800 transition-all">
                    Login Required
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pb-20 md:pb-0 font-sans bg-[#F7F7F8]">
            <Sidebar />

            <div className="md:pl-16">
                <main className="max-w-2xl mx-auto px-4 py-8">

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-zinc-900 uppercase tracking-tighter leading-tight">
                                Alerts
                            </h1>
                            <p className="text-[13px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
                                {unreadCount > 0 ? `${unreadCount} New Synchronization Events` : "All network events synced"}
                            </p>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="px-4 py-2.5 bg-white border border-[#E8E8E8] text-zinc-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-zinc-400 transition-all shrink-0"
                            >
                                Mark All Read
                            </button>
                        )}
                    </div>

                    {/* ── NOTIFICATION LIST ──── */}
                    <div className="space-y-2">
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-white rounded-2xl border border-[#E8E8E8] animate-pulse" />)}
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="py-24 bg-white rounded-3xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-center">
                                <Bell className="text-zinc-200 mb-4 opacity-30" size={48} />
                                <p className="text-zinc-400 text-[14px] font-black uppercase tracking-tight">No events yet</p>
                                <p className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest mt-1">Synchronize with the feed to get updates</p>
                            </div>
                        ) : (
                            notifications.map(notif => {
                                const IconComp = ICON_MAP[notif.type] || Bell;
                                const style = COLOR_MAP[notif.type] || "text-zinc-400 bg-zinc-50";

                                return (
                                    <Link
                                        key={notif._id}
                                        href={notif.link || "/"}
                                        onClick={() => markRead(notif._id)}
                                        className={`group block bg-white border rounded-2xl p-4 transition-all hover:border-zinc-900 hover:shadow-xl hover:shadow-zinc-200/50 relative ${notif.read ? "border-[#E8E8E8]" : "border-zinc-300 shadow-sm"}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${style}`}>
                                                <IconComp size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-[13px] md:text-[14px] leading-tight ${notif.read ? "text-zinc-500 font-medium" : "text-zinc-900 font-black"}`}>
                                                    {notif.message}
                                                </p>
                                                <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mt-1.5 flex items-center gap-2">
                                                    <Clock size={10} />
                                                    {new Date(notif.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            {!notif.read && (
                                                <div className="w-2.5 h-2.5 rounded-full bg-zinc-900" />
                                            )}
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ChevronRight size={16} className="text-zinc-300" />
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })
                        )}
                    </div>

                    {/* Secondary Actions */}
                    <div className="mt-12 grid grid-cols-2 gap-3">
                        <button className="p-6 bg-white border border-[#E8E8E8] rounded-3xl text-left group hover:border-zinc-900 transition-all">
                            <Archive size={24} className="text-zinc-200 mb-3 group-hover:text-zinc-900 transition-colors" />
                            <h4 className="text-[11px] font-black uppercase text-zinc-900 tracking-widest">Archive All</h4>
                            <p className="text-[10px] text-zinc-400 font-bold mt-1">Clean up your feed history</p>
                        </button>
                        <button className="p-6 bg-white border border-[#E8E8E8] rounded-3xl text-left group hover:border-zinc-900 transition-all">
                            <Trash2 size={24} className="text-zinc-200 mb-3 group-hover:text-red-500 transition-colors" />
                            <h4 className="text-[11px] font-black uppercase text-zinc-900 tracking-widest">Clear Log</h4>
                            <p className="text-[10px] text-zinc-400 font-bold mt-1">Remove all events forever</p>
                        </button>
                    </div>

                </main>
            </div>
        </div>
    );
}

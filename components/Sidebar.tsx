"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, MessageSquare, User, Briefcase, Bell, Handshake, Sparkles, BookOpen, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
    const pathname = usePathname();
    const { user, token } = useAuth();
    const isPro = (user as any)?.isPro === true;
    const [unreadNotifs, setUnreadNotifs] = useState(0);

    useEffect(() => {
        if (!token) return;
        const fetchUnread = async () => {
            try {
                const res = await fetch("/api/notifications", {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.unread !== undefined) setUnreadNotifs(data.unread);
            } catch (e) { }
        };
        fetchUnread();
        const interval = setInterval(fetchUnread, 15000);
        return () => clearInterval(interval);
    }, [token]);

    const profileHref = user
        ? `/profile/${(user as any).username || (user as any).id || user.name.toLowerCase().replace(/\s+/g, "")}`
        : "/login";

    const isVendor = (user as any)?.role === 'og_vendor';

    const NAV_ITEMS = [
        { href: "/", icon: Home, label: "Feed" },
        { href: "/explore", icon: Search, label: "Explore" },
        { href: "/create", icon: PlusCircle, label: "Create" },
        { href: "/collaborations", icon: Handshake, label: "Collabs" },
        { href: "/inbox", icon: MessageSquare, label: "Messages" },
        { href: "/notifications", icon: Bell, label: "Alerts" },
        { href: isVendor ? "/dashboard/company" : "/dashboard", icon: Briefcase, label: "Dashboard" },
    ];

    const items = [...NAV_ITEMS, { href: profileHref, icon: User, label: "Profile" }];

    return (
        <>
            {/* ── DESKTOP — fixed left rail (80px wide) ───────────── */}
            <aside
                className="hidden md:flex fixed left-0 top-0 h-screen w-20 flex-col items-center z-50"
                style={{ backgroundColor: "#FFFFFF", borderRight: "1px solid #EBEBEB" }}
            >
                {/* Logo — aligned with feed filter tabs */}
                <Link href="/" className="flex items-center justify-center w-11 h-11 shrink-0 relative" style={{ marginTop: '104px' }}>
                    <Image
                        src="/logo-black.png"
                        alt="RAVE"
                        fill
                        className="object-contain"
                        priority
                    />
                </Link>

                {/* Nav items */}
                <div className="flex flex-col items-center gap-1 flex-1 justify-center">
                    {items.map(({ href, icon: Icon, label }) => {
                        const active = pathname === href || (href !== "/" && pathname.startsWith(href));
                        return (
                            <Link
                                key={href}
                                href={href}
                                title={label}
                                className={`group relative flex items-center justify-center w-11 h-11 rounded-xl transition-all ${active
                                    ? "bg-zinc-900 text-white"
                                    : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
                                    }`}
                            >
                                <Icon size={19} strokeWidth={active ? 2.5 : 1.8} />

                                {label === "Alerts" && unreadNotifs > 0 && (
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                                )}

                                {/* Tooltip */}
                                <span className="pointer-events-none absolute left-[4.5rem] bg-zinc-900 text-white text-[11px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                    {label}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {/* Pro badge pinned to bottom */}
                <div className="mb-4 shrink-0">
                    {isPro ? (
                        <Link href="/pro" title="RAVE Pro"
                            className="group relative flex items-center justify-center w-11 h-11 rounded-xl bg-violet-600 text-white hover:bg-violet-500 transition-all"
                        >
                            <Zap size={16} />
                            <span className="pointer-events-none absolute left-[4.5rem] bg-violet-700 text-white text-[11px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap z-50">Pro Active</span>
                        </Link>
                    ) : (
                        <Link href="/pro" title="Upgrade to Pro"
                            className="group relative flex items-center justify-center w-11 h-11 rounded-xl bg-violet-50 text-violet-500 hover:bg-violet-600 hover:text-white transition-all border border-violet-200"
                        >
                            <Sparkles size={16} />
                            <span className="pointer-events-none absolute left-[4.5rem] bg-violet-700 text-white text-[11px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap z-50">Upgrade to Pro</span>
                        </Link>
                    )}
                </div>
            </aside>

            {/* ── MOBILE — fixed bottom dock ──────────────────────── */}
            <nav className="flex md:hidden fixed bottom-0 left-0 right-0 z-50 py-2 px-1"
                style={{ backgroundColor: "#FFFFFF", borderTop: "1px solid #EBEBEB" }}
            >
                {items.slice(0, 5).map(({ href, icon: Icon, label }) => {
                    const active = pathname === href || (href !== "/" && pathname.startsWith(href));
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex-1 flex flex-col items-center gap-0.5 py-1 transition-colors ${active ? "text-zinc-900" : "text-zinc-400"}`}
                        >
                            <Icon size={20} strokeWidth={active ? 2.5 : 1.6} />
                            <span className="text-[10px] font-bold uppercase tracking-wide">{label}</span>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}

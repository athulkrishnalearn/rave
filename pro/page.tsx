"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import {
    Zap, MessageCircle, Bot, Clock, Briefcase, Shield,
    BarChart3, Star, Check, X, ChevronRight, Sparkles
} from "lucide-react";

const MONTHLY_PRICE = 1299;
const OFFER_PRICE = 649;
const ANNUAL_PRICE = 6490;

const proFeatures = [
    {
        icon: Bot,
        title: "Full AI Agents Access",
        desc: "Unlimited text, image, and audio generation tools. Free users get zero access.",
        color: "bg-violet-500",
    },
    {
        icon: MessageCircle,
        title: "DM Anyone from Feed",
        desc: "Message any creator or brand directly from their drop. No waiting for applications.",
        color: "bg-blue-500",
    },
    {
        icon: Clock,
        title: "5-Day Payouts (3x Faster)",
        desc: "Funds settle in 5 days instead of 15. Better cash flow for your creative business.",
        color: "bg-green-500",
    },
    {
        icon: Briefcase,
        title: "Unlimited Active Work Drops",
        desc: "Free users are capped at 5 active services. Go unlimited and scale freely.",
        color: "bg-orange-500",
    },
    {
        icon: Star,
        title: "Pro Badge on Profile",
        desc: "Stand out in applicant lists. Signal to brands you're a serious creator.",
        color: "bg-amber-500",
    },
    {
        icon: BarChart3,
        title: "Advanced Analytics",
        desc: "Profile views, drop performance, follower trends, hashtag insights. Export your data.",
        color: "bg-pink-500",
    },
    {
        icon: ChevronRight,
        title: "Priority Proposal Placement",
        desc: "Your application appears first when brands review their applicant list.",
        color: "bg-teal-500",
    },
    {
        icon: Shield,
        title: "24-Hour Priority Support",
        desc: "Free users wait 72 hours. Pro users get dedicated support within 24 hours.",
        color: "bg-red-500",
    },
];

const comparisonRows = [
    { label: "Payout Settlement", free: "15 days", pro: "5 days" },
    { label: "Platform Fee", free: "20%", pro: "20%" },
    { label: "AI Agents", free: false, pro: true },
    { label: "DM from Feed", free: false, pro: true },
    { label: "Active Work Drops", free: "5 max", pro: "Unlimited" },
    { label: "Priority in Applicant Lists", free: false, pro: true },
    { label: "Pro Badge", free: false, pro: true },
    { label: "Advanced Analytics", free: false, pro: true },
    { label: "Support Response", free: "72 hours", pro: "24 hours" },
    { label: "All Playbooks", free: true, pro: true },
];

export default function ProPage() {
    const { user, token, refreshUser } = useAuth();
    const router = useRouter();
    const [plan, setPlan] = useState<"monthly" | "annual">("monthly");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Already Pro — show a status page instead of the upgrade CTA
    const isPro = (user as any)?.role === 'og_vendor' || (user as any)?.role === 'admin' ? true : (user as any)?.isPro === true;

    return (
        <div className="min-h-screen bg-[#F7F7F8] pb-24 md:pb-0 font-sans">
            <Sidebar />
            <div className="md:pl-16">
                {/* ── HERO ── */}
                <div className="relative overflow-hidden bg-zinc-900 text-white px-6 py-20 text-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 via-zinc-900 to-zinc-900 pointer-events-none" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/20 blur-3xl rounded-full pointer-events-none" />
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-600/20 border border-violet-500/30 rounded-full text-[11px] font-black uppercase tracking-widest text-violet-300 mb-6">
                            <Sparkles size={12} /> Limited Time — 50% Off
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4">
                            RAVE <span className="text-violet-400">Pro</span>
                        </h1>
                        <p className="text-zinc-400 text-[15px] max-w-lg mx-auto leading-relaxed">
                            Unlock AI creative tools, message anyone from the feed, get paid 3× faster, and stand out with a Pro badge.
                        </p>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">

                    {/* ── PLAN TOGGLE / STATUS ── */}
                    {isPro ? (
                        <div className="text-center max-w-sm mx-auto px-8 py-10 bg-white border border-violet-200 rounded-3xl shadow-xl">
                            <div className="w-16 h-16 bg-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <Zap size={28} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter text-zinc-900 mb-2">You're Pro! ✦</h2>
                            <p className="text-[14px] text-zinc-600 mb-6 leading-relaxed">
                                All Pro features are active. AI Agents and DM from Feed are unlocked.
                                {(user as any)?.proExpiry && (
                                    <span className="block mt-2 text-violet-600 font-bold bg-violet-50 px-3 py-1.5 rounded-xl text-[12px] uppercase tracking-widest">
                                        Active until {new Date((user as any).proExpiry).toLocaleDateString()}
                                    </span>
                                )}
                            </p>
                            <Link href="/" className="block w-full py-3.5 bg-zinc-900 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all">
                                Go to Feed
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-6">
                            <div className="flex items-center gap-2 bg-white border border-[#E8E8E8] p-1 rounded-2xl">
                                {(["monthly", "annual"] as const).map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setPlan(p)}
                                        className={`px-6 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all ${plan === p ? "bg-zinc-900 text-white" : "text-zinc-400 hover:text-zinc-600"}`}
                                    >
                                        {p === "monthly" ? "Monthly" : "Annual (Save 2 months)"}
                                    </button>
                                ))}
                            </div>

                            {/* ── PRICE CARD ── */}
                            <div className="relative w-full max-w-sm bg-white rounded-3xl border-2 border-violet-200 shadow-2xl shadow-violet-100 overflow-hidden">
                                <div className="absolute top-4 right-4">
                                    <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                                        50% OFF
                                    </span>
                                </div>
                                <div className="p-8 text-center">
                                    <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-2">RAVE Pro</p>
                                    <div className="flex items-end justify-center gap-2 mb-1">
                                        <span className="text-5xl font-black text-zinc-900">
                                            ₹{plan === "annual" ? ANNUAL_PRICE.toLocaleString() : OFFER_PRICE}
                                        </span>
                                        <span className="text-zinc-400 text-[13px] font-bold mb-2">
                                            /{plan === "annual" ? "year" : "mo"}
                                        </span>
                                    </div>
                                    <p className="text-zinc-400 text-[12px] line-through mb-1">
                                        ₹{plan === "annual" ? "15,588" : MONTHLY_PRICE} regular price
                                    </p>
                                    {plan === "annual" && (
                                        <p className="text-green-600 text-[12px] font-black mb-1">You save ₹9,098 per year</p>
                                    )}
                                    <p className="text-[11px] text-zinc-300 mb-6">per user · cancel anytime</p>

                                    {success ? (
                                        <div className="py-4 text-green-600 font-black text-[13px] uppercase tracking-widest flex items-center justify-center gap-2">
                                            <Check size={16} /> Pro Activated! Redirecting…
                                        </div>
                                    ) : (
                                        <button
                                            onClick={async () => {
                                                if (!user) { router.push("/login"); return; }
                                                setLoading(true);
                                                try {
                                                    const res = await fetch("/api/subscription", {
                                                        method: "POST",
                                                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                                                        body: JSON.stringify({ plan }),
                                                    });
                                                    if (res.ok) {
                                                        await refreshUser();
                                                        setSuccess(true);
                                                        setTimeout(() => router.push("/"), 2000);
                                                    }
                                                } catch (e) { console.error(e); }
                                                setLoading(false);
                                            }}
                                            disabled={loading}
                                            className="w-full py-4 bg-zinc-900 text-white rounded-2xl text-[13px] font-black uppercase tracking-widest hover:bg-violet-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            <Zap size={15} /> {loading ? "Processing…" : "Upgrade to Pro"}
                                        </button>
                                    )}
                                    <p className="text-[10px] text-zinc-300 mt-3">Simulated payment · Razorpay integration coming soon</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── FEATURES GRID ── */}
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter text-zinc-900 mb-8 text-center">What you unlock</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {proFeatures.map(f => {
                                const Icon = f.icon;
                                return (
                                    <div key={f.title} className="bg-white rounded-2xl border border-[#E8E8E8] p-5 hover:border-zinc-300 hover:shadow-lg transition-all">
                                        <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                                            <Icon size={18} className="text-white" />
                                        </div>
                                        <h3 className="text-[13px] font-black text-zinc-900 uppercase tracking-tight mb-1">{f.title}</h3>
                                        <p className="text-[12px] text-zinc-500 leading-relaxed">{f.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── COMPARISON TABLE ── */}
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter text-zinc-900 mb-8 text-center">Free vs. Pro</h2>
                        <div className="bg-white rounded-3xl border border-[#E8E8E8] overflow-hidden">
                            <div className="grid grid-cols-3 border-b border-[#E8E8E8]">
                                <div className="p-4 text-[11px] font-black uppercase tracking-widest text-zinc-400">Feature</div>
                                <div className="p-4 text-center text-[11px] font-black uppercase tracking-widest text-zinc-400 border-l border-[#E8E8E8]">Free</div>
                                <div className="p-4 text-center text-[11px] font-black uppercase tracking-widest text-violet-600 border-l border-[#E8E8E8] bg-violet-50/50">Pro</div>
                            </div>
                            {comparisonRows.map((row, i) => (
                                <div key={row.label} className={`grid grid-cols-3 ${i < comparisonRows.length - 1 ? "border-b border-[#E8E8E8]" : ""}`}>
                                    <div className="p-4 text-[13px] font-bold text-zinc-700">{row.label}</div>
                                    <div className="p-4 flex items-center justify-center border-l border-[#E8E8E8]">
                                        {typeof row.free === "boolean" ? (
                                            row.free
                                                ? <Check size={16} className="text-green-500" />
                                                : <X size={16} className="text-zinc-300" />
                                        ) : (
                                            <span className="text-[12px] font-bold text-zinc-500">{row.free}</span>
                                        )}
                                    </div>
                                    <div className="p-4 flex items-center justify-center border-l border-[#E8E8E8] bg-violet-50/30">
                                        {typeof row.pro === "boolean" ? (
                                            row.pro
                                                ? <Check size={16} className="text-violet-600" />
                                                : <X size={16} className="text-zinc-300" />
                                        ) : (
                                            <span className="text-[12px] font-black text-violet-700">{row.pro}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── BOTTOM CTA ── */}
                    {!isPro && (
                        <div className="bg-zinc-900 text-white rounded-3xl p-10 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 to-zinc-900 pointer-events-none" />
                            <div className="relative z-10">
                                <p className="text-[11px] font-black uppercase tracking-widest text-violet-400 mb-3">That's less than ₹22/day</p>
                                <h3 className="text-3xl font-black uppercase tracking-tighter mb-3">Ready to go Pro?</h3>
                                <p className="text-zinc-400 text-[13px] mb-8 max-w-md mx-auto">Get paid 3× faster. Unlock AI. Message anyone. Stand out.</p>
                                <button
                                    onClick={async () => {
                                        if (!user) { router.push("/login"); return; }
                                        setLoading(true);
                                        try {
                                            const res = await fetch("/api/subscription", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                                                body: JSON.stringify({ plan }),
                                            });
                                            if (res.ok) {
                                                await refreshUser();
                                                setSuccess(true);
                                                setTimeout(() => router.push("/"), 2000);
                                            }
                                        } catch (e) { console.error(e); }
                                        setLoading(false);
                                    }}
                                    disabled={loading || success}
                                    className="px-10 py-4 bg-violet-600 text-white rounded-2xl text-[13px] font-black uppercase tracking-widest hover:bg-violet-500 transition-all disabled:opacity-50 inline-flex items-center gap-2"
                                >
                                    <Zap size={15} /> {success ? "Activated!" : loading ? "Processing…" : "Upgrade Now – ₹649/mo"}
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

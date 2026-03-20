"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import CopilotInterface from "@/components/ai/CopilotInterface";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Megaphone, Code, Sparkles, Zap, Target, Layout, Box, Lock } from "lucide-react";

type CopilotType = "marketing" | "programming";

export default function AIToolsPage() {
    const { user } = useAuth();
    const isPro = (user as any)?.role === 'og_vendor' || (user as any)?.role === 'admin' ? true : (user as any)?.isPro === true;
    const [activeCopilot, setActiveCopilot] = useState<CopilotType>("marketing");

    if (!isPro) return (
        <div className="min-h-screen bg-[#F7F7F8] font-sans pb-20 md:pb-0">
            <Sidebar />
            <div className="md:pl-16 flex items-center justify-center min-h-screen">
                <div className="text-center max-w-sm px-6">
                    <div className="w-16 h-16 bg-violet-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Lock size={28} className="text-violet-600" />
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 mb-3">Pro Feature</h1>
                    <p className="text-[13px] text-zinc-500 mb-8 leading-relaxed">
                        AI Agents are exclusively available for RAVE Pro subscribers. Upgrade to unlock text, image, and audio generation tools.
                    </p>
                    <Link href="/pro" className="block w-full py-4 bg-violet-600 text-white rounded-2xl text-[13px] font-black uppercase tracking-widest hover:bg-violet-500 transition-all mb-3">
                        Upgrade to Pro – ₹649/mo
                    </Link>
                    <p className="text-[11px] text-zinc-300">50% off · cancel anytime</p>
                </div>
            </div>
        </div>
    );

    const COPILOTS = [
        { 
            id: "marketing" as CopilotType, 
            label: "Marketing Copilot", 
            icon: Megaphone,
            desc: "Growth & Viral Strategy",
            color: "text-indigo-600",
            bg: "bg-indigo-50"
        },
        { 
            id: "programming" as CopilotType, 
            label: "Programming Copilot", 
            icon: Code,
            desc: "Code & Technical Build",
            color: "text-zinc-900",
            bg: "bg-zinc-100"
        }
    ];

    return (
        <div className="min-h-screen bg-[#F7F7F8] font-sans pb-20 md:pb-0">
            <Sidebar />

            <div className="md:pl-16">
                <main className="max-w-6xl mx-auto px-4 py-8">
                    
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-zinc-900 text-white p-2.5 rounded-2xl shadow-lg shadow-zinc-200">
                                <Sparkles size={24} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-zinc-900 uppercase tracking-tighter leading-tight">AI Command Center</h1>
                                <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Synchronized High-Fidelity Assistant Network</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        
                        {/* Selector Sidebar */}
                        <div className="w-full lg:w-72 shrink-0 space-y-3">
                            {COPILOTS.map((cp) => (
                                <button
                                    key={cp.id}
                                    onClick={() => setActiveCopilot(cp.id)}
                                    className={`w-full flex items-center gap-4 p-5 rounded-3xl text-left transition-all border ${
                                        activeCopilot === cp.id 
                                            ? "bg-white border-zinc-900 shadow-xl shadow-zinc-200 ring-1 ring-zinc-900" 
                                            : "bg-white/50 border-transparent hover:bg-white hover:border-[#EBEBEB] text-zinc-400"
                                    }`}
                                >
                                    <div className={`p-3 rounded-2xl ${activeCopilot === cp.id ? cp.bg + " " + cp.color : "bg-zinc-50 text-zinc-300"}`}>
                                        <cp.icon size={22} />
                                    </div>
                                    <div>
                                        <p className={`text-[13px] font-black uppercase tracking-tight ${activeCopilot === cp.id ? "text-zinc-900" : "text-zinc-400"}`}>
                                            {cp.label}
                                        </p>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{cp.desc}</p>
                                    </div>
                                </button>
                            ))}

                            {/* Quick Actions / Tips */}
                            <div className="bg-zinc-900 rounded-3xl p-6 text-white shadow-xl shadow-zinc-200 hidden lg:block">
                                <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                                    <Zap size={12} /> System Status
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 group">
                                        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-zinc-900 transition-colors">
                                            <Target size={14} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black uppercase tracking-tight">Precision Model</p>
                                            <p className="text-[9px] text-zinc-500 uppercase font-black">Nemotron 70B Active</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 group">
                                        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-zinc-900 transition-colors">
                                            <Layout size={14} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black uppercase tracking-tight">Latency</p>
                                            <p className="text-[9px] text-zinc-500 uppercase font-black">Sync Speed: 42ms</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 w-full h-[70vh] lg:h-[750px] min-h-[600px]">
                            {activeCopilot === 'marketing' ? (
                                <CopilotInterface 
                                    key="marketing"
                                    type="marketing"
                                    title="Marketing Copilot"
                                    description="Viral Growth & Brand Strategy"
                                    initialMessage="Identity confirmed. I am your Marketing Copilot. How can I help you dominate the creator market today?"
                                />
                            ) : (
                                <CopilotInterface 
                                    key="programming"
                                    type="programming"
                                    title="Programming Copilot"
                                    description="Technical Build & Optimization"
                                    initialMessage="Dev environment synced. I am your Programming Copilot. Ready to build, debug, or optimize. What's the mission?"
                                />
                            )}
                        </div>

                    </div>

                </main>
            </div>
        </div>
    );
}

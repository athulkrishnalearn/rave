"use client";

import Sidebar from "@/components/Sidebar";
import CopilotInterface from "@/components/ai/CopilotInterface";
import { Sparkles, Library, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function TutorAIPage() {
    return (
        <div className="min-h-screen bg-[#F7F7F8] font-sans pb-20 md:pb-0">
            <Sidebar />

            <div className="md:pl-16">
                <main className="max-w-6xl mx-auto px-4 py-8 h-[calc(100vh-32px)] flex flex-col">
                    
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/learning-hub" className="p-2.5 bg-white border border-[#EBEBEB] rounded-2xl hover:bg-zinc-50 transition-all text-zinc-400">
                                <ChevronLeft size={20} />
                            </Link>
                            <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tighter">Tutor Copilot</h1>
                                    <div className="px-2 py-0.5 bg-amber-500 text-white rounded-md text-[8px] font-black uppercase tracking-widest">Live Sync</div>
                                </div>
                                <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400">AI Education Service • RAVE Learning Hub</p>
                            </div>
                        </div>

                        <Link href="/learning-hub" className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200">
                            <Library size={14} /> View All Playbooks
                        </Link>
                    </div>

                    <div className="flex-1 min-h-0 bg-white rounded-[40px] shadow-2xl shadow-zinc-200/50 border border-[#EBEBEB] overflow-hidden">
                        <CopilotInterface 
                            type="tutor"
                            title="Tutor Copilot"
                            description="AI Learning Specialist"
                            initialMessage="Synchronized and ready to teach. I can help you master any creative skill, explain RAVE platform features, or create a personalized learning plan. What are we studying today?"
                        />
                    </div>

                </main>
            </div>
        </div>
    );
}

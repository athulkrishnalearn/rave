"use client";

import { ArrowLeft, CheckCircle, Send } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function ProposalPage() {
    const [submitted, setSubmitted] = useState(false);

    if (submitted) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-4">
                    <CheckCircle size={32} />
                </div>
                <h1 className="text-2xl font-black uppercase mb-2">Proposal Sent</h1>
                <p className="text-muted-foreground mb-8">CyberGoth99 will receive your message in their inbox.</p>
                <Link href="/explore" className="tactile-btn px-8">
                    Back to Explore
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-24 md:pl-20 md:pb-0 pt-8 px-4 max-w-2xl mx-auto">
            <Link href="/explore" className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6 hover:text-black transition-colors">
                <ArrowLeft size={16} /> Cancel
            </Link>

            <div className="bg-card border border-[#E8E8E8] rounded-xl p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-border">
                    <div className="w-16 h-16 bg-black rounded-lg overflow-hidden relative">
                        <Image src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80" alt="Work" fill className="object-cover" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-tight">Collaboration Request</h1>
                        <p className="text-sm text-muted-foreground">Re: "Acid Techno Visuals"</p>
                    </div>
                </div>

                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider">Message</label>
                        <textarea
                            className="w-full bg-background border border-[#E8E8E8] rounded-lg p-3 min-h-[150px] font-mono text-sm focus:border-black outline-none transition-colors resize-none"
                            placeholder="Hey! I love this style. I'm looking for something similar for my next event..."
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider">Proposed Budget ($)</label>
                        <input
                            type="number"
                            className="w-full bg-background border border-[#E8E8E8] rounded-lg p-3 font-mono text-sm focus:border-black outline-none transition-colors"
                            placeholder="Optional"
                        />
                    </div>

                    <button type="submit" className="tactile-btn w-full py-4 text-base mt-2 flex items-center justify-center gap-2">
                        <Send size={18} /> SEND PROPOSAL
                    </button>

                </form>
            </div>
        </div>
    );
}

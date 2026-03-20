"use client";

import { ArrowLeft, CheckCircle, Upload } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function ApplicationPage() {
    const router = useRouter();
    const params = useParams();
    const { token } = useAuth();

    const [submitted, setSubmitted] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [quote, setQuote] = useState('');
    const [timeline, setTimeline] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!token) {
            alert("Please login first");
            router.push('/login');
            return;
        }

        try {
            const res = await fetch('/api/application', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    campaignId: params.id,
                    coverLetter,
                    quote: Number(quote),
                    timeline: Number(timeline)
                })
            });

            const data = await res.json();

            if (res.ok) {
                setSubmitted(true);
            } else {
                alert(data.error || "Application failed");
            }
        } catch (error) {
            console.error("Application error", error);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-4">
                    <CheckCircle size={32} />
                </div>
                <h1 className="text-2xl font-black uppercase mb-2">Application Sent</h1>
                <p className="text-muted-foreground mb-8">The vendor will review your profile and get back to you.</p>
                <Link href="/" className="tactile-btn px-8">
                    Back to Feed
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-24 md:pl-20 md:pb-0 pt-8 px-4 max-w-2xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6 hover:text-black transition-colors">
                <ArrowLeft size={16} /> Cancel
            </Link>

            <div className="bg-card border border-[#E8E8E8] rounded-xl p-6 md:p-8">
                <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Apply for Campaign</h1>
                <p className="text-muted-foreground mb-8">Submit your pitch.</p>

                <form className="space-y-6" onSubmit={handleSubmit}>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider">Cover Letter</label>
                        <textarea
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            className="w-full bg-background border border-[#E8E8E8] rounded-lg p-3 min-h-[150px] font-mono text-sm focus:border-black outline-none transition-colors resize-none"
                            placeholder="Why are you the best fit for this campaign?"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider">Quote ($)</label>
                            <input
                                type="number"
                                value={quote}
                                onChange={(e) => setQuote(e.target.value)}
                                className="w-full bg-background border border-[#E8E8E8] rounded-lg p-3 font-mono text-sm focus:border-black outline-none transition-colors"
                                placeholder="2500"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider">Timeline (Days)</label>
                            <input
                                type="number"
                                value={timeline}
                                onChange={(e) => setTimeline(e.target.value)}
                                className="w-full bg-background border border-[#E8E8E8] rounded-lg p-3 font-mono text-sm focus:border-black outline-none transition-colors"
                                placeholder="7"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider">Attachments</label>
                        <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">
                            <Upload size={24} className="mb-2" />
                            <span className="text-xs font-bold uppercase">Upload Portfolio / Reel</span>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="tactile-btn w-full py-4 text-base mt-2 disabled:opacity-50">
                        {loading ? 'SENDING...' : 'SEND APPLICATION'}
                    </button>

                </form>
            </div>
        </div>
    );
}

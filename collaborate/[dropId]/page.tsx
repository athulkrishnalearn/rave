"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { ArrowLeft, Handshake, DollarSign, Clock, Send, CheckCircle } from 'lucide-react';

export default function CollaboratePage() {
    const params = useParams();
    const dropId = params.dropId as string;
    const { user, token } = useAuth();
    const router = useRouter();

    const [drop, setDrop] = useState<any>(null);
    const [proposal, setProposal] = useState('');
    const [timeline, setTimeline] = useState('');
    const [budgetConfirm, setBudgetConfirm] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch drop details to know if it's WORK or CAMPAIGN
    useEffect(() => {
        const fetchDrop = async () => {
            try {
                const res = await fetch(`/api/drops/${dropId}`);
                const data = await res.json();
                if (data.drop) {
                    setDrop(data.drop);
                    // Pre-fill budget if it's a WORK post
                    if (data.drop.type === 'WORK' && data.drop.campaignDetails?.budget) {
                        setBudgetConfirm(data.drop.campaignDetails.budget);
                    }
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchDrop();
    }, [dropId]);

    if (!user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <p className="font-black uppercase text-lg mb-4">Login to collaborate</p>
                    <Link href="/login" className="tactile-btn text-xs px-6 py-3">Login</Link>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('/api/collaborate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ dropId, proposal, timeline, budget: budgetConfirm }),
            });
            if (res.ok) {
                setSubmitted(true);
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to submit proposal');
            }
        } catch (e) {
            alert('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="text-center max-w-sm">
                    <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} />
                    </div>
                    <h1 className="text-2xl font-black uppercase mb-3">
                        {drop?.type === 'WORK' ? 'Hire Request Sent!' : 'Proposal Sent!'}
                    </h1>
                    <p className="text-muted-foreground mb-8">
                        {drop?.type === 'WORK'
                            ? "Your hire request has been submitted. You'll be notified when the Rave Head responds."
                            : "Your collaboration proposal has been submitted. You'll be notified when the company responds."
                        }
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Link href="/collaborations" className="tactile-btn text-xs px-6 py-3">My Collabs</Link>
                        <Link href="/" className="text-xs font-bold uppercase border border-border px-6 py-3 rounded hover:bg-muted transition-colors">Back to Feed</Link>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground font-mono uppercase tracking-widest text-xs">Synchronizing Drop...</div>
            </div>
        );
    }

    const isWork = drop?.type === 'WORK';

    return (
        <div className="min-h-screen bg-background text-foreground pb-20 md:pb-0 font-sans">
            <Sidebar />

            <main className="md:pl-20 max-w-2xl mx-auto pt-8 px-4">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6 hover:text-foreground transition-colors">
                    <ArrowLeft size={16} /> Back
                </Link>

                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                        <Handshake size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter">
                            {isWork ? 'Hire Rave Head' : 'Submit Proposal'}
                        </h1>
                        <p className="text-xs text-muted-foreground font-mono">
                            {isWork ? 'Direct hire request for' : 'Collaboration request for'} {isWork ? 'Work' : 'Drop'} #{dropId.slice(-6)}
                        </p>
                    </div>
                </div>

                {/* Requirement Summary Card */}
                <div className="bg-muted/50 border border-border rounded-xl p-5 mb-6">
                    <p className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                        {isWork ? 'Work Summary' : 'Requirement Summary'}
                    </p>
                    <p className="text-sm font-bold">{drop?.content?.title || `Item #${dropId.slice(-6)}`}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {isWork
                            ? "Provide clear contract details or offer specifics for the Rave Head."
                            : "Full details are on the drop page. Make your proposal specific and professional."
                        }
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Proposal */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                            <Send size={13} /> {isWork ? 'Hire Details' : 'Your Proposal'}
                        </label>
                        <textarea
                            value={proposal}
                            onChange={e => setProposal(e.target.value)}
                            className="w-full bg-background border border-[#E8E8E8] rounded-xl p-4 text-sm font-mono min-h-[140px] focus:border-black outline-none resize-none"
                            placeholder={isWork
                                ? "Describe the scope of work, deliverables, and any specific terms for this creative..."
                                : "Describe how you'd approach this project, your relevant experience, and what you'll deliver..."
                            }
                            required
                        />
                        <p className="text-[10px] text-muted-foreground">
                            {isWork
                                ? "Clarity leads to faster acceptance. Specify exactly what you're buying."
                                : "Be specific. Companies look for clear deliverables and proven skills."
                            }
                        </p>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                            <Clock size={13} /> Proposed Timeline
                        </label>
                        <input
                            type="text"
                            value={timeline}
                            onChange={e => setTimeline(e.target.value)}
                            className="w-full bg-background border border-[#E8E8E8] rounded-xl p-4 text-sm font-mono focus:border-black outline-none"
                            placeholder="e.g. 7 days, 2 weeks, 1 month"
                            required
                        />
                    </div>

                    {/* Budget Confirmation */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                            <DollarSign size={13} /> {isWork ? 'Proposed Fee' : 'Your Rate / Budget Confirmation'}
                        </label>
                        <input
                            type="text"
                            value={budgetConfirm}
                            onChange={e => setBudgetConfirm(e.target.value)}
                            className="w-full bg-background border border-[#E8E8E8] rounded-xl p-4 text-sm font-mono focus:border-black outline-none"
                            placeholder={isWork ? "e.g. $500 fixed" : "e.g. $500 fixed / $50/hr / As listed"}
                            required
                        />
                        <p className="text-[10px] text-muted-foreground">
                            {isWork ? "Verify or adjust the fee for this work." : "Confirm or negotiate the budget. This will be part of the agreement."}
                        </p>
                    </div>

                    {/* Terms Notice */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-xs text-yellow-800">
                        <p className="font-bold mb-1">⚠️ Escrow Protection</p>
                        <p>If accepted, payment will be held in escrow until work is delivered and confirmed. RAVE charges a 10% platform fee.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="tactile-btn w-full py-4 text-base flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {submitting ? 'Submitting...' : (
                            <><Handshake size={18} /> {isWork ? 'Send Hire Request' : 'Submit Proposal'}</>
                        )}
                    </button>
                </form>
            </main>
        </div>
    );
}

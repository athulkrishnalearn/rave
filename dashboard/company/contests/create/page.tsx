'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Trophy, ArrowRight, ArrowLeft, DollarSign, UploadCloud, Users, CheckCircle } from 'lucide-react';

function CreateContestForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const campaignId = searchParams?.get('campaignId') || '';

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [fetchingCampaigns, setFetchingCampaigns] = useState(true);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        campaignId: campaignId,
        title: '',
        description: '',
        prizePool: '',
        deadline: '',
        tags: '',
        prizes: [{ rank: 1, amount: '', title: '1st Place' }],
        maxSubmissions: 3,
        judgingType: 'community_hybrid'
    });

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const token = localStorage.getItem('rave_token');
            const res = await fetch('/api/campaign', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setCampaigns(data.campaigns);
                // If a campaignId is already in URL, use it, otherwise use the first one available
                if (!formData.campaignId && data.campaigns.length > 0) {
                    setFormData(prev => ({ ...prev, campaignId: data.campaigns[0]._id }));
                }
            }
        } catch (err: any) {
            console.error('Failed to fetch campaigns', err);
        } finally {
            setFetchingCampaigns(false);
        }
    };

    const addPrizeTier = () => {
        setFormData(prev => ({
            ...prev,
            prizes: [...prev.prizes, { rank: prev.prizes.length + 1, amount: '', title: `${prev.prizes.length + 1}${['st', 'nd', 'rd'][prev.prizes.length] || 'th'} Place` }]
        }));
    };

    const removePrizeTier = (index: number) => {
        setFormData(prev => {
            const newPrizes = [...prev.prizes];
            newPrizes.splice(index, 1);
            // Re-rank
            newPrizes.forEach((p, i) => p.rank = i + 1);
            return { ...prev, prizes: newPrizes };
        });
    };

    const updatePrize = (index: number, field: string, value: string) => {
        setFormData(prev => {
            const newPrizes: any = [...prev.prizes];
            newPrizes[index][field] = value;
            return { ...prev, prizes: newPrizes };
        });
    };

    const handleSubmitDraft = async () => {
        setError('');
        setLoading(true);
        try {
            const token = localStorage.getItem('rave_token');
            const res = await fetch('/api/contests/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    prizePool: Number(formData.prizePool),
                    prizes: formData.prizes.map(p => ({ ...p, amount: Number(p.amount) })),
                    tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                    rules: { maxSubmissionsPerUser: formData.maxSubmissions, allowedFileTypes: [] }
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            // Move to funding step
            setStep(4);
            // Save ID for escrow funding
            localStorage.setItem('pending_contest_id', data.contest._id);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFundEscrow = async () => {
        setError('');
        setLoading(true);
        try {
            const contestId = localStorage.getItem('pending_contest_id');
            const token = localStorage.getItem('rave_token');
            const res = await fetch(`/api/contests/${contestId}/fund`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            localStorage.removeItem('pending_contest_id');
            router.push('/dashboard?tab=contests');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-black uppercase flex items-center gap-3">
                        <Trophy className="text-[#00ff9d] w-8 h-8" />
                        Host a Contest
                    </h1>
                    <p className="text-zinc-400 mt-2">Crowdsource high-quality work by committing an escorted prize pool.</p>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-2 mb-10">
                    {[1, 2, 3, 4].map(s => (
                        <div key={s} className={`h-2 rounded-full flex-1 ${step >= s ? 'bg-[#00ff9d]' : 'bg-zinc-800'}`} />
                    ))}
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">

                    {/* STEP 1: BASIC INFO */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <h2 className="text-xl font-bold">1. Contest Details</h2>
                            <div>
                                <label className="block text-sm text-zinc-400 mb-2">Select Campaign</label>
                                {fetchingCampaigns ? (
                                    <div className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 animate-pulse text-zinc-500">
                                        Loading campaigns...
                                    </div>
                                ) : campaigns.length > 0 ? (
                                    <select
                                        value={formData.campaignId}
                                        onChange={e => setFormData({ ...formData, campaignId: e.target.value })}
                                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-[#00ff9d] text-white appearance-none"
                                    >
                                        {campaigns.map(c => (
                                            <option key={c._id} value={c._id}>{c.title}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="w-full bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3 text-red-500 text-sm">
                                        No active campaigns found. You must <Link href="/dashboard?tab=campaigns" className="underline font-bold">create a campaign</Link> first.
                                    </div>
                                )}
                                <p className="text-xs text-zinc-600 mt-2">Contests must be linked to an active campaign.</p>
                            </div>
                            <div>
                                <label className="block text-sm text-zinc-400 mb-2">Contest Title</label>
                                <input
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Cyberpunk Logo Design Challenge"
                                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-[#00ff9d]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-zinc-400 mb-2">Description & Prompt</label>
                                <textarea
                                    rows={5}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe exactly what you want creators to build..."
                                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-[#00ff9d] resize-none"
                                />
                            </div>
                            <button
                                onClick={() => setStep(2)}
                                disabled={!formData.title || !formData.description || !formData.campaignId || campaigns.length === 0}
                                className="w-full bg-[#00ff9d] hover:bg-[#00cc7d] text-black font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50"
                            >
                                Next Step <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {/* STEP 2: PRIZE POOL */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <button onClick={() => setStep(1)} className="text-zinc-500 hover:text-white flex items-center gap-2 mb-6">
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-[#00ff9d]" />
                                2. Prize Escrow
                            </h2>
                            <div>
                                <label className="block text-sm text-zinc-400 mb-2">Total Prize Pool Amount (USD)</label>
                                <input
                                    type="number"
                                    value={formData.prizePool}
                                    onChange={e => setFormData({ ...formData, prizePool: e.target.value })}
                                    placeholder="e.g., 2000"
                                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-[#00ff9d]"
                                />
                            </div>

                            <div className="pt-6 border-t border-zinc-800 space-y-4">
                                <h3 className="text-sm text-zinc-400">Prize Distribution Strategy</h3>
                                {formData.prizes.map((prize, idx) => (
                                    <div key={idx} className="flex items-center gap-4 bg-black p-4 rounded-xl border border-zinc-800">
                                        <div className="flex-1">
                                            <input
                                                value={prize.title}
                                                onChange={e => updatePrize(idx, 'title', e.target.value)}
                                                className="w-full bg-transparent outline-none font-bold"
                                            />
                                        </div>
                                        <div className="w-1/3 flex items-center gap-2 border-l border-zinc-800 pl-4">
                                            <span className="text-zinc-500">$</span>
                                            <input
                                                type="number"
                                                value={prize.amount}
                                                onChange={e => updatePrize(idx, 'amount', e.target.value)}
                                                placeholder="Amount"
                                                className="w-full bg-transparent outline-none"
                                            />
                                        </div>
                                        {idx > 0 && (
                                            <button onClick={() => removePrizeTier(idx)} className="text-red-500 hover:text-red-400 ml-2">×</button>
                                        )}
                                    </div>
                                ))}
                                <button onClick={addPrizeTier} className="text-[#00ff9d] text-sm hover:underline">+ Add Prize Tier</button>
                            </div>

                            <button
                                onClick={() => setStep(3)}
                                disabled={!formData.prizePool || formData.prizes.some(p => !p.amount)}
                                className="w-full bg-[#00ff9d] hover:bg-[#00cc7d] text-black font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50 mt-8"
                            >
                                Next Step <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {/* STEP 3: RULES & DEADLINE */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <button onClick={() => setStep(2)} className="text-zinc-500 hover:text-white flex items-center gap-2 mb-6">
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Users className="w-5 h-5 text-[#00ff9d]" />
                                3. Rules & Timeline
                            </h2>
                            <div>
                                <label className="block text-sm text-zinc-400 mb-2">Submission Deadline</label>
                                <input
                                    type="datetime-local"
                                    value={formData.deadline}
                                    onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-[#00ff9d] text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-zinc-400 mb-2">Max Submissions per Creator</label>
                                <input
                                    type="number"
                                    value={formData.maxSubmissions}
                                    onChange={e => setFormData({ ...formData, maxSubmissions: Number(e.target.value) })}
                                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-[#00ff9d]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-zinc-400 mb-2">Hashtags / Skills (Comma separated)</label>
                                <input
                                    value={formData.tags}
                                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                    placeholder="3D, blender, animation"
                                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-[#00ff9d]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-zinc-400 mb-2">Judging System</label>
                                <select
                                    value={formData.judgingType}
                                    onChange={e => setFormData({ ...formData, judgingType: e.target.value })}
                                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-[#00ff9d] text-white"
                                >
                                    <option value="community_hybrid">Hybrid (Community Feed Votes + VIP Judge Score)</option>
                                    <option value="company_only">Company Decision Only</option>
                                </select>
                            </div>

                            <button
                                onClick={handleSubmitDraft}
                                disabled={loading || !formData.deadline}
                                className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50 mt-8"
                            >
                                {loading ? 'Saving Draft...' : 'Review & Create Draft Contest'}
                            </button>
                        </div>
                    )}

                    {/* STEP 4: ESCROW FUNDING (FINAL) */}
                    {step === 4 && (
                        <div className="space-y-6 text-center animate-in zoom-in-95">
                            <div className="w-20 h-20 bg-[#00ff9d]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <DollarSign className="w-10 h-10 text-[#00ff9d]" />
                            </div>
                            <h2 className="text-3xl font-black uppercase">Fund Escrow</h2>
                            <p className="text-zinc-400 max-w-sm mx-auto">
                                Your contest draft is saved. To publish this directly to the Explore tab and start accepting submissions, you must secure the prize pool in Escrow.
                            </p>

                            <div className="bg-black border border-[#00ff9d]/30 rounded-2xl p-6 inline-block w-full max-w-xs mt-6">
                                <p className="text-sm text-zinc-500 uppercase tracking-widest font-bold mb-2">Total Due</p>
                                <p className="text-4xl font-black text-[#00ff9d]">${formData.prizePool}</p>
                            </div>

                            <div className="pt-8 max-w-sm mx-auto">
                                <button
                                    onClick={handleFundEscrow}
                                    disabled={loading}
                                    className="w-full bg-[#00ff9d] hover:bg-[#00cc7d] text-black font-black uppercase tracking-wide py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-[0_0_20px_rgba(0,255,157,0.3)] hover:shadow-[0_0_30px_rgba(0,255,157,0.5)]"
                                >
                                    {loading ? 'Processing...' : 'Simulate Payment & Publish'} <CheckCircle className="w-5 h-5" />
                                </button>
                                <p className="text-xs text-zinc-600 mt-4">This protects creators and guarantees they will be paid if they win. Escrow is released by you upon judging.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function CreateContestPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black text-white p-8 animate-pulse text-center">Loading Contest Creator...</div>}>
            <CreateContestForm />
        </Suspense>
    );
}

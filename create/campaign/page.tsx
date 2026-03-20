"use client";

import { ArrowLeft, CheckCircle, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function CreateCampaignPage() {
    const [submitted, setSubmitted] = useState(false);
    const { user, token } = useAuth(); // Assuming useAuth exposes user
    const [loading, setLoading] = useState(false);

    const [step, setStep] = useState(1);
    
    // Form State
    const [title, setTitle] = useState('');
    const [roleCat, setRoleCat] = useState('3D Design');
    const [desc, setDesc] = useState('');
    const [pay, setPay] = useState('');
    const [deadline, setDeadline] = useState('');
    const [skills, setSkills] = useState('');
    const [minOgScore, setMinOgScore] = useState('0');

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#F7F7F8] flex flex-col items-center justify-center p-4 text-center font-sans tracking-tight">
                <div className="w-24 h-24 bg-[#00ff9d] text-zinc-900 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-[#00ff9d]/20">
                    <CheckCircle size={48} />
                </div>
                <h1 className="text-4xl md:text-5xl font-black uppercase mb-4 tracking-tighter italic">Signal Broadcasted</h1>
                <p className="text-zinc-500 font-medium mb-10 max-w-sm leading-relaxed">Your campaign brief is now live on the network. Top creators will be notified directly.</p>
                <div className="flex gap-4">
                    <Link href="/dashboard/company" className="px-8 py-4 bg-zinc-900 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all">
                        View Dashboard
                    </Link>
                    <Link href="/explore" className="px-8 py-4 bg-white border border-[#E8E8E8] text-zinc-900 rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-all">
                        Scout Talent
                    </Link>
                </div>
            </div>
        );
    }

    if (user && (user as any).verificationStatus === 'pending') {
        return (
            <div className="min-h-screen bg-[#F7F7F8] flex flex-col items-center justify-center p-4 text-center font-sans">
                <div className="w-20 h-20 bg-amber-400 text-black rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl shadow-amber-400/20">
                    <CheckCircle size={32} />
                </div>
                <h1 className="text-3xl font-black uppercase mb-2 tracking-tighter">Verification Pending</h1>
                <p className="text-zinc-500 font-medium mb-8 max-w-sm">Brand verification is required before initiating network signals.</p>
                <Link href="/dashboard/company" className="px-8 py-4 bg-zinc-900 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest">Return Home</Link>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formattedDesc = `${desc}\n\nRequired Skills: ${skills}\nMinimum OG Score: ${minOgScore}\nDeadline: ${deadline}`;
            
            const res = await fetch('/api/campaign', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    description: formattedDesc,
                    payAmount: pay,
                    requirements: [roleCat],
                    type: 'CREATOR'
                })
            });

            if (res.ok) {
                setSubmitted(true);
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to create campaign');
            }
        } catch (error) {
            console.error(error);
            alert('Error creating campaign');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F7F7F8] pb-24 md:pb-0 pt-10 px-6 font-sans">
            <div className="max-w-3xl mx-auto">
                
                {/* Header Sequence */}
                <div className="mb-10 flex items-center justify-between">
                    <Link href="/dashboard/company" className="w-12 h-12 bg-white rounded-2xl border border-[#E8E8E8] flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-all shadow-sm">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex gap-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`h-2 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-zinc-900' : 'w-2 bg-zinc-200'}`} />
                        ))}
                    </div>
                </div>

                <div className="mb-10">
                    <h1 className="text-5xl md:text-7xl font-black uppercase text-zinc-900 tracking-tighter leading-none mb-3 italic">
                        Deploy <span className="text-zinc-300">Brief</span>
                    </h1>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-400">Step {step} of 3 — Initiate Network Signal</p>
                </div>

                <div className="bg-white border border-[#E8E8E8] rounded-[3rem] p-8 md:p-12 shadow-sm">
                    <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); setStep(step + 1); }}>
                        
                        {/* STEP 1: IDENTITY */}
                        {step === 1 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest block">Signal Title</label>
                                    <input
                                        type="text"
                                        value={title} onChange={e => setTitle(e.target.value)}
                                        className="w-full bg-[#F7F7F8] border-none rounded-2xl p-5 text-xl font-bold text-zinc-900 placeholder:text-zinc-300 outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all"
                                        placeholder="e.g., Summer Anthem Visualizer"
                                        required autoFocus
                                    />
                                </div>
                                
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest block">Primary Category</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {['3D Design', 'VFX / Motion', 'Graphic Design', 'Video Editing'].map(cat => (
                                            <button 
                                                type="button" 
                                                key={cat} 
                                                onClick={() => setRoleCat(cat)}
                                                className={`p-4 rounded-2xl border text-[12px] font-black uppercase tracking-widest text-center transition-all ${roleCat === cat ? 'bg-zinc-900 text-white border-zinc-900 shadow-xl shadow-zinc-900/20' : 'bg-white text-zinc-400 border-[#E8E8E8] hover:border-zinc-300'}`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: REQUIREMENTS */}
                        {step === 2 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest block">Creative Brief</label>
                                    <textarea
                                        value={desc} onChange={e => setDesc(e.target.value)}
                                        className="w-full bg-[#F7F7F8] border-none rounded-3xl p-6 min-h-[200px] text-[15px] leading-relaxed font-medium text-zinc-900 placeholder:text-zinc-300 resize-none outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all"
                                        placeholder="Describe the objective, aesthetic direction, and strict deliverables..."
                                        required autoFocus
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest block">Required Software / Skills</label>
                                        <input
                                            type="text"
                                            value={skills} onChange={e => setSkills(e.target.value)}
                                            className="w-full bg-[#F7F7F8] border-none rounded-2xl p-4 text-[14px] font-bold text-zinc-900 outline-none focus:ring-4 focus:ring-zinc-900/5"
                                            placeholder="Blender, Unreal Engine, Nuke"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">Min. OG Score Required</label>
                                        <input
                                            type="number"
                                            value={minOgScore} onChange={e => setMinOgScore(e.target.value)}
                                            className="w-full bg-amber-50 border-none rounded-2xl p-4 text-[14px] font-black text-amber-900 outline-none focus:ring-4 focus:ring-amber-500/10"
                                            placeholder="0"
                                            min="0" max="1000"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: FINANCIALS */}
                        {step === 3 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="bg-zinc-50 border border-[#E8E8E8] rounded-[2rem] p-8 space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest block">Indicative Budget (USD)</label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-6 text-2xl font-black text-zinc-300">$</span>
                                            <input
                                                type="text"
                                                value={pay} onChange={e => setPay(e.target.value)}
                                                className="w-full bg-white border border-[#E8E8E8] rounded-2xl py-6 pl-14 pr-6 text-4xl font-black tracking-tighter text-green-600 outline-none focus:ring-4 focus:ring-green-500/10 transition-all shadow-sm"
                                                placeholder="5,000"
                                                required autoFocus
                                            />
                                        </div>
                                        <p className="text-[10px] uppercase font-bold text-zinc-400 pl-2">Subject to standard RAVE network tax (+18% GST)</p>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest block">Hard Deadline</label>
                                        <input
                                            type="date"
                                            value={deadline} onChange={e => setDeadline(e.target.value)}
                                            className="w-full bg-white border border-[#E8E8E8] rounded-2xl p-5 text-xl font-bold text-zinc-900 outline-none focus:ring-4 focus:ring-zinc-900/5 shadow-sm"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-12 flex justify-between items-center border-t border-[#E8E8E8] pt-8">
                            {step > 1 ? (
                                <button type="button" onClick={() => setStep(step - 1)} className="px-8 py-4 text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">
                                    Back
                                </button>
                            ) : <div></div>}

                            <button type="submit" disabled={loading} className="px-10 py-4 bg-zinc-900 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-[#00ff9d] hover:text-black hover:shadow-2xl hover:shadow-[#00ff9d]/20 transition-all flex items-center gap-2">
                                {loading ? 'Processing...' : step === 3 ? 'Deploy Signal' : 'Next Step'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

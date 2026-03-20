"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import {
    ArrowLeft, FileText, DollarSign, Clock, Shield,
    CheckCircle, AlertCircle, Calendar, Briefcase
} from "lucide-react";

export default function ProjectAgreementPage() {
    const params = useParams();
    const projectId = params.projectId as string;
    const { user, token } = useAuth();
    const router = useRouter();

    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [agreed, setAgreed] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        async function fetchProject() {
            try {
                const res = await fetch(`/api/project/${projectId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.project) setProject(data.project);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        if (token) fetchProject();
    }, [projectId, token]);

    const handleConfirm = async () => {
        if (!agreed) return;
        setSubmitting(true);
        try {
            const res = await fetch(`/api/agreement/${projectId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ status: "confirmed" }),
            });
            if (res.ok) {
                router.push(`/escrow/${projectId}`);
            }
        } catch (e) {
            console.error(e);
            alert("Failed to confirm agreement.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F7F7F8]">
            <p className="text-zinc-400 font-mono text-xs animate-pulse uppercase tracking-widest">Generating Agreement...</p>
        </div>
    );

    if (!project) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F7F8]">
            <p className="text-zinc-600 font-black mb-4 uppercase">Project not found</p>
            <button onClick={() => router.back()} className="text-xs font-bold underline uppercase">Go Back</button>
        </div>
    );

    const platformFee = Math.round(project.agreedAmount * 0.1);
    const totalToFund = project.agreedAmount + platformFee;

    return (
        <div className="min-h-screen pb-20 md:pb-0 font-sans bg-[#F7F7F8]">
            <Sidebar />

            <div className="md:pl-16">
                <main className="max-w-3xl mx-auto px-4 py-8">

                    <div className="mb-8">
                        <Link href="/collaborations" className="inline-flex items-center gap-2 text-[12px] font-black uppercase text-zinc-400 hover:text-zinc-900 transition-colors mb-4">
                            <ArrowLeft size={16} /> Back
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-black text-zinc-900 uppercase tracking-tighter leading-tight">
                            Smart Agreement
                        </h1>
                        <p className="text-[13px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
                            Project ID: #RAVE-{projectId.slice(-6).toUpperCase()}
                        </p>
                    </div>

                    {/* ── AGREEMENT DOCUMENT ──── */}
                    <div className="bg-white border border-[#E8E8E8] rounded-3xl overflow-hidden shadow-sm">

                        {/* Parties Header */}
                        <div className="p-6 md:p-8 bg-zinc-900 text-white">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div>
                                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Service Vendor</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-white italic">
                                            {project.vendor?.name?.[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black uppercase tracking-tight">{project.vendor?.brandName || project.vendor?.name}</p>
                                            <p className="text-[11px] text-zinc-400">Official Brand Representative</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden md:block w-px h-12 bg-white/10" />
                                <div>
                                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Rave Head</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-white italic">
                                            {project.creator?.name?.[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black uppercase tracking-tight">{project.creator?.name}</p>
                                            <p className="text-[11px] text-zinc-400">Verified Independent Creator</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Body */}
                        <div className="p-6 md:p-8 space-y-8">

                            {/* Clause 1: Subject */}
                            <section>
                                <h3 className="text-[11px] font-black uppercase text-zinc-400 tracking-widest mb-3 flex items-center gap-2">
                                    <FileText size={13} /> 01. Subject of Engagement
                                </h3>
                                <p className="text-[14px] text-zinc-700 leading-relaxed font-medium">
                                    The parties agree to collaborate on the campaign titled <span className="text-zinc-900 font-black underline italic">"{project.campaign?.title}"</span>.
                                    The Rave Head agrees to deliver the creative assets as per the campaign brief provided by the Vendor.
                                </p>
                            </section>

                            {/* Clause 2: Financials */}
                            <section className="bg-[#F7F7F8] p-6 rounded-2xl border border-[#E8E8E8]">
                                <h3 className="text-[11px] font-black uppercase text-zinc-400 tracking-widest mb-4 flex items-center gap-2">
                                    <DollarSign size={13} /> 02. Smart Escrow Terms
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-[13px]">
                                        <span className="text-zinc-500 font-bold uppercase tracking-wider">Project Agreed Amount</span>
                                        <span className="font-black text-zinc-900">${project.agreedAmount}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[13px]">
                                        <span className="text-zinc-500 font-bold uppercase tracking-wider">RAVE Platform Fee (10%)</span>
                                        <span className="font-black text-zinc-900">${platformFee}</span>
                                    </div>
                                    <div className="pt-3 border-t border-zinc-200 flex justify-between items-center">
                                        <span className="text-[14px] font-black uppercase text-zinc-900">Total Settlement Value</span>
                                        <span className="text-2xl font-black text-zinc-900 italic tracking-tighter">${totalToFund}</span>
                                    </div>
                                </div>
                                <p className="mt-4 text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
                                    * Funds are held by RAVE and only released upon delivery verification or manual release by the vendor.
                                </p>
                            </section>

                            {/* Clause 3: Timeline & Support */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <section>
                                    <h3 className="text-[11px] font-black uppercase text-zinc-400 tracking-widest mb-3 flex items-center gap-2">
                                        <Calendar size={13} /> 03. Timeline
                                    </h3>
                                    <div className="p-4 border border-[#E8E8E8] rounded-xl flex items-center gap-3">
                                        <Clock className="text-zinc-300" size={18} />
                                        <div>
                                            <p className="text-[13px] font-black text-zinc-900 uppercase">Standard 7-Day Window</p>
                                            <p className="text-[11px] text-zinc-400">From the moment funds hit escrow</p>
                                        </div>
                                    </div>
                                </section>
                                <section>
                                    <h3 className="text-[11px] font-black uppercase text-zinc-400 tracking-widest mb-3 flex items-center gap-2">
                                        <Shield size={13} /> 04. Rights
                                    </h3>
                                    <div className="p-4 border border-[#E8E8E8] rounded-xl flex items-center gap-3">
                                        <Briefcase className="text-zinc-300" size={18} />
                                        <div>
                                            <p className="text-[13px] font-black text-zinc-900 uppercase">Full Usage Rights</p>
                                            <p className="text-[11px] text-zinc-400">Transfer upon final payment release</p>
                                        </div>
                                    </div>
                                </section>
                            </div>

                        </div>
                    </div>

                    {/* ── ACCEPTANCE ──── */}
                    <div className="mt-8 space-y-6">
                        <label className="flex items-start gap-4 p-5 bg-white border border-[#E8E8E8] rounded-2xl cursor-pointer hover:border-zinc-300 transition-all select-none focus-within:ring-2 focus-within:ring-zinc-900/5">
                            <div className="pt-0.5">
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${agreed ? "bg-zinc-900 border-zinc-900" : "bg-white border-zinc-200"}`}>
                                    {agreed && <CheckCircle size={14} className="text-white fill-zinc-900" />}
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={agreed}
                                    onChange={e => setAgreed(e.target.checked)}
                                />
                            </div>
                            <span className="text-[12px] md:text-[13px] text-zinc-600 font-bold leading-relaxed">
                                I confirm that I have reviewed the agreement and the campaign brief. I agree to the terms of service and the use of the RAVE Escrow system for this transaction.
                            </span>
                        </label>

                        <div className="flex flex-col md:flex-row gap-3">
                            <button
                                onClick={handleConfirm}
                                disabled={!agreed || submitting}
                                className="flex-1 py-4 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
                            >
                                {submitting ? "Signing..." : "Confirm & Sign Agreement"}
                            </button>
                            <Link href="/collaborations" className="px-8 py-4 bg-white border border-[#E8E8E8] text-zinc-400 rounded-2xl font-black uppercase tracking-widest hover:text-zinc-900 hover:border-zinc-900 text-center transition-all">
                                Decline
                            </Link>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                            <Shield size={12} /> Encrypted Smart Contract Verification Active
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, ShieldCheck, Upload, Send, Loader2 } from "lucide-react";

function DisputeForm() {
    const { user, token } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const projectId = searchParams.get("projectId");

    const [reason, setReason] = useState("");
    const [evidence, setEvidence] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            setErrorMsg("You must be logged in to submit a dispute.");
            return;
        }
        if (!reason.trim()) {
            setErrorMsg("Please describe the reason for your dispute.");
            return;
        }

        setErrorMsg("");
        setLoading(true);
        try {
            const payload: any = {
                reason,
                evidence: evidence ? evidence.split(",").map(s => s.trim()) : [],
            };
            // Include projectId only if provided via URL
            if (projectId) payload.projectId = projectId;
            // raisedBy is derived from the JWT on the server, but we send userId as fallback
            if (user) payload.raisedBy = (user as any).id;

            const res = await fetch("/api/dispute", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setSubmitted(true);
            } else {
                const data = await res.json();
                setErrorMsg(data.error || "Failed to submit dispute. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setErrorMsg("A network error occurred. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="max-w-xl mx-auto mt-20 p-12 bg-white rounded-3xl border border-[#E8E8E8] text-center shadow-sm">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck size={40} />
                </div>
                <h1 className="text-2xl font-black uppercase tracking-tighter mb-4 text-zinc-900">Dispute Claim Filed</h1>
                <p className="text-zinc-500 text-[14px] font-medium leading-relaxed mb-10">
                    Our mediation team has been notified. We will review your claim and the project history within 24-48 business hours.
                </p>
                <button
                    onClick={() => router.push("/collaborations")}
                    className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/10"
                >
                    Return to Projects
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto py-12">
            <Link href="/collaborations" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-600 mb-8 transition-colors text-sm font-bold uppercase tracking-wider">
                <ArrowLeft size={16} /> Cancel Dispute
            </Link>

            <div className="bg-white rounded-3xl border border-[#E8E8E8] overflow-hidden shadow-sm">
                <div className="p-10 bg-zinc-900 text-white">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                        <AlertTriangle size={24} className="text-amber-400" />
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Mediation Support</h1>
                    <p className="text-zinc-400 text-[13px] font-bold uppercase tracking-widest">Raise a formal dispute claim</p>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                    <div className="space-y-3">
                        <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400 ml-1">Why are you raising this dispute?</label>
                        <textarea
                            required
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Please describe the issue in detail..."
                            className="min-h-[160px] focus:border-zinc-900"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400 ml-1">Evidence Links (Comma separated)</label>
                        <input
                            type="text"
                            value={evidence}
                            onChange={(e) => setEvidence(e.target.value)}
                            placeholder="e.g. drive links, loom videos, screenshots"
                            className="focus:border-zinc-900"
                        />
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest italic ml-1">
                            Include links to deliverables, chat logs, or any other relevant proof.
                        </p>
                    </div>

                    <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex gap-4">
                        <ShieldCheck size={20} className="text-amber-600 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-[12px] font-black text-amber-900 uppercase tracking-tighter">Mediation Protocol</p>
                            <p className="text-[11px] text-amber-800/70 font-bold leading-relaxed">
                                Once submitted, payment remains held in escrow. Our team will manually review and either release to creator or refund the company.
                            </p>
                        </div>
                    </div>

                    {errorMsg && (
                        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-[12px] text-red-700 font-bold">
                            {errorMsg}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !reason.trim()}
                        className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/10 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        {loading ? "Processing..." : "Submit Claim"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function CreateDisputePage() {
    return (
        <div className="min-h-screen bg-[#F7F7F8]">
            <Sidebar />
            <div className="md:pl-16 px-4">
                <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                    <DisputeForm />
                </Suspense>
            </div>
        </div>
    );
}

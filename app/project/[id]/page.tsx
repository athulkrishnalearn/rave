"use client";

import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle, DollarSign, Clock, Upload, ShieldCheck, MessageSquare, RefreshCw, AlertTriangle, Paperclip, Send, Link2 } from 'lucide-react';
import Link from 'next/link';

const STATUS_STEPS = ['ACTIVE', 'SUBMITTED', 'REVISION', 'COMPLETED'];

export default function ProjectPage() {
    const { token, user } = useAuth();
    const params = useParams();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Delivery form
    const [deliveryUrl, setDeliveryUrl] = useState('');
    const [deliveryNote, setDeliveryNote] = useState('');
    const [delivering, setDelivering] = useState(false);
    const [showDelivery, setShowDelivery] = useState(false);

    // Revision note
    const [revisionNote, setRevisionNote] = useState('');
    const [submittingRevision, setSubmittingRevision] = useState(false);

    // Action states
    const [acting, setActing] = useState(false);

    useEffect(() => {
        if (!token) return;
        async function fetchProject() {
            try {
                const res = await fetch(`/api/project/${params.id}`, {
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
        fetchProject();
    }, [token, params.id]);

    const handleDeliver = async () => {
        if (!deliveryUrl.trim()) { alert('Please add a delivery URL.'); return; }
        setDelivering(true);
        try {
            const res = await fetch(`/api/project/${params.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ action: 'SUBMIT', payload: { url: deliveryUrl, note: deliveryNote } })
            });
            if (res.ok) window.location.reload();
        } catch (e) { console.error(e); }
        setDelivering(false);
    };

    const handleRelease = async () => {
        if (!confirm('Release payment to the creator?')) return;
        setActing(true);
        try {
            const res = await fetch(`/api/project/${params.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ action: 'PAY', payload: {} })
            });
            if (res.ok) window.location.reload();
        } catch (e) { console.error(e); }
        setActing(false);
    };

    const handleRevision = async () => {
        if (!revisionNote.trim()) { alert('Please describe the revision needed.'); return; }
        setSubmittingRevision(true);
        try {
            const res = await fetch(`/api/project/${params.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ action: 'REVISION', payload: { note: revisionNote } })
            });
            if (res.ok) window.location.reload();
        } catch (e) { console.error(e); }
        setSubmittingRevision(false);
    };

    const handleFundEscrow = async () => {
        setActing(true);
        try {
            const res = await fetch(`/api/project/${params.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ action: 'FUND_ESCROW', payload: {} })
            });
            if (res.ok) window.location.reload();
        } catch (e) { console.error(e); }
        setActing(false);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F7F7F8' }}>
            <div className="animate-pulse text-zinc-400 font-mono text-sm">Loading workspace…</div>
        </div>
    );
    if (!project) return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F7F7F8' }}>
            <div className="text-center">
                <p className="font-bold text-zinc-700 mb-2">Project not found</p>
                <Link href="/collaborations" className="text-[13px] text-zinc-400 underline">← My Collaborations</Link>
            </div>
        </div>
    );

    const isVendor = (user as any)?.id === project.vendor?._id || (user as any)?.id === project.vendor;
    const isCreator = (user as any)?.id === project.creator?._id || (user as any)?.id === project.creator;
    const currentStepIdx = STATUS_STEPS.indexOf(project.status);

    return (
        <div className="min-h-screen pb-20 md:pb-0 font-sans" style={{ backgroundColor: '#F7F7F8' }}>
            <Sidebar />

            <main className="md:pl-16 max-w-4xl mx-auto pt-6 px-4">
                {/* Header */}
                <div className="bg-white rounded-2xl border border-[#E8E8E8] p-6 mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${project.status === 'COMPLETED' ? 'bg-green-50 text-green-700' :
                                    project.status === 'SUBMITTED' ? 'bg-blue-50 text-blue-700' :
                                        project.status === 'REVISION' ? 'bg-amber-50 text-amber-700' :
                                            'bg-zinc-100 text-zinc-600'
                                    }`}>{project.status}</span>
                                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${project.paymentStatus === 'RELEASED' ? 'bg-green-50 text-green-700' :
                                    project.paymentStatus === 'HELD' ? 'bg-blue-50 text-blue-700' :
                                        'bg-zinc-100 text-zinc-600'
                                    }`}>
                                    {project.paymentStatus === 'RELEASED' ? 'PAID OUT' : `$${project.agreedAmount} in escrow`}
                                </span>
                            </div>
                            <h1 className="text-xl font-black text-zinc-900 leading-tight">{project.campaign?.title || 'Project Workspace'}</h1>
                            <p className="text-[12px] text-zinc-400 mt-1 font-mono break-all">
                                {project.vendor?.name} → {project.creator?.name}
                            </p>
                        </div>
                        <Link href={`/inbox?u=${isVendor ? project.creator?._id || project.creator : project.vendor?._id || project.vendor}`} className="flex w-full sm:w-auto items-center justify-center gap-1.5 px-3 py-2 border border-[#E8E8E8] rounded-xl text-[12px] font-bold text-zinc-600 hover:bg-zinc-50 transition-colors">
                            <MessageSquare size={14} /> Chat
                        </Link>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex gap-1 mt-5">
                        {STATUS_STEPS.map((step, i) => (
                            <div key={step} className="flex-1">
                                <div className={`h-1 rounded-full mb-1.5 transition-colors ${i <= currentStepIdx ? 'bg-zinc-900' : 'bg-zinc-200'}`} />
                                <p className={`text-[10px] font-bold uppercase text-center ${i <= currentStepIdx ? 'text-zinc-700' : 'text-zinc-300'}`}>{step}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {/* LEFT: Brief */}
                    <div className="bg-white rounded-2xl border border-[#E8E8E8] p-5">
                        <h3 className="text-[12px] font-black text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <ShieldCheck size={14} /> Project Brief
                        </h3>
                        <p className="text-[13px] text-zinc-600 leading-relaxed">
                            {project.campaign?.description || 'Complete the deliverables as discussed and agreed upon.'}
                        </p>
                        <div className="mt-4 pt-4 border-t border-[#E8E8E8]">
                            <p className="text-[11px] text-zinc-400 font-mono">Transaction ID: #RAVE-{String(project._id).slice(-8).toUpperCase()}</p>
                        </div>
                    </div>

                    {/* RIGHT: Activity */}
                    <div className="bg-white rounded-2xl border border-[#E8E8E8] p-5">
                        <h3 className="text-[12px] font-black text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Clock size={14} /> Activity Log
                        </h3>
                        <div className="space-y-3">
                            {project.submissionUrl ? (
                                <div className="bg-green-50 border border-green-100 rounded-xl p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <CheckCircle size={14} className="text-green-600" />
                                        <p className="text-[12px] font-bold text-green-800">Work Submitted</p>
                                    </div>
                                    <a href={project.submissionUrl} target="_blank" className="text-[12px] text-blue-600 underline break-all">{project.submissionUrl}</a>
                                    {project.submissionNote && <p className="text-[12px] text-zinc-500 mt-1">"{project.submissionNote}"</p>}
                                </div>
                            ) : (
                                <p className="text-[13px] text-zinc-400">No submissions yet.</p>
                            )}
                            {project.paymentStatus === 'RELEASED' && (
                                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                                    <div className="flex items-center gap-2">
                                        <DollarSign size={14} className="text-amber-600" />
                                        <p className="text-[12px] font-bold text-amber-800">Payment Released — ${project.agreedAmount}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ─── VENDOR: Fund Escrow ──── */}
                {isVendor && project.status === 'AWAITING_FUNDS' && (
                    <div className="bg-white rounded-2xl border border-blue-200 p-5 mt-4 bg-blue-50/30">
                        <h3 className="text-[12px] font-black text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <DollarSign size={14} /> Awaiting Escrow Funding
                        </h3>
                        <p className="text-[13px] text-zinc-600 mb-4">
                            To begin the collaboration, please fund the project amount of <strong>${project.agreedAmount}</strong> into Rave's secure escrow. The creator will be notified to start working.
                        </p>
                        <button onClick={handleFundEscrow} disabled={acting}
                            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl text-[12px] font-black uppercase tracking-wider hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <DollarSign size={15} /> {acting ? 'Processing…' : 'Fund Escrow (Simulated)'}
                        </button>
                    </div>
                )}

                {/* ─── CREATOR: Delivery Form ──── */}
                {isCreator && project.status === 'ACTIVE' && (
                    <div className="bg-white rounded-2xl border border-[#E8E8E8] p-5 mt-4">
                        <h3 className="text-[12px] font-black text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Upload size={14} /> Submit Your Work
                        </h3>
                        {!showDelivery ? (
                            <button onClick={() => setShowDelivery(true)}
                                className="w-full py-4 border-2 border-dashed border-zinc-200 rounded-xl text-[13px] font-bold text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <Upload size={15} /> Mark as Delivered
                            </button>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Link2 size={12} /> Delivery Link *</label>
                                    <input type="url" value={deliveryUrl} onChange={e => setDeliveryUrl(e.target.value)}
                                        placeholder="https://drive.google.com/…" className="w-full py-2.5 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all outline-none" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><MessageSquare size={12} /> Delivery Note</label>
                                    <textarea value={deliveryNote} onChange={e => setDeliveryNote(e.target.value)}
                                        placeholder="Add any context for the client…"
                                        rows={3} className="w-full resize-none py-2.5 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all outline-none" />
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-zinc-100">
                                    <button onClick={handleDeliver} disabled={delivering || !deliveryUrl}
                                        className="w-full sm:flex-1 py-3 bg-zinc-900 text-white rounded-xl text-[12px] font-black uppercase tracking-wider hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <Send size={14} /> {delivering ? 'Submitting…' : 'Submit Delivery'}
                                    </button>
                                    <button onClick={() => setShowDelivery(false)} className="w-full sm:w-auto px-6 py-3 border border-zinc-200 bg-white rounded-xl text-[12px] font-bold text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 transition-colors">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ─── VENDOR: Review Submission ──── */}
                {isVendor && project.status === 'SUBMITTED' && project.paymentStatus !== 'RELEASED' && (
                    <div className="bg-white rounded-2xl border border-[#E8E8E8] p-5 mt-4">
                        <h3 className="text-[12px] font-black text-zinc-500 uppercase tracking-wider mb-4">Review Submission</h3>
                        <p className="text-[13px] text-zinc-600 mb-4">The creator has submitted their work. Review the deliverables and either release payment or request a revision.</p>
                        <div className="flex gap-3">
                            <button onClick={handleRelease} disabled={acting}
                                className="flex-1 py-3 bg-green-600 text-white rounded-xl text-[12px] font-black uppercase tracking-wider hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <DollarSign size={14} /> {acting ? 'Processing…' : 'Accept & Release Payment'}
                            </button>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#E8E8E8]">
                            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><RefreshCw size={11} /> Request Revision</p>
                            <textarea value={revisionNote} onChange={e => setRevisionNote(e.target.value)}
                                placeholder="Please revisit the colour grading in the second scene…"
                                rows={2} className="w-full resize-none mb-2" />
                            <button onClick={handleRevision} disabled={submittingRevision}
                                className="px-4 py-2 border border-amber-300 text-amber-700 rounded-xl text-[12px] font-bold hover:bg-amber-50 transition-colors disabled:opacity-40"
                            >
                                {submittingRevision ? 'Sending…' : 'Send Revision Request'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Dispute button */}
                {(isCreator || isVendor) && project.status !== 'COMPLETED' && (
                    <div className="mt-4 text-center">
                        <Link href={`/dispute/create?projectId=${project._id}`}
                            className="inline-flex items-center gap-1.5 text-[12px] text-zinc-400 hover:text-red-500 transition-colors"
                        >
                            <AlertTriangle size={12} /> Raise a dispute
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}

"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { ArrowLeft, Check, X, Users, Eye, MessageSquare, FileText } from 'lucide-react';

interface Applicant {
    _id: string;
    applicant: { _id: string; name: string; image?: string; skills?: string[]; role?: string };
    proposal: string;
    timeline: string;
    budget: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
}

// Mock applicants for prototype
const MOCK_APPLICANTS: Applicant[] = [
    {
        _id: 'a1',
        applicant: { _id: 'u1', name: 'Alex Raven', skills: ['Video Editing', 'After Effects', 'DaVinci'], role: 'rave_head' },
        proposal: 'I have 5 years of experience in video editing for brands. I can deliver cinematic edits within your timeline using DaVinci Resolve and After Effects.',
        timeline: '7 days',
        budget: '$450',
        status: 'pending',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
        _id: 'a2',
        applicant: { _id: 'u2', name: 'Dev Xero', skills: ['React', 'TypeScript', 'Next.js'], role: 'rave_head' },
        proposal: 'Full-stack developer with 4 years experience. Specialized in Next.js and TypeScript. Can build this in 10 days with clean, maintainable code.',
        timeline: '10 days',
        budget: '$600',
        status: 'pending',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
        _id: 'a3',
        applicant: { _id: 'u3', name: 'Noor Jihan', skills: ['UI/UX', 'Figma', 'Branding'], role: 'rave_head' },
        proposal: 'Award-winning designer with a portfolio of 50+ brand identities. I will deliver comprehensive brand guidelines and design assets.',
        timeline: '14 days',
        budget: '$800',
        status: 'pending',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
];

export default function ApplicantsPage() {
    const params = useParams();
    const dropId = params.dropId as string;
    const { user, token } = useAuth();
    const router = useRouter();

    const [applicants, setApplicants] = useState<any[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        async function fetchApplicants() {
            try {
                const res = await fetch(`/api/applicants?dropId=${dropId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.applications) {
                    setApplicants(data.applications);
                    if (data.applications.length > 0) setSelectedId(data.applications[0]._id);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchApplicants();
    }, [dropId, token]);

    const handleAction = async (applicationId: string, action: 'accept' | 'reject') => {
        if (!confirm(`Are you sure you want to ${action} this applicant?`)) return;
        try {
            if (action === 'accept') {
                // For acceptance, we use project/init which also updates application status
                const res = await fetch(`/api/project/init`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ applicationId }),
                });
                if (res.ok) {
                    router.push('/collaborations');
                } else {
                    const data = await res.json();
                    alert(data.error || 'Failed to initialize project');
                }
            } else {
                const res = await fetch(`/api/application/${applicationId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ action: 'reject' }),
                });
                if (res.ok) {
                    setApplicants(prev => prev.map(a =>
                        a._id === applicationId ? { ...a, status: 'REJECTED' } : a
                    ));
                }
            }
        } catch (e) {
            alert('Action failed. Please try again.');
        }
    };

    const selected = applicants.find(a => a._id === selectedId);

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground font-mono">Fetching Applicants...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground pb-20 md:pb-0 font-sans" style={{ backgroundColor: '#F7F7F8' }}>
            <Sidebar />

            <main className="md:pl-20 max-w-5xl mx-auto pt-8 px-4">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6 hover:text-foreground transition-colors">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                            <Users size={24} /> Applicants
                        </h1>
                        <p className="text-xs text-zinc-400 font-mono mt-1 uppercase">
                            Drop #{dropId?.slice(-6).toUpperCase()} · {applicants.filter(a => a.status === 'PENDING').length} pending
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Applicant List */}
                    <div className="md:col-span-1 space-y-3">
                        {applicants.length === 0 ? (
                            <div className="py-12 bg-white rounded-2xl border-2 border-dashed border-zinc-200 text-center">
                                <p className="text-[12px] font-black text-zinc-400 uppercase">No applicants yet</p>
                            </div>
                        ) : (
                            applicants.map(app => (
                                <div
                                    key={app._id}
                                    onClick={() => setSelectedId(app._id)}
                                    className={`bg-white border-2 rounded-2xl p-4 cursor-pointer transition-all ${selectedId === app._id ? 'border-zinc-900 shadow-lg shadow-zinc-200' : 'border-[#E8E8E8] hover:border-zinc-300'}`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-black text-sm shrink-0 overflow-hidden">
                                                {app.applicant?.image ? (
                                                    <img src={app.applicant.image} alt={app.applicant.name} className="w-full h-full object-cover" />
                                                ) : app.applicant?.name?.[0]?.toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-black text-[13px] uppercase truncate max-w-[100px]">{app.applicant?.name}</p>
                                                <p className="text-[9px] text-zinc-400 font-black uppercase tracking-widest">Rave Head</p>
                                            </div>
                                        </div>
                                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${app.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : app.status === 'ACCEPTED' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                            {app.status}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-zinc-500">
                                        <span className="text-green-600 italic">${app.quote}</span>
                                        <span>{app.timeline} Days</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Proposal Preview */}
                    <div className="md:col-span-2">
                        {selected ? (
                            <div className="bg-white rounded-2xl border border-[#E8E8E8] p-8 sticky top-8">
                                <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#F0F0F0]">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-zinc-900 text-white flex items-center justify-center font-black text-2xl overflow-hidden shadow-xl shadow-zinc-200">
                                            {selected.applicant?.image ? (
                                                <img src={selected.applicant.image} alt={selected.applicant.name} className="w-full h-full object-cover" />
                                            ) : selected.applicant?.name?.[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-black text-xl uppercase tracking-tighter">{selected.applicant?.name}</p>
                                            <div className="flex gap-2 mt-1">
                                                {selected.applicant?.skills?.map((s: string) => (
                                                    <span key={s} className="text-[10px] bg-zinc-50 border border-zinc-100 px-2 py-0.5 rounded-full font-black uppercase tracking-widest text-zinc-400">{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/profile/${selected.applicant?.username || selected.applicant?.name?.toLowerCase().replace(/\s+/g, '')}`}
                                        className="px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:bg-white hover:border-zinc-900 transition-all"
                                    >
                                        Full Profile
                                    </Link>
                                </div>

                                <div className="space-y-6 mb-8">
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-3 flex items-center gap-2">
                                            <FileText size={12} /> Cover Letter
                                        </p>
                                        <p className="text-sm leading-relaxed text-zinc-700 bg-zinc-50 p-6 rounded-2xl italic border border-zinc-100">
                                            "{selected.coverLetter || selected.proposal}"
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4">
                                            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-1">Timeline</p>
                                            <p className="font-black text-lg text-zinc-900">{selected.timeline} Days</p>
                                        </div>
                                        <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4">
                                            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-1">Proposed Quote</p>
                                            <p className="font-black text-lg text-green-600 italic">${selected.quote}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    {selected.status === 'PENDING' ? (
                                        <>
                                            <button
                                                onClick={() => handleAction(selected._id, 'accept')}
                                                className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 text-white font-black uppercase text-[12px] py-4 rounded-2xl hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-200"
                                            >
                                                <Check size={16} /> Accept & Start Project
                                            </button>
                                            <button
                                                onClick={() => handleAction(selected._id, 'reject')}
                                                className="px-6 py-4 flex items-center justify-center gap-2 border border-red-100 text-red-500 font-black uppercase text-[12px] rounded-2xl hover:bg-red-50 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className={`w-full text-center py-4 rounded-2xl font-black uppercase text-[12px] tracking-widest flex items-center justify-center gap-2 ${selected.status === 'ACCEPTED' ? 'bg-green-50 text-green-700 italic border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                            {selected.status === 'ACCEPTED' ? <><Check size={16} /> Agreement Finalized</> : <><X size={16} /> Proposal Rejected</>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white border-2 border-dashed border-zinc-200 rounded-2xl p-12 flex items-center justify-center text-center h-[400px]">
                                <div>
                                    <Users size={48} className="mx-auto mb-4 text-zinc-200" />
                                    <p className="text-[14px] font-black uppercase text-zinc-400 tracking-widest">Select an applicant to review proposal</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

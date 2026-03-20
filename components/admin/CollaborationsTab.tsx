"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Briefcase, Link as LinkIcon, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function CollaborationsTab() {
    const { token } = useAuth();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, active, completed, disputed

    useEffect(() => {
        if (!token) return;
        fetch('/api/admin/projects', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => { setProjects(data.projects || []); setLoading(false); })
            .catch(() => setLoading(false));
    }, [token]);

    const filteredProjects = projects.filter(p => {
        if (filter === 'all') return true;
        if (filter === 'active') return ['ACCEPTED', 'IN_PROGRESS', 'IN_REVIEW'].includes(p.status);
        if (filter === 'completed') return p.status === 'COMPLETED';
        if (filter === 'disputed') return p.status === 'DISPUTED';
        return true;
    });

    return (
        <div className="p-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-1 flex items-center gap-2">
                        <Briefcase size={24} className="text-zinc-900" /> Collaboration Manager
                    </h2>
                    <p className="text-sm font-mono text-zinc-500">Monitor all platform projects and escrow constraints.</p>
                </div>
                <div className="flex bg-zinc-100 p-1 rounded-lg">
                    {['all', 'active', 'completed', 'disputed'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 text-xs font-bold uppercase rounded-md transition-colors ${filter === f ? 'bg-white text-black shadow-sm' : 'text-zinc-500 hover:text-black'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white border border-[#E8E8E8] rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-50 border-b border-zinc-200 uppercase text-[11px] font-black tracking-wider text-zinc-500">
                            <tr>
                                <th className="p-4 w-48">Project ID</th>
                                <th className="p-4">Counterparties</th>
                                <th className="p-4">Escrow</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Intervene</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 font-mono text-xs">
                            {loading ? (
                                <tr><td colSpan={5} className="p-8 text-center text-zinc-400">Loading ledgers...</td></tr>
                            ) : filteredProjects.map(proj => (
                                <tr key={proj._id} className="hover:bg-zinc-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="truncate max-w-[120px]" title={proj._id}>{proj._id}</div>
                                        <div className="text-[10px] text-zinc-400 mt-1">{new Date(proj.createdAt).toLocaleDateString()}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-sans font-bold text-[13px]">{proj.companyId?.brandName || 'Brand'} <span className="text-zinc-400 font-normal">→</span> {proj.raveHeadId?.name || 'Creator'}</div>
                                        <div className="truncate max-w-[200px] text-zinc-500 mt-0.5" title={proj.campaignId?.title}>{proj.campaignId?.title || 'Direct Hire'}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold font-sans text-sm">${proj.agreedAmount}</div>
                                        <div className={`text-[10px] font-bold uppercase mt-1 ${proj.paymentStatus === 'RELEASED' ? 'text-green-500' : proj.paymentStatus === 'REFUNDED' ? 'text-zinc-400' : 'text-amber-500'}`}>
                                            {proj.paymentStatus.replace('_', ' ')}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold font-sans uppercase ${proj.status === 'COMPLETED' ? 'bg-green-50 text-green-600' :
                                            proj.status === 'DISPUTED' ? 'bg-red-50 text-red-600' :
                                                'bg-blue-50 text-blue-600'
                                            }`}>
                                            {proj.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Link
                                            href={`/project/${proj._id}`}
                                            target="_blank"
                                            className="inline-flex items-center justify-center p-2 hover:bg-zinc-100 text-zinc-600 font-bold uppercase rounded transition-colors"
                                            title="View Project Terminal"
                                        >
                                            <LinkIcon size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

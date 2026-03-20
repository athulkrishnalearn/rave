"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Flag, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function ReportsTab() {
    const { token } = useAuth();
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReports = () => {
        setLoading(true);
        fetch('/api/admin/reports', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => { setReports(data.reports || []); setLoading(false); })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        if (token) fetchReports();
    }, [token]);

    const handleUpdate = async (reportId: string, status: string) => {
        try {
            await fetch('/api/admin/reports', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ reportId, status })
            });
            fetchReports();
        } catch (e) {
            alert('Update failed.');
        }
    };

    return (
        <div className="p-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-1 flex items-center gap-2">
                    <Flag size={24} className="text-red-500" /> Trust & Safety Queue
                </h2>
                <p className="text-sm font-mono text-zinc-500">Global user-submitted harassment, spam, and fraud reports.</p>
            </div>

            <div className="bg-white border border-[#E8E8E8] rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-50 border-b border-zinc-200 uppercase text-[11px] font-black tracking-wider text-zinc-500">
                            <tr>
                                <th className="p-4 w-32">Status</th>
                                <th className="p-4 w-32">Target Type</th>
                                <th className="p-4 w-48">Target ID</th>
                                <th className="p-4">Reason & Details</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 font-mono text-xs">
                            {loading ? (
                                <tr><td colSpan={5} className="p-8 text-center text-zinc-400">Loading safety net...</td></tr>
                            ) : reports.map(report => (
                                <tr key={report._id} className={`transition-colors ${report.status === 'pending' ? 'bg-red-50/30' : 'hover:bg-zinc-50/50'}`}>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold font-sans uppercase ${report.status === 'pending' ? 'bg-red-500 text-white' :
                                            report.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                                                'bg-zinc-100 text-zinc-600'
                                            }`}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="p-4 font-bold uppercase">{report.targetType}</td>
                                    <td className="p-4 truncate max-w-[120px] text-zinc-500" title={report.targetId}>
                                        {report.targetId}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold font-sans text-[13px]">{report.reason}</div>
                                        <div className="text-zinc-500 text-[11px] mt-0.5 line-clamp-1">{report.details || 'No additional context provided by reporter.'}</div>
                                        <div className="text-[10px] text-zinc-400 mt-1">Submitted by: {report.reportedBy?.name || 'Anonymous'}</div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {report.status === 'pending' && (
                                                <>
                                                    <button onClick={() => handleUpdate(report._id, 'resolved')} className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded transition-colors" title="Mark Resolved">
                                                        <CheckCircle size={16} />
                                                    </button>
                                                    <button onClick={() => handleUpdate(report._id, 'ignored')} className="p-1.5 bg-zinc-50 text-zinc-500 hover:bg-zinc-200 rounded transition-colors" title="Dismiss as False Flag">
                                                        <XCircle size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {reports.length === 0 && !loading && (
                                <tr><td colSpan={5} className="p-8 text-center text-zinc-400 font-sans">No reports in the queue. Safety net is secure.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

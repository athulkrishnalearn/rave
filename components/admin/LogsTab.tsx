"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Database, Terminal } from 'lucide-react';

export default function LogsTab() {
    const { token } = useAuth();
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        fetch('/api/admin/logs', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => { setLogs(data.logs || []); setLoading(false); })
            .catch(() => setLoading(false));
    }, [token]);

    return (
        <div className="p-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-1 flex items-center gap-2">
                    <Database size={24} className="text-zinc-900" /> Immutable Action Ledger
                </h2>
                <p className="text-sm font-mono text-zinc-500">Read-only audit trail recording all administrator actions globally.</p>
            </div>

            <div className="bg-[#0A0A0A] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-zinc-800 flex items-center gap-2 bg-[#1A1A1A]">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-500/20"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                    </div>
                    <span className="ml-2 font-mono text-[10px] text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                        <Terminal size={10} /> Root Access Terminal Log
                    </span>
                </div>

                <div className="overflow-x-auto p-4 max-h-[600px] overflow-y-auto">
                    {loading ? (
                        <div className="font-mono text-xs text-zinc-500 p-4">Connecting to master database instance...</div>
                    ) : (
                        <table className="w-full text-left font-mono text-[11px] text-zinc-300">
                            <thead className="text-zinc-600 border-b border-zinc-800">
                                <tr>
                                    <th className="py-2 pr-4 font-normal">Timestamp</th>
                                    <th className="py-2 px-4 font-normal">Administrator</th>
                                    <th className="py-2 px-4 font-normal">Command Exe</th>
                                    <th className="py-2 px-4 font-normal">Target Entity</th>
                                    <th className="py-2 px-4 font-normal">Metadata</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {logs.map(log => (
                                    <tr key={log._id} className="hover:bg-zinc-900/50 transition-colors">
                                        <td className="py-3 pr-4 text-zinc-500 whitespace-nowrap">
                                            {new Date(log.createdAt).toISOString().replace('T', ' ').substring(0, 19)}
                                        </td>
                                        <td className="py-3 px-4 text-blue-400">
                                            {log.adminId?.name || log.adminId?.email || 'SYSTEM'}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="bg-zinc-800 text-zinc-100 px-1.5 py-0.5 rounded text-[10px]">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-purple-400">
                                            {log.targetUserId ? (log.targetUserId.brandName || log.targetUserId.name || log.targetUserId._id) : 'N/A'}
                                        </td>
                                        <td className="py-3 px-4 text-zinc-500 truncate max-w-[200px]" title={log.details}>
                                            {log.details || '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

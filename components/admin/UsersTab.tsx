"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Search, StopCircle, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

export default function UsersTab() {
    const { token } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [acting, setActing] = useState<string | null>(null);

    const fetchUsers = () => {
        setLoading(true);
        fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => { setUsers(data.users || []); setLoading(false); })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        if (token) fetchUsers();
    }, [token]);

    const handleAction = async (userId: string, action: string) => {
        if (!confirm(`Are you sure you want to proceed with action: ${action.toUpperCase()}?`)) return;
        setActing(userId);
        try {
            await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ userId, action })
            });
            fetchUsers();
        } catch (e) {
            alert('Failed to execute action.');
        } finally {
            setActing(null);
        }
    };

    const filteredUsers = users.filter(u =>
        (u.name || u.brandName || '').toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-1">User Matrix</h2>
                    <p className="text-sm font-mono text-zinc-500">Total Registered Nodes: {users.length}</p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-xl text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all font-mono"
                    />
                </div>
            </div>

            <div className="bg-white border border-[#E8E8E8] rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-50 border-b border-zinc-200 uppercase text-[11px] font-black tracking-wider text-zinc-500">
                            <tr>
                                <th className="p-4">Indentifier</th>
                                <th className="p-4">Matrix Role</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Overrides</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {loading ? (
                                <tr><td colSpan={4} className="p-8 text-center font-mono text-zinc-400">Querying DB...</td></tr>
                            ) : filteredUsers.map(user => (
                                <tr key={user._id} className="hover:bg-zinc-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-[13px]">{user.brandName || user.name}</div>
                                        <div className="text-[11px] text-zinc-500 font-mono mt-0.5">{user.email}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${user.role === 'og_vendor' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                                            {user.role.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-1.5">
                                            {user.verificationStatus === 'verified' ? (
                                                <><CheckCircle size={14} className="text-green-500" /><span className="text-xs font-bold text-green-700 uppercase tracking-wide">Verified</span></>
                                            ) : user.verificationStatus === 'rejected' ? (
                                                <><StopCircle size={14} className="text-red-500" /><span className="text-xs font-bold text-red-700 uppercase tracking-wide">Suspended</span></>
                                            ) : (
                                                <><AlertTriangle size={14} className="text-amber-500" /><span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Pending</span></>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                disabled={acting === user._id}
                                                onClick={() => handleAction(user._id, 'verify')}
                                                className="p-1.5 hover:bg-green-100 text-green-600 rounded transition-colors disabled:opacity-50"
                                                title="Force Verify"
                                            >
                                                <CheckCircle size={16} />
                                            </button>
                                            <button
                                                disabled={acting === user._id}
                                                onClick={() => handleAction(user._id, 'ban')}
                                                className="p-1.5 hover:bg-red-100 text-red-600 rounded transition-colors disabled:opacity-50"
                                                title="Suspend Account"
                                            >
                                                <StopCircle size={16} />
                                            </button>
                                        </div>
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

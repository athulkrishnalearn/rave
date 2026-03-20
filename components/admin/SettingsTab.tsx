"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Settings, Save, AlertCircle } from 'lucide-react';

export default function SettingsTab() {
    const { token } = useAuth();
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        commissionRate: 0.15,
        withdrawalLimitDaily: 5000,
        disputeDeadlineDays: 7,
        verificationRequiredForPayout: true
    });

    useEffect(() => {
        if (!token) return;
        fetch('/api/admin/settings', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => {
                if (data.settings) {
                    setSettings(data.settings);
                    setForm({
                        commissionRate: data.settings.commissionRate,
                        withdrawalLimitDaily: data.settings.withdrawalLimitDaily,
                        disputeDeadlineDays: data.settings.disputeDeadlineDays,
                        verificationRequiredForPayout: data.settings.verificationRequiredForPayout
                    });
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [token]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirm("WARNING: Adjusting platform globals can immediately affect live escrow limits and payouts. Proceed?")) return;

        setSaving(true);
        try {
            await fetch('/api/admin/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    commissionRate: Number(form.commissionRate),
                    withdrawalLimitDaily: Number(form.withdrawalLimitDaily),
                    disputeDeadlineDays: Number(form.disputeDeadlineDays),
                    verificationRequiredForPayout: form.verificationRequiredForPayout
                })
            });
            alert('Settings globally synchronized.');
        } catch (err) {
            alert('Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 animate-pulse font-mono text-zinc-500">Decrypting System Config...</div>;

    return (
        <div className="p-8 animate-in fade-in slide-in-from-bottom-4 max-w-4xl">
            <div className="mb-8 border-b border-zinc-100 pb-8">
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-1 flex items-center gap-2">
                    <Settings size={24} className="text-zinc-900" /> Platform Architecture Config
                </h2>
                <p className="text-sm font-mono text-zinc-500 flex items-center gap-2 mt-2">
                    <AlertCircle size={14} className="text-amber-500" /> Warning: Changes propagate instantly to all active users.
                </p>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Financial Globals */}
                    <div className="space-y-6 bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                        <h3 className="font-black uppercase tracking-widest text-xs text-zinc-400 border-b border-zinc-200 pb-2">Financial Engine</h3>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wide text-zinc-700 block">Platform Commission Rate</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="1"
                                    value={form.commissionRate}
                                    onChange={(e) => setForm({ ...form, commissionRate: Number(e.target.value) })}
                                    className="w-full bg-white border border-zinc-200 rounded-lg p-3 text-sm font-mono outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">e.g. 0.15 = 15%</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wide text-zinc-700 block">Daily Withdrawal Limit (USD)</label>
                            <input
                                type="number"
                                value={form.withdrawalLimitDaily}
                                onChange={(e) => setForm({ ...form, withdrawalLimitDaily: Number(e.target.value) })}
                                className="w-full bg-white border border-zinc-200 rounded-lg p-3 text-sm font-mono outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                            />
                        </div>
                    </div>

                    {/* Operational Globals */}
                    <div className="space-y-6 bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                        <h3 className="font-black uppercase tracking-widest text-xs text-zinc-400 border-b border-zinc-200 pb-2">Operational Bounds</h3>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wide text-zinc-700 block">Dispute Window (Days)</label>
                            <input
                                type="number"
                                value={form.disputeDeadlineDays}
                                onChange={(e) => setForm({ ...form, disputeDeadlineDays: Number(e.target.value) })}
                                className="w-full bg-white border border-zinc-200 rounded-lg p-3 text-sm font-mono outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                            />
                        </div>

                        <div className="space-y-2 pt-2">
                            <label className="flex items-start gap-3 cursor-pointer p-4 bg-white border border-zinc-200 rounded-xl hover:border-zinc-300 transition-colors">
                                <div className="mt-0.5">
                                    <input
                                        type="checkbox"
                                        checked={form.verificationRequiredForPayout}
                                        onChange={(e) => setForm({ ...form, verificationRequiredForPayout: e.target.checked })}
                                        className="w-4 h-4 text-zinc-900 border-zinc-300 rounded focus:ring-zinc-900 focus:ring-2"
                                    />
                                </div>
                                <div>
                                    <div className="font-bold text-sm">Require KYC for Payouts</div>
                                    <div className="text-xs font-mono text-zinc-500 mt-1">If enabled, creators must have an Approved ID Verification before withdrawing settled escrow.</div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-3 bg-zinc-950 text-white font-black uppercase tracking-wider text-xs rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50"
                    >
                        <Save size={16} /> {saving ? 'Deploying...' : 'Deploy Globals to Production'}
                    </button>
                </div>
            </form>
        </div>
    );
}

"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
    Activity, Users, FileText, ShieldAlert, Briefcase,
    DollarSign, AlertTriangle, Flag, Gift, Settings, Database, Trophy, BookOpen
} from 'lucide-react';
import Link from 'next/link';

// Import all 11 sub-components
import OverviewTab from '@/components/admin/OverviewTab';
import UsersTab from '@/components/admin/UsersTab';
import VerificationsTab from '@/components/admin/VerificationsTab';
import ModerationTab from '@/components/admin/ModerationTab';
import CollaborationsTab from '@/components/admin/CollaborationsTab';
import PaymentsTab from '@/components/admin/PaymentsTab';
import DisputesTab from '@/components/admin/DisputesTab';
import ReportsTab from '@/components/admin/ReportsTab';
import BenefitsTab from '@/components/admin/BenefitsTab';
import SettingsTab from '@/components/admin/SettingsTab';
import LogsTab from '@/components/admin/LogsTab';
import ContestsTab from '@/components/admin/ContestsTab';
import PlaybooksTab from '@/components/admin/PlaybooksTab';

type TabId = 'overview' | 'users' | 'verifications' | 'drops' | 'collaborations' | 'contests' | 'playbooks' | 'payments' | 'disputes' | 'reports' | 'benefits' | 'settings' | 'logs';

export default function AdminDashboard() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabId>('overview');

    if (authLoading || !user) return <div className="p-10 font-mono text-center animate-pulse uppercase tracking-widest text-zinc-500">AUTHORIZING SYSTEM ADMIN...</div>;

    const TABS = [
        { id: 'overview', label: 'Dashboard', icon: Activity },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'verifications', label: 'Verifications', icon: FileText },
        { id: 'drops', label: 'Drops', icon: ShieldAlert },
        { id: 'collaborations', label: 'Collaborations', icon: Briefcase },
        { id: 'contests', label: 'Contests', icon: Trophy },
        { id: 'playbooks', label: 'Playbooks', icon: BookOpen },
        { id: 'payments', label: 'Payments', icon: DollarSign },
        { id: 'disputes', label: 'Disputes', icon: AlertTriangle },
        { id: 'reports', label: 'Reports', icon: Flag },
        { id: 'benefits', label: 'Benefits', icon: Gift },
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'logs', label: 'Logs', icon: Database },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <OverviewTab />;
            case 'users': return <UsersTab />;
            case 'verifications': return <VerificationsTab />;
            case 'drops': return <ModerationTab />;
            case 'collaborations': return <CollaborationsTab />;
            case 'contests': return <ContestsTab />;
            case 'playbooks': return <PlaybooksTab />;
            case 'payments': return <PaymentsTab />;
            case 'disputes': return <DisputesTab />;
            case 'reports': return <ReportsTab />;
            case 'benefits': return <BenefitsTab />;
            case 'settings': return <SettingsTab />;
            case 'logs': return <LogsTab />;
            default: return <OverviewTab />;
        }
    };

    return (
        <div className="min-h-screen flex bg-zinc-50 md:pl-20">
            {/* LEFT SIDEBAR NAVIGATION */}
            <aside className="w-64 bg-zinc-950 text-zinc-400 flex flex-col fixed inset-y-0 left-0 md:left-20 z-40 transform -translate-x-full md:translate-x-0 transition-transform duration-200 ease-in-out">
                <div className="p-6 border-b border-zinc-800">
                    <h1 className="text-xl text-white font-black uppercase tracking-tighter flex items-center gap-2">
                        <ShieldAlert size={20} className="text-red-500" /> Control Deck
                    </h1>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1">
                        {TABS.map(tab => (
                            <li key={tab.id}>
                                <button
                                    onClick={() => setActiveTab(tab.id as TabId)}
                                    className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-bold transition-all ${activeTab === tab.id
                                        ? 'bg-zinc-800 text-white border-r-4 border-white'
                                        : 'hover:bg-zinc-900 hover:text-white'
                                        }`}
                                >
                                    <tab.icon size={16} />
                                    {tab.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-6 border-t border-zinc-800">
                    <p className="text-xs font-mono">System v2.4</p>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 min-w-0 bg-white md:ml-64 relative">
                <header className="h-16 border-b border-zinc-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-30">
                    <h2 className="font-bold text-lg uppercase tracking-tight">{TABS.find(t => t.id === activeTab)?.label}</h2>
                    <div className="flex items-center gap-4 text-sm font-mono text-zinc-500">
                        <span>Admin Session: <span className="text-black font-bold">{user?.name || 'ADMIN'}</span></span>
                    </div>
                </header>
                <div className="pb-24">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}

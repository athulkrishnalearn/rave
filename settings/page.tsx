"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { useUpload } from "@/lib/hooks/useUpload";
import ImageCropperModal from "@/components/ui/ImageCropperModal";
import {
    User, CreditCard, Shield, Bell, LogOut,
    Camera, Check, ChevronRight, Globe, Instagram,
    Lock, Smartphone, Mail, Trash2, Loader2
} from "lucide-react";

type SettingsTab = 'Account' | 'Payment' | 'Security' | 'Alerts';

export default function SettingsPage() {
    const { user, token, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<SettingsTab>('Account');
    const [saved, setSaved] = useState(false);
    const [profilePreview, setProfilePreview] = useState<string | null>(null);
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const [cropModalSrc, setCropModalSrc] = useState<string | null>(null);
    const avatarUpload = useUpload({ folder: 'avatars' });

    // Profile States
    const [name, setName] = useState((user as any)?.name || "");
    const [email, setEmail] = useState((user as any)?.email || "");
    const [bio, setBio] = useState((user as any)?.bio || "");
    const [headline, setHeadline] = useState((user as any)?.headline || "");
    const [website, setWebsite] = useState((user as any)?.website || "");
    const [location, setLocation] = useState((user as any)?.location || "");
    const [username, setUsername] = useState((user as any)?.username || "");
    const [twitter, setTwitter] = useState((user as any)?.socialLinks?.twitter || "");
    const [instagram, setInstagram] = useState((user as any)?.socialLinks?.instagram || "");
    const [linkedin, setLinkedin] = useState((user as any)?.socialLinks?.linkedin || "");
    const [phone, setPhone] = useState((user as any)?.socialLinks?.phone || "");
    const [coverImageUrl, setCoverImageUrl] = useState((user as any)?.coverImage || "");
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [skillInput, setSkillInput] = useState("");
    const [skills, setSkills] = useState<string[]>((user as any)?.skills || []);
    const coverUpload = useUpload({ folder: 'covers' });

    // Preference States
    const [preferences, setPreferences] = useState({
        profileVisibility: (user as any)?.preferences?.profileVisibility ?? true,
        collabRequests: (user as any)?.preferences?.collabRequests ?? true,
        twoFactorEnabled: (user as any)?.preferences?.twoFactorEnabled ?? false,
        notifications: {
            interactions: (user as any)?.preferences?.notifications?.interactions ?? true,
            network: (user as any)?.preferences?.notifications?.network ?? true,
            financial: (user as any)?.preferences?.notifications?.financial ?? true,
            internal: (user as any)?.preferences?.notifications?.internal ?? true
        }
    });

    const handleSave = async () => {
        if (!token) return;
        try {
            await fetch('/api/users/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    name,
                    bio,
                    headline,
                    website,
                    location,
                    username,
                    profileImage: profileImageUrl || (user as any)?.profileImage,
                    socialLinks: { twitter, instagram, linkedin, phone },
                    coverImage: coverImageUrl,
                    skills,
                    preferences
                }),
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (error) {
            console.error("Save error:", error);
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setCropModalSrc(reader.result as string);
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const handleCropComplete = async (croppedBlob: Blob) => {
        setCropModalSrc(null);
        setProfilePreview(URL.createObjectURL(croppedBlob));
        const file = new File([croppedBlob], "avatar.jpg", { type: "image/jpeg" });
        try {
            const { publicUrl } = await avatarUpload.upload(file);
            setProfileImageUrl(publicUrl);
        } catch { }
    };

    const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCoverPreview(URL.createObjectURL(file));
        try {
            const { publicUrl } = await coverUpload.upload(file);
            setCoverImageUrl(publicUrl);
        } catch { }
        e.target.value = '';
    };

    const addSkill = () => {
        const s = skillInput.trim();
        if (s && !skills.includes(s)) {
            setSkills([...skills, s]);
        }
        setSkillInput("");
    };

    const removeSkill = (s: string) => setSkills(skills.filter(x => x !== s));

    useEffect(() => {
        if (user) {
            const u = user as any;
            setName(u.name || "");
            setEmail(u.email || "");
            setBio(u.bio || "");
            setHeadline(u.headline || "");
            setWebsite(u.website || "");
            setLocation(u.location || "");
            setUsername(u.username || "");
            setTwitter(u.socialLinks?.twitter || "");
            setInstagram(u.socialLinks?.instagram || "");
            setLinkedin(u.socialLinks?.linkedin || "");
            setPhone(u.socialLinks?.phone || "");
            setCoverImageUrl(u.coverImage || "");
            setSkills(u.skills || []);
            if (u.preferences) {
                setPreferences({
                    profileVisibility: u.preferences.profileVisibility ?? true,
                    collabRequests: u.preferences.collabRequests ?? true,
                    twoFactorEnabled: u.preferences.twoFactorEnabled ?? false,
                    notifications: {
                        interactions: u.preferences.notifications?.interactions ?? true,
                        network: u.preferences.notifications?.network ?? true,
                        financial: u.preferences.notifications?.financial ?? true,
                        internal: u.preferences.notifications?.internal ?? true
                    }
                });
            }
        }
    }, [user]);

    const TABS: { id: SettingsTab; icon: any; label: string }[] = [
        { id: 'Account', icon: User, label: 'Profile' },
        { id: 'Payment', icon: CreditCard, label: 'Finances' },
        { id: 'Security', icon: Shield, label: 'Privacy' },
        { id: 'Alerts', icon: Bell, label: 'Alerts' },
    ];

    if (!user) return (
        <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center p-4">
            <Link href="/login" className="px-8 py-4 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-800 transition-all">
                Login Required
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen pb-20 md:pb-0 font-sans bg-[#F7F7F8]">
            {cropModalSrc && (
                <ImageCropperModal 
                    imageSrc={cropModalSrc} 
                    onCropDone={handleCropComplete} 
                    onCancel={() => setCropModalSrc(null)} 
                />
            )}
            <Sidebar />

            <div className="md:pl-16">
                <main className="max-w-4xl mx-auto px-4 py-8">

                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-black text-zinc-900 uppercase tracking-tighter leading-tight">
                            System Settings
                        </h1>
                        <p className="text-[13px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
                            Managing Identity & Network Synchronization
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">

                        {/* ── LEFT NAV ──── */}
                        <nav className="flex md:flex-col gap-2 overflow-x-auto no-scrollbar md:w-48 shrink-0">
                            {TABS.map(({ id, icon: Icon, label }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-left transition-all whitespace-nowrap ${activeTab === id ? 'bg-zinc-900 text-white shadow-xl shadow-zinc-200' : 'bg-white text-zinc-400 hover:text-zinc-900 border border-[#E8E8E8]'}`}
                                >
                                    <Icon size={16} /> {label}
                                </button>
                            ))}
                            <button
                                onClick={logout}
                                className="flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all border border-transparent whitespace-nowrap mt-auto md:mt-4"
                            >
                                <LogOut size={16} /> Termination
                            </button>
                        </nav>

                        {/* ── CONTENT AREA ──── */}
                        <div className="flex-1 space-y-6">

                            {/* Account Tab */}
                            {activeTab === 'Account' && (
                                <div className="space-y-6 anim-fade-in">
                                    <div className="bg-white p-6 rounded-3xl border border-[#E8E8E8] shadow-sm">
                                        {/* Cover Photo Upload */}
                                        <div className="relative rounded-2xl overflow-hidden h-28 bg-zinc-100 mb-0 group cursor-pointer border border-[#E8E8E8]">
                                            {coverPreview || (user as any).coverImage ? (
                                                <img src={coverPreview || (user as any).coverImage} alt="Cover" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center gap-1"
                                                    style={{ background: "linear-gradient(135deg, #18181b 0%, #3f3f46 100%)" }}>
                                                    <Camera size={20} className="text-white/50" />
                                                    <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Add Cover Photo</p>
                                                </div>
                                            )}
                                            <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                {coverUpload.uploading
                                                    ? <Loader2 size={20} className="text-white animate-spin" />
                                                    : <span className="flex items-center gap-2 text-white text-[11px] font-black uppercase"><Camera size={14} /> Change Cover</span>
                                                }
                                                <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
                                            </label>
                                        </div>

                                        <div className="flex items-center gap-6 mt-[-24px] mb-6 px-2">
                                            <label className="w-20 h-20 rounded-3xl bg-zinc-900 text-white flex items-center justify-center text-3xl font-black relative group cursor-pointer overflow-hidden border-4 border-white shadow-xl shrink-0 z-10">
                                                {profilePreview
                                                    ? <img src={profilePreview} alt="Avatar" className="w-full h-full object-cover" />
                                                    : user.profileImage
                                                        ? <img src={user.profileImage} alt="Avatar" className="w-full h-full object-cover" />
                                                        : user.name[0]?.toUpperCase()
                                                }
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    {avatarUpload.uploading
                                                        ? <Loader2 size={20} className="text-white animate-spin" />
                                                        : <Camera size={20} className="text-white" />
                                                    }
                                                </div>
                                                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                                            </label>
                                            <div className="pt-6">
                                                <h3 className="text-lg font-black text-zinc-900 uppercase">{user.name}</h3>
                                                <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-0.5">{user.role.replace('_', ' ')}</p>
                                                {avatarUpload.uploading
                                                    ? <p className="mt-1 text-[10px] font-black uppercase text-zinc-400">Uploading… {avatarUpload.progress}%</p>
                                                    : profileImageUrl
                                                        ? <p className="mt-1 text-[10px] font-black uppercase text-green-600">✓ Photo updated</p>
                                                        : null
                                                }
                                                {avatarUpload.error && <p className="mt-1 text-[10px] text-red-500 font-bold">{avatarUpload.error}</p>}
                                                {coverUpload.error && <p className="mt-1 text-[10px] text-red-500 font-bold">{coverUpload.error}</p>}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider ml-1">Display Name</label>
                                                    <input
                                                        type="text"
                                                        defaultValue={user.name}
                                                        className="w-full px-5 py-3.5 bg-zinc-50 border border-[#E8E8E8] rounded-2xl text-[14px] font-medium outline-none focus:border-zinc-900 transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider ml-1">Email Address</label>
                                                    <input
                                                        type="email"
                                                        defaultValue={user.email}
                                                        className="w-full px-5 py-3.5 bg-zinc-50 border border-[#E8E8E8] rounded-2xl text-[14px] font-medium outline-none focus:border-zinc-900 transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider ml-1">Headline</label>
                                                <input type="text" value={headline} onChange={e => setHeadline(e.target.value)}
                                                    placeholder="e.g. Video Editor & Motion Designer"
                                                    className="w-full px-5 py-3.5 bg-zinc-50 border border-[#E8E8E8] rounded-2xl text-[14px] font-medium outline-none focus:border-zinc-900 transition-all" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider ml-1">Bio</label>
                                                <textarea value={bio} onChange={e => setBio(e.target.value)}
                                                    placeholder="Describe your creative edge..."
                                                    className="w-full px-5 py-3.5 bg-zinc-50 border border-[#E8E8E8] rounded-2xl text-[14px] font-medium outline-none focus:border-zinc-900 transition-all min-h-[100px] resize-none" />
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider ml-1">Location</label>
                                                    <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="City, Country"
                                                        className="w-full px-5 py-3.5 bg-zinc-50 border border-[#E8E8E8] rounded-2xl text-[14px] font-medium outline-none focus:border-zinc-900 transition-all" />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider ml-1">Website</label>
                                                    <div className="relative">
                                                        <Globe size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                                                        <input type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://yoursite.com"
                                                            className="w-full pl-10 pr-5 py-3.5 bg-zinc-50 border border-[#E8E8E8] rounded-2xl text-[14px] font-medium outline-none focus:border-zinc-900 transition-all" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-zinc-400 tracking-wider ml-1 mb-3">Social Links</p>
                                                <div className="grid md:grid-cols-2 gap-3">
                                                    <div className="relative">
                                                        <Instagram size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" />
                                                        <input type="text" value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="Instagram handle"
                                                            className="w-full pl-10 pr-5 py-3.5 bg-zinc-50 border border-[#E8E8E8] rounded-2xl text-[14px] font-medium outline-none focus:border-zinc-900 transition-all" />
                                                    </div>
                                                    <div className="relative">
                                                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400 w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.746-8.855L1.564 2.25h6.649l4.26 5.63L18.243 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                                        <input type="text" value={twitter} onChange={e => setTwitter(e.target.value)} placeholder="X / Twitter handle"
                                                            className="w-full pl-10 pr-5 py-3.5 bg-zinc-50 border border-[#E8E8E8] rounded-2xl text-[14px] font-medium outline-none focus:border-zinc-900 transition-all" />
                                                    </div>
                                                    <div className="relative">
                                                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                                        <input type="url" value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="LinkedIn URL"
                                                            className="w-full pl-10 pr-5 py-3.5 bg-zinc-50 border border-[#E8E8E8] rounded-2xl text-[14px] font-medium outline-none focus:border-zinc-900 transition-all" />
                                                    </div>
                                                    <div className="relative">
                                                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.72A2 2 0 012 .5h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.34a16 16 0 006.57 6.57l1.21-1.21a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                                                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number"
                                                            className="w-full pl-10 pr-5 py-3.5 bg-zinc-50 border border-[#E8E8E8] rounded-2xl text-[14px] font-medium outline-none focus:border-zinc-900 transition-all" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Skills Section */}
                                    <div className="bg-white p-6 rounded-3xl border border-[#E8E8E8] shadow-sm">
                                        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-wider mb-3">Skills & Expertise</p>
                                        <div className="flex gap-2 mb-3">
                                            <input
                                                type="text"
                                                value={skillInput}
                                                onChange={e => setSkillInput(e.target.value)}
                                                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                                                placeholder="e.g. Video Editing, Motion Graphics…"
                                                className="flex-1 px-4 py-2.5 bg-zinc-50 border border-[#E8E8E8] rounded-xl text-[13px] font-medium outline-none focus:border-zinc-900 transition-all"
                                            />
                                            <button onClick={addSkill}
                                                className="px-4 py-2.5 bg-zinc-900 text-white rounded-xl text-[11px] font-black uppercase tracking-wide hover:bg-zinc-700 transition-all">
                                                Add
                                            </button>
                                        </div>
                                        {skills.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {skills.map((skill: string) => (
                                                    <span key={skill} className="group flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 rounded-xl text-[12px] font-bold text-zinc-700">
                                                        {skill}
                                                        <button onClick={() => removeSkill(skill)}
                                                            className="text-zinc-300 hover:text-red-500 transition-colors text-[14px] leading-none">×</button>
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-[12px] text-zinc-300 font-bold">No skills added yet. Type above and press Add.</p>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleSave}
                                        className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${saved ? "bg-green-500 text-white" : "bg-zinc-900 text-white hover:bg-zinc-800"}`}
                                    >
                                        {saved ? "System Saved" : "Update Core Identity"}
                                    </button>
                                </div>
                            )}

                            {/* Payment Tab */}
                            {activeTab === 'Payment' && (
                                <div className="space-y-6 anim-fade-in">
                                    <div className="bg-white p-8 rounded-3xl border border-[#E8E8E8] text-center shadow-sm">
                                        <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-zinc-200">
                                            <CreditCard size={32} />
                                        </div>
                                        <h3 className="text-[14px] font-black uppercase text-zinc-900 tracking-tight mb-1">No Active Payment Link</h3>
                                        <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest max-w-[200px] mx-auto mb-6">Connect a card or crypto wallet to fund escrow deposits.</p>
                                        <button className="px-8 py-3 bg-zinc-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all">
                                            Sync Payment Method
                                        </button>
                                    </div>

                                    <div className="bg-white p-6 rounded-3xl border border-[#E8E8E8] shadow-sm">
                                        <h3 className="text-[12px] font-black uppercase text-zinc-900 tracking-widest mb-4">Payout Infrastructure</h3>
                                        <div className="space-y-4">
                                            <div className="p-4 bg-zinc-50 rounded-2xl border border-[#E8E8E8] flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Mail className="text-zinc-400" size={18} />
                                                    <span className="text-[13px] font-bold text-zinc-700">PayPal Linked</span>
                                                </div>
                                                <span className="text-[10px] font-black text-green-600 uppercase">Active</span>
                                            </div>
                                            <div className="p-4 border border-[#E8E8E8] rounded-2xl flex items-center justify-between opacity-50">
                                                <div className="flex items-center gap-3">
                                                    <Lock className="text-zinc-400" size={18} />
                                                    <span className="text-[13px] font-bold text-zinc-700">Bank Wire</span>
                                                </div>
                                                <button className="text-[10px] font-black text-zinc-900 uppercase underline">Connect</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'Security' && (
                                <div className="space-y-4 anim-fade-in">
                                    {[
                                        { label: "Profile Visibility", desc: "Open your drops and statistics to the global network.", icon: Globe },
                                        { label: "Collab Requests", desc: "Allow companies to send you outbound coordination briefs.", icon: Mail },
                                        { label: "2FA Protection", desc: "Require a synchronized external device for login access.", icon: Smartphone },
                                    ].map(item => (
                                        <div key={item.label} className="bg-white p-5 rounded-3xl border border-[#E8E8E8] flex items-center justify-between hover:border-zinc-300 transition-all shadow-sm">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-zinc-50 rounded-xl text-zinc-400">
                                                    <item.icon size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="text-[13px] font-black uppercase text-zinc-900">{item.label}</h4>
                                                    <p className="text-[11px] text-zinc-400 font-bold leading-tight mt-0.5">{item.desc}</p>
                                                </div>
                                            </div>
                                            <button className="w-12 h-6 bg-zinc-900 rounded-full relative p-1 group">
                                                <div className="w-4 h-4 bg-white rounded-full absolute right-1 group-hover:bg-zinc-100" />
                                            </button>
                                        </div>
                                    ))}

                                    <div className="mt-8 p-6 bg-red-50 rounded-3xl border border-red-100 flex items-center justify-between">
                                        <div>
                                            <h4 className="text-[12px] font-black uppercase text-red-600 tracking-widest mb-1">Archive Identity</h4>
                                            <p className="text-[11px] text-red-600/60 font-bold max-w-[200px]">Permanently remove your presence from the RAVE network.</p>
                                        </div>
                                        <button className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all">
                                            Terminate
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Alerts Tab */}
                            {activeTab === 'Alerts' && (
                                <div className="space-y-4 anim-fade-in">
                                    {[
                                        { label: "Interaction Alerts", desc: "Likes, comments, and internal feed synchronization." },
                                        { label: "Network Requests", desc: "Direct proposals and collaboration triggers." },
                                        { label: "Financial Signals", desc: "Escrow updates and successful payout confirms." },
                                        { label: "Internal Comms", desc: "New direct messages in the high-fidelity inbox." },
                                    ].map(item => (
                                        <div key={item.label} className="bg-white p-5 rounded-2xl border border-[#E8E8E8] flex items-center justify-between shadow-sm">
                                            <div>
                                                <h4 className="text-[13px] font-black uppercase text-zinc-900 leading-none mb-1">{item.label}</h4>
                                                <p className="text-[11px] text-zinc-400 font-bold leading-none mt-1">{item.desc}</p>
                                            </div>
                                            <button className="w-10 h-5 bg-zinc-900 rounded-full relative p-0.5">
                                                <div className="w-4 h-4 bg-white rounded-full absolute right-0.5" />
                                            </button>
                                        </div>
                                    ))}
                                    <button onClick={handleSave} className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-800 transition-all mt-4">
                                        {saved ? "System Saved" : "Sync Preferences"}
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}

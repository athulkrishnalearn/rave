"use client";
import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUpload } from "@/lib/hooks/useUpload";
import ImageCropperModal from "@/components/ui/ImageCropperModal";
import {
    User, Sparkles, Code, Edit3, Megaphone, Video, Monitor, Camera,
    Tag, FileText, Upload, Shield, Zap, ChevronRight, ChevronLeft, Check, Loader2
} from "lucide-react";

const TOTAL_STEPS = 7;

const FOCUS_OPTIONS = [
    { id: "editing", label: "Editing", icon: Edit3 },
    { id: "programming", label: "Programming", icon: Code },
    { id: "content", label: "Content Creation", icon: Megaphone },
    { id: "design", label: "Design", icon: Monitor },
    { id: "marketing", label: "Marketing", icon: Sparkles },
    { id: "video", label: "Video Production", icon: Video },
    { id: "photography", label: "Photography", icon: Camera },
    { id: "sales", label: "Sales", icon: null, comingSoon: true },
];

function StepIndicator({ current, total }: { current: number; total: number }) {
    return (
        <div className="flex items-center justify-center gap-2 mb-8">
            {Array.from({ length: total }).map((_, i) => (
                <div key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i < current ? "w-8 bg-zinc-900" : i === current - 1 ? "w-8 bg-zinc-900" : "w-3 bg-zinc-200"}`}
                />
            ))}
        </div>
    );
}

export default function RaveHeadOnboarding() {
    const { user, token } = useAuth();
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Upload hooks
    const avatarUpload = useUpload({ folder: 'avatars', token });
    const portfolioUpload = useUpload({ folder: 'portfolio', token });
    const idUpload = useUpload({ folder: 'id-docs', token });

    // Step 1
    const [username, setUsername] = useState("");
    const [usernameAvail, setUsernameAvail] = useState<null | boolean>(null);
    const [checkingUsername, setCheckingUsername] = useState(false);

    // Step 2
    const [focus, setFocus] = useState<string[]>([]);

    // Step 3
    const [skills, setSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState("");

    // Step 4
    const [bio, setBio] = useState("");
    const [profileImage, setProfileImage] = useState<string | null>(null);   // R2 public URL
    const [profilePreview, setProfilePreview] = useState<string | null>(null); // local blob for preview
    const [cropModalSrc, setCropModalSrc] = useState<string | null>(null);

    // Step 5 — Portfolio
    const [portfolioItems, setPortfolioItems] = useState<{ title: string; description: string; fileUrl: string }[]>([]);
    const [portTitle, setPortTitle] = useState("");
    const [portDesc, setPortDesc] = useState("");
    const [portFileName, setPortFileName] = useState<string | null>(null);  // display name
    const [portFileUrl, setPortFileUrl] = useState<string | null>(null);    // R2 public URL

    // Step 6
    const [idFileName, setIdFileName] = useState<string | null>(null);  // display name
    const [idFileUrl, setIdFileUrl] = useState<string | null>(null);    // R2 public URL

    // Step 7 — First drop
    const [dropText, setDropText] = useState("");
    const [dropHashtags, setDropHashtags] = useState("");

    const checkUsername = async (val: string) => {
        if (!val || val.length < 3) { setUsernameAvail(null); return; }
        setCheckingUsername(true);
        // Simulate check — in prod do GET /api/users/check?username=val
        await new Promise(r => setTimeout(r, 500));
        setUsernameAvail(val !== "admin" && val !== "rave");
        setCheckingUsername(false);
    };

    const addSkill = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && skillInput.trim()) {
            e.preventDefault();
            if (!skills.includes(skillInput.trim())) setSkills([...skills, skillInput.trim()]);
            setSkillInput("");
        }
    };

    const addPortfolioItem = () => {
        if (!portTitle.trim()) return;
        setPortfolioItems(prev => [...prev, { title: portTitle, description: portDesc, fileUrl: portFileUrl || "" }]);
        setPortTitle(""); setPortDesc(""); setPortFileName(null); setPortFileUrl(null);
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
            setProfileImage(publicUrl);
        } catch { /* error shown via avatarUpload.error */ }
    };

    const handlePortfolioFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPortFileName(file.name);
        try {
            const { publicUrl } = await portfolioUpload.upload(file);
            setPortFileUrl(publicUrl);
        } catch { /* error shown via portfolioUpload.error */ }
    };

    const handleIdFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIdFileName(file.name);
        try {
            const { publicUrl } = await idUpload.upload(file);
            setIdFileUrl(publicUrl);
        } catch { /* error shown via idUpload.error */ }
    };

    const saveOnboarding = async () => {
        if (!token) return;
        setLoading(true);
        try {
            await fetch("/api/auth/onboarding", {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ username, focus, skills, bio, profileImage, portfolio: portfolioItems, idDocument: idFileUrl }),
            });
        } catch { /* continue even if fails */ }
        setLoading(false);
    };

    const publishFirstDrop = async () => {
        if (!token || !dropText.trim()) { router.push("/"); return; }
        setLoading(true);
        try {
            await saveOnboarding();
            const tags = dropHashtags.split(/[,\s]+/).filter(Boolean).map(t => t.replace(/^#/, ""));
            await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ type: "DROP", content: { text: dropText }, hashtags: tags }),
            });
        } catch { }
        router.push("/");
        setLoading(false);
    };

    const next = async () => {
        if (step === 6) await saveOnboarding();
        if (step < TOTAL_STEPS) setStep(s => s + 1);
    };
    const back = () => setStep(s => s - 1);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans" style={{ backgroundColor: "#F7F7F8" }}>
            {cropModalSrc && (
                <ImageCropperModal 
                    imageSrc={cropModalSrc} 
                    onCropDone={handleCropComplete} 
                    onCancel={() => setCropModalSrc(null)} 
                />
            )}
            <div className="w-full max-w-lg">
                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 relative mb-1">
                        <Image
                            src="/logo-black.png"
                            alt="RAVE"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <span className="text-[28px] font-black italic tracking-tighter text-zinc-900">RAVE</span>
                    <p className="text-[13px] text-zinc-400">Setting up your Rave Head profile</p>
                </div>

                <div className="bg-white rounded-2xl border border-[#E8E8E8] p-8">
                    <StepIndicator current={step} total={TOTAL_STEPS} />

                    {/* ── STEP 1: USERNAME ─────────────────────────── */}
                    {step === 1 && (
                        <div>
                            <h2 className="text-xl font-black text-zinc-900 mb-1">Choose your username</h2>
                            <p className="text-[13px] text-zinc-400 mb-6">This is your handle on RAVE. You can't change it later.</p>
                            <div className="input-icon-wrapper group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-sm group-focus-within:text-zinc-900 transition-colors">@</span>
                                <input type="text" value={username}
                                    onChange={e => { setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, "")); checkUsername(e.target.value); }}
                                    placeholder="yourhandle"
                                    className="w-full pl-10 h-14 bg-zinc-50 border border-[#E8E8E8] rounded-2xl text-[15px] font-bold focus:border-zinc-900 focus:bg-white outline-none transition-all placeholder:text-zinc-300"
                                />
                            </div>
                            {checkingUsername && <p className="text-[12px] text-zinc-400 mt-2">Checking…</p>}
                            {usernameAvail === true && <p className="text-[12px] text-green-600 font-bold mt-2 flex items-center gap-1"><Check size={12} /> Available!</p>}
                            {usernameAvail === false && <p className="text-[12px] text-red-500 font-bold mt-2">Username taken, try another.</p>}
                        </div>
                    )}

                    {/* ── STEP 2: CORE FOCUS ───────────────────────── */}
                    {step === 2 && (
                        <div>
                            <h2 className="text-xl font-black text-zinc-900 mb-1">What's your core focus?</h2>
                            <p className="text-[13px] text-zinc-400 mb-6">Select all that apply.</p>
                            <div className="grid grid-cols-2 gap-3">
                                {FOCUS_OPTIONS.map(opt => {
                                    const Icon = opt.icon;
                                    const selected = focus.includes(opt.id);
                                    return (
                                        <button key={opt.id} disabled={opt.comingSoon}
                                            onClick={() => setFocus(prev => selected ? prev.filter(f => f !== opt.id) : [...prev, opt.id])}
                                            className={`relative flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${opt.comingSoon ? "opacity-40 cursor-not-allowed border-zinc-100" : selected ? "border-zinc-900 bg-zinc-900 text-white shadow-xl shadow-zinc-900/10" : "border-[#E8E8E8] hover:border-zinc-400 bg-white"}`}
                                        >
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${selected ? "bg-white/10" : "bg-zinc-50 text-zinc-400"}`}>
                                                {Icon ? <Icon size={16} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                                            </div>
                                            <span className="text-[13px] font-black uppercase tracking-tight">{opt.label}</span>
                                            {opt.comingSoon && (
                                                <span className="absolute top-2 right-2 text-[8px] bg-amber-200 text-amber-900 font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter">Soon</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ── STEP 3: SKILLS ───────────────────────────── */}
                    {step === 3 && (
                        <div>
                            <h2 className="text-xl font-black text-zinc-900 mb-1">Add your skills</h2>
                            <p className="text-[13px] text-zinc-400 mb-6">Press Enter after each skill.</p>
                            <input type="text" value={skillInput}
                                onChange={e => setSkillInput(e.target.value)}
                                onKeyDown={addSkill}
                                placeholder="e.g. Figma, After Effects, React…"
                                className="w-full mb-4"
                            />
                            <div className="flex flex-wrap gap-2">
                                {skills.map(s => (
                                    <span key={s} className="flex items-center gap-1.5 bg-zinc-100 text-zinc-700 text-[12px] font-bold px-3 py-1 rounded-full">
                                        {s}
                                        <button onClick={() => setSkills(skills.filter(x => x !== s))} className="text-zinc-400 hover:text-zinc-900">×</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── STEP 4: BIO + PHOTO ───────────────────────── */}
                    {step === 4 && (
                        <div>
                            <h2 className="text-xl font-black text-zinc-900 mb-1">Your story</h2>
                            <p className="text-[13px] text-zinc-400 mb-6">Tell companies what makes you unique.</p>
                            <div className="flex items-center gap-4 mb-5">
                                <label className="relative w-16 h-16 rounded-full bg-zinc-100 border-2 border-dashed border-zinc-300 flex items-center justify-center cursor-pointer hover:bg-zinc-50 transition-colors overflow-hidden shrink-0">
                                    {profilePreview
                                        ? <img src={profilePreview} alt="Preview" className="w-full h-full object-cover" />
                                        : avatarUpload.uploading
                                            ? <Loader2 size={20} className="text-zinc-400 animate-spin" />
                                            : <Camera size={20} className="text-zinc-400" />
                                    }
                                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                                </label>
                                <div>
                                    <p className="text-[13px] font-bold text-zinc-700">
                                        {profileImage ? "✓ Photo uploaded" : avatarUpload.uploading ? `Uploading… ${avatarUpload.progress}%` : "Upload profile photo"}
                                    </p>
                                    <p className="text-[11px] text-zinc-400">JPG or PNG, max 5MB</p>
                                    {avatarUpload.error && <p className="text-[11px] text-red-500 mt-0.5">{avatarUpload.error}</p>}
                                </div>
                            </div>
                            <textarea value={bio} onChange={e => setBio(e.target.value)}
                                placeholder="I'm a video editor specialising in brand storytelling…"
                                rows={4}
                                className="w-full resize-none"
                            />
                        </div>
                    )}

                    {/* ── STEP 5: PORTFOLIO ──────────────────────────── */}
                    {step === 5 && (
                        <div>
                            <h2 className="text-xl font-black text-zinc-900 mb-1">Add your portfolio</h2>
                            <p className="text-[13px] text-zinc-400 mb-6">Showcase your best work. You can add more later.</p>
                            <div className="space-y-3 mb-4">
                                <input type="text" value={portTitle} onChange={e => setPortTitle(e.target.value)} placeholder="Project title" className="w-full" />
                                <input type="text" value={portDesc} onChange={e => setPortDesc(e.target.value)} placeholder="Short description" className="w-full" />
                                <label className="flex items-center gap-2 border border-dashed border-zinc-300 rounded-xl p-3 cursor-pointer hover:bg-zinc-50 transition-colors">
                                    {portfolioUpload.uploading
                                        ? <Loader2 size={16} className="text-zinc-400 animate-spin" />
                                        : <Upload size={16} className="text-zinc-400" />
                                    }
                                    <span className="text-[13px] text-zinc-500">
                                        {portFileUrl ? `✓ ${portFileName}` : portfolioUpload.uploading ? `Uploading… ${portfolioUpload.progress}%` : "Upload file"}
                                    </span>
                                    <input type="file" className="hidden" onChange={handlePortfolioFileChange} />
                                </label>
                                {portfolioUpload.error && <p className="text-[12px] text-red-500">{portfolioUpload.error}</p>}
                                <button onClick={addPortfolioItem} disabled={!portTitle.trim()}
                                    className="w-full py-2 border border-zinc-200 rounded-xl text-[13px] font-bold text-zinc-600 hover:bg-zinc-50 transition-colors disabled:opacity-40"
                                >
                                    + Add to Portfolio
                                </button>
                            </div>
                            {portfolioItems.length > 0 && (
                                <div className="space-y-2">
                                    {portfolioItems.map((p, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl">
                                            <div className="w-8 h-8 bg-zinc-200 rounded-lg flex items-center justify-center shrink-0">
                                                <FileText size={14} className="text-zinc-500" />
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-bold text-zinc-800">{p.title}</p>
                                                <p className="text-[11px] text-zinc-400">{p.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <button onClick={next} className="mt-4 text-[12px] text-zinc-400 hover:text-zinc-700 underline">
                                Skip for now →
                            </button>
                        </div>
                    )}

                    {/* ── STEP 6: ID VERIFICATION ────────────────────── */}
                    {step === 6 && (
                        <div>
                            <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center mb-4">
                                <Shield size={22} className="text-white" />
                            </div>
                            <h2 className="text-xl font-black text-zinc-900 mb-1">Identity verification</h2>
                            <p className="text-[13px] text-zinc-400 mb-6">
                                Upload a government-issued ID. This is reviewed by our admin team and never shared publicly.
                            </p>
                            <label className={`flex flex-col items-center gap-3 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors ${idFileUrl ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 hover:border-zinc-400"}`}>
                                {idUpload.uploading
                                    ? <Loader2 size={24} className="text-zinc-400 animate-spin" />
                                    : <Upload size={24} className={idFileUrl ? "text-zinc-900" : "text-zinc-300"} />
                                }
                                <div className="text-center">
                                    <p className="text-[13px] font-bold text-zinc-700">
                                        {idFileUrl ? `✓ ${idFileName}` : idUpload.uploading ? `Uploading… ${idUpload.progress}%` : "Upload ID document"}
                                    </p>
                                    <p className="text-[11px] text-zinc-400 mt-0.5">Passport, Driver's License, or National ID</p>
                                </div>
                                <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleIdFileChange} />
                            </label>
                            {idUpload.error && <p className="text-[12px] text-red-500 text-center mt-2">{idUpload.error}</p>}
                            <p className="text-[11px] text-zinc-400 mt-3 text-center">Verification typically takes 1–24 hours</p>
                        </div>
                    )}

                    {/* ── STEP 7: FIRST DROP ─────────────────────────── */}
                    {step === 7 && (
                        <div>
                            <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center mb-4">
                                <Zap size={22} className="text-zinc-900" />
                            </div>
                            <h2 className="text-xl font-black text-zinc-900 mb-1">Post your first drop</h2>
                            <p className="text-[13px] text-zinc-400 mb-6">Introduce yourself to the RAVE community.</p>
                            <textarea value={dropText} onChange={e => setDropText(e.target.value)}
                                placeholder="Hey RAVE! I'm a video editor based in London, specialising in brand storytelling…"
                                rows={4}
                                className="w-full resize-none mb-3"
                            />
                            <input type="text" value={dropHashtags}
                                onChange={e => setDropHashtags(e.target.value)}
                                placeholder="#VideoEditing #Design #Available"
                                className="w-full"
                            />
                        </div>
                    )}

                    {/* ── NAV BUTTONS ──────────────────────────────────── */}
                    <div className={`flex gap-3 mt-8 ${step > 1 ? "justify-between" : "justify-end"}`}>
                        {step > 1 && (
                            <button onClick={back}
                                className="flex items-center gap-1.5 px-4 py-2.5 border border-zinc-200 rounded-xl text-[13px] font-bold text-zinc-600 hover:bg-zinc-50 transition-colors"
                            >
                                <ChevronLeft size={15} /> Back
                            </button>
                        )}

                        {step < TOTAL_STEPS ? (
                            <button onClick={next}
                                disabled={(step === 1 && !usernameAvail) || (step === 2 && focus.length === 0)}
                                className="flex items-center gap-1.5 px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-[13px] font-black uppercase tracking-wider hover:bg-zinc-700 transition-colors disabled:opacity-40"
                            >
                                Continue <ChevronRight size={15} />
                            </button>
                        ) : (
                            <button onClick={publishFirstDrop} disabled={loading}
                                className="flex items-center gap-1.5 px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-[13px] font-black uppercase tracking-wider hover:bg-zinc-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? "Publishing…" : <><Zap size={14} /> Launch into RAVE</>}
                            </button>
                        )}
                    </div>

                    {/* Skip entire onboarding */}
                    {step < 6 && (
                        <p className="text-center mt-4">
                            <button onClick={() => router.push("/")} className="text-[11px] text-zinc-300 hover:text-zinc-500 transition-colors">
                                Skip for now
                            </button>
                        </p>
                    )}
                </div>

                <p className="text-center text-[11px] text-zinc-400 mt-4">Step {step} of {TOTAL_STEPS}</p>
            </div>
        </div>
    );
}

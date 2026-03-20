"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUpload } from "@/lib/hooks/useUpload";
import { Building2, Globe, Tag, Upload, Shield, Zap, ChevronRight, ChevronLeft, Check, Loader2 } from "lucide-react";

const TOTAL_STEPS = 5;

const INDUSTRIES = [
    "Fashion & Apparel", "Food & Beverage", "Music & Entertainment",
    "Tech & Software", "Health & Wellness", "Education", "Finance",
    "Travel & Hospitality", "Sports & Fitness", "Media & Publishing",
    "Beauty & Cosmetics", "Real Estate", "Automotive", "Gaming",
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

export default function CompanyOnboarding() {
    const { user, token } = useAuth();
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Step 1
    const [username, setUsername] = useState("");
    const [usernameAvail, setUsernameAvail] = useState<null | boolean>(null);
    const [checkingUsername, setCheckingUsername] = useState(false);

    // Step 2
    const [companyName, setCompanyName] = useState("");
    const [website, setWebsite] = useState("");
    const [description, setDescription] = useState("");

    // Step 3
    const [industry, setIndustry] = useState<string[]>([]);

    // Upload hooks
    const idUpload = useUpload({ folder: 'id-docs', token });
    const companyDocUpload = useUpload({ folder: 'company-docs', token });

    // Step 4
    const [idFileName, setIdFileName] = useState<string | null>(null);
    const [idFileUrl, setIdFileUrl] = useState<string | null>(null);
    const [companyDocName, setCompanyDocName] = useState<string | null>(null);
    const [companyDocUrl, setCompanyDocUrl] = useState<string | null>(null);

    const handleIdChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIdFileName(file.name);
        try {
            const { publicUrl } = await idUpload.upload(file);
            setIdFileUrl(publicUrl);
        } catch { }
    };

    const handleCompanyDocChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCompanyDocName(file.name);
        try {
            const { publicUrl } = await companyDocUpload.upload(file);
            setCompanyDocUrl(publicUrl);
        } catch { }
    };

    // Step 5 — First Requirement
    const [reqTitle, setReqTitle] = useState("");
    const [reqDesc, setReqDesc] = useState("");
    const [reqSkills, setReqSkills] = useState<string[]>([]);
    const [reqSkillInput, setReqSkillInput] = useState("");
    const [reqBudget, setReqBudget] = useState("");
    const [reqHashtags, setReqHashtags] = useState("");

    const checkUsername = async (val: string) => {
        if (!val || val.length < 3) { setUsernameAvail(null); return; }
        setCheckingUsername(true);
        await new Promise(r => setTimeout(r, 500));
        setUsernameAvail(val !== "admin" && val !== "rave");
        setCheckingUsername(false);
    };

    const addReqSkill = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && reqSkillInput.trim()) {
            e.preventDefault();
            if (!reqSkills.includes(reqSkillInput.trim())) setReqSkills([...reqSkills, reqSkillInput.trim()]);
            setReqSkillInput("");
        }
    };

    const saveOnboarding = async () => {
        if (!token) return;
        try {
            await fetch("/api/auth/onboarding", {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ username, companyName, website, description, industry, idDocument: idFileUrl, companyRegistration: companyDocUrl }),
            });
        } catch { }
    };

    const publishFirstRequirement = async () => {
        setLoading(true);
        await saveOnboarding();
        if (reqTitle.trim() && token) {
            try {
                const tags = reqHashtags.split(/[,\s]+/).filter(Boolean).map(t => t.replace(/^#/, ""));
                await fetch("/api/posts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({
                        type: "CAMPAIGN",
                        content: { title: reqTitle, text: reqDesc },
                        campaignDetails: { requirements: reqSkills, budget: reqBudget },
                        hashtags: tags,
                    }),
                });
            } catch { }
        }
        router.push("/");
        setLoading(false);
    };

    const next = async () => {
        if (step === 4) await saveOnboarding();
        if (step < TOTAL_STEPS) setStep(s => s + 1);
    };
    const back = () => setStep(s => s - 1);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans" style={{ backgroundColor: "#F7F7F8" }}>
            <div className="w-full max-w-lg">
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
                    <p className="text-[13px] text-zinc-400">Setting up your company profile</p>
                </div>

                <div className="bg-white rounded-2xl border border-[#E8E8E8] p-8">
                    <StepIndicator current={step} total={TOTAL_STEPS} />

                    {/* ── STEP 1: USERNAME ───────────────────────────── */}
                    {step === 1 && (
                        <div>
                            <h2 className="text-xl font-black text-zinc-900 mb-1">Choose your handle</h2>
                            <p className="text-[13px] text-zinc-400 mb-6">This is your company's @username on RAVE.</p>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-sm">@</span>
                                <input type="text" value={username}
                                    onChange={e => { setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, "")); checkUsername(e.target.value); }}
                                    placeholder="yourcompany"
                                    className="w-full pl-8"
                                />
                            </div>
                            {checkingUsername && <p className="text-[12px] text-zinc-400 mt-2">Checking…</p>}
                            {usernameAvail === true && <p className="text-[12px] text-green-600 font-bold mt-2 flex items-center gap-1"><Check size={12} /> Available!</p>}
                            {usernameAvail === false && <p className="text-[12px] text-red-500 font-bold mt-2">Username taken.</p>}
                        </div>
                    )}

                    {/* ── STEP 2: COMPANY INFO ───────────────────────── */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-black text-zinc-900 mb-1">Company details</h2>
                            <p className="text-[13px] text-zinc-400 mb-6">This appears on your public company profile.</p>
                            <div>
                                <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Company Name</label>
                                <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="NordBrands Inc." className="w-full" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Website</label>
                                <input type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://yourcompany.com" className="w-full" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">About Your Brand</label>
                                <textarea value={description} onChange={e => setDescription(e.target.value)}
                                    placeholder="We're a fashion label looking for creative talent to build our next campaign…"
                                    rows={3} className="w-full resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* ── STEP 3: INDUSTRY ───────────────────────────── */}
                    {step === 3 && (
                        <div>
                            <h2 className="text-xl font-black text-zinc-900 mb-1">Your industry</h2>
                            <p className="text-[13px] text-zinc-400 mb-6">Helps talent find the right campaigns.</p>
                            <div className="flex flex-wrap gap-2">
                                {INDUSTRIES.map(ind => (
                                    <button key={ind}
                                        onClick={() => setIndustry(prev => prev.includes(ind) ? prev.filter(i => i !== ind) : [...prev, ind])}
                                        className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all border ${industry.includes(ind) ? "bg-zinc-900 text-white border-zinc-900" : "border-[#E8E8E8] text-zinc-600 hover:border-zinc-400"}`}
                                    >
                                        {ind}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── STEP 4: VERIFICATION ───────────────────────── */}
                    {step === 4 && (
                        <div>
                            <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center mb-4">
                                <Shield size={22} className="text-white" />
                            </div>
                            <h2 className="text-xl font-black text-zinc-900 mb-1">Business verification</h2>
                            <p className="text-[13px] text-zinc-400 mb-6">Upload your business registration document so we can verify you're a legitimate company.</p>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Rep's ID (Required)</p>
                                    <label className={`flex items-center gap-3 border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors ${idFileUrl ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 hover:border-zinc-400"}`}>
                                        {idUpload.uploading
                                            ? <Loader2 size={18} className="text-zinc-400 shrink-0 animate-spin" />
                                            : <Upload size={18} className="text-zinc-400 shrink-0" />
                                        }
                                        <span className="text-[13px] text-zinc-500">
                                            {idFileUrl ? `✓ ${idFileName}` : idUpload.uploading ? `Uploading… ${idUpload.progress}%` : "Upload representative's ID"}
                                        </span>
                                        <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleIdChange} />
                                    </label>
                                    {idUpload.error && <p className="text-[12px] text-red-500 mt-1">{idUpload.error}</p>}
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Company Registration (Optional)</p>
                                    <label className={`flex items-center gap-3 border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors ${companyDocUrl ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 hover:border-zinc-400"}`}>
                                        {companyDocUpload.uploading
                                            ? <Loader2 size={18} className="text-zinc-400 shrink-0 animate-spin" />
                                            : <Upload size={18} className="text-zinc-400 shrink-0" />
                                        }
                                        <span className="text-[13px] text-zinc-500">
                                            {companyDocUrl ? `✓ ${companyDocName}` : companyDocUpload.uploading ? `Uploading… ${companyDocUpload.progress}%` : "Upload registration cert"}
                                        </span>
                                        <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleCompanyDocChange} />
                                    </label>
                                    {companyDocUpload.error && <p className="text-[12px] text-red-500 mt-1">{companyDocUpload.error}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 5: FIRST REQUIREMENT ──────────────────── */}
                    {step === 5 && (
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center mb-2">
                                <Zap size={22} className="text-zinc-900" />
                            </div>
                            <h2 className="text-xl font-black text-zinc-900 mb-1">Post your first requirement</h2>
                            <p className="text-[13px] text-zinc-400 mb-4">Let Rave Heads know what you need. You can edit this later.</p>

                            <input type="text" value={reqTitle} onChange={e => setReqTitle(e.target.value)} placeholder="Looking for a video editor for brand campaign" className="w-full" />
                            <textarea value={reqDesc} onChange={e => setReqDesc(e.target.value)}
                                placeholder="We need 3 short-form videos for our product launch…"
                                rows={3} className="w-full resize-none"
                            />
                            <div>
                                <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Required Skills (press Enter)</label>
                                <input type="text" value={reqSkillInput}
                                    onChange={e => setReqSkillInput(e.target.value)}
                                    onKeyDown={addReqSkill}
                                    placeholder="e.g. After Effects, Video Editing"
                                    className="w-full mb-2"
                                />
                                <div className="flex flex-wrap gap-1.5">
                                    {reqSkills.map(s => (
                                        <span key={s} className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                                            {s} <button onClick={() => setReqSkills(reqSkills.filter(x => x !== s))}>×</button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <input type="text" value={reqBudget} onChange={e => setReqBudget(e.target.value)} placeholder="Budget (e.g. $500 per video)" className="w-full" />
                            <input type="text" value={reqHashtags} onChange={e => setReqHashtags(e.target.value)} placeholder="#VideoEditing #BrandCampaign" className="w-full" />
                        </div>
                    )}

                    {/* ── NAV ──────────────────────────────────────────── */}
                    <div className={`flex gap-3 mt-8 ${step > 1 ? "justify-between" : "justify-end"}`}>
                        {step > 1 && (
                            <button onClick={back} className="flex items-center gap-1.5 px-4 py-2.5 border border-zinc-200 rounded-xl text-[13px] font-bold text-zinc-600 hover:bg-zinc-50 transition-colors">
                                <ChevronLeft size={15} /> Back
                            </button>
                        )}
                        {step < TOTAL_STEPS ? (
                            <button onClick={next}
                                disabled={(step === 1 && !usernameAvail) || (step === 4 && !idFileUrl)}
                                className="flex items-center gap-1.5 px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-[13px] font-black uppercase tracking-wider hover:bg-zinc-700 transition-colors disabled:opacity-40"
                            >
                                Continue <ChevronRight size={15} />
                            </button>
                        ) : (
                            <button onClick={publishFirstRequirement} disabled={loading}
                                className="flex items-center gap-1.5 px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-[13px] font-black uppercase tracking-wider hover:bg-zinc-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? "Publishing…" : <><Zap size={14} /> Launch Requirement</>}
                            </button>
                        )}
                    </div>

                    {step === 5 && (
                        <p className="text-center mt-3">
                            <button onClick={() => router.push("/")} className="text-[11px] text-zinc-300 hover:text-zinc-500 transition-colors">
                                Skip, I'll post later →
                            </button>
                        </p>
                    )}
                </div>

                <p className="text-center text-[11px] text-zinc-400 mt-4">Step {step} of {TOTAL_STEPS}</p>
            </div>
        </div>
    );
}

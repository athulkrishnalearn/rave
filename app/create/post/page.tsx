
"use client";

import { useState, Suspense } from 'react';
import { ArrowLeft, Upload, CheckCircle, Repeat, Briefcase, Zap, Star, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useUpload } from '@/lib/hooks/useUpload';
import ImageCropperModal from '@/components/ui/ImageCropperModal';
import { useRouter, useSearchParams } from 'next/navigation';

function CreateDropForm() {
    const [submitted, setSubmitted] = useState(false);

    // Core Data
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [type, setType] = useState<'DROP' | 'WORK' | 'CAMPAIGN'>('DROP');

    // Meta & Attachments
    const [mediaFile, setMediaFile] = useState<string | null>(null);  // R2 public URL
    const [mediaPreview, setMediaPreview] = useState<string | null>(null); // local preview
    const [cropModalSrc, setCropModalSrc] = useState<string | null>(null);

    // Work Specifics
    const [pricingType, setPricingType] = useState<'HOURLY' | 'PER_UNIT' | 'FIXED'>('FIXED');
    const [rate, setRate] = useState<string>('');

    // Global Hashtags
    const [hashtags, setHashtags] = useState<string[]>([]);
    const [hashtagInput, setHashtagInput] = useState('');

    // Campaign Specifics
    const [requirements, setRequirements] = useState<string[]>([]);
    const [reqInput, setReqInput] = useState('');
    const [budget, setBudget] = useState('');

    const { token, user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const mediaUpload = useUpload({ folder: 'posts' });

    // Check Verification
    if (user && (user as any).verificationStatus !== 'verified' && (user as any).verificationStatus !== undefined) {
        // Should handle pending verification
    }

    const repostId = searchParams.get('repost');
    const repostTitle = searchParams.get('title');

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => setCropModalSrc(reader.result as string);
            reader.readAsDataURL(file);
            e.target.value = '';
        } else {
            alert("Only images are allowed for drops.");
            e.target.value = '';
        }
    };

    const handleCropComplete = async (croppedBlob: Blob) => {
        setCropModalSrc(null);
        setMediaPreview(URL.createObjectURL(croppedBlob));
        const file = new File([croppedBlob], "post.jpg", { type: "image/jpeg" });
        try {
            const { publicUrl } = await mediaUpload.upload(file);
            setMediaFile(publicUrl);
        } catch { /* error shown via mediaUpload.error */ }
    };

    const addHashtag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && hashtagInput.trim()) {
            e.preventDefault();
            let ht = hashtagInput.trim().replace(/\s+/g, '');
            if (!ht.startsWith('#')) ht = '#' + ht;
            if (!hashtags.includes(ht)) setHashtags([...hashtags, ht]);
            setHashtagInput('');
        }
    };

    const addRequirement = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && reqInput.trim()) {
            e.preventDefault();
            if (!requirements.includes(reqInput.trim())) setRequirements([...requirements, reqInput.trim()]);
            setReqInput('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            alert("Please login first.");
            router.push('/login');
            return;
        }

        try {
            const body: any = {
                type,
                authorId: (user as any).id, // Ideally backend extracts from token
                content: {
                    title: type === 'DROP' ? undefined : title, // Drops don't mandate titles usually, but we'll include if set
                    text: text,
                    mediaUrl: mediaFile || undefined
                }
            };

            if (type === 'WORK') {
                body.workDetails = {
                    tags: hashtags, // Mirror hashtags natively into tags 
                    category: 'Visual', // Defaulting for now
                    pricingType,
                    rate: Number(rate) || 0
                };
                body.content.title = title; // Mandate title for Work
            }

            if (type === 'CAMPAIGN') {
                body.campaignDetails = {
                    requirements,
                    budget,
                    status: 'active'
                };
                body.content.title = title; // Mandate title for Campaign
            }

            body.hashtags = hashtags;

            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                setSubmitted(true);
            } else {
                const data = await res.json();
                alert(data.error || "Failed to drop.");
            }
        } catch (error) {
            console.error("Drop error", error);
            alert("Something went wrong");
        }
    };

    if (user && (user as any).verificationStatus === 'pending') {
        return (
            <div className="bg-card border border-[#E8E8E8] border-dashed rounded-xl p-8 text-center mt-8">
                <div className="w-16 h-16 bg-yellow-400 text-black rounded-full flex items-center justify-center mb-4 mx-auto">
                    <CheckCircle size={32} />
                </div>
                <h1 className="text-2xl font-black uppercase mb-2">Verification Pending</h1>
                <p className="text-muted-foreground mb-8">You can't drop until an Admin verifies your ID.</p>
                <Link href="/" className="tactile-btn px-8">Return Home</Link>
            </div>
        )
    }

    if (submitted) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-4">
                    <CheckCircle size={32} />
                </div>
                <h1 className="text-2xl font-black uppercase mb-2">Dropped Successfully</h1>
                <p className="text-muted-foreground mb-8">Your {type.toLowerCase()} is now live on the grid.</p>
                <Link href="/" className="tactile-btn px-8">
                    Back to Feed
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-card border border-[#E8E8E8] rounded-xl p-6 md:p-8">
            {cropModalSrc && (
                <ImageCropperModal 
                    imageSrc={cropModalSrc} 
                    onCropDone={handleCropComplete} 
                    onCancel={() => setCropModalSrc(null)} 
                    cropShape="rect"
                    aspectRatio={1}
                />
            )}
            <h1 className="text-3xl font-black uppercase tracking-tight mb-8">
                New Drop
            </h1>

            <form className="space-y-8" onSubmit={handleSubmit}>

                {/* Type Selection */}
                <div className="grid grid-cols-3 gap-2">
                    <div onClick={() => setType('DROP')}
                        className={`cursor-pointer border-2 rounded-lg p-3 text-center transition-all ${type === 'DROP' ? 'bg-black text-white border-black' : 'hover:border-black'}`}>
                        <Zap size={20} className="mx-auto mb-1" />
                        <span className="text-xs font-bold uppercase">Social</span>
                    </div>

                    <div onClick={() => setType('WORK')}
                        className={`cursor-pointer border-2 rounded-lg p-3 text-center transition-all ${type === 'WORK' ? 'bg-black text-white border-black' : 'hover:border-black'}`}>
                        <Star size={20} className="mx-auto mb-1" />
                        <span className="text-xs font-bold uppercase">Work</span>
                    </div>

                    {(user as any)?.role === 'og_vendor' && (
                        <div onClick={() => setType('CAMPAIGN')}
                            className={`cursor-pointer border-2 rounded-lg p-3 text-center transition-all ${type === 'CAMPAIGN' ? 'bg-black text-white border-black' : 'hover:border-black'}`}>
                            <Briefcase size={20} className="mx-auto mb-1" />
                            <span className="text-xs font-bold uppercase">Campaign</span>
                        </div>
                    )}
                </div>

                {/* Media Upload Area */}
                <div className="border-2 border-dashed border-border rounded-lg aspect-square flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer group relative overflow-hidden">
                    {mediaPreview ? (
                        <div className="relative w-full h-full flex items-center justify-center bg-black/5">
                            {mediaFile
                                ? mediaFile.match(/\.(mp4|mov|webm)$/i)
                                    ? <video src={mediaFile} className="w-full h-full object-contain" controls />
                                    : <img src={mediaPreview} alt="Preview" className="w-full h-full object-contain" />
                                : <div className="flex flex-col items-center gap-2">
                                    <Loader2 size={24} className="animate-spin text-zinc-400" />
                                    <p className="text-sm font-bold text-zinc-500">Uploading… {mediaUpload.progress}%</p>
                                </div>
                            }
                            {mediaFile && (
                                <button type="button" onClick={(e) => { e.stopPropagation(); setMediaFile(null); setMediaPreview(null); }} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:scale-110">
                                    <Upload size={14} className="rotate-45" />
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Upload size={24} />
                            </div>
                            <p className="font-bold text-sm uppercase">Upload Visuals</p>
                            <p className="text-xs text-muted-foreground mt-1">1:1 Square Image (Max 50MB)</p>
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleFileUpload}
                                accept="image/*"
                            />
                        </>
                    )}
                    {mediaUpload.error && <p className="absolute bottom-2 text-[11px] text-red-500 font-bold">{mediaUpload.error}</p>}
                </div>

                {/* Conditional Fields */}
                <div className="space-y-4">
                    {(type === 'WORK' || type === 'CAMPAIGN') && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full focus:border-black"
                                placeholder={type === 'WORK' ? "Project Name" : "Campaign Title"}
                                required
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider">
                            {type === 'DROP' ? 'Caption / Thought' : 'Description'}
                        </label>
                        <textarea
                            value={text}
                            onChange={e => setText(e.target.value)}
                            className="min-h-[120px] focus:border-black resize-none"
                            placeholder="Type here..."
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider">
                            Hashtags (Press Enter)
                        </label>
                        <input
                            value={hashtagInput}
                            onChange={e => setHashtagInput(e.target.value)}
                            onKeyDown={addHashtag}
                            className="w-full focus:border-black"
                            placeholder="e.g. #creative #rave"
                        />
                        {hashtags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {hashtags.map(ht => (
                                    <span key={ht} className="bg-muted px-2 py-1 rounded-md text-xs font-mono border border-border flex items-center gap-1">
                                        {ht}
                                        <button type="button" onClick={() => setHashtags(hashtags.filter(h => h !== ht))} className="text-zinc-400 hover:text-red-500">×</button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Work & Campaign Specifics */}
                    {(type === 'WORK' || type === 'CAMPAIGN') && (
                        <>
                            {type === 'CAMPAIGN' && (
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider">
                                        Budget / Pay
                                    </label>
                                    <input
                                        type="text"
                                        value={budget}
                                        onChange={e => setBudget(e.target.value)}
                                        className="w-full focus:border-black"
                                        placeholder="e.g. $500 or 15% Commission"
                                        required
                                    />
                                </div>
                            )}
                            
                            {type === 'WORK' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider">Pricing Type</label>
                                        <select 
                                            value={pricingType}
                                            onChange={e => setPricingType(e.target.value as any)}
                                            className="w-full px-5 py-3.5 bg-zinc-50 border border-[#E8E8E8] rounded-2xl text-[14px] font-medium outline-none focus:border-zinc-900 transition-all appearance-none"
                                        >
                                            <option value="HOURLY">Hourly Rate</option>
                                            <option value="PER_UNIT">Per Unit</option>
                                            <option value="FIXED">Fixed Rate</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider">Rate ($)</label>
                                        <input
                                            type="number"
                                            value={rate}
                                            onChange={e => setRate(e.target.value)}
                                            className="w-full focus:border-black"
                                            placeholder="e.g. 50"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {type === 'CAMPAIGN' && (
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider">Requirements (Press Enter)</label>
                                    <input
                                        value={reqInput}
                                        onChange={e => setReqInput(e.target.value)}
                                        onKeyDown={addRequirement}
                                        className="w-full focus:border-black"
                                        placeholder="e.g. 10k Followers, US Based"
                                    />
                                    <div className="flex flex-wrap gap-2">
                                        {requirements.map(req => (
                                            <span key={req} className="bg-muted px-2 py-1 rounded-md text-xs font-mono border border-border">{req}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <button type="submit" className="tactile-btn w-full py-4 text-base mt-4">
                    PUBLISH DROP
                </button>

            </form>
        </div>
    );
}

export default function CreatePostPage() {
    return (
        <div className="min-h-screen pb-24 md:pl-20 md:pb-0 pt-8 px-4 max-w-2xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6 hover:text-black transition-colors">
                <ArrowLeft size={16} /> Cancel
            </Link>
            <Suspense fallback={<div>Loading...</div>}>
                <CreateDropForm />
            </Suspense>
        </div>
    );
}

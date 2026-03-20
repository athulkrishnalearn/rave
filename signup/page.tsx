"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Sparkles, Briefcase, Mail, Lock, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
    const [step, setStep] = useState(1);
    const [role, setRole] = useState<'rave_head' | 'og_vendor'>('rave_head');
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otpCode, setOtpCode] = useState('');

    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!email.includes('@') || !email.includes('.')) {
            alert('Please enter a valid email address.');
            return;
        }
        if (password.length < 6) {
            alert('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role
                }),
            });

            let data: any = {};
            try {
                data = await res.json();
            } catch {
                throw new Error('Server error — please try again.');
            }

            if (!res.ok) throw new Error(data.error || 'Signup failed');

            if (data.status === 'pending_verification') {
                setStep(3); // Move to OTP verification step
                return;
            }

            // Fallback (Should not hit this in new flow)
            if (data.token && data.user) {
                login(data.token, data.user);
                router.push(role === 'rave_head' ? '/onboarding/rave-head' : '/onboarding/company');
            }

        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: otpCode }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Verification failed');

            // Login automatically using the returned token
            login(data.token, data.user);

            // Redirect to appropriate onboarding wizard
            if (role === 'rave_head') {
                router.push('/onboarding/rave-head');
            } else {
                router.push('/onboarding/company');
            }

        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#F7F7F8" }}>
            <div className="bg-white border border-[#E8E8E8] rounded-2xl w-full max-w-md overflow-hidden shadow-sm">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex flex-col items-center mb-4">
                            <div className="w-12 h-12 relative flex items-center justify-center mb-1">
                                <Image
                                    src="/logo-black.png"
                                    alt="RAVE"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <span className="text-2xl font-black italic tracking-tighter text-zinc-900">RAVE</span>
                        </Link>
                        <h1 className="text-2xl font-black text-zinc-900 uppercase">
                            {step === 3 ? "Verify Email" : "Join the Network"}
                        </h1>
                        <p className="text-[13px] text-zinc-400 mt-1 uppercase font-bold tracking-widest">
                            {step === 3 ? "Check your inbox" : `Step ${step} of 2`}
                        </p>
                    </div>

                    {step === 1 && (
                        <div className="space-y-4">
                            <div onClick={() => setRole('rave_head')} className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${role === 'rave_head' ? 'border-zinc-900 bg-zinc-50' : 'border-[#E8E8E8] hover:border-zinc-300'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${role === 'rave_head' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-400'}`}>
                                        <Sparkles size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-black uppercase text-zinc-900">Rave Head</h3>
                                        <p className="text-[12px] text-zinc-500">I am a creator, editor, or freelancer</p>
                                    </div>
                                </div>
                            </div>
                            <div onClick={() => setRole('og_vendor')} className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${role === 'og_vendor' ? 'border-zinc-900 bg-zinc-50' : 'border-[#E8E8E8] hover:border-zinc-300'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${role === 'og_vendor' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-400'}`}>
                                        <Briefcase size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-black uppercase text-zinc-900">OG Vendor</h3>
                                        <p className="text-[12px] text-zinc-500">I am a brand, label, or agency</p>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setStep(2)} className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 mt-4">
                                Next <ArrowRight size={18} />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleSubmit} noValidate className="space-y-4">
                            <div className="space-y-1.5 focus-within:text-zinc-900 transition-colors">
                                <label className="text-[11px] font-black uppercase text-zinc-400 tracking-wider">Full Name</label>
                                <div className="input-icon-wrapper group">
                                    <User className="input-icon" size={18} />
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-[#E8E8E8] rounded-2xl text-[14px] font-bold focus:border-zinc-900 focus:bg-white outline-none transition-all placeholder:text-zinc-300" placeholder="Enter your name" required />
                                </div>
                            </div>
                            <div className="space-y-1.5 focus-within:text-zinc-900 transition-colors">
                                <label className="text-[11px] font-black uppercase text-zinc-400 tracking-wider">Email Address</label>
                                <div className="input-icon-wrapper group">
                                    <Mail className="input-icon" size={18} />
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-[#E8E8E8] rounded-2xl text-[14px] font-bold focus:border-zinc-900 focus:bg-white outline-none transition-all placeholder:text-zinc-300" placeholder="you@example.com" required />
                                </div>
                            </div>
                            <div className="space-y-1.5 focus-within:text-zinc-900 transition-colors">
                                <label className="text-[11px] font-black uppercase text-zinc-400 tracking-wider">Password</label>
                                <div className="input-icon-wrapper group">
                                    <Lock className="input-icon" size={18} />
                                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-[#E8E8E8] rounded-2xl text-[14px] font-bold focus:border-zinc-900 focus:bg-white outline-none transition-all placeholder:text-zinc-300" placeholder="••••••••" required />
                                </div>
                            </div>
                            <div className="flex gap-2 pt-4">
                                <button type="button" onClick={() => setStep(1)} className="px-6 py-4 border border-[#E8E8E8] text-zinc-400 rounded-2xl font-black uppercase tracking-widest hover:border-zinc-300 hover:text-zinc-600 transition-all">Back</button>
                                <button type="submit" disabled={loading} className="flex-1 py-4 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-800 transition-all disabled:opacity-50">{loading ? "Creating..." : "Sign Up"}</button>
                            </div>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleVerifyOTP} noValidate className="space-y-4">
                            <div className="space-y-1.5 text-center mb-6">
                                <Mail className="mx-auto text-zinc-300 mb-4" size={48} />
                                <p className="text-[14px] text-zinc-600">
                                    We sent a 6-digit confirmation code to <br />
                                    <strong className="text-zinc-900">{email}</strong>
                                </p>
                            </div>
                            <div className="space-y-1.5">
                                <div className="input-icon-wrapper justify-center bg-zinc-50 border border-[#E8E8E8] rounded-2xl focus-within:border-zinc-900 focus-within:bg-white transition-all overflow-hidden p-1">
                                    <Lock className="absolute left-6 text-zinc-400" size={20} />
                                    <input 
                                        type="text" 
                                        maxLength={6} 
                                        value={otpCode} 
                                        onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))} 
                                        className="w-full bg-transparent border-none text-[28px] tracking-[0.5em] pl-[0.5em] font-black text-center focus:ring-0 outline-none h-16" 
                                        placeholder="000000" 
                                        required 
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={loading || otpCode.length !== 6} className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-800 transition-all disabled:opacity-50">
                                {loading ? "Verifying..." : "Verify & Login"}
                            </button>
                            <p className="text-center text-[12px] text-zinc-400 mt-4">
                                Didn't receive the email? <button type="button" onClick={handleSubmit} className="text-zinc-900 font-bold hover:underline">Resend code</button>
                            </p>
                        </form>
                    )}

                    <p className="text-center text-[12px] text-zinc-400 mt-8">
                        Already have an account? <Link href="/login" className="text-zinc-900 font-bold hover:underline">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

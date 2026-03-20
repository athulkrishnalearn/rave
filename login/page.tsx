"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Login failed");
            login(data.token, data.user);
            router.push("/");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#F7F7F8" }}>
            <div className="bg-white rounded-2xl border border-[#E8E8E8] p-8 w-full max-w-md shadow-sm">
                {/* Logo */}
                <div className="flex flex-col items-center justify-center mb-6">
                    <div className="w-12 h-12 relative flex items-center justify-center mb-1">
                        <Image
                            src="/logo-black.png"
                            alt="RAVE"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <span className="text-xl font-black italic tracking-tighter text-zinc-900">RAVE</span>
                </div>
                <h1 className="text-2xl font-black text-zinc-900 text-center mb-1">Welcome back</h1>
                <p className="text-sm text-zinc-400 text-center mb-8">Sign in to your RAVE account</p>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm font-semibold p-3 rounded-lg mb-5 text-center border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[12px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="you@rave.works"
                            required
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-[12px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full"
                        />
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full mt-2 py-3 bg-zinc-900 text-white text-[13px] font-black uppercase tracking-wider rounded-xl hover:bg-zinc-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Signing in…" : "Sign In"}
                    </button>
                </form>

                <p className="text-center text-[13px] text-zinc-400 mt-6">
                    New here?{" "}
                    <Link href="/signup" className="font-bold text-zinc-900 hover:underline">Join the RAVE</Link>
                </p>

                {/* Test credentials */}
                <div className="mt-6 pt-5 border-t border-[#E8E8E8]">
                    <p className="text-[11px] text-zinc-400 text-center mb-2 font-bold uppercase tracking-wider">Test Accounts</p>
                    <div className="space-y-1 text-center">
                        {[
                            ["Rave Head", "alex@rave.works"],
                            ["Company", "nord@rave.works"],
                            ["Admin", "admin@rave.works"],
                        ].map(([role, em]) => (
                            <button key={em} onClick={() => setEmail(em)}
                                className="block w-full text-[12px] text-zinc-400 hover:text-zinc-700 font-mono transition-colors"
                            >
                                {role}: {em}
                            </button>
                        ))}
                        <p className="text-[11px] text-zinc-300 mt-1">Password: Password123!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

const ADMIN_EMAILS = [
    "athul@faatlab.com",
    "athul.rave@gmail.com"
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white font-mono uppercase tracking-widest animate-pulse">
                SYS_AUTH_CHECK_IN_PROGRESS...
            </div>
        );
    }

    const isAuthorized = user && (user.role === 'admin' || user.role === 'support' || ADMIN_EMAILS.includes(user.email));

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
                <div className="text-center space-y-4 p-8 border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl rounded-2xl max-w-md">
                    <ShieldAlert size={64} className="mx-auto text-red-500" />
                    <h1 className="text-3xl font-black uppercase tracking-tighter">Access Denied</h1>
                    <p className="text-zinc-400 font-mono text-sm">
                        You lack the clearance credentials to access the RAVE system control matrix.
                    </p>
                    <div className="pt-4">
                        <Link href="/" className="inline-block px-8 py-3 bg-white text-black font-bold uppercase rounded-lg hover:bg-zinc-200 transition-colors">
                            Return to Surface
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

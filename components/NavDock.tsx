"use client";
import Link from 'next/link';
import Image from 'next/image';
import { Home, Search, PlusSquare, MessageCircle, User } from 'lucide-react';

export default function NavDock() {
    return (
        <>
            {/* Mobile Bottom Dock (Refined) */}
            <nav className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-xl border-t-2 border-border px-6 py-4 z-50 md:hidden pb-safe">
                <div className="flex justify-between items-center max-w-md mx-auto">
                    <Link href="/" className="text-foreground hover:text-primary transition-colors active:scale-95"><Home size={24} strokeWidth={2.5} /></Link>
                    <Link href="/explore" className="text-muted-foreground hover:text-primary transition-colors active:scale-95"><Search size={24} strokeWidth={2.5} /></Link>
                    <Link href="/create" className="text-primary hover:scale-110 transition-transform active:scale-95"><PlusSquare size={28} strokeWidth={2.5} /></Link>
                    <Link href="/inbox" className="text-muted-foreground hover:text-primary transition-colors active:scale-95"><MessageCircle size={24} strokeWidth={2.5} /></Link>
                    <Link href="/profile" className="text-muted-foreground hover:text-primary transition-colors active:scale-95"><User size={24} strokeWidth={2.5} /></Link>
                </div>
            </nav>

            {/* Desktop Floating Pill Dock */}
            <nav className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 flex-col items-center py-6 px-3 bg-background border-2 border-border rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 gap-8 min-h-[400px]">
                {/* Logo */}
                <div className="w-10 h-10 relative mb-4">
                    <Image src="/logo-black.png" alt="RAVE" fill className="object-contain" />
                </div>

                <div className="flex flex-col gap-8 flex-1 justify-center items-center w-full">
                    <Link href="/" className="group flex items-center justify-center w-12 h-12 rounded-full border-2 border-transparent hover:border-border hover:bg-muted transition-all duration-300">
                        <Home size={24} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
                    </Link>

                    <Link href="/explore" className="group flex items-center justify-center w-12 h-12 rounded-full border-2 border-transparent hover:border-border hover:bg-muted transition-all duration-300">
                        <Search size={24} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
                    </Link>

                    <Link href="/create" className="group flex items-center justify-center w-12 h-12 bg-black text-white rounded-xl hover:rounded-3xl hover:scale-110 transition-all duration-300 shadow-lg">
                        <PlusSquare size={24} strokeWidth={2} />
                    </Link>

                    <Link href="/inbox" className="group flex items-center justify-center w-12 h-12 rounded-full border-2 border-transparent hover:border-border hover:bg-muted transition-all duration-300">
                        <MessageCircle size={24} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
                    </Link>

                    <Link href="/profile" className="group flex items-center justify-center w-12 h-12 rounded-full border-2 border-transparent hover:border-border hover:bg-muted transition-all duration-300">
                        <User size={24} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
                    </Link>
                </div>

                {/* User Avatar Mini */}
                <div className="mt-auto w-10 h-10 rounded-full bg-black border-2 border-border overflow-hidden cursor-pointer hover:ring-2 ring-offset-2 ring-black transition-all">
                    <Image src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&q=80" alt="Me" width={40} height={40} />
                </div>
            </nav>
        </>
    );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { Trophy, ArrowUpRight, DollarSign } from "lucide-react";

interface SignalCardProps {
    post: any;
}

export default function SignalCard({ post }: SignalCardProps) {
    return (
        <Link 
            href={`/campaign/${post.campaignRef || post._id}`} 
            className="group relative flex flex-col w-[300px] shrink-0 bg-white border border-[#E8E8E8] rounded-[2rem] overflow-hidden hover:border-zinc-900 hover:shadow-2xl hover:shadow-zinc-200/50 transition-all"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-zinc-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            {post.contestId && (
                <div className="absolute top-4 right-4 bg-[#00ff9d] text-zinc-900 px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-md z-20">
                    <Trophy size={10} className="fill-current" /> Entry
                </div>
            )}

            <div className="p-6 flex flex-col h-full relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-zinc-50 overflow-hidden border border-zinc-100 shadow-sm relative shrink-0">
                        {post.author?.image ? (
                            <Image src={post.author.image} alt={post.author.name || "Author"} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full bg-zinc-100 flex items-center justify-center font-black text-zinc-300 text-[10px] uppercase">
                                {post.author?.name?.[0] || "?"}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest truncate">
                            {post.author?.brandName || post.author?.name}
                        </p>
                    </div>
                </div>

                <h5 className="text-zinc-900 font-black uppercase tracking-tight text-lg mb-2 leading-tight line-clamp-2 min-h-[2.5rem]">
                    {post.content?.title || "Untitled Signal"}
                </h5>
                
                <p className="text-zinc-500 text-[11px] font-medium leading-relaxed line-clamp-3 mb-6 flex-1">
                    {post.content?.text}
                </p>

                <div className="pt-4 border-t border-zinc-50 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1">
                        <DollarSign size={12} className="text-zinc-400" />
                        <span className="text-[11px] font-black text-zinc-900 uppercase tracking-widest">
                            {post.campaignDetails?.budget || "Negotiable"}
                        </span>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center group-hover:bg-[#00ff9d] group-hover:text-black transition-colors">
                        <ArrowUpRight size={14} />
                    </div>
                </div>
            </div>
        </Link>
    );
}

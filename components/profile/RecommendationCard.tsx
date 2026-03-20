import { Quote, EyeOff, Trash2 } from "lucide-react";
import Link from "next/link";

export function RecommendationCard({ 
    rec, 
    isOwnProfile, 
    onToggleVisibility, 
    onDelete 
}: { 
    rec: any; 
    isOwnProfile: boolean; 
    onToggleVisibility?: () => void; 
    onDelete?: () => void; 
}) {
    function fmtDate(date: string) {
        if (!date) return "";
        return new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" });
    }

    return (
        <div className={`p-5 bg-white rounded-3xl border ${!rec.isVisible ? 'border-dashed border-red-200 opacity-60' : 'border-[#E8E8E8] hover:border-zinc-300'} transition-all relative group/rec`}>
            
            {isOwnProfile && (
                <div className="absolute top-4 right-4 hidden group-hover/rec:flex items-center gap-2">
                    <button onClick={onToggleVisibility} className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-black uppercase text-zinc-500 bg-zinc-50 hover:bg-zinc-100 rounded-md border border-[#E8E8E8] transition-all">
                        <EyeOff size={12} /> {rec.isVisible ? "Hide" : "Show"}
                    </button>
                    {onDelete && (
                         <button onClick={onDelete} className="p-1.5 bg-zinc-50 border border-[#E8E8E8] rounded-md text-zinc-500 hover:text-red-500 hover:border-red-200 transition-all">
                            <Trash2 size={13} />
                        </button>
                    )}
                </div>
            )}

            <div className="flex gap-4">
                <Link href={`/profile/${rec.fromUserId}`} className="shrink-0 group">
                    <div className="w-12 h-12 rounded-xl bg-zinc-100 overflow-hidden border border-[#E8E8E8] group-hover:border-zinc-400 transition-all">
                        {rec.fromImage ? (
                            <img src={rec.fromImage} alt={rec.fromName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center font-black text-zinc-400">
                                {rec.fromName?.[0]}
                            </div>
                        )}
                    </div>
                </Link>
                
                <div className="flex-1 pr-24">
                    <Link href={`/profile/${rec.fromUserId}`} className="hover:underline text-[14px] font-black text-zinc-900 decoration-2 underline-offset-2">
                        {rec.fromName}
                    </Link>
                    <p className="text-[12px] font-bold text-zinc-500 mb-0.5">{rec.fromHeadline}</p>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-[9px] font-black uppercase tracking-widest text-violet-500 bg-violet-50 px-2 py-0.5 rounded-md">
                            {rec.relationship}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-bold">• {fmtDate(rec.createdAt)}</span>
                    </div>
                </div>
            </div>

            <div className="relative mt-2 p-4 bg-zinc-50 rounded-2xl border border-transparent">
                <Quote size={16} className="absolute top-2 left-2 text-zinc-200 rotate-180" />
                <p className="text-[13px] text-zinc-700 leading-relaxed font-medium block pl-5 pr-2">
                    {rec.body}
                </p>
                <Quote size={16} className="absolute bottom-2 right-2 text-zinc-200" />
            </div>
            
            {!rec.isVisible && isOwnProfile && (
                <div className="mt-3 text-[10px] font-black uppercase text-red-500 bg-red-50 px-3 py-1.5 rounded-lg inline-block text-center w-full">
                    Hidden from public profile
                </div>
            )}
        </div>
    );
}

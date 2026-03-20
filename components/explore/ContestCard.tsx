import Link from "next/link";
import Image from "next/image";
import { Trophy, Clock, Users, ShieldCheck } from "lucide-react";

export default function ContestCard({ contest }: { contest: any }) {
    const isEndingSoon = new Date(contest.deadline).getTime() - new Date().getTime() < 86400000 * 3; // 3 days

    return (
        <Link
            href={`/contest/${contest._id}`}
            className="group relative overflow-hidden rounded-[2.5rem] border border-[#E8E8E8] bg-white hover:border-zinc-900 transition-all hover:shadow-2xl hover:shadow-zinc-200/50 flex flex-col items-center p-8 text-center h-full"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-emerald-50/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="relative z-10 w-full h-full flex flex-col justify-between pt-4">

                {/* Header Profile */}
                <div className="flex flex-col items-center">
                    <div className="relative mb-6">
                        <div className="w-20 h-20 rounded-full bg-zinc-50 overflow-hidden border-4 border-white shadow-xl group-hover:ring-1 group-hover:ring-zinc-900 transition-all">
                            {contest.companyId?.profileImage ? (
                                <Image src={contest.companyId.profileImage} alt={contest.companyId.name} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full bg-zinc-100 flex items-center justify-center font-black text-zinc-300 text-xl uppercase">
                                    {contest.companyId?.name?.[0]}
                                </div>
                            )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-[#00ff9d] text-zinc-900 rounded-full p-1.5 border-4 border-white shadow-lg">
                            <Trophy size={14} className="fill-current" />
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-zinc-900 text-[#00ff9d] rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-4 shadow-xl shadow-zinc-200 group-hover:bg-[#00ff9d] group-hover:text-black transition-colors">
                        <ShieldCheck size={12} /> Escrow Active
                    </div>

                    <h5 className="text-zinc-900 font-black uppercase tracking-tight text-2xl mb-1 leading-none line-clamp-2">
                        {contest.title}
                    </h5>

                    <p className="text-[10px] font-black text-zinc-400 w-full truncate uppercase tracking-[0.2em] mb-8">
                        {contest.companyId?.brandName || contest.companyId?.name}
                    </p>
                </div>

                {/* Main Metrics (Prize & Time) */}
                <div className="w-full space-y-4">
                    <div className="flex flex-col items-center px-4 py-6 bg-zinc-50 rounded-3xl border border-zinc-100 group-hover:bg-white transition-colors">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] mb-2">Total Prize Pool</span>
                        <span className="text-4xl font-black text-zinc-900 tracking-tighter">${contest.prizePool??0}</span>
                    </div>

                    <div className="flex gap-2">
                        <div className={`px-4 py-3 rounded-[1.25rem] text-[9px] font-black uppercase tracking-widest flex items-center gap-2 flex-1 justify-center border ${isEndingSoon ? 'bg-red-50 border-red-100 text-red-600' : 'bg-white border-zinc-100 text-zinc-400'
                            }`}>
                            <Clock size={14} /> {isEndingSoon ? 'Closing' : new Date(contest.deadline).toLocaleDateString()}
                        </div>
                        <div className="px-4 py-3 bg-white border border-zinc-100 text-zinc-400 rounded-[1.25rem] text-[9px] font-black uppercase tracking-widest flex items-center gap-2 flex-1 justify-center">
                            <Users size={14} /> {contest.judgingType === 'community_hybrid' ? 'Hybrid' : 'Direct'}
                        </div>
                    </div>
                </div>

            </div>
        </Link>
    );
}

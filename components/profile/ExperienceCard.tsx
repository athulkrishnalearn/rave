import { MapPin, Briefcase, Edit, Trash2 } from "lucide-react";

export function ExperienceCard({ 
    exp, 
    isOwnProfile, 
    onEdit, 
    onDelete 
}: { 
    exp: any; 
    isOwnProfile: boolean; 
    onEdit: () => void; 
    onDelete: () => void; 
}) {
    function fmtDate(date: string) {
        if (!date) return "Present";
        return new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" });
    }

    return (
        <div className="flex gap-4 pl-12 relative group/exp">
            {/* Timeline dot */}
            <div className="absolute left-3.5 top-1.5 w-3 h-3 rounded-full border-2 border-white bg-zinc-800 shadow-sm" />
            <div className="flex-1 bg-zinc-50 rounded-2xl p-4 border border-transparent hover:border-zinc-200 transition-all relative">
                
                {isOwnProfile && (
                    <div className="absolute top-4 right-4 hidden group-hover/exp:flex items-center gap-2">
                        <button onClick={onEdit} className="p-1.5 bg-white border border-[#E8E8E8] rounded-md text-zinc-500 hover:text-blue-500 hover:border-blue-200 transition-all">
                            <Edit size={13} />
                        </button>
                        <button onClick={onDelete} className="p-1.5 bg-white border border-[#E8E8E8] rounded-md text-zinc-500 hover:text-red-500 hover:border-red-200 transition-all">
                            <Trash2 size={13} />
                        </button>
                    </div>
                )}
                
                <div className="flex items-start justify-between gap-2 mb-1 pr-14">
                    <div>
                        <p className="text-[14px] font-black text-zinc-900">{exp.title}</p>
                        <p className="text-[12px] font-bold text-zinc-600 flex items-center gap-1.5">
                            <Briefcase size={12} className="text-zinc-400" /> {exp.company}
                        </p>
                        {exp.location && (
                            <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                                <MapPin size={10} /> {exp.location}
                            </p>
                        )}
                    </div>
                    <span className="text-[11px] font-bold text-zinc-400 shrink-0">
                        {fmtDate(exp.startDate)} – {exp.isCurrent ? "Present" : exp.endDate ? fmtDate(exp.endDate) : ""}
                    </span>
                </div>
                {exp.description && (
                    <p className="text-[13px] text-zinc-600 mt-2.5 leading-relaxed bg-white border border-[#E8E8E8] p-3 rounded-xl">
                        {exp.description}
                    </p>
                )}
            </div>
        </div>
    );
}

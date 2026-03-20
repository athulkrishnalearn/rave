import { BookOpen, Edit, Trash2 } from "lucide-react";

export function EducationCard({ 
    edu, 
    isOwnProfile, 
    onEdit, 
    onDelete 
}: { 
    edu: any; 
    isOwnProfile: boolean; 
    onEdit: () => void; 
    onDelete: () => void; 
}) {
    return (
        <div className="flex gap-4 p-4 bg-zinc-50 rounded-2xl border border-transparent hover:border-zinc-200 transition-all group/edu relative">
            
            {isOwnProfile && (
                <div className="absolute top-4 right-4 hidden group-hover/edu:flex items-center gap-2">
                    <button onClick={onEdit} className="p-1.5 bg-white border border-[#E8E8E8] rounded-md text-zinc-500 hover:text-blue-500 hover:border-blue-200 transition-all">
                        <Edit size={13} />
                    </button>
                    <button onClick={onDelete} className="p-1.5 bg-white border border-[#E8E8E8] rounded-md text-zinc-500 hover:text-red-500 hover:border-red-200 transition-all">
                        <Trash2 size={13} />
                    </button>
                </div>
            )}

            <div className="w-12 h-12 bg-white rounded-xl border border-[#E8E8E8] flex items-center justify-center shrink-0">
                <BookOpen size={18} className="text-zinc-400" />
            </div>
            
            <div className="flex-1 pr-14">
                <p className="text-[14px] font-black text-zinc-900">{edu.institution}</p>
                <p className="text-[12px] font-bold text-zinc-600">{edu.degree}{edu.field ? `, ${edu.field}` : ""}</p>
                <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[11px] text-zinc-400 font-bold">{edu.startYear} – {edu.isCurrent ? "Present" : edu.endYear || ""}</p>
                    {edu.grade && (
                        <span className="text-[9px] font-black uppercase tracking-widest bg-zinc-200 text-zinc-600 px-1.5 py-0.5 rounded-full">
                            Grade: {edu.grade}
                        </span>
                    )}
                </div>
                {edu.activities && (
                    <p className="text-[12px] text-zinc-500 mt-1">Activities: {edu.activities}</p>
                )}
                {edu.description && (
                    <p className="text-[13px] text-zinc-600 mt-2.5 leading-relaxed bg-white border border-[#E8E8E8] p-3 rounded-xl">
                        {edu.description}
                    </p>
                )}
            </div>
        </div>
    );
}

import { useState, useEffect } from "react";
import { X, Save, Trash2 } from "lucide-react";

type EditorType = "experience" | "education" | "skills";

interface ProfileSectionEditorProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    onDelete?: () => void;
    type: EditorType;
    initialData?: any;
    isLoading?: boolean;
}

// Extracted globally to prevent re-mounting and losing focus on keystrokes
const InputLine = ({ label, name, value, onChange, type = "text", placeholder, required = false }: any) => (
    <div className="flex flex-col gap-2 mb-6">
        <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400 pl-1">{label}</label>
        <input 
            type={type} 
            name={name} 
            value={value || ""} 
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full px-5 py-4 bg-zinc-50/50 border border-[#E8E8E8] rounded-2xl text-[15px] text-zinc-800 placeholder:text-zinc-300 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all font-medium"
        />
    </div>
);

const TextAreaLine = ({ label, name, value, onChange, placeholder, rows = 4 }: any) => (
    <div className="flex flex-col gap-2 mb-6">
        <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400 pl-1">{label}</label>
        <textarea 
            name={name} 
            value={value || ""} 
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className="w-full px-5 py-4 bg-zinc-50/50 border border-[#E8E8E8] rounded-2xl text-[15px] text-zinc-800 placeholder:text-zinc-300 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all font-medium resize-none"
        />
    </div>
);

export function ProfileSectionEditor({ isOpen, onClose, onSave, onDelete, type, initialData, isLoading }: ProfileSectionEditorProps) {
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        if (isOpen) {
            if (type === "skills" && initialData?.skills) {
                setFormData({ skills: initialData.skills.join(", ") });
            } else {
                setFormData(initialData || {});
            }
        }
    }, [isOpen, initialData, type]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setFormData((prev: any) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const isEdit = !!initialData?._id;

    const titleMap = {
        experience: { new: "Add Experience", edit: "Edit Experience" },
        education: { new: "Add Education", edit: "Edit Education" },
        skills: { new: "Edit Skills", edit: "Edit Skills" }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-900/40 backdrop-blur-md transition-all overflow-y-auto">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl mt-10 mb-auto relative flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-[#E8E8E8]">
                    <h2 className="text-[20px] font-black tracking-tight text-zinc-900">
                        {isEdit ? titleMap[type].edit : titleMap[type].new}
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="p-3 text-zinc-400 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100 rounded-2xl transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 sm:p-10 overflow-y-auto flex-1">
                    <form id="editor-form" onSubmit={handleSubmit}>
                        
                        {type === "experience" && (
                            <>
                                <InputLine label="Job Title*" name="title" value={formData.title} onChange={handleChange} required placeholder="Ex: Lead Video Editor" />
                                <InputLine label="Company*" name="company" value={formData.company} onChange={handleChange} required placeholder="Ex: RAVE" />
                                <InputLine label="Location" name="location" value={formData.location} onChange={handleChange} placeholder="Ex: Remote / Mumbai" />
                                
                                <div className="flex flex-col sm:flex-row gap-6 mb-2">
                                    <div className="flex-1">
                                        <InputLine label="Start Date*" type="date" name="startDate" value={formData.startDate ? new Date(formData.startDate).toISOString().split('T')[0] : ''} onChange={handleChange} required />
                                    </div>
                                    <div className="flex-1 opacity-100 transition-opacity" style={{ opacity: formData.isCurrent ? 0.4 : 1, pointerEvents: formData.isCurrent ? 'none' : 'auto' }}>
                                        <InputLine label="End Date" type="date" name="endDate" value={formData.endDate ? new Date(formData.endDate).toISOString().split('T')[0] : ''} onChange={handleChange} placeholder="Leave blank if current" />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mb-8">
                                    <input 
                                        type="checkbox" 
                                        id="isCurrent" 
                                        name="isCurrent" 
                                        checked={formData.isCurrent || false} 
                                        onChange={handleChange}
                                        className="w-4 h-4 text-violet-600 rounded bg-zinc-100 border-zinc-300 focus:ring-violet-500 cursor-pointer accent-violet-600"
                                    />
                                    <label htmlFor="isCurrent" className="text-[14px] text-zinc-700 font-bold select-none cursor-pointer">
                                        I am currently working in this role
                                    </label>
                                </div>

                                <TextAreaLine label="Description" name="description" value={formData.description} onChange={handleChange} placeholder="Describe your responsibilities, impact, and achievements..." rows={5} />
                            </>
                        )}

                        {type === "education" && (
                            <>
                                <InputLine label="Institution*" name="institution" value={formData.institution} onChange={handleChange} required placeholder="Ex: National Institute of Design" />
                                <InputLine label="Degree*" name="degree" value={formData.degree} onChange={handleChange} required placeholder="Ex: Bachelor's" />
                                <InputLine label="Field of Study" name="field" value={formData.field} onChange={handleChange} placeholder="Ex: Graphic Design" />
                                
                                <div className="flex flex-col sm:flex-row gap-6 mb-2">
                                    <div className="flex-1">
                                        <InputLine label="Start Year*" type="number" name="startYear" value={formData.startYear} onChange={handleChange} required placeholder="Ex: 2020" />
                                    </div>
                                    <div className="flex-1 opacity-100 transition-opacity" style={{ opacity: formData.isCurrent ? 0.4 : 1, pointerEvents: formData.isCurrent ? 'none' : 'auto' }}>
                                        <InputLine label="End Year" type="number" name="endYear" value={formData.endYear} onChange={handleChange} placeholder="Ex: 2024 (or expected)" />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mb-8">
                                    <input 
                                        type="checkbox" 
                                        id="isCurrentEdu" 
                                        name="isCurrent" 
                                        checked={formData.isCurrent || false} 
                                        onChange={handleChange}
                                        className="w-4 h-4 text-violet-600 rounded bg-zinc-100 border-zinc-300 focus:ring-violet-500 cursor-pointer accent-violet-600"
                                    />
                                    <label htmlFor="isCurrentEdu" className="text-[14px] text-zinc-700 font-bold select-none cursor-pointer">
                                        I am currently studying here
                                    </label>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-6 mb-2">
                                    <div className="w-full sm:w-1/3">
                                        <InputLine label="Grade" name="grade" value={formData.grade} onChange={handleChange} placeholder="Ex: 8.5 CGPA" />
                                    </div>
                                    <div className="flex-1">
                                        <InputLine label="Activities" name="activities" value={formData.activities} onChange={handleChange} placeholder="Ex: Design Society, Debate Club" />
                                    </div>
                                </div>

                                <TextAreaLine label="Description" name="description" value={formData.description} onChange={handleChange} placeholder="Briefly describe your coursework, thesis, or notable honors..." rows={4} />
                            </>
                        )}
                        {type === "skills" && (
                            <>
                                <TextAreaLine 
                                    label="Skills (Comma Separated)" 
                                    name="skills" 
                                    value={formData.skills || ""} 
                                    onChange={handleChange} 
                                    placeholder="React, Next.js, UI/UX Design..." 
                                />
                                <p className="text-[12px] text-zinc-400 -mt-2 mb-6 ml-1">Separate each skill with a comma.</p>
                            </>
                        )}
                        
                    </form>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-[#E8E8E8] bg-zinc-50/50 flex justify-between rounded-b-[2.5rem]">
                    {isEdit && type !== "skills" && onDelete ? (
                        <button 
                            type="button" 
                            onClick={onDelete}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-5 py-3.5 text-[13px] font-black uppercase tracking-wider text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                        >
                            <Trash2 size={16} /> Delete
                        </button>
                    ) : <div />}
                    
                    <div className="flex gap-4">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-6 py-3.5 text-[13px] font-black uppercase tracking-wider text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50 rounded-2xl transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            form="editor-form"
                            disabled={isLoading}
                            className="flex items-center gap-2 px-8 py-3.5 bg-violet-600 text-white text-[13px] font-black uppercase tracking-wider rounded-2xl hover:bg-violet-700 hover:-translate-y-0.5 shadow-lg shadow-violet-600/20 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                        >
                            {isLoading ? "Saving..." : <><Save size={16} /> Save Changes</>}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

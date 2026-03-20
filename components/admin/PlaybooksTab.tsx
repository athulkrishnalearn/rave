"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, Plus, Trash2, Edit2, Save, X, PlusCircle, ArrowRight, Library, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Lesson {
    title: string;
    content: string;
    videoUrl?: string;
    exercise?: string;
}

interface FormData {
    title: string;
    description: string;
    category: 'creator' | 'freelance' | 'programming' | 'career';
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    duration: string;
    image: string;
    lessons: Lesson[];
}

export default function PlaybooksTab() {
    const { token } = useAuth();
    const [playbooks, setPlaybooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        category: 'creator',
        level: 'Beginner',
        duration: '',
        image: '',
        lessons: [{ title: '', content: '', videoUrl: '', exercise: '' }]
    });

    const fetchPlaybooks = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/content/playbooks', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setPlaybooks(data);
        } catch (error) {
            toast.error("Failed to load playbooks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchPlaybooks();
    }, [token]);

    const handleAddLesson = () => {
        setFormData({
            ...formData,
            lessons: [...formData.lessons, { title: '', content: '', videoUrl: '', exercise: '' }]
        });
    };

    const handleRemoveLesson = (index: number) => {
        const newLessons = [...formData.lessons];
        newLessons.splice(index, 1);
        setFormData({ ...formData, lessons: newLessons });
    };

    const handleLessonChange = (index: number, field: string, value: string) => {
        const newLessons = [...formData.lessons];
        (newLessons[index] as any)[field] = value;
        setFormData({ ...formData, lessons: newLessons });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingId 
                ? `/api/admin/content/playbooks/${editingId}`
                : '/api/admin/content/playbooks';
            
            const res = await fetch(url, {
                method: editingId ? 'PATCH' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success(editingId ? "Playbook updated" : "Playbook created");
                setShowForm(false);
                setEditingId(null);
                setFormData({
                    title: '',
                    description: '',
                    category: 'creator',
                    level: 'Beginner',
                    duration: '',
                    image: '',
                    lessons: [{ title: '', content: '', videoUrl: '', exercise: '' }]
                });
                fetchPlaybooks();
            } else {
                toast.error("Process failed");
            }
        } catch (error) {
            toast.error("Error saving playbook");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This is irreversible.")) return;
        try {
            const res = await fetch(`/api/admin/content/playbooks/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success("Playbook deleted");
                fetchPlaybooks();
            }
        } catch (error) {
            toast.error("Failed to delete");
        }
    };

    const handleEdit = (pb: any) => {
        setEditingId(pb._id);
        setFormData({
            title: pb.title,
            description: pb.description,
            category: pb.category,
            level: pb.level,
            duration: pb.duration,
            image: pb.image,
            lessons: pb.lessons?.map((l: any) => ({
                title: l.title || '',
                content: l.content || '',
                videoUrl: l.videoUrl || '',
                exercise: l.exercise || ''
            })) || [{ title: '', content: '', videoUrl: '', exercise: '' }]
        });
        setShowForm(true);
    };

    return (
        <div className="p-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-1 flex items-center gap-2">
                        <Library size={24} className="text-amber-500" /> Playbook Factory
                    </h2>
                    <p className="text-sm font-mono text-zinc-500">Forge high-performance educational content for the RAVE ecosystem.</p>
                </div>
                {!showForm && (
                    <button 
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
                    >
                        <Plus size={16} /> Create New Playbook
                    </button>
                )}
            </div>

            {showForm ? (
                <div className="bg-white border border-[#E8E8E8] rounded-[32px] p-8 shadow-sm max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-100">
                        <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                            {editingId ? <Edit2 size={20} /> : <PlusCircle size={20} />}
                            {editingId ? 'Refine Playbook' : 'New Playbook Blueprint'}
                        </h3>
                        <button onClick={() => { setShowForm(false); setEditingId(null); }} className="text-zinc-400 hover:text-zinc-900">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Playbook Title</label>
                                <input 
                                    required
                                    className="w-full px-5 py-3.5 bg-zinc-50 border border-[#EBEBEB] rounded-2xl text-[13px] font-bold outline-none focus:border-zinc-900 transition-all"
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    placeholder="e.g. Instagram Growth Guide"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Category</label>
                                <select 
                                    className="w-full px-5 py-3.5 bg-zinc-50 border border-[#EBEBEB] rounded-2xl text-[13px] font-bold outline-none focus:border-zinc-900 transition-all appearance-none"
                                    value={formData.category}
                                    onChange={e => setFormData({...formData, category: e.target.value as any})}
                                >
                                    <option value="creator">Creator Skills</option>
                                    <option value="freelance">Freelancing</option>
                                    <option value="programming">Programming</option>
                                    <option value="career">Career Growth</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Mission Description</label>
                            <textarea 
                                required
                                rows={3}
                                className="w-full px-5 py-3.5 bg-zinc-50 border border-[#EBEBEB] rounded-2xl text-[13px] font-medium outline-none focus:border-zinc-900 transition-all resize-none"
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                placeholder="Short summary of what creators will master..."
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Difficulty Level</label>
                                <select 
                                    className="w-full px-5 py-3.5 bg-zinc-50 border border-[#EBEBEB] rounded-2xl text-[13px] font-bold outline-none focus:border-zinc-900 transition-all appearance-none"
                                    value={formData.level}
                                    onChange={e => setFormData({...formData, level: e.target.value as any})}
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Estimated Duration</label>
                                <input 
                                    required
                                    className="w-full px-5 py-3.5 bg-zinc-50 border border-[#EBEBEB] rounded-2xl text-[13px] font-bold outline-none focus:border-zinc-900 transition-all"
                                    value={formData.duration}
                                    onChange={e => setFormData({...formData, duration: e.target.value})}
                                    placeholder="e.g. 45 min"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Cover Image URL</label>
                                <input 
                                    required
                                    className="w-full px-5 py-3.5 bg-zinc-50 border border-[#EBEBEB] rounded-2xl text-[13px] font-bold outline-none focus:border-zinc-900 transition-all"
                                    value={formData.image}
                                    onChange={e => setFormData({...formData, image: e.target.value})}
                                    placeholder="Unsplash URL or Upload URL"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Curriculum (PDF Lessons)</label>
                                <button 
                                    type="button" 
                                    onClick={handleAddLesson}
                                    className="text-[10px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-1 hover:underline"
                                >
                                    <PlusCircle size={14} /> Add Lesson Section
                                </button>
                            </div>

                            <div className="space-y-4">
                                {formData.lessons.map((lesson, idx) => (
                                    <div key={idx} className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 relative group">
                                        <button 
                                            type="button" 
                                            onClick={() => handleRemoveLesson(idx)}
                                            className="absolute top-4 right-4 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="w-6 h-6 rounded bg-zinc-900 text-white flex items-center justify-center text-[10px] font-black">
                                                {idx + 1}
                                            </span>
                                            <input 
                                                required
                                                className="bg-transparent border-none text-[14px] font-black uppercase tracking-tight outline-none focus:text-zinc-900 w-full"
                                                value={lesson.title}
                                                onChange={e => handleLessonChange(idx, 'title', e.target.value)}
                                                placeholder="Lesson Title..."
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">YouTube Video URL</label>
                                                <input 
                                                    className="w-full bg-white border border-[#EBEBEB] rounded-xl px-4 py-2 text-[12px] font-medium outline-none focus:border-zinc-900 transition-all"
                                                    value={lesson.videoUrl || ''}
                                                    onChange={e => handleLessonChange(idx, 'videoUrl', e.target.value)}
                                                    placeholder="https://youtube.com/watch?v=..."
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Practical Exercise</label>
                                                <input 
                                                    className="w-full bg-white border border-[#EBEBEB] rounded-xl px-4 py-2 text-[12px] font-medium outline-none focus:border-zinc-900 transition-all"
                                                    value={lesson.exercise || ''}
                                                    onChange={e => handleLessonChange(idx, 'exercise', e.target.value)}
                                                    placeholder="Brief instruction for the exercise..."
                                                />
                                            </div>
                                        </div>
                                        <textarea 
                                            required
                                            rows={4}
                                            className="w-full bg-white border border-[#EBEBEB] rounded-xl p-4 text-[13px] font-medium outline-none focus:border-zinc-900 transition-all resize-none"
                                            value={lesson.content}
                                            onChange={e => handleLessonChange(idx, 'content', e.target.value)}
                                            placeholder="Write your lesson content here. Support line breaks for the PDF-style reader."
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-4 border-t border-zinc-100">
                            <button 
                                type="submit"
                                className="flex-1 flex items-center justify-center gap-2 py-4 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-zinc-800 transition-all"
                            >
                                <Save size={16} /> {editingId ? 'Commit Changes' : 'Launch Playbook'}
                            </button>
                            <button 
                                type="button"
                                onClick={() => { setShowForm(false); setEditingId(null); }}
                                className="px-10 py-4 bg-zinc-100 text-zinc-400 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-zinc-200 hover:text-zinc-600 transition-all"
                            >
                                Abort
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="grid gap-4">
                    {loading ? (
                        <div className="p-20 text-center font-mono text-zinc-400 animate-pulse border-2 border-dashed border-zinc-100 rounded-[40px]">
                            Synchronizing Course Data...
                        </div>
                    ) : playbooks.length === 0 ? (
                        <div className="p-20 text-center bg-zinc-50 rounded-[40px] border-2 border-dashed border-zinc-100">
                            <BookOpen size={48} className="mx-auto text-zinc-200 mb-4" />
                            <h3 className="text-xl font-black uppercase text-zinc-400">Library Empty</h3>
                            <p className="text-sm font-mono text-zinc-400">Start adding courses to populate the Learning Hub.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {playbooks.map(pb => (
                                <div key={pb._id} className="bg-white border border-[#E8E8E8] rounded-[32px] overflow-hidden group hover:border-zinc-900 transition-all shadow-sm">
                                    <div className="h-40 relative">
                                        <img src={pb.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 bg-white/90 backdrop-blur text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm">
                                                {pb.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-black uppercase tracking-tight leading-none">{pb.title}</h3>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEdit(pb)} className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors"><Edit2 size={16}/></button>
                                                <button onClick={() => handleDelete(pb._id)} className="p-2 text-zinc-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 uppercase">
                                                <FileText size={12} /> {pb.lessons?.length || 0} Lessons
                                            </div>
                                            <div className="w-1 h-1 rounded-full bg-zinc-200" />
                                            <div className="text-[10px] font-bold text-zinc-400 uppercase">{pb.duration}</div>
                                        </div>
                                        <button disabled className="w-full py-3 bg-zinc-50 text-zinc-400 border border-zinc-100 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                                            Published <ArrowRight size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

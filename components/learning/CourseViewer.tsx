"use client";

import { useState, useEffect, useRef } from "react";
import CopilotInterface from "@/components/ai/CopilotInterface";
import { BookOpen, ChevronLeft, ChevronRight, Maximize2, Sparkles, Layout, Youtube, CheckCircle, Play, Lock } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

interface Lesson {
    title: string;
    content?: string; // Legacy
    detailedContent?: { title: string; content: string }[];
    objective?: string;
    videoUrl?: string; // Legacy
    video?: {
        url: string;
        title?: string;
        description?: string;
    };
    exercise?: string; // Legacy
    exercises?: { title: string; steps: string[] }[];
    reflectionPrompt?: string;
}

interface CourseViewerProps {
    courseId: string;
    title: string;
    description?: string;
    lessons: Lesson[];
}

export default function CourseViewer({ courseId, title, description, lessons = [] }: CourseViewerProps) {
    const { token } = useAuth();
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [completedItems, setCompletedItems] = useState<string[]>([]);
    const [videoWatched, setVideoWatched] = useState(false);
    const playerRef = useRef<any>(null);

    useEffect(() => {
        if (token && courseId) {
            fetch(`/api/learning/progress?playbookId=${courseId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => res.json())
            .then(data => setCompletedItems(data.progress || []));
        }
    }, [token, courseId]);

    const handleExerciseToggle = async (lessonIdx: number, exerciseIdx: number) => {
        const itemKey = `L${lessonIdx}-E${exerciseIdx}`;
        if (completedItems.includes(itemKey)) return;

        try {
            const res = await fetch('/api/learning/progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ playbookId: courseId, lessonIndex: lessonIdx, exerciseIndex: exerciseIdx })
            });

            if (res.ok) {
                setCompletedItems(prev => [...prev, itemKey]);
                toast.success("Progress Saved!");
            }
        } catch (error) {
            toast.error("Failed to save exercise progress");
        }
    };

    const handleLessonComplete = async (index: number) => {
        const itemKey = `L${index}`;
        if (completedItems.includes(itemKey)) return;
        
        try {
            const res = await fetch('/api/learning/progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ playbookId: courseId, lessonIndex: index })
            });

            if (res.ok) {
                setCompletedItems(prev => [...prev, itemKey]);
                toast.success("Lesson Completed!");
            }
        } catch (error) {
            console.error("Progress save failed");
        }
    };

    const isLessonMastered = (idx: number) => completedItems.includes(`L${idx}`);
    const isExerciseDone = (lIdx: number, eIdx: number) => completedItems.includes(`L${lIdx}-E${eIdx}`);
    const isEnrolled = completedItems.includes('L-1');

    const handleEnroll = async () => {
        try {
            const res = await fetch('/api/learning/progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ playbookId: courseId, lessonIndex: -1 })
            });

            if (res.ok) {
                setCompletedItems(prev => [...prev, 'L-1']);
                toast.success("Enrolled Successfully!");
            }
        } catch (error) {
            toast.error("Failed to enroll");
        }
    };
    
    // Calculate overall percentage based on total exercises + lessons(?) 
    // User said "act as a percentage of completion also". 
    // Let's count total exercises across all lessons.
    const totalExercises = lessons.reduce((acc, lesson) => acc + (lesson.exercises?.length || 0), 0);
    const completedExercisesCount = completedItems.filter(item => item.includes('-E')).length;
    const overallPercentage = totalExercises > 0 ? Math.round((completedExercisesCount / totalExercises) * 100) : 0;

    const currentLessonExercises = lessons[currentLessonIndex].exercises || [];
    const allCurrentExercisesDone = currentLessonExercises.every((_, idx) => isExerciseDone(currentLessonIndex, idx));

    if (!lessons || lessons.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-black uppercase text-zinc-900 mb-4 tracking-tighter">Sync Error: No Curriculum Found</h1>
                <p className="text-zinc-400 text-sm mb-8 font-mono">This playbook has not been populated with synchronizable lessons yet.</p>
                <Link href="/learning-hub" className="px-8 py-4 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-800 transition-all">
                    Return to Hub
                </Link>
            </div>
        );
    }

    const currentLesson = lessons[currentLessonIndex];

    const getYoutubeId = (url?: string) => {
        if (!url) return null;
        const trimmed = url.trim();
        
        // Handle standard/shorts/embed URLs
        const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
        const match = trimmed.match(regExp);
        if (match && match[1].length === 11) return match[1];

        // Handle bare IDs
        if (trimmed.length === 11 && !trimmed.includes('/') && !trimmed.includes('?')) {
            return trimmed;
        }

        return null;
    };

    const videoId = getYoutubeId(currentLesson.video?.url || currentLesson.videoUrl);

    // Simple helper to render **bold** text
    const renderBold = (text: string) => {
        if (!text) return null;
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-black text-zinc-900">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <div className="flex h-[calc(100vh-64px)] md:h-screen bg-white overflow-hidden">
            {/* Left Sidebar: Curriculum & Progress */}
            {sidebarOpen && (
                <div className="w-80 border-r border-[#F0F0F0] flex flex-col bg-white overflow-hidden animate-in slide-in-from-left duration-300 shrink-0">
                    <div className="p-6 border-b border-[#F0F0F0] shrink-0">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Curriculum</h3>
                            <span className="text-[10px] font-black text-amber-500 bg-amber-50 px-2 py-1 rounded-full">
                                {completedItems.filter(i => !i.includes('-E')).length}/{lessons.length} DONE
                            </span>
                        </div>
                        <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-amber-500 transition-all duration-500" 
                                style={{ width: `${overallPercentage}%` }}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {!isEnrolled ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
                                <Lock className="text-zinc-200" size={48} />
                                <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Curriculum Locked</p>
                                <p className="text-[10px] text-zinc-300 font-medium leading-relaxed">Enroll in this masterclass to unlock synchronized lessons and tracking.</p>
                            </div>
                        ) : (
                            lessons.map((lesson, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentLessonIndex(idx)}
                                    className={`w-full text-left p-4 rounded-2xl transition-all group flex items-start gap-3 ${
                                        currentLessonIndex === idx 
                                            ? 'bg-zinc-900 text-white shadow-xl shadow-zinc-200' 
                                            : 'hover:bg-zinc-50 text-zinc-800'
                                    }`}
                                >
                                    <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center border ${
                                        currentLessonIndex === idx 
                                            ? 'border-white/20' 
                                            : isLessonMastered(idx) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-zinc-200'
                                    }`}>
                                        {isLessonMastered(idx) ? (
                                            <CheckCircle size={12} />
                                        ) : (
                                            <span className="text-[9px] font-black">{idx + 1}</span>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className={`text-[11px] font-black uppercase tracking-tight truncate ${
                                            currentLessonIndex === idx ? 'text-white' : 'text-zinc-800'
                                        }`}>
                                            {lesson.title}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            {(lesson.video?.url || lesson.videoUrl) && <Youtube size={10} className={currentLessonIndex === idx ? 'text-white/60' : 'text-red-400'} />}
                                            <span className={`text-[8px] font-bold uppercase tracking-widest ${
                                                currentLessonIndex === idx ? 'text-white/40' : 'text-zinc-300'
                                            }`}>
                                                {(lesson.video?.url || lesson.videoUrl) ? 'Video Included' : 'Reading Only'}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    <div className="p-4 border-t border-[#F0F0F0]">
                        <div className="p-4 bg-zinc-50 rounded-2xl flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-amber-500">
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-tight">Sync Status</p>
                                <p className="text-[9px] font-mono text-zinc-400">Synced to Day {currentLessonIndex + 1}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Lesson Content */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all bg-[#F7F7F8]`}>
                {/* Lesson Header */}
                <div className="h-16 px-6 border-b border-[#F0F0F0] flex items-center justify-between shrink-0 bg-white z-10">
                    <div className="flex items-center gap-4 min-w-0">
                        <button 
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-400"
                        >
                            <Layout size={20} />
                        </button>
                        <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-0.5">RAVE Masterclass</p>
                            <h2 className="text-[14px] font-black uppercase tracking-tight text-zinc-800 truncate">{title}</h2>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-4 mr-4">
                            <div className="text-right">
                                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-300">Phase Completion</p>
                                <p className="text-[11px] font-black uppercase">{overallPercentage}%</p>
                            </div>
                            <div className="w-32 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: `${overallPercentage}%` }} />
                            </div>
                        </div>
                        <Link href="/learning-hub" className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-400">
                            <Maximize2 size={18} />
                        </Link>
                    </div>
                </div>

                {/* Lesson Display */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-4xl mx-auto space-y-8 pb-20">
                        {!isEnrolled ? (
                            <div className="bg-white shadow-2xl shadow-zinc-200/50 rounded-[40px] p-8 md:p-16 border border-[#EBEBEB] relative overflow-hidden text-center">
                                <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                                    <Sparkles size={300} />
                                </div>
                                
                                <div className="mb-8 flex justify-center">
                                    <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center text-amber-500 shadow-inner">
                                        <BookOpen size={40} />
                                    </div>
                                </div>

                                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-500 mb-4">New Playbook Available</p>
                                <h1 className="text-4xl md:text-6xl font-black text-zinc-900 uppercase tracking-tighter leading-[0.9] mb-8">
                                    {title}
                                </h1>

                                <div className="max-w-2xl mx-auto mb-12">
                                    <p className="text-zinc-500 text-lg leading-relaxed font-medium">
                                        {description || "Master new skills with this synchronized RAVE learning module. Enroll to unlock the curriculum and start your journey."}
                                    </p>
                                </div>

                                <div className="flex flex-col items-center gap-6">
                                    <button 
                                        onClick={handleEnroll}
                                        className="px-12 py-6 bg-zinc-900 text-white rounded-[24px] text-[15px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-2xl shadow-zinc-300 active:scale-95 flex items-center gap-3"
                                    >
                                        Enroll Now <Play size={18} className="fill-white" />
                                    </button>
                                    <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                                        {lessons.length} Synchronized Lessons • Mastery Tracking Enabled
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white shadow-xl shadow-zinc-200/50 rounded-[40px] p-8 md:p-16 border border-[#EBEBEB] relative overflow-hidden">
                            {/* Paper Header */}
                            <div className="flex items-center justify-between mb-12">
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">Synchronized Lesson {currentLessonIndex + 1}</div>
                                {isLessonMastered(currentLessonIndex) && (
                                    <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 animate-in slide-in-from-top-2">
                                        <CheckCircle size={12} /> Mastered
                                    </div>
                                )}
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black text-zinc-900 uppercase tracking-tighter leading-[0.9] mb-12">
                                {currentLesson.title}
                            </h1>

                            {/* Objective */}
                            {currentLesson.objective && (
                                <div className="mb-12 p-8 rounded-3xl bg-zinc-50 border border-zinc-100 italic text-zinc-600 text-[18px] leading-relaxed relative">
                                    <div className="absolute -top-3 left-8 px-3 py-1 bg-white border border-zinc-100 rounded-full text-[9px] font-black uppercase tracking-widest text-zinc-400">Learning Objective</div>
                                    "{renderBold(currentLesson.objective)}"
                                </div>
                            )}


                            {/* Detailed Content (New) */}
                            {currentLesson.detailedContent && currentLesson.detailedContent.length > 0 && (
                                <div className="space-y-12">
                                    {currentLesson.detailedContent.map((section, sIdx) => (
                                        <div key={sIdx} className="space-y-4">
                                            <h3 className="text-2xl font-black uppercase tracking-tighter text-zinc-900">{section.title}</h3>
                                            <div className="text-[17px] text-zinc-600 leading-relaxed font-medium whitespace-pre-wrap">
                                                {renderBold(section.content)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Legacy Content */}
                            {currentLesson.content && (
                                <div className="prose prose-zinc max-w-none">
                                    <div className="text-[17px] text-zinc-600 leading-relaxed space-y-8 font-medium whitespace-pre-wrap">
                                        {renderBold(currentLesson.content)}
                                    </div>
                                </div>
                            )}


                            {/* Video Section */}
                            {videoId ? (
                                <div className="mt-16 space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="h-px bg-zinc-100 flex-1" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Recommended video for the section</span>
                                        <div className="h-px bg-zinc-100 flex-1" />
                                    </div>
                                    <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl bg-zinc-900 relative group border-4 border-zinc-100">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0`}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="w-full h-full"
                                        />
                                        <div className="absolute top-4 left-4 z-20">
                                            <span className="px-4 py-2 bg-black/60 backdrop-blur text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2 border border-white/10">
                                                <Youtube size={14} className="text-red-500" /> Watch & Execute
                                            </span>
                                        </div>
                                        {currentLesson.video?.title && (
                                            <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
                                                <p className="text-white font-black uppercase text-xs tracking-tight">{currentLesson.video.title}</p>
                                                {currentLesson.video.description && <p className="text-white/60 text-[10px] line-clamp-1">{currentLesson.video.description}</p>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-16 aspect-video rounded-3xl bg-zinc-50 border-2 border-dashed border-zinc-100 flex flex-col items-center justify-center text-zinc-300">
                                    <Youtube size={48} className="mb-2 opacity-50" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">Knowledge Module (Reading Only)</p>
                                </div>
                            )}

                            {/* Practical Exercises (New) */}
                            {currentLesson.exercises && currentLesson.exercises.length > 0 && (
                                <div className="mt-16 space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="h-px bg-zinc-100 flex-1" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Practical Missions</span>
                                        <div className="h-px bg-zinc-100 flex-1" />
                                    </div>
                                    {currentLesson.exercises.map((ex, eIdx) => (
                                        <div key={eIdx} className="p-8 rounded-3xl bg-amber-50 border-l-4 border-amber-500">
                                            <h4 className="text-[11px] font-black uppercase tracking-widest text-amber-700 mb-4 flex items-center gap-2">
                                                <Play size={14} className="fill-amber-700" /> {ex.title}
                                            </h4>
                                    {ex.steps.map((step, stIdx) => (
                                        <div key={stIdx} className="flex gap-4 p-4 rounded-2xl bg-white/50 border border-amber-100 group transition-all hover:border-amber-300">
                                            <button 
                                                onClick={() => handleExerciseToggle(currentLessonIndex, eIdx)}
                                                disabled={isExerciseDone(currentLessonIndex, eIdx)}
                                                className={`shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                                    isExerciseDone(currentLessonIndex, eIdx) 
                                                        ? 'bg-amber-500 border-amber-500 text-white' 
                                                        : 'border-amber-200 bg-white hover:border-amber-400'
                                                }`}
                                            >
                                                {isExerciseDone(currentLessonIndex, eIdx) && <CheckCircle size={14} />}
                                            </button>
                                            <p className={`text-[15px] font-bold leading-snug ${isExerciseDone(currentLessonIndex, eIdx) ? 'text-amber-900/50 line-through' : 'text-amber-900'}`}>
                                                {step}
                                            </p>
                                        </div>
                                    ))}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Legacy Exercise */}
                            {currentLesson.exercise && (
                                <div className="mt-12 p-8 rounded-3xl bg-amber-50 border-l-4 border-amber-500">
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-amber-700 mb-3 flex items-center gap-2">
                                        <Play size={14} className="fill-amber-700" /> Practical Mission
                                    </h4>
                                    <p className="text-[16px] font-bold text-amber-900 leading-snug italic">
                                        "{currentLesson.exercise}"
                                    </p>
                                </div>
                            )}

                            {/* Reflection Prompt */}
                            {currentLesson.reflectionPrompt && (
                                <div className="mt-16 p-8 rounded-3xl bg-zinc-900 text-white relative overflow-hidden group">
                                    <Sparkles className="absolute -right-4 -top-4 w-24 h-24 text-white/5 rotate-12 group-hover:scale-110 transition-transform" />
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 mb-4 flex items-center gap-2">
                                        <BookOpen size={14} /> Reflection Journal
                                    </h4>
                                    <p className="text-[18px] font-bold leading-relaxed relative z-10">
                                        "{renderBold(currentLesson.reflectionPrompt)}"
                                    </p>
                                    <p className="mt-4 text-[10px] font-mono text-zinc-500 uppercase">Write 3–5 sentences in your mindset journal.</p>
                                </div>
                            )}

                            <div className="mt-16 pt-10 border-t border-zinc-100 flex flex-col sm:flex-row gap-6 items-center justify-between">
                                <div className="flex flex-col gap-2 w-full sm:w-auto">
                                    <button 
                                        onClick={() => handleLessonComplete(currentLessonIndex)}
                                        disabled={isLessonMastered(currentLessonIndex) || !allCurrentExercisesDone}
                                        className={`px-12 py-5 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all ${
                                            isLessonMastered(currentLessonIndex)
                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default'
                                                : !allCurrentExercisesDone
                                                    ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200'
                                                    : 'bg-zinc-900 text-white hover:bg-zinc-800 active:scale-95 shadow-xl shadow-zinc-200'
                                        }`}
                                    >
                                        {isLessonMastered(currentLessonIndex) ? 'Knowledge Synced' : 'Mark as Mastered'}
                                    </button>
                                    {!allCurrentExercisesDone && !isLessonMastered(currentLessonIndex) && (
                                        <p className="text-[9px] font-black uppercase tracking-widest text-amber-600 animate-pulse text-center sm:text-left">
                                            Complete all exercises first
                                        </p>
                                    )}
                                </div>
                                
                                <div className="flex gap-4 w-full sm:w-auto">
                                    <button 
                                        disabled={currentLessonIndex === 0}
                                        onClick={() => setCurrentLessonIndex(prev => Math.max(0, prev - 1))}
                                        className="flex-1 sm:flex-none p-5 bg-white border border-[#EBEBEB] rounded-2xl text-zinc-400 hover:text-zinc-900 disabled:opacity-30 transition-all"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button 
                                        disabled={currentLessonIndex === lessons.length - 1}
                                        onClick={() => setCurrentLessonIndex(prev => Math.min(lessons.length - 1, prev + 1))}
                                        className="flex-1 sm:flex-none p-5 bg-zinc-900 rounded-2xl text-white hover:bg-zinc-800 active:scale-95 transition-all shadow-xl shadow-zinc-200 disabled:opacity-30"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    </div>
                </div>
            </div>

            {/* Right Sidebar: Tutor AI */}
            <div className="hidden xl:flex w-[400px] border-l border-[#F0F0F0] flex flex-col shrink-0 bg-white shadow-2xl">
                <CopilotInterface 
                    type="tutor"
                    title="Tutor Copilot"
                    description={`Synced to Day ${currentLessonIndex + 1}: ${currentLesson.title}`}
                    initialMessage={`Hi! I'm your Tutor AI for the "${title}" playbook. I can help explain Section ${currentLessonIndex + 1} ("${currentLesson.title}") in simpler terms, give you more examples, or quiz you on the material. What's on your mind?`}
                />
            </div>
        </div>
    );
}

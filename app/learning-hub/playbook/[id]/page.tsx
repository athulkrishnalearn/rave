"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CourseViewer from "@/components/learning/CourseViewer";


export default function PlaybookPage() {
    const params = useParams();
    const id = params?.id as string;
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetch(`/api/learning/playbooks?id=${id}`)
                .then(res => res.json())
                .then(setData)
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) {
        return <div className="min-h-screen bg-white flex items-center justify-center font-mono animate-pulse">SYNCHRONIZING PLAYBOOK DATA...</div>;
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-black uppercase text-zinc-900 mb-4">Sync Error: Playbook Not Found</h1>
                <a href="/learning-hub" className="px-8 py-4 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-800 transition-all">
                    Return to Hub
                </a>
            </div>
        );
    }

    return (
        <CourseViewer 
            courseId={id}
            title={data.title}
            description={data.description}
            lessons={data.lessons}
        />
    );
}

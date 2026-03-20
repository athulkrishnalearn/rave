import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/lib/models/Project';
import { getUserFromRequest } from '@/lib/auth';

// Ensure models are loaded
import '@/lib/models/User';
import '@/lib/models/Post';
import '@/lib/models/Application';

export async function GET(req: Request) {
    try {
        await connectDB();
        const user = getUserFromRequest(req);
        
        if (!user || user.role !== 'og_vendor') {
            return NextResponse.json({ error: 'Unauthorized vendor access' }, { status: 403 });
        }

        const projects = await Project.find({ vendor: user.id })
            .populate('creator', 'name username profileImage email brandName')
            .populate('campaign', 'content.title type')
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ success: true, projects });

    } catch (error) {
        console.error("Collab fetch error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

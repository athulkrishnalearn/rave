import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { requireAuth } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const authResult = await requireAuth(req);
        if (authResult instanceof Response) return authResult;

        await connectDB();
        const { playbookId, lessonIndex, exerciseIndex } = await req.json();
        
        const user = await User.findById((authResult as any).id);
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        if (!user.learningProgress) {
            user.learningProgress = new Map();
        }

        const currentProgress = user.learningProgress.get(playbookId) || [];
        const progressItem = exerciseIndex !== undefined 
            ? `L${lessonIndex}-E${exerciseIndex}` 
            : `L${lessonIndex}`;

        if (!currentProgress.includes(progressItem)) {
            currentProgress.push(progressItem);
            user.learningProgress.set(playbookId, currentProgress);
            user.markModified('learningProgress');
            await user.save();
        }

        return NextResponse.json({ success: true, progress: currentProgress });
    } catch (error: any) {
        console.error('Progress Update Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to update progress' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const authResult = await requireAuth(req);
        if (authResult instanceof Response) return authResult;

        await connectDB();
        const { searchParams } = new URL(req.url);
        const playbookId = searchParams.get('playbookId');

        const user = await User.findById((authResult as any).id);
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        if (playbookId) {
            return NextResponse.json({ progress: user.learningProgress?.get(playbookId) || [] });
        }

        return NextResponse.json({ learningProgress: user.learningProgress || {} });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
    }
}

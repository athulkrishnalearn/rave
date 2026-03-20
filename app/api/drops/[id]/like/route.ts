import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Post from '@/lib/models/Post';
import Notification from '@/lib/models/Notification';
import { getUserFromRequest } from '@/lib/auth';

// POST /api/drops/[id]/like
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await connectDB();

        const authUser = getUserFromRequest(req);
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const post = await Post.findByIdAndUpdate(id, {
            $inc: { 'metrics.likes': 1 }
        }, { new: true }).lean();

        if (!post) {
            return NextResponse.json({ error: 'Drop not found' }, { status: 404 });
        }

        // Create notification for post author (if not liking own post)
        const authorId = (post as any).author?.toString() || (post as any).author;
        if (authorId && authorId !== authUser.id) {
            await Notification.create({
                recipient: authorId,
                sender: authUser.id,
                type: 'like',
                message: 'Someone liked your drop',
                link: `/drop/${id}`,
                read: false,
            }).catch(() => { }); // Non-blocking
        }

        return NextResponse.json({ success: true, likes: (post as any).metrics?.likes });
    } catch (error) {
        console.error('Like error:', error);
        return NextResponse.json({ error: 'Failed to like' }, { status: 500 });
    }
}

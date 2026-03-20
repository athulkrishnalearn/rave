import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Post from '@/lib/models/Post';
import ActivityLog from '@/lib/models/ActivityLog';
import { requireRole } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const authResult = requireRole(req, 'admin');
        if (authResult instanceof Response) return authResult;

        await connectDB();
        const posts = await Post.find({})
            .populate('author', 'name email role')
            .sort({ createdAt: -1 })
            .limit(50);

        return NextResponse.json({ posts });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const authResult = requireRole(req, 'admin');
        if (authResult instanceof Response) return authResult;

        await connectDB();
        const { postId } = await req.json();

        const post = await Post.findByIdAndDelete(postId);
        if (post) {
            await ActivityLog.create({
                adminId: authResult.id,
                targetUserId: post.author,
                action: 'CONTENT_DELETED',
                details: `Moderator deleted Post ID: ${postId}`
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

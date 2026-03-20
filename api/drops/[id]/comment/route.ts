import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Post from '@/lib/models/Post';
import Comment from '@/lib/models/Comment';
import Notification from '@/lib/models/Notification';
import { getUserFromRequest } from '@/lib/auth';

// GET /api/drops/[id]/comment - Fetch comments for a drop
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await connectDB();

        const comments = await Comment.find({ post: id })
            .populate('author', 'name image brandName')
            .sort({ createdAt: 1 })
            .lean();

        return NextResponse.json({ comments });
    } catch (error) {
        console.error('Fetch comments error:', error);
        return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }
}

// POST /api/drops/[id]/comment - Add a new comment
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await connectDB();

        const authUser = getUserFromRequest(req);
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { text } = await req.json();

        if (!text?.trim()) {
            return NextResponse.json({ error: 'Comment text required' }, { status: 400 });
        }

        const post = await Post.findById(id);
        if (!post) {
            return NextResponse.json({ error: 'Drop not found' }, { status: 404 });
        }

        // Create comment
        const comment = await Comment.create({
            post: id,
            author: authUser.id,
            text
        });

        // Increment metrics
        post.metrics.comments += 1;
        await post.save();

        // Populate author for response
        await comment.populate('author', 'name image brandName');

        // Notification logic
        const authorId = post.author?.toString() || post.author;
        if (authorId && authorId !== authUser.id) {
            await Notification.create({
                recipient: authorId,
                sender: authUser.id,
                type: 'comment',
                message: 'Someone commented on your drop',
                link: `/drop/${id}`,
                read: false,
            }).catch(() => { });
        }

        return NextResponse.json({ comment });
    } catch (error) {
        console.error('Comment error:', error);
        return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
    }
}

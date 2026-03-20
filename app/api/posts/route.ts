import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Post from '@/lib/models/Post';
import { getUserFromRequest } from '@/lib/auth';

// GET /api/posts?type=DROP|WORK|CAMPAIGN&tab=requirements|services|trending
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const url = new URL(req.url);
        const type = url.searchParams.get('type');
        const tab = url.searchParams.get('tab');
        const author = url.searchParams.get('author');
        const limit = parseInt(url.searchParams.get('limit') || '50');

        let query: Record<string, any> = {};

        // Filter by author
        if (author) query.author = author;

        // Filter by explicit type
        if (type) query.type = type.toUpperCase();

        // Filter by feed tab
        if (tab) {
            if (tab === 'requirements') query.type = 'CAMPAIGN';
            else if (tab === 'services') query.type = 'WORK';
            else if (tab === 'trending') {
                // Top posts by likes in last 7 days
                query.createdAt = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
            }
        }

        const posts = await Post.find(query)
            .populate('author', 'name image role verified brandName skills username')
            .sort(tab === 'trending' ? { 'metrics.likes': -1 } : { createdAt: -1 })
            .limit(limit)
            .lean();

        return NextResponse.json({ posts });
    } catch (error) {
        console.error('GET /api/posts error:', error);
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}

// POST /api/posts — Create a new drop (requires auth)
export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const authUser = getUserFromRequest(req);
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { type, content, workDetails, campaignDetails, hashtags } = body;

        if (!type || !content?.text) {
            return NextResponse.json({ error: 'type and content.text are required' }, { status: 400 });
        }

        if (!['DROP', 'WORK', 'CAMPAIGN'].includes(type)) {
            return NextResponse.json({ error: 'Invalid post type' }, { status: 400 });
        }

        const post = await Post.create({
            type,
            author: authUser.id,
            content,
            workDetails: workDetails || {},
            campaignDetails: campaignDetails || {},
            hashtags: hashtags || [],
            metrics: { likes: 0, comments: 0, shares: 0 }
        });

        const populated = await post.populate('author', 'name image role verified brandName');

        return NextResponse.json({ success: true, post: populated }, { status: 201 });
    } catch (error) {
        console.error('POST /api/posts error:', error);
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}

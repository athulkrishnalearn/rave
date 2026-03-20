
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Post from '@/lib/models/Post';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await connectDB();

        // Try Post first
        let item = await Post.findById(id)
            .populate('author', 'name image role verified brandName skills username')
            .lean() as any;

        // If not found as a Post, it might be a direct Campaign ID
        if (!item) {
            const Campaign = (await import('@/lib/models/Campaign')).default;
            const User = (await import('@/lib/models/User')).default;
            const campaignData = await Campaign.findById(id).lean() as any;

            if (campaignData) {
                const vendor = await User.findById(campaignData.vendorId).select('name image role verified brandName username').lean();
                item = {
                    _id: campaignData._id.toString(),
                    type: 'CAMPAIGN',
                    author: vendor || { _id: campaignData.vendorId.toString(), name: 'Unknown' },
                    content: { title: campaignData.title, text: campaignData.description },
                    campaignDetails: {
                        budget: campaignData.payAmount,
                        requirements: campaignData.requirements,
                        status: campaignData.status
                    },
                    metrics: { likes: 0, comments: 0, shares: 0 },
                    createdAt: campaignData.createdAt
                };
            }
        }

        if (!item) {
            return NextResponse.json({ error: 'Drop not found', id }, { status: 404 });
        }

        return NextResponse.json({ drop: item, comments: [] });
    } catch (error) {
        console.error('GET /api/drops/[id] error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: (error as Error).message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await connectDB();

        const authUser = getUserFromRequest(req);
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const post = await Post.findById(id);
        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Verify ownership
        if (post.author.toString() !== authUser.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await Post.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: 'Post deleted' });
    } catch (error) {
        console.error('DELETE /api/drops/[id] error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

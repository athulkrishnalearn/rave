import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Post from '@/lib/models/Post';
import Contest from '@/lib/models/Contest';
import { getUserFromRequest } from '@/lib/auth';

// GET /api/feed?tab=foryou|requirements|services|trending
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const url = new URL(req.url);
        const tab = url.searchParams.get('tab') || 'foryou';

        let query: Record<string, any> = {};
        let sortOpts: Record<string, any> = { createdAt: -1 };

        if (tab === 'requirements') {
            query.type = 'CAMPAIGN';
        } else if (tab === 'services') {
            query.type = 'WORK';
        } else if (tab === 'contests') {
            // If contests tab, we return empty posts and handle contests logic below
            query._id = { $exists: false }; 
        } else if (tab === 'trending') {
            query.createdAt = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
            sortOpts = { 'metrics.likes': -1, createdAt: -1 };
        }
        // 'foryou' = all posts, newest first

        // Fetch Posts
        const posts = await Post.find(query)
            .populate('author', 'name image role verified brandName skills')
            .sort(sortOpts)
            .limit(50)
            .lean();

        // Fetch Active Contests (For 'foryou', 'requirements', or 'contests' tabs)
        let contests: any[] = [];
        if (tab === 'foryou' || tab === 'requirements' || tab === 'contests') {
            contests = await Contest.find({ status: 'active_escrow_funded' })
                .populate('companyId', 'name image profileImage role verified brandName')
                .sort({ createdAt: -1 })
                .limit(tab === 'contests' ? 50 : 10)
                .lean();
            
            // Format contests to match Feed item structure minimally
            contests = contests.map((c: any) => ({
                ...c,
                type: 'CONTEST',
                author: c.companyId, // Map companyId to author for feed consistency
            }));
        }

        // Merge and Sort
        let combinedFeed = [...posts, ...contests];
        if (sortOpts.createdAt) {
            combinedFeed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        return NextResponse.json({ feed: combinedFeed });
    } catch (error) {
        console.error('Feed API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import Post from '@/lib/models/Post';
import Project from '@/lib/models/Project';

export async function GET(req: Request, { params }: { params: Promise<{ username: string }> }) {
    try {
        await connectDB();

        const { username } = await params;
        const decodedUsername = decodeURIComponent(username);

        let user: any = null;

        // 1. Try by exact username field
        user = await User.findOne({ username: decodedUsername }).select('-password -verificationCode -verificationCodeExpires').lean();

        // 2. Try by _id
        if (!user) {
            try { user = await User.findById(decodedUsername).select('-password -verificationCode -verificationCodeExpires').lean(); } catch { }
        }

        // 3. Try by name (stripped spaces, case-insensitive)
        if (!user) {
            const all = await User.find({}).select('-password').lean();
            user = all.find((u: any) => u.name?.toLowerCase().replace(/\s+/g, '') === decodedUsername.toLowerCase()) || null;
        }

        // 4. Try by email prefix
        if (!user) {
            user = await User.findOne({ email: new RegExp(`^${decodedUsername}@`, 'i') }).select('-password -verificationCode -verificationCodeExpires').lean();
        }

        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const userId = (user._id as any).toString();

        // ── Stats & Work History ─────────────────────────────────────────────
        const completedProjects = await Project.find({
            $or: [{ creator: userId }, { vendor: userId }],
            status: 'COMPLETED'
        })
        .populate('campaign', 'content type')
        .sort({ updatedAt: -1 })
        .limit(10)
        .lean();

        const completedCount = await Project.countDocuments({
            $or: [{ creator: userId }, { vendor: userId }],
            status: 'COMPLETED'
        });

        // Completed courses from learningProgress map
        const progressMap: Record<string, string[]> = (user.learningProgress as any) || {};
        const completedCoursesCount = Object.values(progressMap)
            .filter(steps => steps && steps.some((s: string) => s.includes('COMPLETE')))
            .length;

        // Features drops (pinned)
        let featuredDrops: any[] = [];
        if (user.featuredDrops?.length) {
            featuredDrops = await Post.find({ _id: { $in: user.featuredDrops } }).lean();
        }

        // Vendor specific logic
        let totalSpend = 0;
        let activeContestsCount = 0;
        let campaignsPostedCount = 0;

        if (user.role === 'og_vendor') {
            const Campaign = (await import('@/lib/models/Campaign')).default;
            
            const spendAgg = await Project.aggregate([
                { $match: { vendor: user._id, status: 'COMPLETED' } },
                { $group: { _id: null, total: { $sum: '$agreedAmount' } } }
            ]);
            totalSpend = spendAgg[0]?.total || 0;

            const modernPosts = await Post.countDocuments({ author: userId, type: 'CAMPAIGN' });
            const legacyCamps = await Campaign.countDocuments({ vendorId: userId });
            campaignsPostedCount = modernPosts + legacyCamps;
            
            // Just approximate active contests as total - completed projects (for display purposes)
            activeContestsCount = Math.max(0, campaignsPostedCount - completedCount);
        }

        // Recent drops for the profile
        const recentDrops = await Post.find({ author: userId })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        // Build work history timeline
        const workHistory = completedProjects.map((p: any) => ({
            type: 'COLLABORATION',
            id: p._id?.toString(),
            title: (p.campaign as any)?.content?.title || 'Collaboration',
            date: p.updatedAt,
            amount: p.amount,
        }));

        return NextResponse.json({
            user,
            stats: {
                followers: user.followers?.length || 0,
                following: user.following?.length || 0,
                drops: recentDrops.length,
                completedCollabs: completedCount,
                completedCourses: completedCoursesCount,
                rating: user.rating || 0,
                
                // Vendor specifics
                totalSpend,
                activeContests: activeContestsCount,
                campaignsPosted: campaignsPostedCount,
                avgResponseTime: "1 hr",
                completionRate: "98%"
            },
            workHistory,
            featuredDrops,
            recentDrops,
        });

    } catch (error) {
        console.error('Profile API error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PATCH – update profile fields (own profile only)
export async function PATCH(req: Request, { params }: { params: Promise<{ username: string }> }) {
    try {
        await connectDB();
        const jwt = await import('jsonwebtoken');
        const JWT_SECRET = process.env.JWT_SECRET || 'rave-secret-key';
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const decoded = jwt.default.verify(authHeader.split(' ')[1], JWT_SECRET) as any;

        const body = await req.json();
        const allowed = ['headline', 'bio', 'location', 'website', 'coverImage', 'socialLinks', 'featuredDrops', 'skills', 'interests'];
        const update: any = {};
        allowed.forEach(k => { if (body[k] !== undefined) update[k] = body[k]; });

        const updated = await User.findByIdAndUpdate(decoded.id, update, { new: true }).select('-password').lean();
        return NextResponse.json({ user: updated });
    } catch (err) {
        console.error('Profile PATCH error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

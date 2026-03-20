import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Application from '@/lib/models/Application';
import Message from '@/lib/models/Message';
import Project from '@/lib/models/Project';
import mongoose from 'mongoose';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        await connectDB();
        const user = getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // 1. Inbox (Messages Received) - for everyone
        const inbox = await Message.find({ recipient: user.id })
            .populate('sender', 'name image')
            .sort({ createdAt: -1 })
            .limit(10);

        // 2. Notifications - for everyone
        const Notification = (await import('@/lib/models/Notification')).default;
        const notifications = await Notification.find({ recipient: user.id })
            .populate('sender', 'name image')
            .sort({ createdAt: -1 })
            .limit(5);

        let data: any = { inbox, notifications };

        if (user.role === 'og_vendor') {
            // VENDOR DASHBOARD DATA
            const Campaign = (await import('@/lib/models/Campaign')).default;
            const Post = (await import('@/lib/models/Post')).default;

            const legacyCampaigns = await Campaign.find({ vendorId: user.id }).lean() as any[];
            const modernPosts = await Post.find({ author: user.id, type: 'CAMPAIGN' }).lean() as any[];

            const allRequirements = [
                ...legacyCampaigns.map(c => ({
                    _id: c._id,
                    title: c.title,
                    status: c.status,
                    createdAt: c.createdAt,
                    type: 'CAMPAIGN',
                    isLegacy: true
                })),
                ...modernPosts.map(p => ({
                    _id: p._id,
                    title: p.content?.title || 'Untitled Post',
                    status: 'active',
                    createdAt: p.createdAt,
                    type: 'CAMPAIGN',
                    isLegacy: false
                }))
            ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            const activeProjectsCount = await Project.countDocuments({ vendor: user.id, status: { $nin: ['COMPLETED', 'CANCELLED'] } });
            const totalSpend = await Project.aggregate([
                { $match: { vendor: new mongoose.Types.ObjectId(user.id), status: 'COMPLETED' } },
                { $group: { _id: null, total: { $sum: '$agreedAmount' } } }
            ]);

            const requirementsWithApps = await Promise.all(allRequirements.map(async (r: any) => {
                const appCount = await Application.countDocuments({ campaign: r._id });
                const recentApps = await Application.find({ campaign: r._id })
                    .populate('applicant', 'name image username')
                    .sort({ createdAt: -1 })
                    .limit(3);

                return { ...r, appCount, recentApps };
            }));

            // Calculate pending applications across all active campaigns
            const pendingAppsCount = await Application.countDocuments({ 
                campaign: { $in: allRequirements.map(r => r._id) },
                status: 'PENDING'
            });

            // Action required mock/logic
            const actionRequired = [];
            if (pendingAppsCount > 0) actionRequired.push({ id: 1, text: `${pendingAppsCount} new applicants await your review`, link: '/applications', type: 'applicants' });

            const pendingReviewCount = await Project.countDocuments({ vendor: user.id, status: 'SUBMITTED' });
            if (pendingReviewCount > 0) actionRequired.push({ id: 2, text: `${pendingReviewCount} deliverables await your approval`, link: '/collaborations', type: 'review' });

            // Get actual user record for OG Score
            const User = (await import('@/lib/models/User')).default;
            const userRecord = await User.findById(user.id).select('rating').lean() as any;

            data.campaigns = requirementsWithApps;
            data.stats = {
                activeProjects: activeProjectsCount,
                totalSpend: totalSpend[0]?.total || 0,
                campaignCount: allRequirements.length,
                pendingApplicants: pendingAppsCount,
                ogScore: userRecord?.rating || 0,
                avgResponseTime: "2 hours" // mocked for now
            };
            data.actionRequired = actionRequired;

        } else {
            // RAVE HEAD DASHBOARD DATA
            const myApplications = await Application.find({ applicant: user.id })
                .sort({ createdAt: -1 })
                .limit(10)
                .lean() as any[];

            const Post = (await import('@/lib/models/Post')).default;
            const Campaign = (await import('@/lib/models/Campaign')).default;

            const appsWithProjects = await Promise.all(myApplications.map(async (app: any) => {
                let project = await Project.findOne({ application: app._id }).select('_id status');

                // Manually fetch campaign/post details because populate might fail due to multiple models
                let campaignDetails: any = await Campaign.findById(app.campaign).select('title status type payAmount').lean();
                if (!campaignDetails) {
                    const post = await Post.findById(app.campaign).select('content type campaignDetails').lean() as any;
                    if (post) {
                        campaignDetails = {
                            _id: post._id,
                            title: post.content?.title || 'Untitled',
                            status: 'active',
                            type: post.type,
                            payAmount: post.campaignDetails?.budget || 0
                        };
                    }
                }

                return { ...app, project, campaign: campaignDetails };
            }));

            const activeProjectsCount = await Project.countDocuments({ creator: user.id, status: { $nin: ['COMPLETED', 'CANCELLED'] } });
            const totalEarnings = await Project.aggregate([
                { $match: { creator: new mongoose.Types.ObjectId(user.id), status: 'COMPLETED' } },
                { $group: { _id: null, total: { $sum: '$agreedAmount' } } }
            ]);

            data.applications = appsWithProjects;
            data.stats = {
                activeProjects: activeProjectsCount,
                totalEarnings: totalEarnings[0]?.total || 0,
                applicationCount: myApplications.length
            };
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error('Dashboard API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

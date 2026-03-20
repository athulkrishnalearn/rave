import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Application from '@/lib/models/Application';
import Post from '@/lib/models/Post';
import { getUserFromRequest } from '@/lib/auth';

// POST /api/collaborate — Submit a collaboration proposal
export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const authUser = getUserFromRequest(req);
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized — please log in' }, { status: 401 });
        }

        const { dropId, proposal, timeline, budget } = await req.json();

        if (!dropId || !proposal?.trim()) {
            return NextResponse.json({ error: 'dropId and proposal are required' }, { status: 400 });
        }

        // Check drop exists
        const post = await Post.findById(dropId);
        if (!post) {
            return NextResponse.json({ error: 'Drop not found' }, { status: 404 });
        }

        if (!['CAMPAIGN', 'WORK'].includes(post.type)) {
            return NextResponse.json({ error: 'Can only collaborate on Campaign or Work drops' }, { status: 400 });
        }

        // Prevent duplicate applications
        const existing = await Application.findOne({
            campaign: dropId,
            applicant: authUser.id
        });
        if (existing) {
            return NextResponse.json({ error: 'You have already applied/requested for this drop' }, { status: 409 });
        }

        const application = await Application.create({
            campaign: dropId,
            applicant: authUser.id,
            coverLetter: proposal,
            quote: parseFloat(String(budget || '0').replace(/[^0-9.]/g, '')) || 0,
            timeline: parseInt(String(timeline || '7').replace(/[^0-9]/g, '')) || 7,
            status: 'PENDING',
        });

        // Create notification for post author
        try {
            const Notification = (await import('@/lib/models/Notification')).default;
            const isWork = post.type === 'WORK';
            await Notification.create({
                recipient: post.author,
                sender: authUser.id,
                type: 'collaborate',
                message: isWork
                    ? `New hire request for "${post.content?.title || 'your work'}"`
                    : `New collaboration proposal for "${post.content?.title || 'your drop'}"`,
                link: `/applicants/${dropId}`
            });
        } catch (nErr) {
            console.error('Notif error:', nErr);
        }

        return NextResponse.json({
            success: true,
            application,
            message: 'Proposal submitted successfully'
        }, { status: 201 });

    } catch (error: any) {
        if (error?.code === 11000) {
            return NextResponse.json({ error: 'You have already applied to this drop' }, { status: 409 });
        }
        console.error('Collaborate POST error:', error);
        return NextResponse.json({ error: 'Failed to submit proposal' }, { status: 500 });
    }
}

// GET /api/collaborate — Get collaborations for the current user
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const authUser = getUserFromRequest(req);
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const applications = await Application.find({ applicant: authUser.id })
            .populate('campaign', 'content type campaignDetails')
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ collaborations: applications });
    } catch (error) {
        console.error('Collaborate GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch collaborations' }, { status: 500 });
    }
}

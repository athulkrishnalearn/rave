import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/lib/models/Project';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'rave-secret-key';

async function getUserFromToken(req: Request) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    try { return jwt.verify(token, JWT_SECRET) as any; } catch (e) { return null; }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const user = await getUserFromToken(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const project = await Project.findById(id)
            .populate('vendor', 'name image brandName')
            .populate('creator', 'name image')
            .lean() as any;

        if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        // Manually fetch requirement details
        const Campaign = (await import('@/lib/models/Campaign')).default;
        const Post = (await import('@/lib/models/Post')).default;

        let requirement = await Campaign.findById(project.campaign).select('title description requirements').lean();
        if (!requirement) {
            const post = await Post.findById(project.campaign).select('content type campaignDetails').lean() as any;
            if (post) {
                requirement = {
                    title: post.content?.title || 'Untitled',
                    description: post.content?.text || '',
                    requirements: post.campaignDetails?.requirements || []
                } as any;
            }
        }

        project.campaign = requirement || { title: 'Untitled Requirement', description: '' };

        return NextResponse.json({ project });
    } catch (error) {
        console.error('Project Detail Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Handle Actions (Submit Work, Release Pay)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const user = await getUserFromToken(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const { action, payload } = await req.json(); // action: 'SUBMIT' | 'PAY'
        const project = await Project.findById(id);
        if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        if (action === 'FUND_ESCROW') {
            if (project.vendor.toString() !== user.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
            if (project.status !== 'AWAITING_FUNDS') return NextResponse.json({ error: 'Invalid state' }, { status: 400 });
            
            project.paymentStatus = 'HELD';
            project.status = 'ACTIVE';
            await project.save();

            // Create notification for creator
            try {
                const Notification = (await import('@/lib/models/Notification')).default;
                await Notification.create({
                    recipient: project.creator,
                    sender: user.id,
                    type: 'project_started',
                    message: "Escrow funded. You can now begin work.",
                    link: `/project/${id}`
                });
            } catch (ne) {
                console.error('Notification error on FUND_ESCROW:', ne);
            }
        }
        else if (action === 'SUBMIT') {
            // Creator logic
            project.submissionUrl = payload.url;
            project.submissionNote = payload.note;
            project.status = 'SUBMITTED';
            await project.save();

            // Create notification for vendor
            try {
                const Notification = (await import('@/lib/models/Notification')).default;
                await Notification.create({
                    recipient: project.vendor,
                    sender: user.id,
                    type: 'delivery',
                    message: "Work has been delivered for review",
                    link: `/project/${id}`
                });
            } catch (ne) {
                console.error('Notification error on SUBMIT:', ne);
            }

        }
        else if (action === 'PAY') {
            // Vendor logic
            if (project.vendor.toString() !== user.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
            project.paymentStatus = 'RELEASED';
            project.status = 'COMPLETED';
            await project.save();

            // Generate Creator Invoice (Net Payout)
            try {
                const { InvoiceService } = await import('@/lib/services/InvoiceService');
                await InvoiceService.generateCreatorInvoice(project._id.toString());
            } catch (ie) {
                console.error('Creator invoice generation error:', ie);
            }

            // Create notification for creator
            try {
                const Notification = (await import('@/lib/models/Notification')).default;
                await Notification.create({
                    recipient: project.creator,
                    sender: user.id,
                    type: 'complete',
                    message: "Project completed and payment released",
                    link: `/project/${id}`
                });
            } catch (ne) {
                console.error('Notification error on PAY:', ne);
            }
        }

        return NextResponse.json({ success: true, project });

    } catch (error) {
        console.error('Project Action Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/lib/models/Project';
import Application from '@/lib/models/Application';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'rave-secret-key';

async function getUserFromToken(req: Request) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    try { return jwt.verify(token, JWT_SECRET) as any; } catch (e) { return null; }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const user = await getUserFromToken(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { applicationId } = await req.json();

        // 1. Get Application
        const application = await Application.findById(applicationId);
        if (!application) return NextResponse.json({ error: 'Application not found' }, { status: 404 });

        // 2. Fetch Post to determine roles and ownership
        const Post = (await import('@/lib/models/Post')).default;
        const post = await Post.findById(application.campaign);
        if (!post || post.author.toString() !== user.id) {
            return NextResponse.json({ error: 'Only the author of the drop can accept requests.' }, { status: 403 });
        }

        // 3. Assign Vendor (Payer) and Creator (Payee)
        const isWorkDrop = post.type === 'WORK';
        const vendorId = isWorkDrop ? application.applicant : user.id;
        const creatorId = isWorkDrop ? user.id : application.applicant;

        // 4. Fetch Settings for Commission
        const SystemSettings = (await import('@/lib/models/SystemSettings')).default;
        const settings = await SystemSettings.findOne() || { commissionRate: 0.20 };

        // 5. Calculate Monetary Fields
        const dealAmount = application.quote;
        const platformFee = dealAmount * settings.commissionRate;
        const taxAmount = platformFee * 0.18; // 18% GST on fee
        const netAmount = dealAmount - platformFee;

        // 6. Create Project (AWAITING_FUNDS state)
        const project = await Project.create({
            campaign: application.campaign,
            vendor: vendorId,
            creator: creatorId,
            application: applicationId,
            dealAmount,
            platformFee,
            taxAmount,
            netAmount,
            status: 'AWAITING_FUNDS',
            paymentStatus: 'PENDING'
        });

        // 5. Generate Platform Invoice (RAVE Fee + GST)
        try {
            const { InvoiceService } = await import('@/lib/services/InvoiceService');
            await InvoiceService.generatePlatformInvoice(project._id.toString());
        } catch (e) {
            console.error('Invoice generation error:', e);
        }

        // 6. Update Application Status
        application.status = 'ACCEPTED';
        await application.save();

        // Create notification for creator
        try {
            const Notification = (await import('@/lib/models/Notification')).default;
            await Notification.create({
                recipient: application.applicant,
                sender: user.id,
                type: 'accept',
                message: `Your collaboration proposal was accepted!`,
                link: `/project/${project._id}`
            });
        } catch (e) {
            console.error('Notif error:', e);
        }

        return NextResponse.json({ success: true, project });

    } catch (error) {
        console.error('Init Project Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: (error as Error).message }, { status: 500 });
    }
}

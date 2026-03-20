import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Application from '@/lib/models/Application';
import Campaign from '@/lib/models/Campaign';
import User from '@/lib/models/User'; // Ensure User model is registered
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'rave-secret-key';

// Helper to get user from token
async function getUserFromToken(req: Request) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        return decoded;
    } catch (e) {
        return null;
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const user = await getUserFromToken(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();

        // Basic validation
        if (!body.campaignId || !body.coverLetter || !body.quote) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const application = await Application.create({
            applicant: user.id,
            campaign: body.campaignId,
            coverLetter: body.coverLetter,
            quote: body.quote,
            timeline: body.timeline || 7,
            status: 'PENDING'
        });

        return NextResponse.json({ success: true, application });

    } catch (error: any) {
        console.error('Application Error:', error);
        if (error.code === 11000) {
            return NextResponse.json({ error: 'You have already applied to this campaign' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// GET: Fetch applications for a campaign (Vendor) OR user's applications
export async function GET(req: Request) {
    try {
        await connectDB();
        const user = await getUserFromToken(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const campaignId = searchParams.get('campaignId');

        // IF User is Vendor requesting apps for their campaign
        if (campaignId) {
            const campaign = await Campaign.findById(campaignId);
            if (!campaign) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });

            // Check if user owns the campaign
            if (campaign.vendorId.toString() !== user.id) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
            }

            const applications = await Application.find({ campaign: campaignId })
                .populate('applicant', 'name email image skills')
                .sort({ createdAt: -1 });

            return NextResponse.json({ applications });
        }

        // ELSE Return User's own applications
        const myApplications = await Application.find({ applicant: user.id })
            .populate('campaign', 'title vendorId type')
            .sort({ createdAt: -1 });

        return NextResponse.json({ applications: myApplications });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

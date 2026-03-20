import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Campaign from '@/lib/models/Campaign';
import User from '@/lib/models/User';
import Post from '@/lib/models/Post';
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
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Verify User Status
        const dbUser = await User.findById(user.id);
        if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        if (dbUser.role !== 'og_vendor') {
            return NextResponse.json({ error: 'Only vendors can create campaigns' }, { status: 403 });
        }

        if (dbUser.verificationStatus !== 'verified') {
            return NextResponse.json({ error: 'Account pending verification. Please wait for admin approval.' }, { status: 403 });
        }

        const body = await req.json();

        // Basic validation
        if (!body.title || !body.payAmount) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const campaign = await Campaign.create({
            title: body.title,
            description: body.description,
            vendorId: user.id,
            payAmount: body.payAmount,
            requirements: body.requirements || [],
            type: body.type || 'CREATOR',
            status: 'active'
        });

        // Add to Feed (Post collection)
        await Post.create({
            type: 'CAMPAIGN',
            author: user.id,
            content: {
                title: body.title,
                text: body.description,
            },
            campaignDetails: {
                requirements: body.requirements || [],
                budget: body.payAmount,
                status: 'active'
            },
            campaignRef: campaign._id,
            metrics: { likes: 0, comments: 0, shares: 0 }
        });

        return NextResponse.json({ success: true, campaign });

    } catch (error) {
        console.error('Campaign Create Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
export async function GET(req: Request) {
    try {
        await connectDB();
        const user = await getUserFromToken(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const legacyCampaigns = await Campaign.find({ vendorId: user.id }).lean();
        const modernPosts = await Post.find({ author: user.id, type: 'CAMPAIGN' }).lean();

        // Standardize the list for the dropdown
        const allCampaigns = [
            ...legacyCampaigns.map((c: any) => ({
                _id: c._id,
                title: c.title,
                isLegacy: true
            })),
            ...modernPosts.map((p: any) => ({
                _id: p._id,
                title: p.content?.title || 'Untitled Campaign',
                isLegacy: false
            }))
        ];

        return NextResponse.json({ success: true, campaigns: allCampaigns });

    } catch (error) {
        console.error('Campaign List Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

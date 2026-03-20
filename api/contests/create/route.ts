import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Contest from '@/lib/models/Contest';
import Campaign from '@/lib/models/Campaign';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'rave-secret-key';

export async function POST(req: Request) {
    try {
        await connectDB();

        // Standard auth check
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        let decoded: any;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // Only companies (og_vendor) can create contests
        if (decoded.role !== 'og_vendor') {
            return NextResponse.json({ error: 'Forbidden: Only companies can create contests' }, { status: 403 });
        }

        const body = await req.json();
        const { campaignId, title, description, prizePool, prizes, deadline, rules, tags, judgingType } = body;

        // 1. Validation
        if (!campaignId || !title || !description || prizePool === undefined || !prizes || !deadline) {
            return NextResponse.json({ error: 'Missing required contest fields' }, { status: 400 });
        }

        // 2. Validate Campaign Ownership (Check both Legacy Campaign and Modern Post)
        let campaign = await Campaign.findById(campaignId);
        let ownerId: string | undefined;

        if (campaign) {
            ownerId = campaign.vendorId.toString();
        } else {
            const Post = (await import('@/lib/models/Post')).default;
            const postCampaign = await Post.findOne({ _id: campaignId, type: 'CAMPAIGN' });
            if (postCampaign) {
                ownerId = postCampaign.author.toString();
            }
        }

        if (!ownerId) {
            return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
        }

        if (ownerId !== decoded.id) {
            return NextResponse.json({ error: 'Forbidden: You do not own this campaign' }, { status: 403 });
        }

        // 3. Mathematical check on prize pool
        const calculatedTotal = prizes.reduce((sum: number, p: any) => sum + Number(p.amount), 0);
        if (calculatedTotal !== Number(prizePool)) {
            return NextResponse.json({
                error: `Prize distribution sum (${calculatedTotal}) does not match total prize pool (${prizePool})`
            }, { status: 400 });
        }

        // 4. Create Draft Contest
        const newContest = await Contest.create({
            companyId: decoded.id,
            campaignId,
            title,
            description,
            prizePool,
            prizes,
            deadline: new Date(deadline),
            status: 'draft', // Requires funding to become active
            rules: rules || { maxSubmissionsPerUser: 1, allowedFileTypes: [] },
            tags: tags || [],
            judgingType: judgingType || 'community_hybrid'
        });

        return NextResponse.json({ success: true, contest: newContest }, { status: 201 });
    } catch (error) {
        console.error('Contest Creation Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Contest from '@/lib/models/Contest';
import Campaign from '@/lib/models/Campaign';
import User from '@/lib/models/User';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;

        let contest = await Contest.findById(id)
            .populate({
                path: 'companyId',
                select: 'name brandName profileImage isVerified'
            })
            .populate({
                path: 'campaignId',
                select: 'title description requirements budget timeframe'
            }).lean();

        if (!contest) {
            return NextResponse.json({ error: 'Contest not found' }, { status: 404 });
        }

        // Fallback: If campaignId failed to populate (because it's a Post), fetch it manually
        if (!contest.campaignId || (typeof contest.campaignId === 'object' && Object.keys(contest.campaignId).length === 1 && '_id' in (contest.campaignId as any))) {
             // In some cases lean() might leave the ID or an empty object if populate fails
             const Campaign = (await import('@/lib/models/Campaign')).default;
             const Post = (await import('@/lib/models/Post')).default;
             
             // Extract ID (it might be the ID string or the ID in an object)
             const campId = (contest as any).campaignId?._id || (contest as any).campaignId;

             if (campId) {
                 const postCampaign = await Post.findOne({ _id: campId, type: 'CAMPAIGN' }).lean();
                 if (postCampaign) {
                     contest.campaignId = {
                         _id: postCampaign._id,
                         title: postCampaign.content?.title,
                         description: postCampaign.content?.text,
                         requirements: postCampaign.campaignDetails?.requirements,
                         budget: postCampaign.campaignDetails?.budget,
                         timeframe: '' // Posts don't have a direct timeframe field usually
                     } as any;
                 }
             }
        }

        return NextResponse.json({ success: true, contest }, { status: 200 });

    } catch (error) {
        console.error('Fetch Contest Details Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

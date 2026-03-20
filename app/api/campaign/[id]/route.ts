import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Campaign from '@/lib/models/Campaign';
import User from '@/lib/models/User';
import Post from '@/lib/models/Post';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        let finalCampaign: any = null;
        let finalVendor: any = null;

        const campaign = await Campaign.findById(id).lean();
        
        if (campaign) {
            finalCampaign = campaign;
            finalVendor = await User.findById(campaign.vendorId).select('name brandName username profileImage verificationStatus').lean();
        } else {
            // FALLBACK: Check Post collection
            const post = await Post.findOne({ _id: id, type: 'CAMPAIGN' })
                .populate('author', 'name brandName username profileImage verificationStatus')
                .lean();

            if (post) {
                // Map Post fields to Campaign shape for frontend compatibility
                finalCampaign = {
                    _id: post._id,
                    title: post.content.title || 'Untitled Campaign',
                    description: post.content.text,
                    requirements: post.campaignDetails?.requirements || [],
                    payAmount: post.campaignDetails?.budget || '0',
                    type: 'CREATOR', // Default for signals
                    status: post.campaignDetails?.status || 'active',
                    createdAt: post.createdAt,
                    updatedAt: post.updatedAt
                };
                finalVendor = post.author;
            }
        }

        if (!finalCampaign) {
            return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
        }

        // Fetch similar campaigns (fallback to empty if none found)
        const similar = await Campaign.find({ _id: { $ne: id }, status: 'active' }).limit(2).lean();

        // Find the associated Post ID for collaborate links (if it was a traditional campaign)
        const associatedPost = finalCampaign.type === 'CREATOR' && !campaign 
            ? { _id: finalCampaign._id } 
            : await Post.findOne({ campaignRef: id }).select('_id').lean();

        return NextResponse.json({ 
            campaign: finalCampaign, 
            vendor: finalVendor, 
            similar, 
            postId: associatedPost?._id?.toString() ?? null 
        });

    } catch (error) {
        console.error('Campaign Get Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

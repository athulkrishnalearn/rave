import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import Post from '@/lib/models/Post';
import Project from '@/lib/models/Project';
import Dispute from '@/lib/models/Dispute';
import { requireRole } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const authResult = requireRole(req, 'admin');
        if (authResult instanceof Response) return authResult;

        await connectDB();

        // 1. User Stats
        const totalUsers = await User.countDocuments();
        const pendingVerifications = await User.countDocuments({ verificationStatus: 'pending' });
        const verifiedUsers = await User.countDocuments({ verified: true });

        // 2. Content Stats
        const totalDrops = await Post.countDocuments();
        const activeCampaigns = await Post.countDocuments({ type: 'CAMPAIGN', 'campaignDetails.status': 'active' });

        // 3. Financial & Project Aggregations
        const projectAggregation = await Project.aggregate([
            {
                $group: {
                    _id: null,
                    totalVolume: { $sum: "$agreedAmount" },
                    settledVolume: {
                        $sum: {
                            $cond: [{ $eq: ["$paymentStatus", "RELEASED"] }, "$agreedAmount", 0]
                        }
                    },
                    totalProjects: { $sum: 1 },
                    completedProjects: {
                        $sum: {
                            $cond: [{ $in: ["$status", ["COMPLETED"]] }, 1, 0]
                        }
                    }
                }
            }
        ]);

        const projectStats = projectAggregation[0] || {
            totalVolume: 0,
            settledVolume: 0,
            totalProjects: 0,
            completedProjects: 0
        };

        const openDisputes = await Dispute.countDocuments({ status: 'open' });

        return NextResponse.json({
            stats: {
                totalUsers,
                verifiedUsers,
                pendingVerifications,
                totalDrops,
                activeCampaigns,
                totalEscrowVolume: projectStats.totalVolume,
                settledVolume: projectStats.settledVolume,
                totalProjects: projectStats.totalProjects,
                completedProjects: projectStats.completedProjects,
                openDisputes
            }
        });

    } catch (error) {
        console.error('Admin Stats Error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

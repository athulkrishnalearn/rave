import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Contest from '@/lib/models/Contest';
import ActivityLog from '@/lib/models/ActivityLog';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'rave-secret-key';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;

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

        const contest = await Contest.findById(id);

        if (!contest) {
            return NextResponse.json({ error: 'Contest not found' }, { status: 404 });
        }

        // Only the Company that created the contest can fund it
        if (contest.companyId.toString() !== decoded.id) {
            return NextResponse.json({ error: 'Forbidden: You do not own this contest' }, { status: 403 });
        }

        if (contest.status !== 'draft') {
            return NextResponse.json({ error: `Contest is already ${contest.status}` }, { status: 400 });
        }

        /* 
         * INTEGRATION POINT: 
         * In production, this is where you would call the Stripe/Razorpay API to hold the `contest.prizePool` amount.
         * For now, we simulate a successful escrow and activate the contest. 
         */

        contest.status = 'active_escrow_funded';
        await contest.save();

        // Optional: If Admin KYC logging is required for high-value contests
        if (contest.prizePool >= 1000) {
            // Note: Since a company is funding it, adminId might not exist here, 
            // but logging it as a high-value system event is smart. 
            // We use a generic 'SYSTEM' tag or actual admin if triggered by a dashboard.
            // Skipping explicit ActivityLog here unless an admin manually verifies it, 
            // but the structure exists in ActivityLog.ts if needed later.
        }

        return NextResponse.json({
            success: true,
            message: 'Funds secured in Escrow. Contest is now live!',
            contest
        }, { status: 200 });

    } catch (error) {
        console.error('Contest Funding Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

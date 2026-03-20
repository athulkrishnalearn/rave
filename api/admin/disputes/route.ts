import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Dispute from '@/lib/models/Dispute';
import { requireRole } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const authResult = requireRole(req, 'admin');
        if (authResult instanceof Response) return authResult;

        await connectDB();
        const disputes = await Dispute.find({})
            .populate('project')
            .populate('raisedBy', 'name brandName email')
            .sort({ createdAt: -1 });

        return NextResponse.json({ disputes });
    } catch (error) {
        console.error('Admin Disputes GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch disputes' }, { status: 500 });
    }
}

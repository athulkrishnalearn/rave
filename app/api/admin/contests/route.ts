import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Contest from '@/lib/models/Contest';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
    try {
        await connectDB();

        // 1. Authenticate Admin
        const authHeader = req.headers.get('authorization');
        let token = authHeader?.split(' ')[1];

        if (!token) {
            const cookieStore = await cookies();
            token = cookieStore.get('token')?.value;
        }

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
        const user = await User.findById(decoded.id);

        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 });
        }

        // 2. Fetch all contests across the platform
        const searchParams = new URL(req.url).searchParams;
        const status = searchParams.get('status');

        const query: any = {};
        if (status && status !== 'all') {
            query.status = status;
        }

        const contests = await Contest.find(query)
            .sort({ createdAt: -1 })
            .populate('companyId', 'name brandName profileImage')
            .populate('campaignId', 'title');

        // Calculate quick stats
        const stats = {
            totalContests: await Contest.countDocuments(),
            activeContests: await Contest.countDocuments({ status: 'active_escrow_funded' }),
            totalEscrowLocked: await Contest.aggregate([
                { $match: { status: 'active_escrow_funded' } },
                { $group: { _id: null, total: { $sum: "$prizePool" } } }
            ]).then((res: any[]) => res[0]?.total || 0),
        };

        return NextResponse.json({ success: true, contests, stats });

    } catch (error: any) {
        console.error('Admin Contests API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Contest from '@/lib/models/Contest';
import Campaign from '@/lib/models/Campaign';
import User from '@/lib/models/User';

export async function GET(req: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const tag = searchParams.get('tag');
        const sort = searchParams.get('sort') || 'newest'; // newest, prize_high, ending_soon

        // Base query: Only show funded/active contests to the public
        const query: any = {
            status: { $in: ['active_escrow_funded', 'judging'] }
        };

        if (tag) {
            query.tags = tag;
        }

        let sortOption: any = { createdAt: -1 };
        if (sort === 'prize_high') {
            sortOption = { prizePool: -1 };
        } else if (sort === 'ending_soon') {
            sortOption = { deadline: 1 };
        }

        const contests = await Contest.find(query)
            .populate({ path: 'companyId', select: 'name brandName profileImage' })
            .populate({ path: 'campaignId', select: 'title' })
            .sort(sortOption)
            .limit(50); // Pagination could be added here

        return NextResponse.json({ success: true, contests }, { status: 200 });

    } catch (error) {
        console.error('Fetch Public Contests Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

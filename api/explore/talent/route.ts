import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

export async function GET(req: Request) {
    try {
        await connectDB();
        const url = new URL(req.url);
        const search = url.searchParams.get('q') || '';
        const limitStr = url.searchParams.get('limit') || '20';
        const limit = parseInt(limitStr, 10);
        
        let query: any = { role: { $ne: 'admin' }, isPro: { $exists: true } }; // Basic filter to avoid showing admins

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { username: { $regex: search, $options: 'i' } },
                { headline: { $regex: search, $options: 'i' } },
                { skills: { $in: [new RegExp(search, 'i')] } },
            ];
        }

        // Just fetch raving talent, leaning heavily towards PRO users and those with high ratings
        const talents = await User.find(query)
            .select('name username profileImage headline location rating skills isPro hourlyRate drops followers verificationStatus')
            .sort({ isPro: -1, rating: -1, followers: -1 }) // Prioritize PRO, then rating, then followers
            .limit(limit)
            .lean();

        return NextResponse.json({ success: true, talents });
    } catch (error) {
        console.error("Talent fetch error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch talent pool" }, { status: 500 });
    }
}

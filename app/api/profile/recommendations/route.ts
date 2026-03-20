import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import jwt from 'jsonwebtoken';
import Recommendation from '@/lib/models/Recommendation';
import User from '@/lib/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'rave-secret-key';

function getUser(req: Request) {
    const auth = req.headers.get('authorization');
    if (!auth?.startsWith('Bearer ')) return null;
    try { return jwt.verify(auth.split(' ')[1], JWT_SECRET) as any; } catch { return null; }
}

// GET /api/profile/recommendations?userId=xxx
export async function GET(req: Request) {
    await connectDB();
    const userId = new URL(req.url).searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });
    const items = await Recommendation.find({ toUserId: userId, isVisible: true }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ recommendations: items });
}

// POST – write a recommendation for another user
export async function POST(req: Request) {
    await connectDB();
    const decoded = getUser(req);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    // Fetch recommender's profile info
    const fromUser = await User.findById(decoded.id).select('name headline profileImage image').lean() as any;
    const rec = await Recommendation.create({
        toUserId: body.toUserId,
        fromUserId: decoded.id,
        fromName: fromUser?.name || 'Anonymous',
        fromHeadline: fromUser?.headline || '',
        fromImage: fromUser?.profileImage || fromUser?.image || '',
        relationship: body.relationship,
        body: body.body,
    });
    return NextResponse.json({ recommendation: rec }, { status: 201 });
}

// PATCH – toggle visibility (toUser only)
export async function PATCH(req: Request) {
    await connectDB();
    const decoded = getUser(req);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id, isVisible } = await req.json();
    const rec = await Recommendation.findOneAndUpdate(
        { _id: id, toUserId: decoded.id },
        { isVisible },
        { new: true }
    );
    if (!rec) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ recommendation: rec });
}

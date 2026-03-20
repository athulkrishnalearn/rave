import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import Recommendation from '@/lib/models/Recommendation';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'rave-secret-key';

async function resolveUser(usernameParam: string) {
    const decodedUsername = decodeURIComponent(usernameParam);
    let user: any = null;
    user = await User.findOne({ username: decodedUsername }).select('_id name').lean();
    if (!user) {
        try { user = await User.findById(decodedUsername).select('_id name').lean(); } catch { }
    }
    if (!user) {
        const all = await User.find({}).select('_id name').lean();
        user = all.find((u: any) => u.name?.toLowerCase().replace(/\s+/g, '') === decodedUsername.toLowerCase()) || null;
    }
    if (!user) {
        user = await User.findOne({ email: new RegExp(`^${decodedUsername}@`, 'i') }).select('_id name').lean();
    }
    return user;
}

export async function GET(req: Request, { params }: { params: Promise<{ username: string }> }) {
    try {
        await connectDB();
        const { username } = await params;
        const profileUser = await resolveUser(username);
        
        if (!profileUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        let isOwner = false;
        try {
            const authHeader = req.headers.get('authorization');
            if (authHeader?.startsWith('Bearer ')) {
                const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET) as any;
                if (decoded.id === profileUser._id.toString()) isOwner = true;
            }
        } catch {}

        const query: any = { toUserId: profileUser._id };
        if (!isOwner) query.isVisible = true;

        const recommendations = await Recommendation.find(query).sort({ createdAt: -1 }).lean();
        return NextResponse.json({ recommendations });
    } catch (error) {
        console.error('Recommendation GET error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: Promise<{ username: string }> }) {
    try {
        await connectDB();
        
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET) as any;
        const fromUserId = decoded.id;
        
        const { username } = await params;
        const profileUser = await resolveUser(username);
        
        if (!profileUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });
        
        if (profileUser._id.toString() === fromUserId) {
            return NextResponse.json({ error: 'Cannot recommend yourself' }, { status: 400 });
        }

        const fromUser = await User.findById(fromUserId).select('name headline profileImage').lean();
        if (!fromUser) return NextResponse.json({ error: 'Recommender not found' }, { status: 404 });

        const body = await req.json();
        
        const newRecommendation = await Recommendation.create({
            toUserId: profileUser._id,
            fromUserId,
            fromName: fromUser.name,
            fromHeadline: fromUser.headline,
            fromImage: fromUser.profileImage,
            relationship: body.relationship,
            body: body.body,
            isVisible: true // Default visible
        });

        return NextResponse.json({ recommendation: newRecommendation }, { status: 201 });
    } catch (error) {
        console.error('Recommendation POST error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

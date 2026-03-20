import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import Experience from '@/lib/models/Experience';
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
        const user = await resolveUser(username);
        
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const experiences = await Experience.find({ userId: user._id }).sort({ startDate: -1 }).lean();
        return NextResponse.json({ experiences });
    } catch (error) {
        console.error('Experience GET error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: Promise<{ username: string }> }) {
    try {
        await connectDB();
        
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET) as any;
        
        const { username } = await params;
        const user = await resolveUser(username);
        
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
        
        // Ensure the authenticated user is posting to their own profile
        if (user._id.toString() !== decoded.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();
        
        const newExperience = await Experience.create({
            userId: user._id,
            title: body.title,
            company: body.company,
            location: body.location,
            startDate: body.startDate,
            endDate: body.endDate,
            isCurrent: body.isCurrent || false,
            description: body.description,
        });

        return NextResponse.json({ experience: newExperience }, { status: 201 });
    } catch (error) {
        console.error('Experience POST error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

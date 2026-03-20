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

export async function PUT(req: Request, { params }: { params: Promise<{ username: string, id: string }> }) {
    try {
        await connectDB();
        
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET) as any;
        
        const { username, id } = await params;
        const user = await resolveUser(username);
        
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
        if (user._id.toString() !== decoded.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const body = await req.json();
        
        const updated = await Experience.findOneAndUpdate(
            { _id: id, userId: user._id },
            { $set: body },
            { new: true }
        );

        if (!updated) return NextResponse.json({ error: 'Experience not found' }, { status: 404 });

        return NextResponse.json({ experience: updated });
    } catch (error) {
        console.error('Experience PUT error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ username: string, id: string }> }) {
    try {
        await connectDB();
        
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET) as any;
        
        const { username, id } = await params;
        const user = await resolveUser(username);
        
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
        if (user._id.toString() !== decoded.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const deleted = await Experience.findOneAndDelete({ _id: id, userId: user._id });
        if (!deleted) return NextResponse.json({ error: 'Experience not found' }, { status: 404 });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Experience DELETE error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

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

export async function PUT(req: Request, { params }: { params: Promise<{ username: string, id: string }> }) {
    try {
        await connectDB();
        
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET) as any;
        const currentUserId = decoded.id;
        
        const { username, id } = await params;
        const profileUser = await resolveUser(username);
        
        if (!profileUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const recommendation = await Recommendation.findById(id);
        if (!recommendation) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        
        const body = await req.json();

        // If current user is the author, they can update body and relationship
        if (currentUserId === recommendation.fromUserId.toString()) {
            if (body.body) recommendation.body = body.body;
            if (body.relationship) recommendation.relationship = body.relationship;
        } 
        // If current user is the profile owner, they can update visibility
        else if (currentUserId === recommendation.toUserId.toString() && profileUser._id.toString() === currentUserId) {
            if (typeof body.isVisible === 'boolean') {
                recommendation.isVisible = body.isVisible;
            }
        } 
        else {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await recommendation.save();
        return NextResponse.json({ recommendation });
    } catch (error) {
        console.error('Recommendation PUT error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ username: string, id: string }> }) {
    try {
        await connectDB();
        
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET) as any;
        const currentUserId = decoded.id;
        
        const { username, id } = await params;
        const profileUser = await resolveUser(username);
        
        if (!profileUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const recommendation = await Recommendation.findById(id);
        if (!recommendation) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        // Either author or recipient can delete
        if (currentUserId !== recommendation.fromUserId.toString() && currentUserId !== recommendation.toUserId.toString()) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await recommendation.deleteOne();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Recommendation DELETE error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

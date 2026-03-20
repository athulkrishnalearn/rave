import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import jwt from 'jsonwebtoken';
import Experience from '@/lib/models/Experience';

const JWT_SECRET = process.env.JWT_SECRET || 'rave-secret-key';

function getUser(req: Request) {
    const auth = req.headers.get('authorization');
    if (!auth?.startsWith('Bearer ')) return null;
    try { return jwt.verify(auth.split(' ')[1], JWT_SECRET) as any; } catch { return null; }
}

// GET /api/profile/experience?userId=xxx
export async function GET(req: Request) {
    await connectDB();
    const userId = new URL(req.url).searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });
    const items = await Experience.find({ userId }).sort({ startDate: -1 }).lean();
    return NextResponse.json({ experience: items });
}

// POST – add new entry (own profile only)
export async function POST(req: Request) {
    await connectDB();
    const decoded = getUser(req);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    const entry = await Experience.create({ ...body, userId: decoded.id });
    return NextResponse.json({ entry }, { status: 201 });
}

// PATCH – update entry
export async function PATCH(req: Request) {
    await connectDB();
    const decoded = getUser(req);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    const { id, ...update } = body;
    const entry = await Experience.findOneAndUpdate({ _id: id, userId: decoded.id }, update, { new: true });
    if (!entry) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ entry });
}

// DELETE – remove entry
export async function DELETE(req: Request) {
    await connectDB();
    const decoded = getUser(req);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const id = new URL(req.url).searchParams.get('id');
    await Experience.findOneAndDelete({ _id: id, userId: decoded.id });
    return NextResponse.json({ success: true });
}

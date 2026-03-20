import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import jwt from 'jsonwebtoken';
import Education from '@/lib/models/Education';

const JWT_SECRET = process.env.JWT_SECRET || 'rave-secret-key';

function getUser(req: Request) {
    const auth = req.headers.get('authorization');
    if (!auth?.startsWith('Bearer ')) return null;
    try { return jwt.verify(auth.split(' ')[1], JWT_SECRET) as any; } catch { return null; }
}

// GET /api/profile/education?userId=xxx
export async function GET(req: Request) {
    await connectDB();
    const userId = new URL(req.url).searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });
    const items = await Education.find({ userId }).sort({ startYear: -1 }).lean();
    return NextResponse.json({ education: items });
}

export async function POST(req: Request) {
    await connectDB();
    const decoded = getUser(req);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    const entry = await Education.create({ ...body, userId: decoded.id });
    return NextResponse.json({ entry }, { status: 201 });
}

export async function PATCH(req: Request) {
    await connectDB();
    const decoded = getUser(req);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id, ...update } = await req.json();
    const entry = await Education.findOneAndUpdate({ _id: id, userId: decoded.id }, update, { new: true });
    if (!entry) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ entry });
}

export async function DELETE(req: Request) {
    await connectDB();
    const decoded = getUser(req);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const id = new URL(req.url).searchParams.get('id');
    await Education.findOneAndDelete({ _id: id, userId: decoded.id });
    return NextResponse.json({ success: true });
}

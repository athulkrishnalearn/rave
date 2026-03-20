import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Playbook from '@/lib/models/Playbook';
import { requireRole } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const authResult = requireRole(req, 'admin');
        if (authResult instanceof Response) return authResult;

        await connectDB();
        const playbooks = await Playbook.find({}).sort({ createdAt: -1 });
        return NextResponse.json(playbooks);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch playbooks' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const authResult = requireRole(req, 'admin');
        if (authResult instanceof Response) return authResult;

        await connectDB();
        const body = await req.json();
        const playbook = await Playbook.create(body);
        return NextResponse.json(playbook);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create playbook' }, { status: 500 });
    }
}

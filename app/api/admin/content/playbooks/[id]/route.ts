import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Playbook from '@/lib/models/Playbook';
import { requireRole } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authResult = requireRole(req, 'admin');
        if (authResult instanceof Response) return authResult;

        await connectDB();
        const { id } = await params;
        const body = await req.json();
        const playbook = await Playbook.findByIdAndUpdate(id, body, { new: true });
        return NextResponse.json(playbook);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update playbook' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authResult = requireRole(req, 'admin');
        if (authResult instanceof Response) return authResult;

        await connectDB();
        const { id } = await params;
        await Playbook.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete playbook' }, { status: 500 });
    }
}

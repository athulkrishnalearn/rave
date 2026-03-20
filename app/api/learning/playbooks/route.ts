import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Playbook from '@/lib/models/Playbook';

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (id) {
            const playbook = await Playbook.findById(id);
            return NextResponse.json(playbook);
        }

        const playbooks = await Playbook.find({}).sort({ createdAt: -1 });
        return NextResponse.json(playbooks);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch playbooks' }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Invoice from '@/lib/models/Invoice';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await connectDB();

        const invoice = await Invoice.findById(id).populate('projectId payerId payeeId');
        if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });

        // Auth check should happen here to ensure only involved parties can view

        return NextResponse.json({ invoice });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

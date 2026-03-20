
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Application from '@/lib/models/Application';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await connectDB();

        const { action } = await req.json();
        if (!['accept', 'reject'].includes(action)) {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        const application = await Application.findByIdAndUpdate(
            id,
            { status: action === 'accept' ? 'ACCEPTED' : 'REJECTED' },
            { new: true }
        );

        if (!application) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        return NextResponse.json({ application, message: `Application ${action}ed` });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await connectDB();
        const application = await Application.findById(id)
            .populate('applicant', 'name image role')
            .lean();

        if (!application) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json({ application });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

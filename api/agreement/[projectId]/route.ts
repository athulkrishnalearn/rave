
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
    try {
        const { projectId } = await params;
        await connectDB();

        const { status } = await req.json();

        if (status !== 'confirmed') {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: 'Agreement confirmed. Please fund escrow to begin.',
            projectId,
            nextStep: `/escrow/${projectId}`,
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to confirm agreement' }, { status: 500 });
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
    try {
        const { projectId } = await params;
        return NextResponse.json({
            agreement: {
                projectId,
                status: 'pending_confirmation',
                title: 'Project Agreement',
                createdAt: new Date().toISOString(),
            }
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ActivityLog from '@/lib/models/ActivityLog';
import { requireRole } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const authResult = requireRole(req, 'admin');
        if (authResult instanceof Response) return authResult;

        await connectDB();
        const logs = await ActivityLog.find()
            .populate('adminId', 'name email')
            .populate('targetUserId', 'name brandName email')
            .sort({ createdAt: -1 })
            .limit(100);

        return NextResponse.json({ logs });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const authResult = requireRole(req, 'admin');
        if (authResult instanceof Response) return authResult;

        await connectDB();
        const body = await req.json();

        const log = await ActivityLog.create({
            adminId: authResult.id,
            action: body.action,
            targetUserId: body.targetUserId,
            details: body.details
        });

        return NextResponse.json({ log, success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create log' }, { status: 500 });
    }
}

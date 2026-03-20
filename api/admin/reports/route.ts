import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Report from '@/lib/models/Report';
import { requireRole } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const authResult = requireRole(req, 'admin');
        if (authResult instanceof Response) return authResult;

        await connectDB();
        const reports = await Report.find({})
            .populate('reportedBy', 'name email')
            .sort({ status: "desc", createdAt: -1 });

        return NextResponse.json({ reports });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const authResult = requireRole(req, 'admin');
        if (authResult instanceof Response) return authResult;

        await connectDB();
        const { reportId, status } = await req.json();

        const report = await Report.findByIdAndUpdate(reportId, { status }, { new: true });
        return NextResponse.json({ report, success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
    }
}

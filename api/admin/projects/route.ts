import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/lib/models/Project';
import { requireRole } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const authResult = requireRole(req, 'admin');
        if (authResult instanceof Response) return authResult;

        await connectDB();
        const projects = await Project.find({})
            .populate('companyId', 'name brandName email')
            .populate('raveHeadId', 'name brandName email')
            .populate('campaignId', 'title')
            .sort({ createdAt: -1 });

        return NextResponse.json({ projects });
    } catch (error) {
        console.error('Admin Projects GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

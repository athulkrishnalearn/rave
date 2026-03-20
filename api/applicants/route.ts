import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Application from '@/lib/models/Application';
import { getUserFromRequest } from '@/lib/auth';

// GET /api/applicants?dropId=xxx — List all applicants for a drop (company owner only)
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const authUser = getUserFromRequest(req);
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const url = new URL(req.url);
        const dropId = url.searchParams.get('dropId');

        if (!dropId) {
            return NextResponse.json({ error: 'dropId is required' }, { status: 400 });
        }

        const applications = await Application.find({ campaign: dropId })
            .populate('applicant', 'name image role skills rating verified')
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ applications });
    } catch (error) {
        console.error('GET /api/applicants error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

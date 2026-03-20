import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Contest from '@/lib/models/Contest';
import Campaign from '@/lib/models/Campaign';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'rave-secret-key';

export async function GET(req: Request) {
    try {
        await connectDB();

        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        let decoded: any;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        if (decoded.role !== 'og_vendor') {
            return NextResponse.json({ error: 'Forbidden: Only companies have active contests assigned.' }, { status: 403 });
        }

        // Fetch all Contests created by this Company
        // We `.populate('campaignId')` so the frontend can display the parent Campaign name next to the contest 
        const contests = await Contest.find({ companyId: decoded.id })
            .populate({ path: 'campaignId', select: 'title status' })
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, contests }, { status: 200 });

    } catch (error) {
        console.error('Fetch Company Contests Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

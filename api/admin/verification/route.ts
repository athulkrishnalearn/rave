import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import ActivityLog from '@/lib/models/ActivityLog';
import { requireRole } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const authResult = requireRole(req, 'admin');
        if (authResult instanceof Response) return authResult;

        await connectDB();

        const users = await User.find({ verificationStatus: 'pending' }).sort({ createdAt: -1 });

        return NextResponse.json({ users });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const authResult = requireRole(req, 'admin');
        if (authResult instanceof Response) return authResult;

        await connectDB();
        const { userId, status } = await req.json();

        if (!['verified', 'rejected'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const user = await User.findByIdAndUpdate(userId, {
            verificationStatus: status,
            verified: status === 'verified' // Sync boolean field
        }, { new: true });

        await ActivityLog.create({
            adminId: authResult.id,
            targetUserId: userId,
            action: status === 'verified' ? 'ID_APPROVED' : 'ID_REJECTED',
            details: `Identity Verification document was ${status.toUpperCase()}.`
        });

        return NextResponse.json({ success: true, user });

    } catch (error) {
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}

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
        // Return mostly all users for the table
        const users = await User.find({})
            .select('-password') // Exclude password
            .sort({ createdAt: -1 })
            .limit(100); // Limit for safety

        return NextResponse.json({ users });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const authResult = requireRole(req, 'admin');
        if (authResult instanceof Response) return authResult;

        await connectDB();
        const { userId, action, role } = await req.json();

        if (action === 'ban') {
            await User.findByIdAndUpdate(userId, { verificationStatus: 'rejected' });
            await ActivityLog.create({ adminId: authResult.id, targetUserId: userId, action: 'USER_BANNED', details: 'Suspended user account access via verifications block.' });
        } else if (action === 'verify') {
            await User.findByIdAndUpdate(userId, { verificationStatus: 'verified', verified: true });
            await ActivityLog.create({ adminId: authResult.id, targetUserId: userId, action: 'USER_VERIFIED', details: 'Force-verified user identity.' });
        } else if (action === 'role' && role) {
            await User.findByIdAndUpdate(userId, { role });
            await ActivityLog.create({ adminId: authResult.id, targetUserId: userId, action: 'ROLE_MODIFIED', details: `Changed user matrix role to ${role}.` });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

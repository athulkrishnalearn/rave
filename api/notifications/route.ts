import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Notification from '@/lib/models/Notification';
import { getUserFromRequest } from '@/lib/auth';

// GET /api/notifications — Get all notifications for current user
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const authUser = getUserFromRequest(req);
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const notifications = await Notification.find({ recipient: authUser.id })
            .populate('sender', 'name image')
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();

        const unread = notifications.filter(n => !n.read).length;

        return NextResponse.json({ notifications, unread });
    } catch (error) {
        console.error('GET /api/notifications error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PATCH /api/notifications — Mark notifications as read
export async function PATCH(req: NextRequest) {
    try {
        await connectDB();

        const authUser = getUserFromRequest(req);
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { ids, all } = await req.json();

        if (all) {
            await Notification.updateMany(
                { recipient: authUser.id, read: false },
                { read: true }
            );
        } else if (ids?.length) {
            await Notification.updateMany(
                { _id: { $in: ids }, recipient: authUser.id },
                { read: true }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('PATCH /api/notifications error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Message from '@/lib/models/Message';
import User from '@/lib/models/User';
import { getUserFromRequest } from '@/lib/auth';
import Notification from '@/lib/models/Notification';
import { pusherServer, chatChannel } from '@/lib/pusher';

export async function POST(req: Request) {
    try {
        await connectDB();
        const user = getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json(); // { recipientId, content, budget?, relatedWorkId? }

        const message = await Message.create({
            sender: user.id,
            recipient: body.recipientId,
            content: body.content,
            budget: body.budget,
            isNegotiation: body.isNegotiation,
            negotiationAmount: body.negotiationAmount,
            negotiationStatus: body.isNegotiation ? 'PENDING' : undefined,
            relatedWork: body.relatedWorkId
        });

        // Create Notification for recipient
        await Notification.create({
            recipient: body.recipientId,
            sender: user.id,
            type: 'message',
            message: `New brief from ${user.role === 'og_vendor' ? 'Vendor' : 'Rave Head'}`,
            link: '/inbox'
        });

        // ── Trigger real-time Pusher event ───────────────────────────────────
        const channel = chatChannel(user.id, body.recipientId);
        await pusherServer.trigger(channel, 'new-message', {
            _id: message._id.toString(),
            sender: user.id,
            recipient: body.recipientId,
            content: body.content,
            isNegotiation: message.isNegotiation,
            negotiationAmount: message.negotiationAmount,
            negotiationStatus: message.negotiationStatus,
            createdAt: message.createdAt,
        });

        return NextResponse.json({ success: true, message });
    } catch (error) {
        console.error('Message Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        await connectDB();
        const user = getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const url = new URL(req.url);
        const partnerId = url.searchParams.get('u');

        if (partnerId) {
            // Get messages between Me and Partner
            const messages = await Message.find({
                $or: [
                    { sender: user.id, recipient: partnerId },
                    { sender: partnerId, recipient: user.id }
                ]
            })
                .sort({ createdAt: 1 })
                .lean();

            // Mark as read
            await Message.updateMany(
                { sender: partnerId, recipient: user.id, read: false },
                { $set: { read: true } }
            );

            return NextResponse.json({ messages });
        }

        // Fallback: Get all messages where I am recipient (legacy)
        const inbox = await Message.find({ recipient: user.id })
            .populate('sender', 'name image role')
            .populate('relatedWork', 'title')
            .sort({ createdAt: -1 });

        return NextResponse.json({ inbox });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

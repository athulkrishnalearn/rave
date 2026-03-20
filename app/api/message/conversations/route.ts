import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Message from '@/lib/models/Message';
import User from '@/lib/models/User';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        await connectDB();
        const user = getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Find all messages involving the current user
        const messages = await Message.find({
            $or: [{ sender: user.id }, { recipient: user.id }]
        })
            .sort({ createdAt: -1 })
            .lean();

        // Group by conversation partner
        const conversationMap = new Map();

        for (const msg of messages) {
            const partnerId = msg.sender.toString() === user.id ? msg.recipient.toString() : msg.sender.toString();

            if (!conversationMap.has(partnerId)) {
                conversationMap.set(partnerId, {
                    lastMessage: msg.content,
                    lastAt: msg.createdAt,
                    unread: (msg.recipient.toString() === user.id && !msg.read) ? 1 : 0,
                    partnerId
                });
            } else {
                if (msg.recipient.toString() === user.id && !msg.read) {
                    conversationMap.get(partnerId).unread += 1;
                }
            }
        }

        const partnerIds = Array.from(conversationMap.keys());
        const partners = await User.find({ _id: { $in: partnerIds } })
            .select('name username profileImage image role brandName')
            .lean();

        const partnersById = new Map(partners.map(p => [p._id.toString(), p]));

        const conversations = partnerIds.map(id => {
            const partner = partnersById.get(id) || { _id: id, name: 'Unknown User', username: 'unknown' };
            return {
                ...conversationMap.get(id),
                partner
            };
        }).sort((a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime());

        return NextResponse.json({ conversations });

    } catch (error) {
        console.error('Conversation List Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Message from '@/lib/models/Message';
import Project from '@/lib/models/Project';
import SystemSettings from '@/lib/models/SystemSettings';
import Notification from '@/lib/models/Notification';
import { getUserFromRequest } from '@/lib/auth';
import { pusherServer, chatChannel } from '@/lib/pusher';

export async function POST(req: Request) {
    try {
        await connectDB();
        const user = getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { messageId, action, counterAmount } = await req.json();

        const message = await Message.findById(messageId);
        if (!message) return NextResponse.json({ error: 'Message not found' }, { status: 404 });

        // Ensure user is the recipient of the negotiation
        if (message.recipient.toString() !== user.id) {
            return NextResponse.json({ error: 'Only the recipient can act on this negotiation.' }, { status: 403 });
        }

        if (message.negotiationStatus !== 'PENDING') {
            return NextResponse.json({ error: 'Negotiation was already resolved.' }, { status: 400 });
        }

        if (action === 'ACCEPT') {
            // Calculate fees
            const settings = await SystemSettings.findOne() || { commissionRate: 0.20 };
            const dealAmount = message.negotiationAmount || 0;
            const platformFee = dealAmount * settings.commissionRate;
            const taxAmount = platformFee * 0.18;
            const netAmount = dealAmount - platformFee;

            // Vendor is usually the one paying. 
            // We assume sender is creator offering a service, and recipient (user) is the vendor paying.
            // If the user role is vendor, then user.id = vendor. Else we fallback to sender = vendor.
            const vendorId = user.role === 'og_vendor' ? user.id : message.sender;
            const creatorId = user.role === 'og_vendor' ? message.sender : user.id;

            const project = await Project.create({
                vendor: vendorId,
                creator: creatorId,
                dealAmount,
                platformFee,
                taxAmount,
                netAmount,
                status: 'AWAITING_FUNDS',
                paymentStatus: 'PENDING'
            });

            message.negotiationStatus = 'ACCEPTED';
            message.relatedProject = project._id;
            await message.save();

            // Notify
            await Notification.create({
                recipient: message.sender,
                sender: user.id,
                type: 'accept',
                message: `Your price of $${dealAmount} was accepted!`,
                link: `/project/${project._id}`
            });

            // Send system message back updating UI 
            await Message.create({
                sender: user.id,
                recipient: message.sender,
                content: `Quote Accepted: $${dealAmount}. I will deposit funds to Escrow to begin.`,
            });
            await pusherServer.trigger(chatChannel(user.id, message.sender.toString()), 'new-message', {
                sender: user.id,
                recipient: message.sender,
                content: `Quote Accepted: $${dealAmount}. I will deposit funds to Escrow to begin.`,
                createdAt: new Date().toISOString()
            });

            return NextResponse.json({ success: true, project });

        } else if (action === 'DECLINE') {
            message.negotiationStatus = 'DECLINED';
            await message.save();
            return NextResponse.json({ success: true, message });
        } else if (action === 'COUNTER') {
            message.negotiationStatus = 'COUNTERED';
            await message.save();
            
            // Send new counter negotiation
            const newMsg = await Message.create({
                sender: user.id,
                recipient: message.sender,
                content: `Counter-offer: $${counterAmount}`,
                isNegotiation: true,
                negotiationAmount: counterAmount,
                negotiationStatus: 'PENDING'
            });

            await pusherServer.trigger(chatChannel(user.id, message.sender.toString()), 'new-message', {
                sender: user.id,
                recipient: message.sender,
                content: `Counter-offer: $${counterAmount}`,
                isNegotiation: true,
                negotiationAmount: counterAmount,
                negotiationStatus: 'PENDING',
                createdAt: new Date().toISOString()
            });

            return NextResponse.json({ success: true, message: newMsg });
        } else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

    } catch (error) {
        console.error('Negotiation Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

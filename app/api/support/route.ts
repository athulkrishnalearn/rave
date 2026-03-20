import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Ticket from '@/lib/models/Ticket';
import { getUserFromRequest } from '@/lib/auth';
import mongoose from 'mongoose';

export async function GET(req: Request) {
    try {
        await connectDB();
        const user = getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const tickets = await Ticket.find({ creator: user.id })
            .sort({ updatedAt: -1 })
            .lean();

        return NextResponse.json({ success: true, tickets });
    } catch (error) {
        console.error("Support GET error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const user = getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();

        // If ticketId is provided, we are adding a message
        if (body.ticketId) {
            const ticket = await Ticket.findOne({ _id: body.ticketId, creator: user.id });
            if (!ticket) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });

            ticket.messages.push({
                sender: new mongoose.Types.ObjectId(user.id),
                content: body.message,
                timestamp: new Date()
            });
            ticket.status = 'OPEN'; // Reopen if user replies
            await ticket.save();

            return NextResponse.json({ success: true, ticket });
        }

        // Otherwise, create a new ticket
        if (!body.title || !body.description) {
            return NextResponse.json({ error: 'Title and description required' }, { status: 400 });
        }

        const newTicket = await Ticket.create({
            title: body.title,
            description: body.description,
            priority: body.priority || 'MEDIUM',
            creator: user.id,
            messages: [{ sender: new mongoose.Types.ObjectId(user.id), content: body.description, timestamp: new Date() }]
        });

        return NextResponse.json({ success: true, ticket: newTicket });
    } catch (error) {
        console.error("Support POST error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

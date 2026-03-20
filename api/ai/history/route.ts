import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import connectDB from '@/lib/db';
import AIChat from '@/lib/models/AIChat';

export async function GET(req: Request) {
    try {
        await connectDB();
        const user = getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type') as 'marketing' | 'programming' | 'tutor';
        const chatId = searchParams.get('chatId');

        if (chatId) {
            // Fetch specific chat messages
            const chat = await AIChat.findOne({ _id: chatId, userId: user.id });
            if (!chat) {
                return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
            }
            return NextResponse.json(chat);
        } else if (type) {
            // Fetch all chats of a specific type for the user
            const chats = await AIChat.find({ userId: user.id, type })
                .sort({ updatedAt: -1 })
                .limit(20);
            return NextResponse.json(chats);
        } else {
            return NextResponse.json({ error: 'Missing type or chatId parameter' }, { status: 400 });
        }

    } catch (error: any) {
        console.error('[/api/ai/history] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusher';
import { getUserFromRequest } from '@/lib/auth';

// Pusher calls this endpoint to authenticate private channel subscriptions.
// Only authenticated users may subscribe.
export async function POST(req: Request) {
    const user = getUserFromRequest(req);
    if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const body = await req.text();
    const params = new URLSearchParams(body);
    const socketId = params.get('socket_id');
    const channel = params.get('channel_name');

    if (!socketId || !channel) {
        return new Response(JSON.stringify({ error: 'Missing params' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Ensure the user is actually a participant of this private chat channel.
    // Channel format: private-chat-{id1}-{id2}
    const channelMatch = channel.match(/^private-chat-(\w+)-(\w+)$/);
    if (!channelMatch) {
        return new Response(JSON.stringify({ error: 'Invalid channel format' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const [, id1, id2] = channelMatch;
    const channelParticipants = [id1, id2];

    if (!channelParticipants.includes(user.id)) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    const authResponse = pusherServer.authorizeChannel(socketId, channel);
    return new Response(JSON.stringify(authResponse), {
        headers: { 'Content-Type': 'application/json' },
    });
}

import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

// ── Server-side Pusher instance (used in API routes) ──────────────────────────
export const pusherServer = new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!,
    useTLS: true,
});

// ── Client-side Pusher instance (singleton, keyed by token) ──────────────────
let pusherClient: PusherClient | null = null;
let pusherClientToken: string | null = null;

export function getPusherClient(token?: string): PusherClient {
    // Re-create if the token has changed (e.g. after login)
    if (!pusherClient || (token && token !== pusherClientToken)) {
        if (pusherClient) {
            pusherClient.disconnect();
        }
        pusherClientToken = token ?? null;
        pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
            channelAuthorization: {
                endpoint: '/api/pusher/auth',
                transport: 'ajax',
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            },
        });
    }
    return pusherClient;
}

// Channel name helper — sort IDs so both users generate the same channel name
export function chatChannel(userAId: string, userBId: string): string {
    return `private-chat-${[userAId, userBId].sort().join('-')}`;
}

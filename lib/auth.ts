import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'rave-social-supreme-secret-key-2026';

export interface JWTPayload {
    id: string;
    role: 'rave_head' | 'og_vendor' | 'admin' | 'support';
    iat?: number;
    exp?: number;
}

/**
 * Extract and verify JWT from Authorization header.
 * Returns decoded payload or null.
 */
export function getUserFromRequest(req: NextRequest | Request): JWTPayload | null {
    try {
        const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) return null;

        const token = authHeader.split(' ')[1];
        if (!token) return null;

        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        return decoded;
    } catch {
        return null;
    }
}

/**
 * Require auth — returns user or throws a 401 response.
 * Usage: const user = requireAuth(req); if (user instanceof Response) return user;
 */
export function requireAuth(req: NextRequest | Request): JWTPayload | Response {
    const user = getUserFromRequest(req);
    if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    return user;
}

/**
 * Require a specific role. Returns user or throws a 403.
 */
export function requireRole(req: NextRequest | Request, role: JWTPayload['role']): JWTPayload | Response {
    const user = getUserFromRequest(req);
    if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    if (user.role !== role && user.role !== 'admin') {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    return user;
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'rave-secret-key';

async function getUserFromToken(req: Request) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;
    try { return jwt.verify(authHeader.split(' ')[1], JWT_SECRET) as any; } catch { return null; }
}

// GET – Return subscription status
export async function GET(req: Request) {
    try {
        await connectDB();
        const auth = await getUserFromToken(req);
        if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const user = await User.findById(auth.id).select('isPro proExpiry proSubscribedAt role').lean();
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        // Auto-expire Pro if past expiry date, always true for vendors/admins
        const isActive = user.role === 'og_vendor' || user.role === 'admin' 
            ? true 
            : (user.isPro && user.proExpiry && new Date(user.proExpiry) > new Date());

        return NextResponse.json({
            isPro: isActive,
            proExpiry: user.proExpiry,
            proSubscribedAt: user.proSubscribedAt,
        });
    } catch (err) {
        console.error('Subscription GET error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST – Activate / renew Pro (simulated payment)
export async function POST(req: Request) {
    try {
        await connectDB();
        const auth = await getUserFromToken(req);
        if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { plan } = await req.json(); // 'monthly' | 'annual'
        const isAnnual = plan === 'annual';

        const now = new Date();
        const proExpiry = new Date(now);
        proExpiry.setDate(proExpiry.getDate() + (isAnnual ? 365 : 30));

        await User.findByIdAndUpdate(auth.id, {
            isPro: true,
            proSubscribedAt: now,
            proExpiry,
            aiCredits: 99999, // Effectively unlimited for Pro
        });

        // Notify user
        try {
            const Notification = (await import('@/lib/models/Notification')).default;
            await Notification.create({
                recipient: auth.id,
                sender: auth.id,
                type: 'system',
                message: `Welcome to RAVE Pro! Your ${isAnnual ? 'annual' : 'monthly'} subscription is now active.`,
                link: '/settings',
            });
        } catch (ne) { console.error('Pro notification error:', ne); }

        return NextResponse.json({
            success: true,
            isPro: true,
            proExpiry,
            message: `RAVE Pro activated! ${isAnnual ? 'Annual' : 'Monthly'} plan active until ${proExpiry.toLocaleDateString()}.`,
        });
    } catch (err) {
        console.error('Subscription POST error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

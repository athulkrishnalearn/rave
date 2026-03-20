import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'rave-secret-key';

export async function GET(req: Request) {
    try {
        await connectDB();
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET) as any;

        const user = await User.findById(decoded.id)
            .select('id name email role image profileImage isPro proExpiry proSubscribedAt username brandName')
            .lean();

        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        // Auto-expire Pro if past expiry date, but always true for vendors/admins
        const isProActive = (user as any).role === 'og_vendor' || (user as any).role === 'admin' 
            ? true 
            : ((user as any).isPro && (user as any).proExpiry
                ? new Date((user as any).proExpiry) > new Date()
                : (user as any).isPro);

        return NextResponse.json({
            user: {
                ...(user as any),
                _id: undefined,
                id: (user as any)._id?.toString() || decoded.id,
                isPro: isProActive,
            }
        });
    } catch (err) {
        console.error('/api/users/me error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

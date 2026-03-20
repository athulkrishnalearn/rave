import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Invoice from '@/lib/models/Invoice';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'rave-secret-key';

async function getUserFromToken(req: Request) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    try { return jwt.verify(token, JWT_SECRET) as any; } catch (e) { return null; }
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        
        const user = await getUserFromToken(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const userId = user.id;

        // A user can be a payer (Brand) or a payee (Rave Head)
        const invoices = await Invoice.find({
            $or: [{ payerId: userId }, { payeeId: userId }]
        }).sort({ createdAt: -1 });

        return NextResponse.json({ invoices });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

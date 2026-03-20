
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';

export async function POST(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
    try {
        const { projectId } = await params;
        await connectDB();

        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { amount, method } = await req.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }

        const escrowRecord = {
            projectId,
            amount,
            method,
            status: 'funded',
            fundedAt: new Date().toISOString(),
            transactionId: `txn_${Date.now()}`,
        };

        return NextResponse.json({
            success: true,
            escrow: escrowRecord,
            message: 'Escrow funded successfully. Work can now begin.',
        });
    } catch (error) {
        console.error('Escrow fund error:', error);
        return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 });
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
    try {
        const { projectId } = await params;
        return NextResponse.json({
            escrow: {
                projectId,
                status: 'pending',
                amount: 0,
            }
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/lib/models/Project';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        await connectDB();
        const user = getUserFromRequest(req);
        
        if (!user || user.role !== 'og_vendor') {
            return NextResponse.json({ error: 'Unauthorized vendor access' }, { status: 403 });
        }

        const projects = await Project.find({ vendor: user.id })
            .populate('creator', 'name brandName')
            .sort({ createdAt: -1 })
            .lean();

        let totalSpent = 0;
        let inEscrow = 0;
        let pendingFunding = 0;
        const transactionHistory: any[] = [];

        projects.forEach((p: any) => {
            if (p.paymentStatus === 'RELEASED') {
                totalSpent += p.dealAmount || 0;
                transactionHistory.push({ ...p, transactionType: 'PAYOUT' });
            } else if (p.paymentStatus === 'HELD') {
                inEscrow += p.dealAmount || 0;
                transactionHistory.push({ ...p, transactionType: 'ESCROW' });
            } else if (p.paymentStatus === 'PENDING' && p.status === 'AWAITING_FUNDS') {
                pendingFunding += p.dealAmount || 0;
                transactionHistory.push({ ...p, transactionType: 'PENDING' });
            }
        });

        return NextResponse.json({ 
            success: true, 
            metrics: {
                totalSpent,
                inEscrow,
                pendingFunding,
                totalTransactions: transactionHistory.length
            },
            history: transactionHistory 
        });

    } catch (error) {
        console.error("Payments API error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

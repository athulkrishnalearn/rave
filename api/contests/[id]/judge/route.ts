import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Contest from '@/lib/models/Contest';
import ContestEntry from '@/lib/models/ContestEntry';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'rave-secret-key';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;

        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        let decoded: any;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const contest = await Contest.findById(id);
        if (!contest) {
            return NextResponse.json({ error: 'Contest not found' }, { status: 404 });
        }
        if (contest.companyId.toString() !== decoded.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        if (contest.status !== 'judging') {
            return NextResponse.json({ error: 'Contest is not in judging phase' }, { status: 400 });
        }

        /* 
         * Body should contain an array of the final rankings decided by the company.
         * Example: { winners: [{ entryId: "...", rank: 1 }, { entryId: "...", rank: 2 }] }
         */
        const { winners } = await req.json();

        if (!Array.isArray(winners) || winners.length === 0) {
            return NextResponse.json({ error: 'Winners array is required' }, { status: 400 });
        }

        // Validate that they assigned a winner to every prize tier available
        if (winners.length > contest.prizes.length) {
            return NextResponse.json({ error: 'Too many winners for available prizes' }, { status: 400 });
        }

        // 1. Process the winners
        for (const winner of winners) {
            const entry = await ContestEntry.findById(winner.entryId);
            if (!entry || entry.contestId.toString() !== contest._id.toString()) continue;

            // Find the prize amount that corresponds to the given rank
            const prizeTier = contest.prizes.find((p: any) => p.rank === winner.rank);
            if (!prizeTier) continue;

            entry.status = 'winner';
            entry.awardedPrize = {
                rank: prizeTier.rank,
                amount: prizeTier.amount
            };
            await entry.save();

            // INTEGRATION POINT: 
            // In production, call Stripe Connect / Escrow Release here 
            // to transfer `prizeTier.amount` to `entry.raveHeadId`.
        }

        // 2. Mark contest closed
        contest.status = 'completed';
        await contest.save();

        return NextResponse.json({
            success: true,
            message: 'Winners finalized. Escrow released to Rave Heads!'
        }, { status: 200 });

    } catch (error) {
        console.error('Contest Judging Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

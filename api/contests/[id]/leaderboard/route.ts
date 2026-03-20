import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ContestEntry from '@/lib/models/ContestEntry';
import Post from '@/lib/models/Post';
import User from '@/lib/models/User';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;

        // Find all entries for this contest
        const entries = await ContestEntry.find({ contestId: id })
            .populate({
                path: 'raveHeadId',
                select: 'name username profileImage'
            })
            .populate({
                path: 'dropId',
                select: 'content metrics'
            });

        // Calculate Hybrid Scores Dynamically
        // Formula: (Likes * 1) + (Comments * 2) + (Company Judge Score * 5)
        const rankedEntries = entries.map(entry => {
            const drop: any = entry.dropId;
            let computedScore = 0;

            if (drop) {
                computedScore = (drop.metrics.likes * 1) + (drop.metrics.comments * 2) + (entry.companyScore * 5);

                // Optional: Update the database async so it doesn't block the request if we want caching
                if (entry.finalScore !== computedScore) {
                    entry.finalScore = computedScore;
                    entry.save().catch((e: any) => console.error('Failed to async sync score:', e));
                }
            }

            return {
                ...entry.toObject(),
                currentLeaderboardScore: computedScore
            };
        });

        // Sort Highest Score First
        rankedEntries.sort((a, b) => b.currentLeaderboardScore - a.currentLeaderboardScore);

        return NextResponse.json({ success: true, leaderboard: rankedEntries }, { status: 200 });

    } catch (error) {
        console.error('Fetch Contest Leaderboard Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

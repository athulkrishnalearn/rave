import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Contest from '@/lib/models/Contest';
import ContestEntry from '@/lib/models/ContestEntry';
import Post from '@/lib/models/Post';
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

        // Only Rave Heads can submit to contests
        if (decoded.role !== 'rave_head') {
            return NextResponse.json({ error: 'Forbidden: Only Creators (Rave Heads) can participate in contests' }, { status: 403 });
        }

        const contest = await Contest.findById(id);
        if (!contest) {
            return NextResponse.json({ error: 'Contest not found' }, { status: 404 });
        }

        if (contest.status !== 'active_escrow_funded') {
            return NextResponse.json({ error: `Contest is no longer accepting submissions. Status: ${contest.status}` }, { status: 400 });
        }

        if (new Date() > new Date(contest.deadline)) {
            return NextResponse.json({ error: 'Contest deadline has passed' }, { status: 400 });
        }

        const { dropId } = await req.json();

        if (!dropId) {
            return NextResponse.json({ error: 'You must select a Drop to submit' }, { status: 400 });
        }

        // 1. Verify the Drop belongs to the user
        const drop = await Post.findById(dropId);
        if (!drop || drop.author.toString() !== decoded.id) {
            return NextResponse.json({ error: 'Drop not found or you do not own it' }, { status: 404 });
        }
        if (drop.type !== 'DROP') {
            return NextResponse.json({ error: 'Only DROP content types can be submitted to contests' }, { status: 400 });
        }

        // 2. Validate max submissions per user
        const existingEntries = await ContestEntry.countDocuments({
            contestId: id,
            raveHeadId: decoded.id
        });

        if (existingEntries >= contest.rules.maxSubmissionsPerUser) {
            return NextResponse.json({
                error: `You have reached the maximum allowed submissions (${contest.rules.maxSubmissionsPerUser}) for this contest.`
            }, { status: 400 });
        }

        // 3. Create the Entry Link
        const entry = await ContestEntry.create({
            contestId: id,
            raveHeadId: decoded.id,
            dropId: drop._id,
        });

        // 4. Tag the original Drop so it renders the "🏆 Entry" badge on the feed
        drop.contestId = contest._id;
        await drop.save();

        return NextResponse.json({ success: true, message: 'Submission accepted! Good luck!', entry }, { status: 201 });

    } catch (error) {
        console.error('Contest Submission Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

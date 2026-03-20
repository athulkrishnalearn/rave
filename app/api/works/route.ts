import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Work from '@/lib/models/Work';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'rave-secret-key';

async function getUserFromToken(req: Request) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    try { return jwt.verify(token, JWT_SECRET) as any; } catch (e) { return null; }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const user = await getUserFromToken(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Retrieve full user to check verification status (token might be outdated if verification happened recently, or we can trust token if we update it on login)
        // Better to fetch user from DB to be safe
        const dbUser = await User.findById(user.id);
        if (!dbUser || dbUser.verificationStatus !== 'verified') {
            return NextResponse.json({ error: 'Account pending verification' }, { status: 403 });
        }

        const body = await req.json();

        const work = await Work.create({
            title: body.title,
            description: body.description,
            author: user.id,
            mediaUrl: body.mediaUrl, // This would normally come from an upload service (S3/Cloudinary)
            tags: body.tags || [],
            type: body.type || 'VISUAL',
            resharedCampaign: body.resharedCampaign
        });

        return NextResponse.json({ success: true, work });
    } catch (error) {
        console.error('Work Post Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/lib/models/Project';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'rave-secret-key';

async function getUserFromToken(req: Request) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    try { return jwt.verify(token, JWT_SECRET) as any; } catch (e) { return null; }
}

export async function GET(req: Request) {
    try {
        await connectDB();
        const user = await getUserFromToken(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // 1. Find Projects
        const projects = await Project.find({
            $or: [
                { vendor: user.id },
                { creator: user.id }
            ]
        })
            .populate('campaign', 'title type payAmount content')
            .populate('vendor', 'name brandName username profileImage')
            .populate('creator', 'name username profileImage')
            .sort({ updatedAt: -1 })
            .lean();

        // 2. Find Pending Applications
        // For Vendors: Apps sent to their campaigns
        // For Creators: Their sent apps
        // For all users: Apps they sent OR Apps sent to their posts
        const Post = mongoose.models.Post || (await import('@/lib/models/Post')).default;
        const myPosts = await Post.find({ author: user.id }).select('_id');
        const postIds = myPosts.map(p => p._id);

        const applicationQuery = {
            status: 'PENDING',
            $or: [
                { applicant: user.id },
                { campaign: { $in: postIds } }
            ]
        };

        const Application = mongoose.models.Application || (await import('@/lib/models/Application')).default;
        const applications = await Application.find(applicationQuery)
            .populate('campaign', 'title type payAmount vendorId author content') // Added author and content
            .populate('applicant', 'name brandName username profileImage')
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ projects, applications });

    } catch (error) {
        console.error('Project List Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

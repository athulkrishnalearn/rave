import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { getUserFromRequest } from '@/lib/auth';

export async function PATCH(req: Request) {
    try {
        const userPayload = getUserFromRequest(req);
        if (!userPayload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const data = await req.json();

        // Build update object
        const update: Record<string, any> = {};
        
        if (data.name) update.name = data.name;
        if (data.bio !== undefined) update.bio = data.bio;
        if (data.location !== undefined) update.location = data.location;
        if (data.website !== undefined) update.website = data.website;
        if (data.profileImage) update.profileImage = data.profileImage;
        if (data.username) update.username = data.username;
        
        // Handle preferences
        if (data.preferences) {
            update.preferences = data.preferences;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userPayload.id,
            { $set: update },
            { new: true, select: '-password' }
        );

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, user: updatedUser });

    } catch (error: any) {
        console.error('[/api/users/profile] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { getUserFromRequest } from '@/lib/auth';

export async function PATCH(req: Request) {
    try {
        const user = getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const {
            username,
            focus,
            skills,
            bio,
            profileImage,
            portfolio,
            idDocument,
            // Vendor fields
            companyName,
            website,
            description,
            industry,
            companyRegistration,
        } = await req.json();

        // Build update object — only update provided fields
        const update: Record<string, any> = {};

        if (username) update.username = username;
        if (focus) update.interests = focus;
        if (skills) update.skills = skills;
        if (bio) update.bio = bio;
        if (profileImage) update.profileImage = profileImage;
        if (portfolio) update.portfolio = portfolio.map((p: any) => p.fileUrl || p);
        if (idDocument) { update.idDocument = idDocument; update.verificationStatus = 'pending'; }
        if (companyName) {
            update.brandName = companyName;
            update.role = 'og_vendor';
            update.vendorType = 'company';
        }
        if (website) update.website = website;
        if (description) update.description = description;
        if (industry) update.interests = industry;
        if (companyRegistration) update.companyRegistration = companyRegistration;

        const updated = await User.findByIdAndUpdate(
            user.id,
            { $set: update },
            { new: true, select: '-password' }
        );

        if (!updated) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, user: updated });

    } catch (error: any) {
        console.error('[/api/auth/onboarding] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

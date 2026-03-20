import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SystemSettings from '@/lib/models/SystemSettings';
import { requireRole } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const authResult = requireRole(req, 'admin');
        if (authResult instanceof Response) return authResult;

        await connectDB();
        let settings = await SystemSettings.findOne();

        if (!settings) {
            settings = await SystemSettings.create({
                commissionRate: 0.15,
                withdrawalLimitDaily: 5000,
                disputeDeadlineDays: 7,
                verificationRequiredForPayout: true,
            });
        }

        return NextResponse.json({ settings });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const authResult = requireRole(req, 'admin');
        if (authResult instanceof Response) return authResult;

        await connectDB();
        const body = await req.json();

        let settings = await SystemSettings.findOne();
        if (!settings) {
            settings = new SystemSettings(body);
        } else {
            Object.assign(settings, body);
            // Optionally, we could record that the admin `authResult.id` updated it
            settings.updatedBy = authResult.id as any;
        }

        await settings.save();
        return NextResponse.json({ settings, success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}

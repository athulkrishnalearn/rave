import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Dispute from "@/lib/models/Dispute";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const disputes = await Dispute.find({})
            .populate("raisedBy", "name email")
            .populate("project")
            .sort({ createdAt: -1 })
            .lean();
        return NextResponse.json({ disputes });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        // Derive the user from the JWT token for security
        const authUser = getUserFromRequest(req);
        if (!authUser) {
            return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
        }

        const body = await req.json();
        const { projectId, reason, evidence } = body;

        if (!reason || !reason.trim()) {
            return NextResponse.json({ error: "Reason is required." }, { status: 400 });
        }

        const disputeData: any = {
            raisedBy: authUser.id, // Always use the authenticated user's ID
            reason: reason.trim(),
            evidence: evidence || [],
        };

        // projectId is optional — disputes may be general support contacts
        if (projectId) disputeData.project = projectId;

        const dispute = await Dispute.create(disputeData);
        return NextResponse.json({ dispute }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

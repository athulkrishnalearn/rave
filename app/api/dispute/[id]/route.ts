import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Dispute from "@/lib/models/Dispute";
import Project from "@/lib/models/Project";
import { requireRole } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authResult = requireRole(req, 'admin');
        if (authResult instanceof Response) return authResult;

        await dbConnect();
        const { id } = await params;
        const dispute = await Dispute.findById(id)
            .populate("raisedBy", "name email")
            .populate("project")
            .lean();

        if (!dispute) return NextResponse.json({ error: "Dispute not found" }, { status: 404 });
        return NextResponse.json({ dispute });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authResult = requireRole(req, 'admin');
        if (authResult instanceof Response) return authResult;

        await dbConnect();
        const { id } = await params;
        const { decision } = await req.json(); // 'release' | 'refund'

        const dispute = await Dispute.findById(id);
        if (!dispute) return NextResponse.json({ error: "Not found" }, { status: 404 });

        const project = await Project.findById(dispute.project);
        if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

        if (decision === 'release') {
            project.paymentStatus = 'RELEASED';
            project.status = 'COMPLETED';
            dispute.resolution = 'released';
        } else if (decision === 'refund') {
            project.paymentStatus = 'REFUNDED';
            project.status = 'CANCELLED';
            dispute.resolution = 'refunded';
        }

        dispute.status = 'resolved';

        await project.save();
        await dispute.save();

        return NextResponse.json({ success: true, dispute });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

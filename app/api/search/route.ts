import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Post from "@/lib/models/Post";
import User from "@/lib/models/User";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const q = req.nextUrl.searchParams.get("q") || "";

        if (!q.trim()) {
            return NextResponse.json({ drops: [], users: [] });
        }

        const regex = new RegExp(q, "i");

        const [drops, users] = await Promise.all([
            Post.find({
                $or: [
                    { "content.text": { $regex: regex } },
                    { "content.title": { $regex: regex } },
                    { hashtags: { $regex: regex } },
                ]
            })
                .populate("author", "name username profileImage role")
                .sort({ createdAt: -1 })
                .limit(20)
                .lean(),

            User.find({
                $or: [
                    { name: { $regex: regex } },
                    { username: { $regex: regex } },
                    { skills: { $regex: regex } },
                    { bio: { $regex: regex } },
                ]
            })
                .select("name username profileImage role bio skills verificationStatus")
                .limit(20)
                .lean(),
        ]);

        return NextResponse.json({ drops, users });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

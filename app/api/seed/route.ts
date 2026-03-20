import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import Work from '@/lib/models/Work';
import Campaign from '@/lib/models/Campaign';
import Application from '@/lib/models/Application';
import Message from '@/lib/models/Message';
import Project from '@/lib/models/Project';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        await connectDB();

        // 1. CLEAR DB
        await User.deleteMany({});
        await Work.deleteMany({});
        await Campaign.deleteMany({});
        await Application.deleteMany({});
        await Message.deleteMany({});
        await Project.deleteMany({});

        // 2. CREATE USERS
        const vendorPassword = await bcrypt.hash('password', 10);
        const headPassword = await bcrypt.hash('password', 10);

        const vendor = await User.create({
            name: "NIGHTCORP",
            email: "vendor@rave.com",
            password: vendorPassword,
            role: "og_vendor",
            brandName: "NIGHTCORP",
            image: "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=800&q=80",
            description: "Global underground fashion syndicate.",
            verified: true
        });

        const head = await User.create({
            name: "CyberGoth99",
            email: "head@rave.com",
            password: headPassword,
            role: "rave_head",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
            // bio: "Visual artist | Techno enthusiast | 3D Glitch", // Model doesn't support bio yet
            verified: true
        });

        // 3. CREATE CAMPAIGNS (Vendor)
        const campaign1 = await Campaign.create({
            title: "Neon City Launch",
            description: "Looking for 3D motion designers to create a 15s bumper for our new collection launch in Tokyo.",
            payAmount: "5000",
            vendorId: vendor._id,
            status: 'active',
            type: 'CREATOR',
            requirements: ["3D Motion", "Cyberpunk Aesthetic", "4K Delivery"],
            // deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14) // 14 days
        });

        const campaign2 = await Campaign.create({
            title: "Acid Rain Drop",
            description: "Need hyper-realistic rain overlays for a music video. Dark, gritty, industrial vibes.",
            payAmount: "2000",
            vendorId: vendor._id,
            status: 'active',
            type: 'CREATOR',
            requirements: ["VFX", "Compositing"],
            // deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
        });

        // 4. CREATE WORKS (Head)
        await Work.create({
            title: "Glitch Series 01",
            description: "Experimental datamoshing on VHS footage.",
            author: head._id,
            mediaUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
            type: "VISUAL",
            tags: ["#glitch", "#vhs", "#retro"]
        });

        await Work.create({
            title: "Cyber Skull Render",
            description: "Daily render using Blender and Octane.",
            author: head._id,
            mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
            type: "VISUAL",
            tags: ["#3d", "#blender", "#cyberpunk"]
        });

        // 5. CREATE APPLICATION (Head -> Campaign1)
        const application = await Application.create({
            applicant: head._id,
            campaign: campaign1._id,
            coverLetter: "I specialize in this exact aesthetic. Check my profile for the Glitch Series.",
            quote: 4500,
            timeline: 10,
            status: 'PENDING'
        });

        // 6. CREATE MESSAGES
        await Message.create({
            sender: head._id,
            recipient: vendor._id,
            content: "Hey, I just applied to your Neon City campaign. Huge fan of the brand.",
            read: false
        });

        await Message.create({
            sender: vendor._id,
            recipient: head._id,
            content: "Saw your application. Your portfolio looks sick. We might want to move fast.",
            read: false
        });

        return NextResponse.json({
            success: true,
            message: "Database Seeded Successfully",
            credentials: {
                vendor: "vendor@rave.com / password",
                head: "head@rave.com / password"
            }
        });

    } catch (error) {
        console.error('Seed Error:', error);
        return NextResponse.json({ error: 'Seed Failed', details: error }, { status: 500 });
    }
}

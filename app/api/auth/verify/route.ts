import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'rave-secret-key';

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email, code } = await req.json();

        if (!email || !code) {
            return NextResponse.json({ error: 'Email and OTP code are required.' }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        }

        if (user.emailVerified) {
            return NextResponse.json({ error: 'Email is already verified.' }, { status: 400 });
        }

        if (user.verificationCode !== code || !user.verificationCodeExpires || Date.now() > user.verificationCodeExpires.getTime()) {
            return NextResponse.json({ error: 'Invalid or expired verification code.' }, { status: 400 });
        }

        // Code is valid! Complete the verification.
        user.emailVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();

        // Generate JWT Token exactly like a standard login now that they are verified
        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        const userPayload = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
            brandName: user.brandName
        };

        return NextResponse.json({ token, user: userPayload }, { status: 200 });

    } catch (error) {
        console.error('OTP Verification Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '@/lib/email';

const JWT_SECRET = process.env.JWT_SECRET || 'rave-secret-key';

export async function POST(req: Request) {
    try {
        await connectDB();
        const { name, email, password, role, interests, skills, brandName, description, idDocument, vendorType, companyRegistration } = await req.json();

        // Validate required fields
        if (!name || !email || !password || !role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check availability
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // ONLY throw error if they are ALREADY verified.
            // If NOT verified, we allow them to "re-signup" (overwrite pending data)
            if (existingUser.emailVerified) {
                return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
            }
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        // Build User Object
        const userData: any = {
            name,
            email,
            password: hashedPassword,
            role,
            verified: false,
            verificationStatus: 'pending', // Default to pending Admin KYC
            idDocument, // Save URL
            emailVerified: false,
            verificationCode: otpCode,
            verificationCodeExpires: otpExpires
        };

        if (role === 'rave_head') {
            userData.interests = interests || [];
            userData.skills = skills || [];
        } else if (role === 'og_vendor') {
            userData.brandName = brandName || name;
            userData.description = description || '';
            userData.vendorType = vendorType || 'individual';
            if (vendorType === 'company') {
                userData.companyRegistration = companyRegistration;
            }
        }

        const user = await User.findOneAndUpdate(
            { email },
            userData,
            { new: true, upsert: true }
        );

        // Send OTP via Resend
        await sendVerificationEmail(user.email, otpCode);

        // Return Pending Verification Status (Do NOT return JWT yet)
        return NextResponse.json({
            status: 'pending_verification',
            email: user.email,
            message: 'OTP Sent to Email'
        }, { status: 201 });

    } catch (error) {
        console.error('Signup Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

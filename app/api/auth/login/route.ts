import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'rave-secret-key';

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email, password } = await req.json();

        // Find User
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Check Password
        if (!user.password) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Allow simple password for dev if needed, but sticking to bcrypt for now
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Generate Token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Return User (excluding password)
        const userPayload = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            username: user.username,
            image: user.image
        };

        return NextResponse.json({ token, user: userPayload });

    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

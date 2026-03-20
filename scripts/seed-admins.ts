import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../lib/models/User';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rave-social';

const adminEmails = [
    'athul@faatlab.com',
    'athul.rave@gmail.com'
];

async function seedAdmins() {
    try {
        console.log('🌱 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected');

        for (const email of adminEmails) {
            const user = await User.findOne({ email });
            if (user) {
                user.role = 'admin';
                await user.save();
                console.log(`✅ Granted admin access to: ${email}`);
            } else {
                console.warn(`⚠️ User not found for email: ${email}`);
            }
        }

        console.log('\n✨ ADMIN SEEDING COMPLETED');
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seedAdmins();

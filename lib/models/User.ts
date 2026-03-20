import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: 'rave_head' | 'og_vendor' | 'admin' | 'support';
    username?: string;  // unique handle e.g. @johndoe
    image?: string;
    profileImage?: string;
    coverImage?: string;   // profile banner
    headline?: string;     // short tagline e.g. "Video Editor & Motion Designer"
    bio?: string;
    location?: string;
    website?: string;
    socialLinks?: {
        twitter?: string;
        linkedin?: string;
        instagram?: string;
        phone?: string;
    };
    featuredDrops?: string[];  // up to 6 post IDs to pin
    followers?: string[];
    following?: string[];

    // Rave Head Specifics
    interests: string[];
    skills: string[]; // e.g. "Video Editing", "Copywriting"
    portfolio: string[]; // URLs
    rating: number;

    // OD Vendor Specifics
    brandName?: string;
    description?: string;
    vendorType?: 'individual' | 'company';
    companyRegistration?: string; // URL to doc

    // Verification
    verified: boolean; // Computed or duplicate of status === 'verified'
    verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
    idDocument?: string; // URL to ID proof

    // Email OTP Authentication
    emailVerified: boolean;
    verificationCode?: string;
    verificationCodeExpires?: Date;

    // Preferences & Settings
    preferences?: {
        profileVisibility: boolean;
        collabRequests: boolean;
        twoFactorEnabled: boolean;
        notifications: {
            interactions: boolean;
            network: boolean;
            financial: boolean;
            internal: boolean;
        }
    };

    // AI Usage
    aiCredits: number;
    aiTokensUsed: number;
    isPro: boolean;
    proExpiry?: Date;
    proSubscribedAt?: Date;
    learningProgress: Map<string, string[]>; // playbookId -> array of progress strings (e.g. 'L0', 'L0-E0')

    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['rave_head', 'og_vendor', 'admin', 'support'], required: true, default: 'rave_head' },
    username: { type: String, unique: true, sparse: true },
    image: { type: String },
    profileImage: { type: String },
    coverImage: { type: String },
    headline: { type: String },
    bio: { type: String },
    location: { type: String },
    website: { type: String },
    socialLinks: {
        twitter: { type: String },
        linkedin: { type: String },
        instagram: { type: String },
        phone: { type: String },
    },
    featuredDrops: { type: [String], default: [] },
    followers: { type: [String], default: [] },
    following: { type: [String], default: [] },
    
    // AI Usage
    aiCredits: { type: Number, default: 100 }, // Free users start with 100
    aiTokensUsed: { type: Number, default: 0 },
    isPro: { type: Boolean, default: false },
    proExpiry: { type: Date },
    proSubscribedAt: { type: Date },
    learningProgress: { type: Map, of: [String], default: {} },

    // Rave Head Fields
    interests: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    portfolio: { type: [String], default: [] },
    rating: { type: Number, default: 0 },

    // Vendor Fields
    brandName: { type: String },
    description: { type: String },
    vendorType: { type: String, enum: ['individual', 'company'] },
    companyRegistration: { type: String },

    // Verification
    verified: { type: Boolean, default: false },
    verificationStatus: { type: String, enum: ['unverified', 'pending', 'verified', 'rejected'], default: 'unverified' },
    idDocument: { type: String },

    // Email OTP Authentication
    emailVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },

    // Preferences
    preferences: {
        profileVisibility: { type: Boolean, default: true },
        collabRequests: { type: Boolean, default: true },
        twoFactorEnabled: { type: Boolean, default: false },
        notifications: {
            interactions: { type: Boolean, default: true },
            network: { type: Boolean, default: true },
            financial: { type: Boolean, default: true },
            internal: { type: Boolean, default: true }
        }
    }
}, { timestamps: true });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;


import mongoose, { Schema, Document, Model } from 'mongoose';

export type PostType = 'DROP' | 'WORK' | 'CAMPAIGN';

export interface IPost extends Document {
    type: PostType;
    author: mongoose.Types.ObjectId;

    // Core Content
    content: {
        title?: string; // Optional for simple drops
        text: string;
        mediaUrl?: string; // Image or Video URL
        thumbnailUrl?: string; // For videos
    };

    // Work Specifics
    workDetails?: {
        tags: string[];
        category?: string;
        pricingType: 'HOURLY' | 'PER_UNIT' | 'FIXED';
        rate: number;
        workType: 'SERVICE' | 'REQUIREMENT';
    };

    // Campaign Specifics
    campaignDetails?: {
        requirements: string[];
        budget?: string;
        status: 'active' | 'closed';
    };

    // Reference to the Campaign document when type === 'CAMPAIGN'
    campaignRef?: mongoose.Types.ObjectId;

    // Reference to a Contest if this post is a submission
    contestId?: mongoose.Types.ObjectId;

    // Metrics & Interactions
    metrics: {
        likes: number;     // "Praise"
        comments: number;
        shares: number;
    };

    // Hashtags
    hashtags: string[];

    createdAt: Date;
    updatedAt: Date;
}

const PostSchema = new Schema<IPost>({
    type: { type: String, enum: ['DROP', 'WORK', 'CAMPAIGN'], required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    content: {
        title: { type: String },
        text: { type: String, required: true },
        mediaUrl: { type: String },
        thumbnailUrl: { type: String }
    },

    workDetails: {
        tags: [{ type: String }],
        category: { type: String },
        pricingType: { type: String, enum: ['HOURLY', 'PER_UNIT', 'FIXED'], default: 'FIXED' },
        rate: { type: Number, default: 0 },
        workType: { type: String, enum: ['SERVICE', 'REQUIREMENT'], default: 'SERVICE' }
    },

    campaignDetails: {
        requirements: [{ type: String }],
        budget: { type: String },
        status: { type: String, enum: ['active', 'closed'], default: 'active' }
    },

    campaignRef: { type: Schema.Types.ObjectId, ref: 'Campaign' },

    contestId: { type: Schema.Types.ObjectId, ref: 'Contest' },

    metrics: {
        likes: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
        shares: { type: Number, default: 0 }
    },
    hashtags: [{ type: String }]
}, { timestamps: true });

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
export default Post;

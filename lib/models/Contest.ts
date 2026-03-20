import mongoose, { Schema, Document } from 'mongoose';

export interface IContestPrize {
    rank: number;
    amount: number;
    title?: string;
}

export interface IContest extends Document {
    companyId: mongoose.Types.ObjectId;
    campaignId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    prizePool: number;
    prizes: IContestPrize[];
    deadline: Date;
    status: 'draft' | 'active_escrow_funded' | 'judging' | 'completed' | 'cancelled';
    rules: {
        maxSubmissionsPerUser: number;
        allowedFileTypes: string[];
    };
    tags: string[];
    judgingType: 'company_only' | 'community_hybrid';
    createdAt: Date;
    updatedAt: Date;
}

const ContestPrizeSchema = new Schema<IContestPrize>({
    rank: { type: Number, required: true },
    amount: { type: Number, required: true },
    title: { type: String }
});

const ContestSchema = new Schema<IContest>({
    companyId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    prizePool: { type: Number, required: true, min: 0 },
    prizes: [ContestPrizeSchema],
    deadline: { type: Date, required: true },
    status: {
        type: String,
        enum: ['draft', 'active_escrow_funded', 'judging', 'completed', 'cancelled'],
        default: 'draft'
    },
    rules: {
        maxSubmissionsPerUser: { type: Number, default: 3, min: 1 },
        allowedFileTypes: [{ type: String }] // e.g., ['image/jpeg', 'video/mp4']
    },
    tags: [{ type: String, trim: true }],
    judgingType: {
        type: String,
        enum: ['company_only', 'community_hybrid'],
        default: 'community_hybrid'
    }
}, {
    timestamps: true
});

// Indexings for Explore queries
ContestSchema.index({ status: 1, deadline: 1 });
ContestSchema.index({ tags: 1 });
ContestSchema.index({ companyId: 1 });

export default mongoose.models.Contest || mongoose.model<IContest>('Contest', ContestSchema);

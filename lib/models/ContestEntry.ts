import mongoose, { Schema, Document } from 'mongoose';

export interface IContestEntry extends Document {
    contestId: mongoose.Types.ObjectId;
    raveHeadId: mongoose.Types.ObjectId;
    dropId: mongoose.Types.ObjectId;
    companyScore: number;
    finalScore: number;
    status: 'submitted' | 'disqualified' | 'winner';
    awardedPrize?: {
        rank: number;
        amount: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

const ContestEntrySchema = new Schema<IContestEntry>({
    contestId: { type: Schema.Types.ObjectId, ref: 'Contest', required: true },
    raveHeadId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    dropId: { type: Schema.Types.ObjectId, ref: 'Drop', required: true },
    companyScore: { type: Number, default: 0, min: 0, max: 100 },
    finalScore: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['submitted', 'disqualified', 'winner'],
        default: 'submitted'
    },
    awardedPrize: {
        rank: { type: Number },
        amount: { type: Number }
    }
}, {
    timestamps: true
});

// Enforce max 1 entry per Drop per Contest
ContestEntrySchema.index({ contestId: 1, dropId: 1 }, { unique: true });

// Optimize Leaderboard lookups
ContestEntrySchema.index({ contestId: 1, finalScore: -1 });

// Optimize User Portfolio lookups
ContestEntrySchema.index({ raveHeadId: 1, contestId: 1 });

export default mongoose.models.ContestEntry || mongoose.model<IContestEntry>('ContestEntry', ContestEntrySchema);

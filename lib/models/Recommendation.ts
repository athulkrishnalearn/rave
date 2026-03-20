import mongoose, { Schema, Document } from 'mongoose';

export interface IRecommendation extends Document {
    toUserId: mongoose.Types.ObjectId;     // Profile owner who receives it
    fromUserId: mongoose.Types.ObjectId;   // The recommender
    fromName: string;
    fromHeadline?: string;
    fromImage?: string;
    relationship: string;   // e.g. "Collaborated on a campaign"
    body: string;           // The recommendation text
    isVisible: boolean;     // Profile owner can hide
    createdAt: Date;
}

const RecommendationSchema = new Schema<IRecommendation>({
    toUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fromUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fromName: { type: String, required: true },
    fromHeadline: { type: String },
    fromImage: { type: String },
    relationship: { type: String, required: true },
    body: { type: String, required: true },
    isVisible: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Recommendation || mongoose.model<IRecommendation>('Recommendation', RecommendationSchema);

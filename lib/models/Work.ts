import mongoose, { Schema, Document, Model } from 'mongoose';

export type WorkType = 'VISUAL' | 'AUDIO' | 'HYBRID';

export interface IWork extends Document {
    title: string;
    description: string;
    author: mongoose.Types.ObjectId;
    mediaUrl: string; // Video or Image
    thumbnailUrl?: string; // Optional for videos
    type: WorkType;
    tags: string[];
    likes: number;
    resharedCampaign?: mongoose.Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
}

const WorkSchema = new Schema<IWork>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mediaUrl: { type: String, required: true },
    thumbnailUrl: { type: String },
    type: { type: String, enum: ['VISUAL', 'AUDIO', 'HYBRID'], default: 'VISUAL' },
    tags: [{ type: String }],
    likes: { type: Number, default: 0 },
    resharedCampaign: { type: Schema.Types.ObjectId, ref: 'Campaign' },
}, { timestamps: true });

const Work: Model<IWork> = mongoose.models.Work || mongoose.model<IWork>('Work', WorkSchema);
export default Work;

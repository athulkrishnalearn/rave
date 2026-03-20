import mongoose, { Schema, Document } from 'mongoose';

export interface IExperience extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;           // Job title
    company: string;         // Company name
    location?: string;
    startDate: Date;
    endDate?: Date;          // null = current job
    isCurrent: boolean;
    description?: string;
    createdAt: Date;
}

const ExperienceSchema = new Schema<IExperience>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    isCurrent: { type: Boolean, default: false },
    description: { type: String },
}, { timestamps: true });

export default mongoose.models.Experience || mongoose.model<IExperience>('Experience', ExperienceSchema);

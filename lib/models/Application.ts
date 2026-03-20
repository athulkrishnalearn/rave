import mongoose, { Schema, Document, Model } from 'mongoose';

export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface IApplication extends Document {
    campaign: mongoose.Types.ObjectId;
    applicant: mongoose.Types.ObjectId;
    coverLetter: string;
    quote: number;
    timeline: number; // Days
    status: ApplicationStatus;
    attachments: string[]; // URLs

    createdAt: Date;
    updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>({
    campaign: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
    applicant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    coverLetter: { type: String, required: true },
    quote: { type: Number, required: true },
    timeline: { type: Number, required: true }, // in days
    status: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED'], default: 'PENDING' },
    attachments: [{ type: String }],
}, { timestamps: true });

// Prevent duplicate applications from same user to same campaign
ApplicationSchema.index({ campaign: 1, applicant: 1 }, { unique: true });

const Application: Model<IApplication> = mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);
export default Application;

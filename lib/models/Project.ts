import mongoose, { Schema, Document, Model } from 'mongoose';

export type ProjectStatus = 'AWAITING_FUNDS' | 'ACTIVE' | 'SUBMITTED' | 'REVISION' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'HELD' | 'RELEASED' | 'REFUNDED' | 'DISPUTED';

export interface IProject extends Document {
    campaign: mongoose.Types.ObjectId;
    vendor: mongoose.Types.ObjectId;
    creator: mongoose.Types.ObjectId;
    application: mongoose.Types.ObjectId; // Source application

    status: ProjectStatus;
    paymentStatus: PaymentStatus;
    dealAmount: number;
    platformFee: number;
    taxAmount: number; // GST on platform fee
    netAmount: number; // Amount rave head receives

    // Delivery
    submissionUrl?: string;
    submissionNote?: string;

    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>({
    campaign: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    vendor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    application: { type: Schema.Types.ObjectId, ref: 'Application', required: true },

    status: { type: String, enum: ['AWAITING_FUNDS', 'ACTIVE', 'SUBMITTED', 'REVISION', 'COMPLETED', 'CANCELLED'], default: 'AWAITING_FUNDS' },
    paymentStatus: { type: String, enum: ['PENDING', 'HELD', 'RELEASED', 'REFUNDED', 'DISPUTED'], default: 'PENDING' },
    dealAmount: { type: Number, required: true },
    platformFee: { type: Number, required: true },
    taxAmount: { type: Number, required: true },
    netAmount: { type: Number, required: true },

    submissionUrl: { type: String },
    submissionNote: { type: String },

}, { timestamps: true });

const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
export default Project;

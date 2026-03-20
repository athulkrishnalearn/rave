import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
    reportedBy: mongoose.Types.ObjectId;
    targetId: mongoose.Types.ObjectId; // User, Post, or Project ID
    targetType: 'User' | 'Post' | 'Project';
    reason: string;
    details?: string;
    status: 'pending' | 'reviewed' | 'resolved' | 'ignored';
    createdAt: Date;
    updatedAt: Date;
}

const ReportSchema: Schema = new Schema(
    {
        reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        targetId: { type: Schema.Types.ObjectId, required: true },
        targetType: { type: String, enum: ['User', 'Post', 'Project'], required: true },
        reason: { type: String, required: true },
        details: { type: String },
        status: { type: String, enum: ['pending', 'reviewed', 'resolved', 'ignored'], default: 'pending' },
    },
    { timestamps: true }
);

export default mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema);

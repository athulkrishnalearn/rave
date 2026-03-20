import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDispute extends Document {
    project: mongoose.Types.ObjectId;
    raisedBy: mongoose.Types.ObjectId;
    reason: string;
    evidence: string[];
    status: 'open' | 'resolved';
    resolution: 'released' | 'refunded' | '';
    createdAt: Date;
    updatedAt: Date;
}

const DisputeSchema = new Schema<IDispute>({
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: false },
    raisedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    evidence: [{ type: String }],
    status: { type: String, enum: ['open', 'resolved'], default: 'open' },
    resolution: { type: String, enum: ['released', 'refunded', ''], default: '' },
}, { timestamps: true });

const Dispute: Model<IDispute> = mongoose.models.Dispute || mongoose.model<IDispute>('Dispute', DisputeSchema);
export default Dispute;

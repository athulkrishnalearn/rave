import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
    adminId: mongoose.Types.ObjectId;
    action: string;
    targetUserId?: mongoose.Types.ObjectId;
    targetContestId?: mongoose.Types.ObjectId;
    details?: string;
    createdAt: Date;
}

const ActivityLogSchema: Schema = new Schema({
    adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    targetUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    targetContestId: { type: Schema.Types.ObjectId, ref: 'Contest' },
    details: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);

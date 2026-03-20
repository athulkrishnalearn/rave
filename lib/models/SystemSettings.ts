import mongoose, { Schema, Document } from 'mongoose';

export interface ISystemSettings extends Document {
    commissionRate: number; // e.g., 0.15 for 15%
    withdrawalLimitDaily: number;
    disputeDeadlineDays: number;
    verificationRequiredForPayout: boolean;
    updatedBy?: mongoose.Types.ObjectId;
    updatedAt: Date;
}

const SystemSettingsSchema: Schema = new Schema(
    {
        commissionRate: { type: Number, default: 0.20 },
        withdrawalLimitDaily: { type: Number, default: 5000 },
        disputeDeadlineDays: { type: Number, default: 7 },
        verificationRequiredForPayout: { type: Boolean, default: true },
        updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

export default mongoose.models.SystemSettings || mongoose.model<ISystemSettings>('SystemSettings', SystemSettingsSchema);

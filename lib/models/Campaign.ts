import mongoose, { Schema, Document, Model } from 'mongoose';

export type CampaignType = 'CREATOR' | 'SALES' | 'FREELANCE';

export interface ICampaign extends Document {
    title: string;
    vendorId: mongoose.Types.ObjectId;
    description: string;
    type: CampaignType;

    // Config
    requirements: string[]; // e.g. "Must have 10k followers" or "Python expert"
    payAmount?: string;
    totalBudget: number;
    remainingBudget: number;
    status: 'active' | 'closed';

    // Assets for creators/sales
    assets: string[];

    // Leads/Submissions (Referenced later)

    createdAt: Date;
    updatedAt: Date;
}

const CampaignSchema = new Schema<ICampaign>({
    title: { type: String, required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['CREATOR', 'SALES', 'FREELANCE'], required: true },

    requirements: [{ type: String }],
    payAmount: { type: String },
    totalBudget: { type: Number, default: 0 },
    remainingBudget: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'closed'], default: 'active' },

    assets: [{ type: String }],
}, { timestamps: true });

const Campaign: Model<ICampaign> = mongoose.models.Campaign || mongoose.model<ICampaign>('Campaign', CampaignSchema);
export default Campaign;

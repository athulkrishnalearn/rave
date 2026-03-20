import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInvoice extends Document {
    invoiceNumber: string; // RAVE-INV-XXXX or RH-USR-XXXX
    type: 'PLATFORM' | 'CREATOR';
    projectId: mongoose.Types.ObjectId;
    payerId: mongoose.Types.ObjectId;
    payeeId: mongoose.Types.ObjectId;
    amount: number;
    taxAmount: number;
    totalAmount: number;
    currency: string;
    description: string;
    metadata: {
        campaignTitle?: string;
        raveHeadName?: string;
        brandName?: string;
    };
    status: 'GENERATED' | 'SENT' | 'PAID';
    createdAt: Date;
}

const InvoiceSchema = new Schema<IInvoice>({
    invoiceNumber: { type: String, required: true, unique: true },
    type: { type: String, enum: ['PLATFORM', 'CREATOR'], required: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    payerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    payeeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    taxAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    description: { type: String },
    metadata: {
        campaignTitle: { type: String },
        raveHeadName: { type: String },
        brandName: { type: String }
    },
    status: { type: String, enum: ['GENERATED', 'SENT', 'PAID'], default: 'GENERATED' }
}, { timestamps: { createdAt: true, updatedAt: false } });

const Invoice: Model<IInvoice> = mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);
export default Invoice;

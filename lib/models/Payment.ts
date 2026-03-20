import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPayment extends Document {
    amount: number;
    platformFee: number;
    netAmount: number;
    payer: mongoose.Types.ObjectId;
    payee: mongoose.Types.ObjectId;
    project: mongoose.Types.ObjectId;
    status: 'PENDING' | 'COMPLETED' | 'REFUNDED';
    createdAt: Date;
    updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
    amount: { type: Number, required: true },
    platformFee: { type: Number, required: true },
    netAmount: { type: Number, required: true },
    payer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    payee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    status: { type: String, enum: ['PENDING', 'COMPLETED', 'REFUNDED'], default: 'PENDING' }
}, { timestamps: true });

const Payment: Model<IPayment> = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
export default Payment;

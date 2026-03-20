import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage extends Document {
    sender: mongoose.Types.ObjectId;
    recipient: mongoose.Types.ObjectId;
    content: string;
    budget?: number; // legacy
    isNegotiation?: boolean;
    negotiationStatus?: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'COUNTERED';
    negotiationAmount?: number;
    relatedProject?: mongoose.Types.ObjectId; // After acceptance, link to the auto-generated project
    relatedWork?: mongoose.Types.ObjectId;
    read: boolean;

    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    budget: { type: Number },
    isNegotiation: { type: Boolean, default: false },
    negotiationStatus: { type: String, enum: ['PENDING', 'ACCEPTED', 'DECLINED', 'COUNTERED'], default: 'PENDING' },
    negotiationAmount: { type: Number },
    relatedProject: { type: Schema.Types.ObjectId, ref: 'Project' },
    relatedWork: { type: Schema.Types.ObjectId, ref: 'Work' },
    read: { type: Boolean, default: false },
}, { timestamps: true });

const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
export default Message;

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAIChat extends Document {
    userId: mongoose.Types.ObjectId;
    type: 'marketing' | 'programming' | 'tutor';
    title: string;
    messages: {
        role: 'user' | 'assistant' | 'system';
        content: string;
        timestamp: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const AIChatSchema = new Schema<IAIChat>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['marketing', 'programming', 'tutor'], required: true },
    title: { type: String, default: 'New Sync Session' },
    messages: [{
        role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

// Index for faster lookups
AIChatSchema.index({ userId: 1, type: 1, updatedAt: -1 });

const AIChat: Model<IAIChat> = mongoose.models.AIChat || mongoose.model<IAIChat>('AIChat', AIChatSchema);
export default AIChat;

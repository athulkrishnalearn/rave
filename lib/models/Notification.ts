import mongoose, { Schema, Document, Model } from 'mongoose';

export type NotificationType =
    | 'like' | 'comment' | 'repost'
    | 'collaborate' | 'accept' | 'reject'
    | 'payment' | 'delivery' | 'complete' | 'message';

export interface INotification extends Document {
    recipient: mongoose.Types.ObjectId;
    sender?: mongoose.Types.ObjectId;
    type: NotificationType;
    message: string;
    link?: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>({
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    type: {
        type: String,
        enum: ['like', 'comment', 'repost', 'collaborate', 'accept', 'reject', 'payment', 'delivery', 'complete', 'message'],
        required: true
    },
    message: { type: String, required: true },
    link: { type: String },
    read: { type: Boolean, default: false },
}, { timestamps: true });

// Index for fast lookup by recipient
NotificationSchema.index({ recipient: 1, createdAt: -1 });
NotificationSchema.index({ recipient: 1, read: 1 });

const Notification: Model<INotification> =
    mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;

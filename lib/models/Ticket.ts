import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITicket extends Document {
    title: string;
    description: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    creator: mongoose.Types.ObjectId;
    assignedTo?: mongoose.Types.ObjectId;
    messages: {
        sender: mongoose.Types.ObjectId;
        content: string;
        timestamp: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const TicketSchema = new Schema<ITicket>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED'], default: 'OPEN' },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    messages: [{
        sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

const Ticket: Model<ITicket> = mongoose.models.Ticket || mongoose.model<ITicket>('Ticket', TicketSchema);
export default Ticket;

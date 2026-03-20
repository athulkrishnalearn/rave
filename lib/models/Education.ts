import mongoose, { Schema, Document } from 'mongoose';

export interface IEducation extends Document {
    userId: mongoose.Types.ObjectId;
    institution: string;
    degree: string;          // e.g. "Bachelor of Design"
    field?: string;          // e.g. "Visual Communication"
    startYear: number;
    endYear?: number;
    isCurrent: boolean;
    grade?: string;
    activities?: string;
    description?: string;
}

const EducationSchema = new Schema<IEducation>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    field: { type: String },
    startYear: { type: Number, required: true },
    endYear: { type: Number },
    isCurrent: { type: Boolean, default: false },
    grade: { type: String },
    activities: { type: String },
    description: { type: String },
}, { timestamps: true });

export default mongoose.models.Education || mongoose.model<IEducation>('Education', EducationSchema);

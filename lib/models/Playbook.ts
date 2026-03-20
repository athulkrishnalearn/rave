import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILessonSection {
    title: string;
    content: string;
}

export interface ILessonExercise {
    title: string;
    steps: string[];
}

export interface ILesson {
    title: string;
    content?: string; // Legacy
    detailedContent?: ILessonSection[]; // New
    objective?: string;
    videoUrl?: string; // Legacy
    video?: {
        url: string;
        title?: string;
        description?: string;
    };
    exercise?: string; // Legacy
    exercises?: ILessonExercise[]; // New
    reflectionPrompt?: string;
}

export interface IPlaybook extends Document {
    title: string;
    description: string;
    category: 'creator' | 'freelance' | 'programming' | 'career';
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    duration: string;
    image: string;
    lessons: ILesson[];
    createdAt: Date;
    updatedAt: Date;
}

const PlaybookSchema = new Schema<IPlaybook>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['creator', 'freelance', 'programming', 'career'], required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    duration: { type: String, required: true },
    image: { type: String, required: true },
    lessons: [{
        title: { type: String, required: true },
        content: { type: String },
        detailedContent: [{
            title: { type: String },
            content: { type: String }
        }],
        objective: { type: String },
        videoUrl: { type: String },
        video: {
            url: { type: String },
            title: { type: String },
            description: { type: String }
        },
        exercise: { type: String },
        exercises: [{
            title: { type: String },
            steps: [{ type: String }]
        }],
        reflectionPrompt: { type: String }
    }]
}, { timestamps: true });

// Force delete the model if already defined to ensure schema updates are picked up in dev
if (mongoose.models.Playbook) {
    delete mongoose.models.Playbook;
}

const Playbook: Model<IPlaybook> = mongoose.model<IPlaybook>('Playbook', PlaybookSchema);
export default Playbook;

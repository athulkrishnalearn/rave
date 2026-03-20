import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rave-social';

const PlaybookSchema = new mongoose.Schema({
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

const Playbook = mongoose.models.Playbook || mongoose.model('Playbook', PlaybookSchema);

const playbooksMetadata = [
    { file: 'public-speaking.json', title: 'Public Speaking & English Communication', category: 'career', description: 'From absolute beginner to confident speaker in 7 days.', level: 'Beginner', image: '/images/playbooks/personal-branding.png', duration: '7 Days' },
    { file: 'videography-basics.json', title: 'Videography Basics: From Beginner to Creator', category: 'creator', description: 'A complete 7-day playbook to transform from "pointing and shooting" to deliberate videography. Master settings, composition, and light.', level: 'Beginner', image: '/images/playbooks/video-editing.png', duration: '7 Days' },
    { file: 'smm-7day.json', title: 'Social Media Management (7-Day Intensive)', category: 'creator', description: 'Transform from a scroller to a strategic community manager. Learn goal setting, content strategy, analytics, and engagement in 7 days.', level: 'Beginner', image: '/images/playbooks/smm.png', duration: '7 Days' },
    { file: 'video-editing-7day.json', title: 'Video Editing: From Beginner to Confident Editor', category: 'creator', description: 'Master the art of storytelling through the cut. Learn software, pacing, audio, color, and motion graphics in 7 days.', level: 'Beginner', image: '/images/playbooks/video-editing.png', duration: '7 Days' },
    { file: 'graphic-design-7day.json', title: 'Graphic Design: From Beginner to Confident Designer', category: 'creator', description: 'Master the fundamental principles of great design. Learn typography, color theory, layout, and branding in 7 days.', level: 'Beginner', image: '/images/playbooks/graphic-design.png', duration: '7 Days' },
    { file: 'copywriting-7day.json', title: 'Copywriting: From Beginner to Confident Copywriter', category: 'creator', description: 'Master the art of persuasion and salesmanship in print. Learn headlines, storytelling, and high-converting CTAs in 7 days.', level: 'Beginner', image: '/images/playbooks/copywriting.png', duration: '7 Days' },
    { file: 'freelancing-basics-7day.json', title: 'Freelancing Basics: From Beginner to Confident Freelancer', category: 'career', description: 'Master the business of freelancing. Learn how to find your niche, pitch clients, set your rates, and manage your first projects in 7 days.', level: 'Beginner', image: '/images/playbooks/freelancing.png', duration: '7 Days' },
    { file: 'ai-content-creation-7day.json', title: 'AI Content Creation: From Beginner to AI-Powered Creator', category: 'creator', description: 'Master the tools of the future. Learn prompt engineering, AI image generation, automated video, and AI-powered workflows in 7 days.', level: 'Beginner', image: '/images/playbooks/ai-creation.png', duration: '7 Days' },
    { file: 'web-dev-basics-7day.json', title: 'Web Development Basics: From Beginner to Confident Developer', category: 'career', description: 'Master the core technologies of the web. Learn HTML, CSS, JavaScript, responsive design, and live deployment in 7 days.', level: 'Beginner', image: '/images/playbooks/web-dev.png', duration: '7 Days' },
    { file: 'seo-fundamentals-7day.json', title: 'SEO Fundamentals: From Absolute Beginner to Confident Practitioner', category: 'creator', description: 'Master the art of search engine optimization. Learn keyword research, on-page SEO, technical audits, and link building in 7 days.', level: 'Beginner', image: '/images/playbooks/seo.png', duration: '7 Days' },
    { file: 'automation-7day.json', title: 'Automation using Low-Code / No-Code Agents', category: 'career', description: 'Master the art of automation. Learn triggers, actions, filters, paths, and integration of AI agents like ChatGPT in 7 days.', level: 'Beginner', image: '/images/playbooks/automation.png', duration: '7 Days' },
];

async function seed() {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected');

    // Clear existing playbooks
    await Playbook.deleteMany({});
    console.log('🧹 Cleaned existing playbooks');

    for (const meta of playbooksMetadata) {
        const dataPath = path.join(process.cwd(), 'scripts', 'data', meta.file);
        if (!fs.existsSync(dataPath)) {
            console.warn(`⚠️ Warning: ${meta.file} not found, skipping...`);
            continue;
        }

        const lessons = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        
        await Playbook.create({
            title: meta.title,
            description: meta.description,
            category: meta.category,
            level: meta.level,
            duration: meta.duration,
            image: meta.image,
            lessons: lessons
        });

        console.log(`✅ Seeded: ${meta.title}`);
    }

    console.log('\n✨ ALL PLAYBOOKS SEEDED SUCCESSFULLY');
    await mongoose.disconnect();
    process.exit(0);
}

seed().catch(err => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});

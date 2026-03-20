/**
 * RAVE — Database Seed Script
 * Run: npx ts-node -e "require('./scripts/seed.ts')"
 *   OR: npx tsx scripts/seed.ts
 *
 * Seeds:
 *  - 1 Admin user
 *  - 2 Rave Heads (verified)
 *  - 2 Companies (og_vendor)
 *  - 10 Posts (mix of DROP, WORK, CAMPAIGN)
 *  - Sample notifications
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rave-social';

// Inline schemas to avoid Next.js module issues in Node
const UserSchema = new mongoose.Schema({
    name: String, email: { type: String, unique: true }, password: String,
    role: { type: String, enum: ['rave_head', 'og_vendor', 'admin', 'support'] },
    image: String, interests: [String], skills: [String], portfolio: [String],
    rating: { type: Number, default: 0 }, brandName: String, description: String,
    vendorType: { type: String, enum: ['individual', 'company'] }, companyRegistration: String,
    verified: { type: Boolean, default: false },
    verificationStatus: { type: String, enum: ['unverified', 'pending', 'verified', 'rejected'], default: 'pending' },
    idDocument: String,
}, { timestamps: true });

const PostSchema = new mongoose.Schema({
    type: { type: String, enum: ['DROP', 'WORK', 'CAMPAIGN'] },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { title: String, text: String, mediaUrl: String, thumbnailUrl: String },
    workDetails: { tags: [String], category: String },
    campaignDetails: { requirements: [String], budget: String, status: { type: String, default: 'active' } },
    hashtags: [String],
    metrics: { likes: { type: Number, default: 0 }, comments: { type: Number, default: 0 }, shares: { type: Number, default: 0 } }
}, { timestamps: true });

const NotificationSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: String, message: String, link: String, read: { type: Boolean, default: false }
}, { timestamps: true });

async function seed() {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected:', MONGODB_URI);

    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
    const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

    // ── CLEAN UP ──────────────────────────────────────────────────────────────
    await User.deleteMany({});
    await Post.deleteMany({});
    await Notification.deleteMany({});
    console.log('🧹 Cleaned existing data');

    const pass = await bcrypt.hash('Password123!', 10);

    // ── USERS ─────────────────────────────────────────────────────────────────
    const admin = await User.create({
        name: 'RAVE Admin', email: 'admin@rave.works', password: pass,
        role: 'admin', verified: true, verificationStatus: 'verified',
    });

    const support = await User.create({
        name: 'RAVE Support', email: 'support@rave.works', password: pass,
        role: 'support', verified: true, verificationStatus: 'verified',
    });

    const head1 = await User.create({
        name: 'Alex Raven', email: 'alex@rave.works', password: pass,
        role: 'rave_head', verified: true, verificationStatus: 'verified',
        skills: ['Video Editing', 'Colour Grading', 'DaVinci Resolve'],
        interests: ['Lifestyle', 'Travel', 'Fashion'],
        rating: 4.8,
    });

    const head2 = await User.create({
        name: 'Jordan Cruz', email: 'jordan@rave.works', password: pass,
        role: 'rave_head', verified: true, verificationStatus: 'verified',
        skills: ['Photography', 'Content Writing', 'Brand Strategy'],
        interests: ['Tech', 'Fitness', 'Food'],
        rating: 4.6,
    });

    const company1 = await User.create({
        name: 'NordBrands', email: 'nord@rave.works', password: pass,
        role: 'og_vendor', verified: true, verificationStatus: 'verified',
        brandName: 'NordBrands', description: 'Premium lifestyle brand',
        vendorType: 'company',
    });

    const company2 = await User.create({
        name: 'Luxe Studio', email: 'luxe@rave.works', password: pass,
        role: 'og_vendor', verified: true, verificationStatus: 'verified',
        brandName: 'Luxe Studio', description: 'Creative studio for fashion brands',
        vendorType: 'company',
    });

    console.log('👥 Created 5 users');

    // ── POSTS ─────────────────────────────────────────────────────────────────
    const posts = await Post.insertMany([
        // Normal Drops (Rave Heads)
        {
            type: 'DROP', author: head1._id,
            content: { text: 'Just dropped a 4K brand reel for a client. Colour grade took 8 hours but it was worth every second 🎬' },
            hashtags: ['videography', 'colorgrading', 'brandfilm'],
            metrics: { likes: 142, comments: 23, shares: 8 }
        },
        {
            type: 'DROP', author: head2._id,
            content: { text: 'My editorial shoot for @luxe went live today. Clean aesthetics, natural light, no filters 📸' },
            hashtags: ['photography', 'editorial', 'fashion'],
            metrics: { likes: 89, comments: 14, shares: 5 }
        },
        // Service/Work Drops
        {
            type: 'WORK', author: head1._id,
            content: { title: 'Brand Video Production', text: 'I produce high-quality brand videos for lifestyle and fashion companies. Includes scripting, filming, editing, and colour grading.' },
            workDetails: { tags: ['Video', 'Editing', 'Brand'], category: 'Video Production' },
            hashtags: ['videoediting', 'brandvideo', 'production'],
            metrics: { likes: 67, comments: 9, shares: 3 }
        },
        {
            type: 'WORK', author: head2._id,
            content: { title: 'Content Strategy & Photography', text: 'Full content packages for brands — strategy, photoshoots, copy, and social scheduling included.' },
            workDetails: { tags: ['Photography', 'Strategy', 'Content'], category: 'Content Creation' },
            hashtags: ['contentcreation', 'photography', 'branding'],
            metrics: { likes: 55, comments: 7, shares: 12 }
        },
        // Company Requirements / Campaigns
        {
            type: 'CAMPAIGN', author: company1._id,
            content: { title: 'Product Launch Videos — 3 Reels Needed', text: 'We are launching our new summer collection and need 3 short-form videos (15–30s each). Must feel authentic, not over-produced. Our audience is 18–28. Looking for creators with a natural shooting style.' },
            campaignDetails: { requirements: ['Video Editing', 'Filming', 'Colour Grading'], budget: '$800–$1,200', status: 'active' },
            hashtags: ['videography', 'productlaunch', 'ugc'],
            metrics: { likes: 31, comments: 19, shares: 7 }
        },
        {
            type: 'CAMPAIGN', author: company2._id,
            content: { title: 'Fashion Photoshoot — Editorial Style', text: 'Seeking a creative photographer for a 1-day editorial shoot in London. 30+ final images, RAW files included. Must have experience with fashion / clothing brands.' },
            campaignDetails: { requirements: ['Fashion Photography', 'Editing', 'Lightroom'], budget: '$600–$900', status: 'active' },
            hashtags: ['photography', 'fashion', 'editorial'],
            metrics: { likes: 44, comments: 11, shares: 6 }
        },
        {
            type: 'CAMPAIGN', author: company1._id,
            content: { title: 'Brand Copywriter Needed — Email Campaign', text: 'Need an experienced copywriter for a 5-email welcome sequence. Tone: warm, premium, lifestyle. Target audience: women 25–40.' },
            campaignDetails: { requirements: ['Copywriting', 'Email Marketing', 'Brand Voice'], budget: '$300–$500', status: 'active' },
            hashtags: ['copywriting', 'emailmarketing', 'branding'],
            metrics: { likes: 22, comments: 8, shares: 3 }
        },
        {
            type: 'DROP', author: head1._id,
            content: { text: 'Motion graphics reel — 2025 edition. Every frame in this took at least an hour to create. Passion project but clients keep asking about it 🔥' },
            hashtags: ['motiongraphics', 'aftereffects', 'design'],
            metrics: { likes: 203, comments: 41, shares: 19 }
        },
        {
            type: 'DROP', author: head2._id,
            content: { text: 'Hot take: most brand content is too polished. Raw, authentic content outperforms. I have the analytics to prove it.' },
            hashtags: ['contentcreation', 'ugc', 'brandstrategy'],
            metrics: { likes: 177, comments: 56, shares: 24 }
        },
        {
            type: 'CAMPAIGN', author: company2._id,
            content: { title: 'Social Media Manager — 3 Months Part-Time', text: 'Managing 3 brand accounts (Instagram, TikTok, Pinterest). Post scheduling, community management, monthly reporting. 10hrs/week.' },
            campaignDetails: { requirements: ['Social Media', 'Community Management', 'Analytics'], budget: '$900/month', status: 'active' },
            hashtags: ['socialmedia', 'communitymanagement', 'remote'],
            metrics: { likes: 38, comments: 16, shares: 9 }
        },
    ]);

    console.log(`📝 Created ${posts.length} posts`);

    // ── SAMPLE NOTIFICATIONS ──────────────────────────────────────────────────
    await Notification.insertMany([
        {
            recipient: head1._id, sender: company1._id,
            type: 'collaborate', message: 'NordBrands sent you a collaboration request',
            link: `/collaborations`, read: false
        },
        {
            recipient: head1._id, sender: head2._id,
            type: 'like', message: 'Jordan Cruz liked your drop',
            link: `/drop/${posts[0]._id}`, read: false
        },
        {
            recipient: company1._id, sender: head1._id,
            type: 'collaborate', message: 'Alex Raven applied to your campaign',
            link: `/applicants/${posts[4]._id}`, read: false
        },
        {
            recipient: head2._id, sender: head1._id,
            type: 'like', message: 'Alex Raven liked your editorial',
            link: `/drop/${posts[1]._id}`, read: true
        },
    ]);

    console.log('🔔 Created sample notifications');

    // ── SUMMARY ───────────────────────────────────────────────────────────────
    console.log('\n✅ SEED COMPLETE');
    console.log('─────────────────────────────────');
    console.log('TEST ACCOUNTS (all password: Password123!)');
    console.log('  Admin:    admin@rave.works');
    console.log('  Support:  support@rave.works');
    console.log('  Rave Head: alex@rave.works');
    console.log('  Rave Head: jordan@rave.works');
    console.log('  Company:  nord@rave.works');
    console.log('  Company:  luxe@rave.works');
    console.log('─────────────────────────────────\n');

    await mongoose.disconnect();
    process.exit(0);
}

seed().catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
});

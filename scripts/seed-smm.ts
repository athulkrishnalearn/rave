import connectDB from '../lib/db';
import Playbook from '../lib/models/Playbook';

const smmLessons = [
    { day: 1, topic: "The SMM Landscape", video: "How to Start SMM in 2026 (Social Media Oga)", exercise: "List 3 brand wins and 3 misses for a brand you admire." },
    { day: 2, topic: "Digital Audits", video: "How to Conduct a Professional Social Audit(Metricool)", exercise: "Perform a Bio & Link audit on your own profile." },
    { day: 3, topic: "Target Audience", video: "Defining Your Customer Avatar (Jade Beason)", exercise: "Create a Persona document for a fitness brand." },
    { day: 4, topic: "Competitor Research", video: "Social Media Competitor Analysis Guide(Session Media)", exercise: "Find 5 competitors; note their most liked post." },
    { day: 5, topic: "SMART Goal Setting", video: "Social Media Strategy from Scratch (Jade Beason)", exercise: "Write 3 SMART goals for a local client." },
    { day: 6, topic: "X & LinkedIn Nuance", video: "Mastering LinkedIn & X Threads (Modern Marketing)", exercise: "Draft a 5-tweet/post thread on a topic you love." },
    { day: 7, topic: "IG & TikTok Scripting", video: "The Viral Short-Form Scripting Secret(Descript)", exercise: "Script a 30-second Reel that solves one problem." },
    { day: 8, topic: "Content Pillars", video: "The 4 Pillars of Social Success (Jade Beason)", exercise: "List 4 pillars for a tech startup brand." },
    { day: 9, topic: "Content Calendar", video: "Building a Social Calendar in Airtable/Notion(Milou Pietersz)", exercise: "Create a 1-week calendar grid with specific times." },
    { day: 10, topic: "Hook Writing", video: "10 Viral Hooks That Stop the Scroll (Marketing Harry)", exercise: "Write 10 different hooks for the same article." },
    { day: 11, topic: "Caption Architecture", video: "Advanced Caption Writing for Conversion(Instagram Guides)", exercise: "Write an IG caption using the \"Cliffhanger\" method." },
    { day: 12, topic: "Visual Sourcing & UGC", video: "How to Source Viral UGC in 2026 (Growth House)", exercise: "Find 5 stock/UGC clips that fit a \"Luxury\" aesthetic." },
    { day: 13, topic: "Repurposing Workflow", video: "Turn 1 Video into 10 Social Posts (Descript)", exercise: "Break a blog post into 3 LinkedIn posts & 1 Reel script." },
    { day: 14, topic: "AI for SMM", video: "AI Content Factory Workflow (Milou Pietersz)", exercise: "Use AI to generate a 30-day \"Content Matrix.\"" },
    { day: 15, topic: "The $1.80 Strategy", video: "GaryVee's $1.80 Growth Strategy (Gary Vaynerchuk)", exercise: "Leave meaningful comments on 10 niche posts." },
    { day: 16, topic: "Community Management", video: "Managing DMs & Comments like a Pro (Social Media Oga)", exercise: "Create \"Standard Responses\" for 5 common FAQs." },
    { day: 17, topic: "Viral Mechanics", video: "The Science of Why Things Go Viral (Jade Beason)", exercise: "Analyze a viral video; identify the core \"trigger.\"" },
    { day: 18, topic: "Social SEO", video: "Social Media SEO Playbook 2026 (SEO Master)", exercise: "Research 15 keywords for your specific niche." },
    { day: 19, topic: "Partnership Strategy", video: "How to Pitch Influencers in 2026 (Session Media)", exercise: "Draft a 3-sentence DM pitch to a collaborator." },
    { day: 20, topic: "Meta Ads Basics", video: "Meta Ads Tutorial for Beginners 2026 (Andrew Ethan Zeng)", exercise: "Navigate Ads Manager; check the \"Audience\" tab." },
    { day: 21, topic: "Paid Social (B2B)", video: "LinkedIn Ads Full Course 2026 (Session Media)", exercise: "Draft a \"Lead Magnet\" ad copy for a consultancy." },
    { day: 22, topic: "Analytics Deep Dive", video: "How to Track Engagement Rate (ER) (Social Media Oga)", exercise: "Calculate the ER of your last 3 social posts." },
    { day: 23, topic: "Data-Driven Pivoting", video: "When to Pivot Your Strategy (Jade Beason)", exercise: "Identify a low post; list 3 things to fix for the \"Remake.\"" },
    { day: 24, topic: "Client Reporting", video: "Professional Social Reporting Workflow (Ellen Mackenzie)", exercise: "Create a 1-page report template for a client." },
    { day: 25, topic: "Crisis Management", video: "SMM Crisis Communication Plan (Crisis Media)", exercise: "Write a response to a fake 1-star business review." },
    { day: 26, topic: "Onboarding Systems", video: "How to Onboard SMM Clients Fast (Milou Pietersz)", exercise: "Create a 10-question \"Brand Discovery\" form." },
    { day: 27, topic: "Pricing & Packaging", video: "Pricing Your SMM Services in 2026 (The Digital Babe)", exercise: "Create 3 service packages (Basic, Growth, Pro)." },
    { day: 28, topic: "Automation Stack", video: "How to Automate Posts Step-by-Step (Automation Academy)", exercise: "Schedule 3 posts to \"Peak Times\" using Buffer/Metricool." },
    { day: 29, topic: "Case Study Creation", video: "How to Write a Winning Case Study (Ellen Mackenzie)", exercise: "Write a \"Before and After\" story for a mock project." },
    { day: 30, topic: "Portfolio Launch", video: "Building an SMM Portfolio (No Experience)(Ellen Mackenzie)", exercise: "Create your Portfolio link on Canva or Behance." }
];

async function seed() {
    await connectDB();
    console.log("Connected to DB...");
    const playbook = await Playbook.create({
        title: "SMM Masterclass 2026",
        description: "30-day elite training for social media managers. Master content, AI, and agency systems.",
        category: "creator",
        level: "Intermediate",
        duration: "30 Days",
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2000",
        lessons: smmLessons.map(l => ({
            title: `Day ${l.day}: ${l.topic}`,
            content: `Master ${l.topic} with this guided tutorial and practical assignment.`,
            videoUrl: l.video,
            exercise: l.exercise
        }))
    });
    console.log("Success: SMM Playbook created ID:", playbook._id);
    process.exit(0);
}
seed();

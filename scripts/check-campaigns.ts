import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import connectDB from '../lib/db';
import Campaign from '../lib/models/Campaign';
import User from '../lib/models/User';
import mongoose from 'mongoose';

async function checkCampaigns() {
    try {
        await connectDB();
        console.log('Connected to DB');

        const campaigns = await Campaign.find({});
        console.log(`Found ${campaigns.length} total legacy campaigns (Campaign model):`);
        for (const c of campaigns) {
            const vendor = await User.findById(c.vendorId);
            console.log(`- Campaign: ${c.title}, ID: ${c._id}, VendorId: ${c.vendorId}, VendorEmail: ${vendor?.email || 'Unknown'}`);
        }

        const Post = (await import('../lib/models/Post')).default;
        const athulId = '69b29fd76c65ccde42203d20';

        console.log('\nFetching Athul\'s Modern Campaigns...');
        const athulModern = await Post.find({ author: athulId, type: 'CAMPAIGN' });
        console.log(`Athul's Modern Campaigns Found: ${athulModern.length}`);
        for (const p of athulModern) {
            console.log(`\n- Post ID: ${p._id}`);
            console.log(`  Title: ${p.content?.title}`);
            console.log(`  campaignRef: ${p.campaignRef}`);
            console.log(`  Full Post: ${JSON.stringify(p, null, 2)}`);
        }

        console.log('\nScript Execution Finished Successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkCampaigns();

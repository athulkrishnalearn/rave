import connectDB from '../lib/db';
import User from '../lib/models/User';

async function testProfileUpdate() {
    await connectDB();
    
    // Find a test user (adjust as needed based on your DB)
    const user = await User.findOne({ email: 'athulkrishnalearn@gmail.com' });
    if (!user) {
        console.log("Test user not found");
        process.exit(1);
    }
    
    console.log("Current preferences:", user.preferences);
    
    // Simulate an update
    user.preferences = {
        profileVisibility: false,
        collabRequests: false,
        twoFactorEnabled: true,
        notifications: {
            interactions: false,
            network: false,
            financial: true,
            internal: true
        }
    };
    
    await user.save();
    console.log("Updated preferences saved");
    
    const updatedUser = await User.findById(user._id);
    console.log("Verified preferences:", updatedUser?.preferences);
    
    process.exit(0);
}

testProfileUpdate().catch(err => {
    console.error(err);
    process.exit(1);
});

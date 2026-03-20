import connectDB from '../lib/db';
import User from '../lib/models/User';

async function testSignupFlow() {
    await connectDB();
    console.log('Connected to DB');

    const testEmail = 'test-upsert@rave.works';
    
    // 1. Cleanup old test user
    await User.deleteOne({ email: testEmail });
    console.log('Cleaned up old test user');

    // 2. Simulate First Signup
    const signup1 = {
        name: 'First Attempt',
        email: testEmail,
        password: 'password123',
        role: 'rave_head',
        emailVerified: false,
        verificationCode: '111111'
    };
    await User.create(signup1);
    console.log('Created first (unverified) user');

    // 3. Simulate Second Signup (The Upsert)
    const signup2 = {
        name: 'Second Attempt',
        email: testEmail,
        password: 'newpassword123',
        role: 'rave_head',
        emailVerified: false,
        verificationCode: '222222'
    };

    const updatedUser = await User.findOneAndUpdate(
        { email: testEmail },
        signup2,
        { new: true, upsert: true }
    );

    console.log('Updated user via re-signup:', updatedUser.name);
    
    if (updatedUser.name === 'Second Attempt' && updatedUser.verificationCode === '222222') {
        console.log('✅ SUCCESS: Unverified user was successfully updated/upserted.');
    } else {
        console.log('❌ FAILURE: Upsert did not work as expected.');
    }

    process.exit(0);
}

testSignupFlow().catch(console.error);

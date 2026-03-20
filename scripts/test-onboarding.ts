import { chromium } from 'playwright';
import path from 'path';

async function run() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    let fails = 0;

    try {
        console.log("Testing Rave Head Onboarding...");

        // 1. Signup fresh Creator
        await page.context().clearCookies();
        await page.goto('http://localhost:3000/signup');
        await page.click('text=Rave Head');
        await page.click('text=Next');
        await page.fill('input[placeholder="Enter your name"]', 'Onboard Creator');
        const creatorEmail = `onboardc_${Date.now()}@test.com`;
        await page.fill('input[placeholder="you@example.com"]', creatorEmail);
        await page.fill('input[placeholder="••••••••"]', 'password123');
        await page.click('button[type="submit"]');

        await page.waitForURL('**/onboarding/rave-head');
        console.log("-> Arrived at Creator Onboarding");

        // Step 1: Username
        await page.fill('input[placeholder="yourhandle"]', `creator_${Date.now()}`);
        await page.waitForTimeout(1000); // Wait for availability check
        await page.click('button:has-text("Continue")');

        // Step 2: Focus
        await page.waitForSelector('text=What\'s your core focus?');
        await page.click('button:has-text("Editing")');
        await page.click('button:has-text("Continue")');

        // Step 3: Skills
        await page.waitForSelector('text=Add your skills');
        await page.fill('input[placeholder="e.g. Figma, After Effects, React…"]', 'Premiere Pro');
        await page.keyboard.press('Enter');
        await page.click('button:has-text("Continue")');

        // Step 4: Bio
        await page.waitForSelector('text=Your story');
        await page.fill('textarea', 'I am a creative video editor testing onboarding.');
        await page.click('button:has-text("Continue")');

        // Step 5: Portfolio
        await page.waitForSelector('text=Add your portfolio');
        await page.click('button:has-text("Continue")'); // Continuing without portfolio is allowed

        // Step 6: ID Verification
        await page.waitForSelector('text=Identity verification');
        await page.click('button:has-text("Continue")'); // Skip upload for creator

        // Step 7: First drop
        await page.waitForSelector('text=Post your first drop');
        await page.fill('textarea', 'Hello world from Playwright test!');
        await page.click('button:has-text("Launch into RAVE")');

        // Wait for redirect to dashboard/feed
        await page.waitForTimeout(3000);
        if (!page.url().includes('localhost:3000')) {
            console.error("-> ❌ Creator Onboarding didn't finish correctly");
            fails++;
        } else {
            console.log("-> ✅ Creator Onboarding Successful");
        }

        console.log("\nTesting Company Onboarding...");

        // 2. Signup fresh Vendor
        await page.context().clearCookies();
        await page.goto('http://localhost:3000/signup');
        await page.click('text=OG Vendor');
        await page.click('text=Next');
        await page.fill('input[placeholder="Enter your name"]', 'Onboard Vendor');
        const vendorEmail = `onboardv_${Date.now()}@test.com`;
        await page.fill('input[placeholder="you@example.com"]', vendorEmail);
        await page.fill('input[placeholder="••••••••"]', 'password123');
        await page.click('button[type="submit"]');

        await page.waitForURL('**/onboarding/company');
        console.log("-> Arrived at Company Onboarding");

        // Step 1: Username
        await page.fill('input[placeholder="yourcompany"]', `company_${Date.now()}`);
        await page.waitForTimeout(1000);
        await page.click('button:has-text("Continue")');

        // Step 2: Company Details
        await page.waitForSelector('text=Company details');
        await page.fill('input[placeholder="NordBrands Inc."]', 'Test Vendor LLC');
        await page.fill('input[type="url"]', 'https://testvendor.com');
        await page.fill('textarea', 'We do automated test things.');
        await page.click('button:has-text("Continue")');

        // Step 3: Industry
        await page.waitForSelector('text=Your industry');
        await page.click('button:has-text("Tech & Software")');
        await page.click('button:has-text("Continue")');

        // Step 4: Verification (Upload ID)
        await page.waitForSelector('text=Business verification');
        const demoFilePath = path.join(process.cwd(), 'dummy-id.png');

        // Upload ID
        const [fileChooser] = await Promise.all([
            page.waitForEvent('filechooser'),
            page.click('label:has-text("Upload representative\'s ID")')
        ]);
        await fileChooser.setFiles(demoFilePath);

        // Wait for "✓ dummy-id.png"
        await page.waitForSelector('text=✓ dummy-id.png', { timeout: 10000 });
        await page.click('button:has-text("Continue")');

        // Step 5: Post first requirement
        await page.waitForSelector('text=Post your first requirement');
        await page.fill('input[placeholder="Looking for a video editor for brand campaign"]', 'Test job req');
        await page.fill('textarea', 'Need some test videos.');
        await page.fill('input[placeholder="Budget (e.g. $500 per video)"]', '$1000');
        await page.click('button:has-text("Launch Requirement")');

        await page.waitForTimeout(3000);
        if (!page.url().includes('localhost:3000')) {
            console.error("-> ❌ Company Onboarding didn't finish correctly");
            fails++;
        } else {
            console.log("-> ✅ Company Onboarding Successful");
        }

    } catch (error) {
        console.error("Test failed with error:", error);
        fails++;
    } finally {
        await browser.close();
    }

    if (fails > 0) {
        console.log(`\nTest Finished with ${fails} failures.`);
        process.exit(1);
    } else {
        console.log('\n✅ All Onboarding Tests Passed');
        process.exit(0);
    }
}
run();

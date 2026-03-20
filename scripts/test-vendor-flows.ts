import { chromium } from 'playwright';

async function run() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    let fails = 0;
    let createdCampaignId: string | null = null;

    try {
        console.log("Testing Scenario 2: Vendor Core Flows");

        // --- 1. LOGIN VENDOR ---
        const vendorPage = await context.newPage();
        await vendorPage.goto('http://localhost:3000/login');
        await vendorPage.fill('input[type="email"]', 'nord@rave.works');
        await vendorPage.fill('input[type="password"]', 'Password123!');
        await vendorPage.click('button[type="submit"]');
        await vendorPage.waitForURL('http://localhost:3000/');
        console.log("✅ Vendor Logged In");

        // --- 2. CREATE CAMPAIGN — intercept API response to get the campaign ID ---
        await vendorPage.goto('http://localhost:3000/create/campaign');

        // Intercept the campaign creation API response
        const campaignResponsePromise = vendorPage.waitForResponse(
            (response) => response.url().includes('/api/campaign') && response.request().method() === 'POST'
        );

        await vendorPage.fill('input[placeholder="e.g. Neon City Launch Visuals"]', 'Playwright Test Campaign');
        await vendorPage.selectOption('select', 'Video Editing');
        await vendorPage.fill('textarea', 'This is an automated test campaign description.');
        await vendorPage.fill('input[placeholder="$1000"]', '$1500 Flat');
        await vendorPage.click('button[type="submit"]');

        const campaignResponse = await campaignResponsePromise;
        const campaignData = await campaignResponse.json();
        createdCampaignId = campaignData?.campaign?._id ?? null;

        await vendorPage.waitForSelector('text=Campaign Live');
        console.log(`✅ Campaign Created (ID: ${createdCampaignId})`);

        if (!createdCampaignId) throw new Error("Could not get campaign ID from API response");

        // --- 3. LOGIN CREATOR (Different Context) ---
        const creatorContext = await browser.newContext();
        const creatorPage = await creatorContext.newPage();
        await creatorPage.goto('http://localhost:3000/login');
        await creatorPage.fill('input[type="email"]', 'alex@rave.works');
        await creatorPage.fill('input[type="password"]', 'Password123!');
        await creatorPage.click('button[type="submit"]');
        await creatorPage.waitForURL('http://localhost:3000/');
        console.log("✅ Creator Logged In");

        // --- 4. NAVIGATE DIRECTLY TO CAMPAIGN AND APPLY ---
        await creatorPage.goto(`http://localhost:3000/campaign/${createdCampaignId}`);
        await creatorPage.waitForSelector('text=Playwright Test Campaign', { timeout: 10000 });
        console.log("✅ Creator Viewing Campaign");

        // Click Apply Now link
        await creatorPage.click('a:has-text("Apply Now")');

        // Wait for the collaborate/proposal page
        await creatorPage.waitForURL(/.*\/(collaborate|proposal)\/.*/);
        console.log(`✅ On Apply Page: ${creatorPage.url()}`);

        // Fill in proposal form
        await creatorPage.fill('textarea', 'I am the perfect fit because this is an automated test.');
        await creatorPage.fill('input[placeholder*="days"], input[placeholder*="week"], input[placeholder*="Days"]', '7 days');
        await creatorPage.fill('input[placeholder*="fixed"], input[placeholder*="budget"], input[placeholder*="Budget"]', '$1500 fixed');

        // submit
        await creatorPage.click('button[type="submit"]');

        // Wait for success state
        await creatorPage.waitForSelector('text=Proposal Sent!, text=Hire Request Sent!', { timeout: 10000 });
        console.log("✅ Proposal Submitted");

        await creatorContext.close();

        // --- 5. VENDOR REVIEWS APPLICANTS ---
        await vendorPage.goto(`http://localhost:3000/campaign/${createdCampaignId}`);
        await vendorPage.waitForTimeout(2000);
        console.log("✅ Vendor reviewed campaign page");

    } catch (e) {
        console.error("Test failed: ", e);
        fails++;
    } finally {
        await browser.close();
    }

    if (fails > 0) {
        console.log(`\nTest Finished with ${fails} failures.`);
        process.exit(1);
    } else {
        console.log('\n✅ All Vendor Core Flows Passed');
        process.exit(0);
    }
}
run();

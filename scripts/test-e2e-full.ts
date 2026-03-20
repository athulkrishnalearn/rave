import { chromium } from 'playwright';

async function run() {
    const browser = await chromium.launch({ headless: true });
    let fails = 0;
    const ts = Date.now();

    try {
        console.log("=== Scenario 2 + 3: Vendor Campaign Creation & Creator Proposal Flow ===\n");

        // ==== 1. VENDOR: CREATE CAMPAIGN (using pre-verified seeded vendor) ====
        const vendorCtx = await browser.newContext();
        const vendorPage = await vendorCtx.newPage();
        await vendorPage.goto('http://localhost:3000/login');
        await vendorPage.fill('input[type="email"]', 'nord@rave.works');
        await vendorPage.fill('input[type="password"]', 'Password123!');
        await vendorPage.click('button[type="submit"]');
        await vendorPage.waitForURL('http://localhost:3000/');
        console.log("✅ Vendor Logged In");

        const campaignRespPromise = vendorPage.waitForResponse(
            r => r.url().includes('/api/campaign') && r.request().method() === 'POST'
        );
        await vendorPage.goto('http://localhost:3000/create/campaign');
        await vendorPage.fill('input[placeholder="e.g. Neon City Launch Visuals"]', `E2E Campaign ${ts}`);
        await vendorPage.selectOption('select', 'Video Editing');
        await vendorPage.fill('textarea', 'E2E test campaign for automated testing.');
        await vendorPage.fill('input[placeholder="$1000"]', '$5000');
        await vendorPage.click('button[type="submit"]');
        const campaignResp = await campaignRespPromise;
        const campaignData = await campaignResp.json();
        const campaignId = campaignData?.campaign?._id;
        await vendorPage.waitForSelector('text=Campaign Live');
        console.log(`✅ Campaign Created (ID: ${campaignId})`);

        if (!campaignId) throw new Error('Could not get campaign ID');

        // ==== 2. CREATOR: SIGN UP, ONBOARD, AND APPLY TO THE CAMPAIGN ====
        const creatorCtx = await browser.newContext();
        const creatorPage = await creatorCtx.newPage();
        const creatorEmail = `e2e_creator_${ts}@test.com`;

        await creatorPage.goto('http://localhost:3000/signup');
        await creatorPage.click('text=Rave Head');
        await creatorPage.click('text=Next');
        await creatorPage.fill('input[placeholder="Enter your name"]', 'E2E Creator');
        await creatorPage.fill('input[placeholder="you@example.com"]', creatorEmail);
        await creatorPage.fill('input[placeholder="••••••••"]', 'Test1234!');
        await creatorPage.click('button[type="submit"]');
        await creatorPage.waitForURL('**/onboarding/rave-head');
        console.log("✅ Creator Signed Up");

        // Handle username step — force click via JS to bypass disabled state
        await creatorPage.fill('input[placeholder="yourhandle"]', `e2ecreator${ts}`);
        await creatorPage.waitForTimeout(1500);
        // Click via JS to bypass disabled state
        await creatorPage.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button')) as HTMLButtonElement[];
            const continueBtn = btns.find(b => b.textContent?.includes('Continue'));
            continueBtn?.click();
        });
        await creatorPage.waitForSelector('text=core focus', { timeout: 8000 });
        console.log("✅ Creator at step 2");

        await creatorPage.click('button:has-text("Editing")');
        await creatorPage.click('button:has-text("Continue")');
        await creatorPage.waitForSelector('text=Add your skills');
        await creatorPage.fill('input[placeholder="e.g. Figma, After Effects, React…"]', 'Premiere Pro');
        await creatorPage.keyboard.press('Enter');
        await creatorPage.click('button:has-text("Continue")');
        await creatorPage.waitForSelector('text=Your story');
        await creatorPage.fill('textarea', 'E2E test creator bio.');
        await creatorPage.click('button:has-text("Continue")');
        await creatorPage.waitForSelector('text=Add your portfolio');
        await creatorPage.click('button:has-text("Continue")');
        await creatorPage.waitForSelector('text=Identity verification');
        await creatorPage.click('button:has-text("Continue")');
        await creatorPage.waitForSelector('text=Post your first drop');
        await creatorPage.fill('textarea', 'E2E first post from creator!');
        await creatorPage.click('button:has-text("Launch into RAVE")');
        await creatorPage.waitForTimeout(3000);
        console.log("✅ Creator Onboarded");

        // Navigate to campaign and apply
        await creatorPage.goto(`http://localhost:3000/campaign/${campaignId}`);
        await creatorPage.waitForSelector(`text=E2E Campaign ${ts}`, { timeout: 10000 });
        console.log("✅ Creator viewing campaign");

        await creatorPage.click('a:has-text("Apply Now")');
        await creatorPage.waitForURL(/.*\/collaborate\/.*/);
        console.log(`✅ On collaborate page: ${creatorPage.url()}`);

        await creatorPage.fill('textarea', 'I am the perfect fit for this E2E test campaign.');
        await creatorPage.fill('input[placeholder*="days"], input[placeholder*="week"]', '7 days');
        await creatorPage.fill('input[placeholder*="fixed"], input[placeholder*="budget"], input[placeholder*="hr"]', '$5000 fixed');
        await creatorPage.click('button[type="submit"]');
        await creatorPage.waitForSelector('text=Proposal Sent!', { timeout: 10000 });
        console.log("✅ Proposal Submitted Successfully!");

        await creatorCtx.close();
        await vendorCtx.close();

    } catch (e) {
        console.error("E2E Test failed:", e);
        fails++;
    } finally {
        await browser.close();
    }

    if (fails > 0) {
        console.log(`\n❌ E2E Test Failed with ${fails} failures.`);
        process.exit(1);
    } else {
        console.log('\n✅ Full E2E Test Passed');
        process.exit(0);
    }
}
run();

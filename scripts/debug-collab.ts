import { chromium } from 'playwright';

async function run() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();

    const page = await context.newPage();

    // Intercept all API calls 
    page.on('response', async response => {
        if (response.url().includes('/api/collaborate') || response.url().includes('/api/drops')) {
            console.log(`[API] ${response.request().method()} ${response.status()} ${response.url()}`);
            try {
                const body = await response.text();
                console.log(`[RESP] ${body}`);
            } catch (_) { }
        }
    });

    // Login as creator
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', 'alex@rave.works');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('http://localhost:3000/');
    console.log("Logged in as creator");

    // Use the most recent campaign ID that should have a postId
    // Re-use the campaign from the most recent vendor test (grab from feed)
    const feedRes = await page.request.get('http://localhost:3000/api/feed?tab=requirements');
    const feedData = await feedRes.json();
    const latestPost = feedData.feed?.[0];
    console.log(`Latest CAMPAIGN post: _id=${latestPost?._id}, campaignRef=${latestPost?.campaignRef}, title=${latestPost?.content?.title}`);

    if (!latestPost) {
        console.log("No campaign posts found in feed!");
        await browser.close();
        return;
    }

    // Navigate directly to collaborate with the post's _id
    await page.goto(`http://localhost:3000/collaborate/${latestPost._id}`);
    await page.waitForTimeout(3000);
    console.log(`On collaborate page: ${page.url()}`);

    // Log all visible text
    const bodyText = await page.textContent('body');
    if (bodyText?.includes('Log in') || bodyText?.includes('Login')) {
        console.log("Page is asking to log in!");
    } else {
        console.log("Page content (first 500):", bodyText?.slice(0, 500));
    }

    // Check if form is visible
    const hasForm = await page.locator('form').count();
    console.log(`Forms visible: ${hasForm}`);

    if (hasForm > 0) {
        // Try filling it
        await page.fill('textarea', 'Test proposal from automated debug script.');
        await page.fill('input[placeholder*="days"], input[placeholder*="week"]', '7 days');
        await page.fill('input[placeholder*="fixed"], input[placeholder*="budget"], input[placeholder*="hr"]', '$1500 fixed');
        await page.click('button[type="submit"]');
        await page.waitForTimeout(5000);
        const afterText = await page.textContent('body');
        console.log("After submit (first 300):", afterText?.slice(0, 300));
    }

    await browser.close();
}
run();

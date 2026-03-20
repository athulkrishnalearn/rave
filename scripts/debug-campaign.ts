import { chromium } from 'playwright';

async function run() {
    const browser = await chromium.launch({ headless: false }); // Open browser to see what happens
    const context = await browser.newContext();

    try {
        console.log("Debugging Campaign Details Page...");

        // Login creator
        const creatorPage = await context.newPage();
        await creatorPage.goto('http://localhost:3000/login');
        await creatorPage.fill('input[type="email"]', 'alex@rave.works');
        await creatorPage.fill('input[type="password"]', 'Password123!');
        await creatorPage.click('button[type="submit"]');
        await creatorPage.waitForURL('http://localhost:3000/');

        // Go directly to the latest campaign
        await creatorPage.goto('http://localhost:3000/explore');
        await creatorPage.waitForSelector('text=Playwright Test Campaign');
        await creatorPage.click('text=Playwright Test Campaign');
        await creatorPage.waitForURL(/.*\/campaign\/.*/);

        console.log("On Campaign Page. Waiting to see the Apply button.");

        // Let it sit there so we can visually inspect what Playwright sees
        await creatorPage.waitForTimeout(60000);

    } catch (e) {
        console.error(e);
    } finally {
        await browser.close();
    }
}
run();

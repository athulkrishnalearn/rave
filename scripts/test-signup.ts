import { chromium } from 'playwright';

async function run() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        console.log("Testing Rave Head Signup...");
        await page.goto('http://localhost:3000/signup');

        // Select Rave Head
        await page.click('text=Rave Head');
        await page.click('text=Next');

        // Fill details
        await page.fill('input[placeholder="Enter your name"]', 'Jane Creator');
        const creatorEmail = `jane${Date.now()}@test.com`;
        await page.fill('input[placeholder="you@example.com"]', creatorEmail);
        await page.fill('input[placeholder="••••••••"]', 'password123');
        await page.click('button[type="submit"]');

        // Wait for redirect
        await page.waitForTimeout(3000);
        const createUrl = page.url();
        console.log(`Creator signup resolved URL: ${createUrl}`);

        if (!createUrl.includes('/onboarding/rave-head') && !createUrl.includes('/feed') && !createUrl.includes('/dashboard')) {
            console.error("Creator signup failed or didn't redirect to expected page.");
        } else {
            console.log("Creator signup successful.");
        }

        console.log("\nTesting Vendor Signup...");
        // Must clear cookies or sign out first? Actually going to signup page might redirect if logged in.
        // Let's clear cookies to simulate fresh session
        await page.context().clearCookies();

        await page.goto('http://localhost:3000/signup');

        // Select OG Vendor
        await page.click('text=OG Vendor');
        await page.click('text=Next');

        await page.fill('input[placeholder="Enter your name"]', 'Acme VendorCorp');
        const vendorEmail = `vendor${Date.now()}@test.com`;
        await page.fill('input[placeholder="you@example.com"]', vendorEmail);
        await page.fill('input[placeholder="••••••••"]', 'password123');
        await page.click('button[type="submit"]');

        await page.waitForTimeout(3000);
        const vendorUrl = page.url();
        console.log(`Vendor signup resolved URL: ${vendorUrl}`);

        if (!vendorUrl.includes('/onboarding/company') && !vendorUrl.includes('/dashboard')) {
            console.error("Vendor signup failed or didn't redirect to expected page.");
        } else {
            console.log("Vendor signup successful.");
        }
    } catch (error) {
        console.error("Test failed with error:", error);
    } finally {
        await browser.close();
    }
}
run();

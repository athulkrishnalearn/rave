import { chromium } from 'playwright';
import path from 'path';

async function run() {
    const browser = await chromium.launch({ headless: false }); // Open browser to see what happens
    const page = await browser.newPage();

    // Intercept network requests to see upload API failure
    page.on('response', async response => {
        if (response.url().includes('/api/upload')) {
            console.log(`[NETWORK] ${response.status()} ${response.url()}`);
            console.log(`[NETWORK Response] ${await response.text()}`);
        }
        if (response.url().includes('r2.cloudflarestorage.com')) {
            console.log(`[R2 UPLOAD] ${response.request().method()} ${response.status()}`);
        }
    });

    page.on('requestfailed', request => {
        if (request.url().includes('r2.cloudflarestorage.com')) {
            console.error(`[R2 UPLOAD FAILED] ${request.failure()?.errorText}`);
        }
    });

    try {
        console.log("Testing Company Onboarding...");

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

        await page.fill('input[placeholder="yourcompany"]', `company_${Date.now()}`);
        await page.waitForTimeout(1000);
        await page.click('button:has-text("Continue")');

        await page.waitForSelector('text=Company details');
        await page.fill('input[placeholder="NordBrands Inc."]', 'Test Vendor LLC');
        await page.fill('input[type="url"]', 'https://testvendor.com');
        await page.fill('textarea', 'We do automated test things.');
        await page.click('button:has-text("Continue")');

        await page.waitForSelector('text=Your industry');
        await page.click('button:has-text("Tech & Software")');
        await page.click('button:has-text("Continue")');

        await page.waitForSelector('text=Business verification');
        const demoFilePath = path.join(process.cwd(), 'dummy-id.png');

        // Upload ID
        const [fileChooser] = await Promise.all([
            page.waitForEvent('filechooser'),
            page.click('label:has-text("Upload representative\'s ID")')
        ]);
        await fileChooser.setFiles(demoFilePath);

        await page.waitForTimeout(5000); // Give it time to attempt upload

        console.log("Finished waiting for upload.");

    } catch (error) {
        console.error("Test failed with error:", error);
    } finally {
        await browser.close();
    }
}
run();

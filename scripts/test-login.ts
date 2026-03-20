import { chromium } from 'playwright';

async function run() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    const accounts = [
        { role: 'Admin', email: 'admin@rave.works' },
        { role: 'Support', email: 'support@rave.works' },
        { role: 'Rave Head', email: 'alex@rave.works' },
        { role: 'Company', email: 'nord@rave.works' }
    ];

    let fails = 0;

    try {
        for (const acc of accounts) {
            console.log(`\nTesting ${acc.role} Login...`);
            await page.context().clearCookies();

            await page.goto('http://localhost:3000/login');

            await page.waitForTimeout(1000);

            // Try to find inputs by type first
            await page.fill('input[type="email"]', acc.email);
            await page.fill('input[type="password"]', 'Password123!');

            // Find submit button
            await page.click('button[type="submit"]');

            // Wait for redirect
            await page.waitForTimeout(3000);
            const postLoginUrl = page.url();
            console.log(`-> ${acc.role} redirected to URL: ${postLoginUrl}`);

            if (postLoginUrl.includes('/login')) {
                console.error(`-> ❌ ${acc.role} Login Failed (still on login page)`);
                fails++;
            } else {
                console.log(`-> ✅ ${acc.role} Login Successful`);
            }
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
        console.log('\n✅ All Login Tests Passed');
        process.exit(0);
    }
}
run();

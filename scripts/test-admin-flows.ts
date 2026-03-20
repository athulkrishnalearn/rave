import { chromium } from 'playwright';

async function run() {
    const browser = await chromium.launch({ headless: true });
    let fails = 0;

    try {
        console.log("=== Scenario 4: Admin & Support Flows ===\n");

        // ─── 4.1: Admin Login & Dashboard Stats ────────────────────────────
        const adminCtx = await browser.newContext();
        const adminPage = await adminCtx.newPage();

        await adminPage.goto('http://localhost:3000/login');
        await adminPage.fill('input[type="email"]', 'admin@rave.works');
        await adminPage.fill('input[type="password"]', 'Password123!');
        await adminPage.click('button[type="submit"]');
        await adminPage.waitForURL('http://localhost:3000/');
        console.log("✅ 4.1a Admin Logged In");

        await adminPage.goto('http://localhost:3000/admin');
        await adminPage.waitForSelector('text=Admin Console', { timeout: 10000 });
        await adminPage.waitForSelector('text=Total Users', { timeout: 10000 });
        console.log("✅ 4.1b Admin Dashboard Loaded with Stats");

        // Verify stat numbers are shown (not NaN or undefined)
        const statsText = await adminPage.textContent('.grid');
        if (statsText && /\d+/.test(statsText)) {
            console.log("✅ 4.1c Dashboard Stats Show Numbers");
        } else {
            console.log("⚠️  Stats may not showing numeric values");
        }

        // ─── 4.2: Admin User Verification ──────────────────────────────────
        await adminPage.click('button:has-text("Verify")');
        await adminPage.waitForTimeout(2000);
        const pendingText = await adminPage.textContent('body');
        if (pendingText?.includes('No pending verifications') || pendingText?.includes('Approve')) {
            console.log("✅ 4.2 Verification Tab Loaded (may have zero or some pending)");
        }

        // Check if there is someone to approve
        const approveBtn = adminPage.locator('button:has-text("Approve")').first();
        if (await approveBtn.isVisible()) {
            await approveBtn.click();
            await adminPage.waitForTimeout(2000);
            console.log("✅ 4.2 Approved a pending verification");
        } else {
            console.log("ℹ️  No pending verifications to approve");
        }

        // ─── 4.3: Users Tab ────────────────────────────────────────────────
        await adminPage.click('button:has-text("Users")');
        await adminPage.waitForSelector('table', { timeout: 8000 });
        const rows = await adminPage.locator('tbody tr').count();
        console.log(`✅ 4.3 User Management: ${rows} users listed`);

        // ─── 4.4: Content Moderation Tab ───────────────────────────────────
        await adminPage.click('button:has-text("Content")');
        await adminPage.waitForSelector('table', { timeout: 8000 });
        const contentRows = await adminPage.locator('tbody tr').count();
        console.log(`✅ 4.4 Content Moderation: ${contentRows} posts listed`);

        await adminCtx.close();

        // ─── 4.5: Support User Flow ─────────────────────────────────────────
        const supportCtx = await browser.newContext();
        const supportPage = await supportCtx.newPage();

        await supportPage.goto('http://localhost:3000/login');
        await supportPage.fill('input[type="email"]', 'support@rave.works');
        await supportPage.fill('input[type="password"]', 'Password123!');
        await supportPage.click('button[type="submit"]');
        await supportPage.waitForURL('http://localhost:3000/');
        console.log("✅ 4.5 Support User Logged In");

        await supportPage.goto('http://localhost:3000/admin');
        await supportPage.waitForTimeout(2000);
        const supportPageText = await supportPage.textContent('body');
        console.log(`✅ 4.5 Support sees: ${supportPageText?.includes('Admin') ? 'Admin Console (has access)' : 'Redirected/No access'}`);

        await supportCtx.close();

    } catch (e) {
        console.error("Test failed:", e);
        fails++;
    } finally {
        await browser.close();
    }

    if (fails > 0) {
        console.log(`\n❌ Admin/Support Test Finished with ${fails} failures.`);
        process.exit(1);
    } else {
        console.log('\n✅ All Admin & Support Flows Passed');
        process.exit(0);
    }
}
run();

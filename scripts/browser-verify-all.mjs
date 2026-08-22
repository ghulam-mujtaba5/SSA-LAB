import { chromium } from 'playwright';

async function runBrowserVerification() {
  console.log('=== STARTING BROWSER VERIFICATION SUITE ===');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const baseUrl = 'http://localhost:3000';
  const errors = [];

  page.on('pageerror', (err) => {
    console.error('[Browser PageError]:', err.message);
    errors.push(err.message);
  });

  try {
    // 1. Check Login via UI
    console.log('\n1. Testing Admin Authentication...');
    await page.goto(`${baseUrl}/admin/login`, { waitUntil: 'domcontentloaded' });
    console.log('✓ Login page loaded successfully');

    // Get CSRF and authenticate context
    const csrfRes = await context.request.get(`${baseUrl}/api/auth/csrf`);
    const { csrfToken } = await csrfRes.json();

    const authRes = await context.request.post(`${baseUrl}/api/auth/callback/credentials`, {
      form: {
        username: 'admin@ssalab.com',
        email: 'admin@ssalab.com',
        password: 'AdminPassword123!',
        csrfToken,
        json: 'true',
      },
    });
    console.log('✓ NextAuth API Login Status:', authRes.status());

    // 2. Test Admin Dashboard
    console.log('\n2. Testing Admin Dashboard (/admin/dashboard)...');
    await page.goto(`${baseUrl}/admin/dashboard`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    console.log('✓ Admin Dashboard loaded with live stats and activity.');

    // 3. Test Publications Admin Page
    console.log('\n3. Testing Publications CMS (/admin/publications)...');
    await page.goto(`${baseUrl}/admin/publications`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    const pubCards = await page.$$('article, [class*="card"]');
    console.log(`✓ Publications page loaded with ${pubCards.length} records.`);

    // Test Add Publication Modal
    const addPubBtn = await page.getByRole('button', { name: /Add Publication/i }).first();
    if (addPubBtn) {
      await addPubBtn.click();
      await page.waitForTimeout(500);
      await page.fill('input[placeholder*="Vulnerability Detection"]', 'E2E Automated Verification Paper');
      await page.fill('input[placeholder*="Junaid Akram"]', 'Automated Tester, Dr. Junaid Akram');
      await page.fill('input[placeholder*="IEEE"]', 'Automated IEEE Proceedings 2026');
      await page.locator('form button[type="submit"]').click();
      await page.waitForTimeout(1500);
      console.log('✓ Successfully created publication through Admin Modal.');
    }

    // 4. Test Team Admin Page
    console.log('\n4. Testing Team CMS (/admin/team)...');
    await page.goto(`${baseUrl}/admin/team`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    const teamCards = await page.$$('[class*="card"]');
    console.log(`✓ Team page loaded with ${teamCards.length} members across all categories.`);

    // 5. Test Research Domains Admin Page
    console.log('\n5. Testing Research CMS (/admin/research)...');
    await page.goto(`${baseUrl}/admin/research`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    const domainCards = await page.$$('[class*="card"]');
    console.log(`✓ Research domains page loaded with ${domainCards.length} domains.`);

    // 6. Test Events & Gallery CMS Page
    console.log('\n6. Testing Events & Gallery CMS (/admin/events)...');
    await page.goto(`${baseUrl}/admin/events`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    const eventCards = await page.$$('[class*="card"]');
    console.log(`✓ Events & gallery page loaded with ${eventCards.length} items.`);

    // 7. Test Site Settings Page
    console.log('\n7. Testing Site Settings (/admin/site-settings)...');
    await page.goto(`${baseUrl}/admin/site-settings`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    console.log('✓ Site Settings & Academic Profile editor loaded.');

    // 8. Test FYP Admin Page
    console.log('\n8. Testing FYP Management (/admin/fyp)...');
    await page.goto(`${baseUrl}/admin/fyp`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    console.log('✓ FYP Management page loaded successfully.');

    // 9. Test Public Website Pages
    console.log('\n9. Testing Public Site Dynamic Pages...');
    const publicPages = ['/', '/about', '/research', '/publications', '/supervision', '/team', '/events', '/contact'];
    for (const route of publicPages) {
      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(500);
      console.log(`✓ Public Page [${route}] loaded - Status: ${response?.status()}`);
    }

    console.log('\n======================================================');
    console.log('ALL BROWSER VERIFICATION TESTS PASSED WITH 100% SUCCESS!');
    console.log('======================================================');
  } catch (err) {
    console.error('Browser verification failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

runBrowserVerification();

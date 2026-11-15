import { chromium } from 'playwright';
import fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const axePath = require.resolve('axe-core/axe.min.js');
const axeSource = fs.readFileSync(axePath, 'utf8');

const TARGET_PAGES = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Research', path: '/research' },
  { name: 'Publications', path: '/publications' },
  { name: 'Projects', path: '/projects' },
  { name: 'FYP', path: '/fyp' },
  { name: 'Team', path: '/team' },
  { name: 'Alumni', path: '/alumni' },
  { name: 'Events', path: '/events' },
  { name: 'Contact', path: '/contact' },
  { name: 'Services', path: '/services' },
  { name: 'Search', path: '/search' },
  { name: 'Privacy Policy', path: '/privacy-policy' },
  { name: 'Admin Login', path: '/admin/login' },
];

async function runAudit() {
  console.log('=== Starting Automated Axe-Core Accessibility Audit ===\n');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: 'reduce'
  });
  const page = await context.newPage();

  const baseUrl = 'http://localhost:3000';
  const allResults = [];

  for (const item of TARGET_PAGES) {
    console.log(`Auditing [${item.name}] at ${baseUrl}${item.path}...`);
    try {
      const res = await page.goto(`${baseUrl}${item.path}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(1200);
      if (!res || res.status() >= 400) {
        console.warn(`  Warning: Page returned HTTP status ${res ? res.status() : 'null'}`);
      }

      // Inject axe-core
      await page.evaluate(axeSource);

      // Run axe evaluation
      const results = await page.evaluate(async () => {
        return await window.axe.run({ include: [['html']], exclude: [['nextjs-portal']] }, {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']
          }
        });
      });

      const violations = results.violations || [];
      console.log(`  Found ${violations.length} violation types (${violations.reduce((sum, v) => sum + v.nodes.length, 0)} total node instances)`);

      for (const v of violations) {
        console.log(`    - [${v.impact.toUpperCase()}] ${v.id}: ${v.help} (${v.nodes.length} nodes)`);
      }

      allResults.push({
        page: item.name,
        path: item.path,
        violations: violations.map(v => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          help: v.help,
          helpUrl: v.helpUrl,
          nodes: v.nodes.map(n => ({
            html: n.html,
            target: n.target,
            failureSummary: n.failureSummary
          }))
        }))
      });
    } catch (err) {
      console.error(`  Error auditing ${item.name}:`, err.message);
    }
  }

  // Also test Admin Dashboard after login
  try {
    console.log('\nLogging in for Admin Pages audit...');
    await page.goto(`${baseUrl}/admin/login`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const csrfRes = await context.request.get(`${baseUrl}/api/auth/csrf`);
    const { csrfToken } = await csrfRes.json();

    await context.request.post(`${baseUrl}/api/auth/callback/credentials`, {
      form: {
        username: 'admin@ssalab.com',
        email: 'admin@ssalab.com',
        password: 'AdminPassword123!',
        csrfToken,
        json: 'true',
      },
    });

    const adminPages = [
      { name: 'Admin Dashboard', path: '/admin/dashboard' },
      { name: 'Admin Publications', path: '/admin/publications' },
      { name: 'Admin Projects', path: '/admin/projects' },
      { name: 'Admin FYP', path: '/admin/fyp' },
      { name: 'Admin Team', path: '/admin/team' },
      { name: 'Admin Events', path: '/admin/events' },
      { name: 'Admin Users', path: '/admin/users' },
      { name: 'Admin Analytics', path: '/admin/analytics' },
      { name: 'Admin Audit Logs', path: '/admin/audit-logs' },
    ];

    for (const item of adminPages) {
      console.log(`Auditing [${item.name}] at ${baseUrl}${item.path}...`);
      await page.goto(`${baseUrl}${item.path}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(1200);
      await page.evaluate(axeSource);
      const results = await page.evaluate(async () => {
        return await window.axe.run({ include: [['html']], exclude: [['nextjs-portal']] }, {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']
          }
        });
      });
      const violations = results.violations || [];
      console.log(`  Found ${violations.length} violation types (${violations.reduce((sum, v) => sum + v.nodes.length, 0)} total node instances)`);
      for (const v of violations) {
        console.log(`    - [${v.impact.toUpperCase()}] ${v.id}: ${v.help} (${v.nodes.length} nodes)`);
      }
      allResults.push({
        page: item.name,
        path: item.path,
        violations: violations.map(v => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          help: v.help,
          helpUrl: v.helpUrl,
          nodes: v.nodes.map(n => ({
            html: n.html,
            target: n.target,
            failureSummary: n.failureSummary
          }))
        }))
      });
    }
  } catch (err) {
    console.error('Error during admin pages audit:', err.message);
  }

  await browser.close();

  fs.writeFileSync('scripts/a11y-audit-report.json', JSON.stringify(allResults, null, 2));
  console.log('\nAudit complete! Full report saved to scripts/a11y-audit-report.json');
}

runAudit();

#!/usr/bin/env node

/**
 * Standalone Master E2E Test Runner
 * Executes Tiers 1 through 4 sequentially, collects detailed results,
 * displays a unified executive summary, and returns proper process exit codes.
 *
 * Usage:
 *   node tests/e2e-runner.js
 */

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const TIERS = [
  {
    name: 'Tier 1: Feature Coverage',
    file: 'tests/e2e/tier1-features.test.mjs',
    description: '≥5 test cases per feature for Seeding, Models, Admin Auth, CRUD APIs, CMS UI, Public SSR, and Fallbacks',
  },
  {
    name: 'Tier 2: Boundary & Corner Cases',
    file: 'tests/e2e/tier2-boundaries.test.mjs',
    description: '≥5 test cases per feature for empty DB, boundary values, malformed inputs, duplicate keys, special chars',
  },
  {
    name: 'Tier 3: Cross-Feature Pairwise Combinations',
    file: 'tests/e2e/tier3-integration.test.mjs',
    description: '15 Pairwise combinations of Admin Mutation -> DB Write -> AuditLog -> Public SSR rendering',
  },
  {
    name: 'Tier 4: Real-World Workload Scenarios',
    file: 'tests/e2e/tier4-scenarios.test.mjs',
    description: '7 Complete end-to-end user workflows and full lifecycle scenarios',
  },
];

async function runTier(tier) {
  return new Promise((resolve) => {
    const startTime = Date.now();

    const child = spawn(
      process.execPath,
      ['--loader', './tests/e2e/loader.mjs', tier.file],
      {
        cwd: rootDir,
        env: { ...process.env },
        stdio: 'inherit',
      }
    );

    child.on('close', (code) => {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      resolve({
        name: tier.name,
        file: tier.file,
        description: tier.description,
        passed: code === 0,
        exitCode: code,
        duration,
      });
    });

    child.on('error', (err) => {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      resolve({
        name: tier.name,
        file: tier.file,
        description: tier.description,
        passed: false,
        exitCode: 1,
        error: err.message,
        duration,
      });
    });
  });
}

async function main() {
  console.log(`\n======================================================================`);
  console.log(`   ACADEMIC LAB CMS — MASTER END-TO-END (E2E) TEST SUITE RUNNER`);
  console.log(`   Running Tiers 1 through 4 against MongoDB & Next.js Engine`);
  console.log(`======================================================================\n`);

  const globalStart = Date.now();
  const results = [];

  for (let i = 0; i < TIERS.length; i++) {
    const tier = TIERS[i];
    console.log(`\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`);
    console.log(` [RUNNING] [Tier ${i + 1}/4] ${tier.name}`);
    console.log(` ${tier.description}`);
    console.log(`<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\n`);

    const result = await runTier(tier);
    results.push(result);
  }

  const globalDuration = ((Date.now() - globalStart) / 1000).toFixed(2);
  const allPassed = results.every((r) => r.passed);

  console.log(`\n======================================================================`);
  console.log(`                      EXECUTIVE E2E TEST SUMMARY                       `);
  console.log(`======================================================================\n`);

  console.log(`┌───────────────────────────────────────────┬────────────┬──────────┐`);
  console.log(`│ Test Suite Tier                           │ Status     │ Duration │`);
  console.log(`├───────────────────────────────────────────┼────────────┼──────────┤`);

  results.forEach((r) => {
    const tierName = r.name.padEnd(41, ' ');
    const status = r.passed ? '✓ PASSED   ' : '✗ FAILED   ';
    const duration = `${r.duration}s`.padStart(8, ' ');
    console.log(`│ ${tierName} │ ${status} │ ${duration} │`);
  });

  console.log(`└───────────────────────────────────────────┴────────────┴──────────┘`);
  console.log(`\nTotal Execution Time: ${globalDuration}s`);
  console.log(`Overall Result: ${allPassed ? 'ALL TIERS PASSED (100% SUCCESS)' : 'SOME TIERS FAILED'}\n`);

  if (!allPassed) {
    console.error(`❌ One or more E2E test tiers failed. Check the detailed output above.`);
    process.exit(1);
  } else {
    console.log(`✅ All E2E test suites completed successfully. Exit Code: 0`);
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Fatal Runner Error:', err);
  process.exit(1);
});

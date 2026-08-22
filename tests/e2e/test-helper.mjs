/**
 * E2E Test Suite Shared Helper & Test Framework
 * Provides mock HTTP req/res, NextAuth JWT token mocking, DB connectivity,
 * assertion utilities, and test registry for all tiers.
 */

import assert from 'node:assert';
import dotenv from 'dotenv';
import { encode } from 'next-auth/jwt';
import mongoose from 'mongoose';
import dbConnect from '../../lib/mongoose.js';

// Load environment variables
dotenv.config({ path: '.env.local' });
process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || 'test_jwt_secret_e2e_harness_key_12345678901234567890';

// Global test registry
const suites = [];
let currentSuite = null;

export function describe(name, fn) {
  const suite = {
    name,
    tests: [],
    beforeAllFns: [],
    afterAllFns: [],
    beforeEachFns: [],
    afterEachFns: [],
  };
  suites.push(suite);
  currentSuite = suite;
  fn();
  currentSuite = null;
}

export function it(name, fn) {
  if (!currentSuite) {
    throw new Error(`Test "${name}" must be defined inside a describe block.`);
  }
  currentSuite.tests.push({ name, fn });
}

export const test = it;

export function beforeAll(fn) {
  if (currentSuite) currentSuite.beforeAllFns.push(fn);
}

export function afterAll(fn) {
  if (currentSuite) currentSuite.afterAllFns.push(fn);
}

export function beforeEach(fn) {
  if (currentSuite) currentSuite.beforeEachFns.push(fn);
}

export function afterEach(fn) {
  if (currentSuite) currentSuite.afterEachFns.push(fn);
}

export async function createMockToken({
  id = '65f1a2b3c4d5e6f7a8b9c0d1',
  name = 'Test Admin',
  email = 'admin@ssalab.test',
  role = 'admin',
} = {}) {
  const token = {
    sub: id,
    id,
    name,
    email,
    role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400,
  };
  return token;
}

export async function createMockReqRes({
  method = 'GET',
  body = {},
  query = {},
  headers = {},
  token = null,
} = {}) {
  const reqHeaders = { 'x-forwarded-for': '127.0.0.1', ...headers };
  const cookies = {};

  if (token) {
    const encoded = await encode({
      token,
      secret: process.env.NEXTAUTH_SECRET,
    });
    cookies['next-auth.session-token'] = encoded;
    reqHeaders.cookie = `next-auth.session-token=${encoded}`;
  }

  const req = {
    method,
    body,
    query,
    cookies,
    headers: reqHeaders,
    socket: { remoteAddress: '127.0.0.1' },
  };

  let statusCode = 200;
  let responseData = null;
  const responseHeaders = {};
  let endCalled = false;

  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      responseData = data;
      return this;
    },
    end(data) {
      endCalled = true;
      if (data) responseData = data;
      return this;
    },
    setHeader(key, val) {
      responseHeaders[key.toLowerCase()] = val;
      return this;
    },
    getHeader(key) {
      return responseHeaders[key.toLowerCase()];
    },
    getStatusCode: () => statusCode,
    getData: () => responseData,
    getHeaders: () => responseHeaders,
    isEnded: () => endCalled,
  };

  return { req, res };
}

export function generateTestPrefix(prefix = 'e2e') {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

export async function runAllSuites(tierName = 'E2E Suite') {
  console.log(`\n===============================================================`);
  console.log(` Starting ${tierName}`);
  console.log(`===============================================================\n`);

  let totalPass = 0;
  let totalFail = 0;
  const failures = [];
  const startTime = Date.now();

  for (const suite of suites) {
    console.log(`\n--- ${suite.name} ---`);
    for (const beforeAllFn of suite.beforeAllFns) {
      await beforeAllFn();
    }

    for (const t of suite.tests) {
      for (const beforeEachFn of suite.beforeEachFns) {
        await beforeEachFn();
      }

      try {
        await t.fn();
        totalPass++;
        console.log(`  [PASS] ${t.name}`);
      } catch (err) {
        totalFail++;
        console.error(`  [FAIL] ${t.name}`);
        console.error(`         ${err.message}`);
        failures.push({ suite: suite.name, test: t.name, error: err });
      }

      for (const afterEachFn of suite.afterEachFns) {
        await afterEachFn();
      }
    }

    for (const afterAllFn of suite.afterAllFns) {
      await afterAllFn();
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  const total = totalPass + totalFail;

  console.log(`\n---------------------------------------------------------------`);
  console.log(` ${tierName} Results: ${totalPass}/${total} Passed (${totalFail} Failed) in ${duration}s`);
  console.log(`---------------------------------------------------------------\n`);

  if (failures.length > 0) {
    console.error(`Summary of Failures:`);
    failures.forEach((f, idx) => {
      console.error(`  ${idx + 1}. [${f.suite}] ${f.test}`);
      console.error(`     ${f.error.message}\n`);
    });
    return { passed: false, totalPass, totalFail, total, duration };
  }

  return { passed: true, totalPass, totalFail, total, duration };
}

export { assert, dbConnect, mongoose };

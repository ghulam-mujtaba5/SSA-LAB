/**
 * @jest-environment node
 *
 * Empirical Verification & Adversarial Stress Tests for Milestone 2:
 * - User Authentication (username vs email, case-insensitivity, inactive blocking, lastLogin tracking, password verification, regex escaping)
 * - User Administration API (duplicate email/username collisions on creation and update, role updates, password reset, self-delete blocking, authorization checks)
 * - Enquiry Lifecycle & Persistence (/api/enquiries & /api/admin/enquiries triage, validation, stats calculation, admin notes persistence, deletion, audit logging)
 */

import dbConnect from "../lib/mongoose";
import User from "../models/User";
import Enquiry from "../models/Enquiry";
import AuditLog from "../models/AuditLog";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import usersIndexHandler from "../pages/api/users/index";
import userByIdHandler from "../pages/api/users/[id]";
import enquiriesIndexHandler from "../pages/api/enquiries/index";
import enquiryByIdHandler from "../pages/api/enquiries/[id]";
import adminEnquiriesHandler from "../pages/api/admin/enquiries";
import bcrypt from "bcryptjs";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";


jest.setTimeout(30000);

// Mock next-auth/jwt
jest.mock("next-auth/jwt", () => ({
  getToken: jest.fn(),
}));

// Helper to create mock Req & Res
function createMockReqRes({ method = "GET", body = {}, query = {}, headers = {}, token = null } = {}) {
  const req = {
    method,
    body,
    query,
    headers: { "x-forwarded-for": "127.0.0.1", ...headers },
    socket: { remoteAddress: "127.0.0.1" },
  };

  getToken.mockImplementation(async ({ req: passedReq }) => {
    return token;
  });

  let statusCode = 200;
  let responseData = null;
  let responseHeaders = {};

  const res = {
    status: jest.fn(function (code) {
      statusCode = code;
      return this;
    }),
    json: jest.fn(function (data) {
      responseData = data;
      return this;
    }),
    end: jest.fn(function (data) {
      if (data) responseData = data;
      return this;
    }),
    setHeader: jest.fn(function (key, val) {
      responseHeaders[key] = val;
      return this;
    }),
    getStatusCode: () => statusCode,
    getData: () => responseData,
    getHeaders: () => responseHeaders,
  };

  return { req, res };
}

describe("Milestone 2 Adversarial & Empirical Verification", () => {
  const TEST_PREFIX = "m2_adv_test_" + Date.now();
  let adminUserDoc = null;
  let testUserADoc = null;
  let testUserBDoc = null;

  const credentialsProvider = authOptions.providers.find(
    (p) => p.id === "credentials" || p.name === "Credentials"
  );
  const authorize = credentialsProvider.options?.authorize || credentialsProvider.authorize;

  beforeAll(async () => {
    await dbConnect();

    // Clean any prior test artifacts
    await User.deleteMany({ email: new RegExp(TEST_PREFIX, "i") });
    await Enquiry.deleteMany({ email: new RegExp(TEST_PREFIX, "i") });
    await AuditLog.deleteMany({ details: new RegExp(TEST_PREFIX, "i") });

    // Seed Admin User for tests
    const hashedPassword = await bcrypt.hash("AdminPassword123!", 10);
    adminUserDoc = await User.create({
      name: "M2 Test Admin",
      username: `${TEST_PREFIX}_admin`,
      email: `${TEST_PREFIX}_admin@ssalab.test`,
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });
  });

  afterAll(async () => {
    // Cleanup created test records
    await User.deleteMany({ email: new RegExp(TEST_PREFIX, "i") });
    await Enquiry.deleteMany({ email: new RegExp(TEST_PREFIX, "i") });
    await AuditLog.deleteMany({ details: new RegExp(TEST_PREFIX, "i") });
    if (mongoose.connection && mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });



  describe("1. User Authentication & NextAuth authorize() Stress Tests", () => {
    let testUser = null;
    const plainPassword = "SecretPassword123!";

    beforeAll(async () => {
      const hashed = await bcrypt.hash(plainPassword, 10);
      testUser = await User.create({
        name: "Empirical User",
        username: `${TEST_PREFIX}_regular`,
        email: `${TEST_PREFIX}_regular@ssalab.test`,
        password: hashed,
        role: "editor",
        isActive: true,
        lastLogin: null,
      });
    });

    test("1.1 Username Login: Authenticates successfully with valid username", async () => {
      const result = await authorize({
        username: testUser.username,
        password: plainPassword,
      });

      expect(result).toBeDefined();
      expect(result.id).toBe(testUser._id.toString());
      expect(result.username).toBe(testUser.username);
      expect(result.email).toBe(testUser.email);
      expect(result.role).toBe("editor");
      expect(result.isActive).toBe(true);
      expect(result.lastLogin).toBeInstanceOf(Date);
    });

    test("1.2 Email Login: Authenticates successfully with valid email", async () => {
      const result = await authorize({
        email: testUser.email,
        password: plainPassword,
      });

      expect(result).toBeDefined();
      expect(result.id).toBe(testUser._id.toString());
      expect(result.email).toBe(testUser.email);
    });

    test("1.3 Case-Insensitive Login: Authenticates with UPPERCASE username and email", async () => {
      const upperUsernameResult = await authorize({
        username: testUser.username.toUpperCase(),
        password: plainPassword,
      });
      expect(upperUsernameResult).toBeDefined();
      expect(upperUsernameResult.id).toBe(testUser._id.toString());

      const upperEmailResult = await authorize({
        email: testUser.email.toUpperCase(),
        password: plainPassword,
      });
      expect(upperEmailResult).toBeDefined();
      expect(upperEmailResult.id).toBe(testUser._id.toString());
    });

    test("1.4 Inactive User Blocking: Rejects deactivated user (isActive: false)", async () => {
      // Deactivate user in DB
      await User.findByIdAndUpdate(testUser._id, { isActive: false });

      // Attempt username login
      await expect(
        authorize({
          username: testUser.username,
          password: plainPassword,
        })
      ).rejects.toThrow(/Account has been deactivated/);

      // Attempt email login
      await expect(
        authorize({
          email: testUser.email,
          password: plainPassword,
        })
      ).rejects.toThrow(/Account has been deactivated/);

      // Verify AuditLog captured deactivated login attempt
      const log = await AuditLog.findOne({
        action: "login_fail",
        entity: "Auth",
        details: new RegExp("Deactivated user login attempt"),
        actorId: testUser._id.toString(),
      });
      expect(log).toBeDefined();

      // Reactivate user and verify login recovers
      await User.findByIdAndUpdate(testUser._id, { isActive: true });
      const reactivatedResult = await authorize({
        username: testUser.username,
        password: plainPassword,
      });
      expect(reactivatedResult).toBeDefined();
      expect(reactivatedResult.isActive).toBe(true);
    });

    test("1.5 lastLogin Tracking: Updates timestamp in MongoDB on successful login", async () => {
      const tBefore = new Date(Date.now() - 1000);
      await authorize({
        username: testUser.username,
        password: plainPassword,
      });
      const tAfter = new Date(Date.now() + 1000);

      const freshDoc = await User.findById(testUser._id);
      expect(freshDoc.lastLogin).toBeDefined();
      expect(freshDoc.lastLogin.getTime()).toBeGreaterThanOrEqual(tBefore.getTime());
      expect(freshDoc.lastLogin.getTime()).toBeLessThanOrEqual(tAfter.getTime());
    });

    test("1.6 Invalid Password: Fails with incorrect password error", async () => {
      await expect(
        authorize({
          username: testUser.username,
          password: "WrongPassword999!",
        })
      ).rejects.toThrow(/Incorrect password/);
    });

    test("1.7 Non-Existent Identifier: Fails when user not found", async () => {
      await expect(
        authorize({
          username: "non_existent_user_99999",
          password: plainPassword,
        })
      ).rejects.toThrow(/No user found/);
    });

    test("1.8 Missing Credentials: Fails when identifier or password is blank", async () => {
      await expect(
        authorize({
          username: "",
          password: "",
        })
      ).rejects.toThrow(/Please enter your username\/email and password/);
    });

    test("1.9 Regex Escaping: Special characters in identifier handled safely", async () => {
      const specialPass = "SpecialPass123!";
      const specialHashed = await bcrypt.hash(specialPass, 10);
      const specialUser = await User.create({
        name: "Special Char User",
        username: `${TEST_PREFIX}.user+tag$1`,
        email: `${TEST_PREFIX}.user+tag$1@ssalab.test`,
        password: specialHashed,
        role: "editor",
        isActive: true,
      });

      const resSpecial = await authorize({
        username: `${TEST_PREFIX}.user+tag$1`,
        password: specialPass,
      });
      expect(resSpecial).toBeDefined();
      expect(resSpecial.id).toBe(specialUser._id.toString());
    });
  });

  describe("2. User Management API (/api/users & /api/users/[id])", () => {
    const adminToken = {
      id: "60c72b2f9b1d8b3a5c8e4f1a",
      name: "M2 Admin Token",
      role: "admin",
    };
    const editorToken = {
      id: "60c72b2f9b1d8b3a5c8e4f1b",
      name: "M2 Editor Token",
      role: "editor",
    };


    test("2.1 Access Control: Rejects non-admin requests with HTTP 403", async () => {
      const { req, res } = createMockReqRes({
        method: "GET",
        token: editorToken,
      });
      await usersIndexHandler(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    test("2.2 User Creation: Admin successfully creates new user", async () => {
      const newUserPayload = {
        name: "Challenger Alpha",
        username: `${TEST_PREFIX}_alpha`,
        email: `${TEST_PREFIX}_alpha@ssalab.test`,
        password: "AlphaPassword123!",
        role: "editor",
        isActive: true,
      };

      const { req, res } = createMockReqRes({
        method: "POST",
        body: newUserPayload,
        token: adminToken,
      });

      await usersIndexHandler(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      const responseData = res.getData();
      expect(responseData.user).toBeDefined();
      expect(responseData.user.username).toBe(`${TEST_PREFIX}_alpha`);
      expect(responseData.user.email).toBe(`${TEST_PREFIX}_alpha@ssalab.test`);

      testUserADoc = responseData.user;
    });

    test("2.3 Duplicate Email Collision (Creation): Returns HTTP 409", async () => {
      const duplicateEmailPayload = {
        name: "Challenger Alpha Duplicate Email",
        username: `${TEST_PREFIX}_distinct_user`,
        email: `${TEST_PREFIX}_alpha@ssalab.test`, // Duplicate email
        password: "SomePassword123!",
        role: "editor",
      };

      const { req, res } = createMockReqRes({
        method: "POST",
        body: duplicateEmailPayload,
        token: adminToken,
      });

      await usersIndexHandler(req, res);
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.getData().error).toMatch(/email already exists/i);
    });

    test("2.4 Duplicate Username Collision (Creation): Returns HTTP 409", async () => {
      const duplicateUsernamePayload = {
        name: "Challenger Alpha Duplicate Username",
        username: `${TEST_PREFIX}_alpha`, // Duplicate username
        email: `${TEST_PREFIX}_distinct_email@ssalab.test`,
        password: "SomePassword123!",
        role: "editor",
      };

      const { req, res } = createMockReqRes({
        method: "POST",
        body: duplicateUsernamePayload,
        token: adminToken,
      });

      await usersIndexHandler(req, res);
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.getData().error).toMatch(/username is already in use/i);
    });

    test("2.5 Duplicate Collision on Update: Returns HTTP 409 when stealing existing email/username", async () => {
      // Create User B
      const userBPayload = {
        name: "Challenger Beta",
        username: `${TEST_PREFIX}_beta`,
        email: `${TEST_PREFIX}_beta@ssalab.test`,
        password: "BetaPassword123!",
        role: "editor",
        isActive: true,
      };
      const { req: createBReq, res: createBRes } = createMockReqRes({
        method: "POST",
        body: userBPayload,
        token: adminToken,
      });
      await usersIndexHandler(createBReq, createBRes);
      expect(createBRes.status).toHaveBeenCalledWith(201);
      testUserBDoc = createBRes.getData().user;

      // Attempt to update User B's email to User A's email
      const { req: updateEmailReq, res: updateEmailRes } = createMockReqRes({
        method: "PUT",
        query: { id: testUserBDoc._id.toString() },
        body: { email: `${TEST_PREFIX}_alpha@ssalab.test` },
        token: adminToken,
      });
      await userByIdHandler(updateEmailReq, updateEmailRes);
      expect(updateEmailRes.status).toHaveBeenCalledWith(409);
      expect(updateEmailRes.getData().error).toMatch(/email already exists/i);

      // Attempt to update User B's username to User A's username
      const { req: updateUsernameReq, res: updateUsernameRes } = createMockReqRes({
        method: "PUT",
        query: { id: testUserBDoc._id.toString() },
        body: { username: `${TEST_PREFIX}_alpha` },
        token: adminToken,
      });
      await userByIdHandler(updateUsernameReq, updateUsernameRes);
      expect(updateUsernameRes.status).toHaveBeenCalledWith(409);
      expect(updateUsernameRes.getData().error).toMatch(/username is already in use/i);
    });

    test("2.6 Valid User Update: Allows updating own fields, role, isActive, and resetting password", async () => {
      const { req, res } = createMockReqRes({
        method: "PUT",
        query: { id: testUserBDoc._id.toString() },
        body: {
          name: "Challenger Beta Renamed",
          username: `${TEST_PREFIX}_beta`, // keeping own username
          email: `${TEST_PREFIX}_beta@ssalab.test`, // keeping own email
          role: "admin",
          isActive: false,
          password: "NewBetaPassword123!",
        },
        token: adminToken,
      });

      await userByIdHandler(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      const updatedUser = res.getData().user;
      expect(updatedUser.name).toBe("Challenger Beta Renamed");
      expect(updatedUser.role).toBe("admin");
      expect(updatedUser.isActive).toBe(false);

      // Verify password reset took effect and is valid bcrypt hash
      const freshDoc = await User.findById(testUserBDoc._id).select("+password");
      const match = await bcrypt.compare("NewBetaPassword123!", freshDoc.password);
      expect(match).toBe(true);
    });

    test("2.7 Self-Deletion Prevention: Blocks admin from deleting their own account", async () => {
      const { req, res } = createMockReqRes({
        method: "DELETE",
        query: { id: adminToken.id },
        token: adminToken, // token.id === id
      });

      await userByIdHandler(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.getData().error).toMatch(/cannot delete your own account/i);
    });

    test("2.8 User Deletion: Admin deletes user successfully", async () => {
      const { req, res } = createMockReqRes({
        method: "DELETE",
        query: { id: testUserBDoc._id.toString() },
        token: adminToken,
      });

      await userByIdHandler(req, res);
      expect(res.status).toHaveBeenCalledWith(200);

      const checkDeleted = await User.findById(testUserBDoc._id);
      expect(checkDeleted).toBeNull();
    });
  });

  describe("3. Enquiry Lifecycle & Admin Notes Persistence", () => {
    let createdEnquiryId = null;
    const adminToken = {
      id: "60c72b2f9b1d8b3a5c8e4f1a",
      name: "M2 Admin Token",
      role: "admin",
    };


    test("3.1 Public Submission: POST /api/enquiries creates enquiry with status 'new'", async () => {
      const payload = {
        name: "Test Inquirer",
        email: `${TEST_PREFIX}_inquiry@student.edu`,
        degree: "BS Computer Science",
        enquiryType: "FYP Supervision",
        topic: "Adversarial Machine Learning",
        message: "I would like to apply for FYP supervision in SSA Lab under your mentorship.",
      };

      const { req, res } = createMockReqRes({
        method: "POST",
        body: payload,
      });

      await enquiriesIndexHandler(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      const data = res.getData();
      expect(data.success).toBe(true);
      expect(data.data._id).toBeDefined();
      expect(data.data.status).toBe("new");
      expect(data.data.ipAddress).toBe("127.0.0.1");

      createdEnquiryId = data.data._id.toString();
    });

    test("3.2 Validation: POST /api/enquiries rejects missing required fields with HTTP 400", async () => {
      const { req, res } = createMockReqRes({
        method: "POST",
        body: { email: "no_name@test.com" }, // missing name and message
      });

      await enquiriesIndexHandler(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.getData().success).toBe(false);
    });

    test("3.3 Retrieval & Stats: GET /api/enquiries returns data and calculated stats", async () => {
      const { req, res } = createMockReqRes({
        method: "GET",
        query: { status: "all" },
        token: adminToken,
      });

      await enquiriesIndexHandler(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      const data = res.getData();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.stats).toBeDefined();
      expect(typeof data.stats.total).toBe("number");
      expect(typeof data.stats.new).toBe("number");
      expect(data.stats.new).toBeGreaterThanOrEqual(1);
    });

    test("3.4 Lifecycle Transition & Admin Notes via /api/enquiries/[id]", async () => {
      // Step 1: Transition new -> read + add admin notes
      const { req: readReq, res: readRes } = createMockReqRes({
        method: "PATCH",
        query: { id: createdEnquiryId },
        body: {
          status: "read",
          adminNotes: "Transcript verified. Good GPA.",
        },
        token: adminToken,
      });
      await enquiryByIdHandler(readReq, readRes);
      expect(readRes.status).toHaveBeenCalledWith(200);
      expect(readRes.getData().data.status).toBe("read");
      expect(readRes.getData().data.adminNotes).toBe("Transcript verified. Good GPA.");

      // Step 2: Transition read -> replied + update admin notes
      const { req: repliedReq, res: repliedRes } = createMockReqRes({
        method: "PATCH",
        query: { id: createdEnquiryId },
        body: {
          status: "replied",
          adminNotes: "Sent interview meeting invite for Monday.",
        },
        token: adminToken,
      });
      await enquiryByIdHandler(repliedReq, repliedRes);
      expect(repliedRes.status).toHaveBeenCalledWith(200);
      expect(repliedRes.getData().data.status).toBe("replied");
      expect(repliedRes.getData().data.adminNotes).toBe("Sent interview meeting invite for Monday.");

      // Step 3: Transition replied -> archived
      const { req: archReq, res: archRes } = createMockReqRes({
        method: "PATCH",
        query: { id: createdEnquiryId },
        body: {
          status: "archived",
          adminNotes: "Interview complete. Project assigned.",
        },
        token: adminToken,
      });
      await enquiryByIdHandler(archReq, archRes);
      expect(archRes.status).toHaveBeenCalledWith(200);
      expect(archRes.getData().data.status).toBe("archived");
      expect(archRes.getData().data.adminNotes).toBe("Interview complete. Project assigned.");

      // Step 4: Reject invalid status value
      const { req: invalidReq, res: invalidRes } = createMockReqRes({
        method: "PATCH",
        query: { id: createdEnquiryId },
        body: { status: "non_existent_status" },
        token: adminToken,
      });
      await enquiryByIdHandler(invalidReq, invalidRes);
      expect(invalidRes.status).toHaveBeenCalledWith(400);
      expect(invalidRes.getData().success).toBe(false);
    });

    test("3.5 Lifecycle Transition & Notes via /api/admin/enquiries (Admin PATCH)", async () => {
      const { req, res } = createMockReqRes({
        method: "PATCH",
        body: {
          id: createdEnquiryId,
          status: "read",
          adminNotes: "Re-opened for secondary evaluation.",
        },
        token: adminToken,
      });

      await adminEnquiriesHandler(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.getData().data.status).toBe("read");
      expect(res.getData().data.adminNotes).toBe("Re-opened for secondary evaluation.");

      // Verify AuditLog entry created for Enquiry update
      const auditEntry = await AuditLog.findOne({
        action: "update",
        entity: "Enquiry",
        entityId: createdEnquiryId,
      });
      expect(auditEntry).toBeDefined();
    });

    test("3.6 Enquiry Deletion via /api/admin/enquiries (Admin DELETE)", async () => {
      const { req, res } = createMockReqRes({
        method: "DELETE",
        query: { id: createdEnquiryId },
        token: adminToken,
      });

      await adminEnquiriesHandler(req, res);
      expect(res.status).toHaveBeenCalledWith(200);

      // Verify deleted from DB
      const checkEnquiry = await Enquiry.findById(createdEnquiryId);
      expect(checkEnquiry).toBeNull();

      // Verify AuditLog entry for Enquiry delete
      const auditDeleteEntry = await AuditLog.findOne({
        action: "delete",
        entity: "Enquiry",
        entityId: createdEnquiryId,
      });
      expect(auditDeleteEntry).toBeDefined();
    });
  });

  afterAll(async () => {
    try {
      await mongoose.connection.close();
    } catch {}
  });
});

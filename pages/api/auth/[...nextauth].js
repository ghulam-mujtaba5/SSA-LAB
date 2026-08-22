import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "../../../lib/mongoose";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import { createAuditLog } from "../../../lib/auditLog";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username or Email", type: "text" },
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const identifier = (credentials?.username || credentials?.email || "").trim();
          const password = credentials?.password;

          if (!identifier || !password) {
            await createAuditLog({
              action: "login_fail",
              entity: "Auth",
              details: "Missing username/email or password",
              actorName: identifier || "Anonymous",
            });
            throw new Error("Please enter your username/email and password");
          }

          await dbConnect();

          const escaped = identifier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const user = await User.findOne({
            $or: [
              { email: { $regex: new RegExp(`^${escaped}$`, "i") } },
              { username: { $regex: new RegExp(`^${escaped}$`, "i") } },
              { name: { $regex: new RegExp(`^${escaped}$`, "i") } },
            ],
          }).select("+password");

          if (!user) {
            await createAuditLog({
              action: "login_fail",
              entity: "Auth",
              details: "No user found for identifier: " + identifier,
              actorName: identifier,
            });
            throw new Error("No user found with this username or email");
          }

          if (user.isActive === false) {
            await createAuditLog({
              action: "login_fail",
              entity: "Auth",
              details: "Deactivated user login attempt: " + identifier,
              actorId: user._id.toString(),
              actorName: user.name,
            });
            throw new Error("Account has been deactivated. Please contact an administrator.");
          }

          const isPasswordMatch = await bcrypt.compare(
            password,
            user.password,
          );

          if (!isPasswordMatch) {
            await createAuditLog({
              action: "login_fail",
              entity: "Auth",
              details: "Incorrect password attempt",
              actorId: user._id.toString(),
              actorName: user.name,
            });
            throw new Error("Incorrect password. Please try again.");
          }

          // Record lastLogin timestamp
          user.lastLogin = new Date();
          await user.save();

          const result = {
            id: user._id.toString(),
            name: user.name,
            username: user.username || user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive !== false,
            lastLogin: user.lastLogin,
          };

          await createAuditLog({
            action: "login_success",
            entity: "Auth",
            details: "User logged in successfully",
            actorId: user._id.toString(),
            actorName: user.name,
          });

          return result;
        } catch (err) {
          // Rethrow so NextAuth shows error
          throw err;
        }
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "X2f+LFHZI5wwNOsGTF0Etql5AEgiR7I32/KQRqrql5EgXF3fM7FVtAFuhg4=",
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
        token.isActive = user.isActive;
        token.lastLogin = user.lastLogin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.username = token.username;
        session.user.isActive = token.isActive;
        session.user.lastLogin = token.lastLogin;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);

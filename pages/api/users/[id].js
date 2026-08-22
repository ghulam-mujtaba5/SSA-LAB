import { getToken } from "next-auth/jwt";
import dbConnect from "../../../lib/mongoose";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import { createAuditLog } from "../../../lib/auditLog";

const handler = async (req, res) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || token.role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }

  const { id } = req.query;

  await dbConnect();

  switch (req.method) {
    case "GET":
      try {
        const user = await User.findById(id);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
      break;

    case "PATCH":
    case "PUT":
      try {
        const { name, username, email, role, password, isActive } = req.body;
        const updateData = {};
        if (name) updateData.name = name.trim();
        if (email) {
          const normalizedEmail = email.trim().toLowerCase();
          const existingEmail = await User.findOne({ email: normalizedEmail, _id: { $ne: id } });
          if (existingEmail) {
            return res.status(409).json({ error: "User with this email already exists" });
          }
          updateData.email = normalizedEmail;
        }
        if (username) {
          const cleanUsername = username.trim().toLowerCase();
          const existingUsername = await User.findOne({ username: cleanUsername, _id: { $ne: id } });
          if (existingUsername) {
            return res.status(409).json({ error: "Username is already in use by another user" });
          }
          updateData.username = cleanUsername;
        }
        if (role) updateData.role = role;
        if (typeof isActive !== "undefined") {
          updateData.isActive = Boolean(isActive);
        }

        if (password && password.trim()) {
          updateData.password = await bcrypt.hash(password.trim(), 12);
        }

        const user = await User.findByIdAndUpdate(
          id,
          updateData,
          { new: true, runValidators: true },
        );
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        await createAuditLog({
          session: token,
          action: "update",
          entity: "User",
          entityId: user._id.toString(),
          details: `User updated: ${user.email}${password ? ' (password reset)' : ''}`,
        });
        res.status(200).json({ message: "User updated successfully", user });
      } catch (error) {
        res.status(500).json({ error: error?.message || "Internal Server Error" });
      }
      break;

    case "DELETE":
      try {
        // Prevent admin from deleting their own account
        if (token.id === id) {
          return res
            .status(400)
            .json({ error: "You cannot delete your own account." });
        }
        const user = await User.findByIdAndDelete(id);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        await createAuditLog({
          session: token,
          action: "delete",
          entity: "User",
          entityId: id,
          details: `User deleted: ${user.email}`,
        });
        res.status(200).json({ message: "User deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
};

export default handler;

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

  await dbConnect();

  switch (req.method) {
    case "GET":
      try {
        const users = await User.find({}).sort({ createdAt: -1 });
        res.status(200).json(users);
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
      break;

    case "POST":
      try {
        const { name, username, email, password, role, isActive } = req.body;
        if (!name || !email || !password) {
          return res
            .status(400)
            .json({ error: "Name, email, and password are required" });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const existingEmail = await User.findOne({ email: normalizedEmail });
        if (existingEmail) {
          return res
            .status(409)
            .json({ error: "User with this email already exists" });
        }

        const cleanUsername = (username || name.toLowerCase().replace(/\s+/g, "_")).trim().toLowerCase();
        if (cleanUsername) {
          const existingUsername = await User.findOne({ username: cleanUsername });
          if (existingUsername) {
            return res
              .status(409)
              .json({ error: "Username is already in use. Please choose another." });
          }
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
          name: name.trim(),
          username: cleanUsername,
          email: normalizedEmail,
          password: hashedPassword,
          role: role || "editor",
          isActive: typeof isActive !== "undefined" ? Boolean(isActive) : true,
        });

        await newUser.save();

        // Audit log: user created
        await createAuditLog({
          session: token,
          action: "create",
          entity: "User",
          entityId: newUser._id.toString(),
          details: `User created: ${newUser.email} (@${newUser.username})`,
        });

        res
          .status(201)
          .json({ message: "User created successfully", user: newUser });
      } catch (error) {
        res.status(500).json({ error: error?.message || "Internal Server Error" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
};

export default handler;

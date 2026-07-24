import mongoose from "mongoose";
import { getToken } from "next-auth/jwt";
import dbConnect from "../../../lib/mongoose";
import { createAuditLog } from "../../../lib/auditLog";
import FypProject from "../../../models/FypProject";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!session || !["admin", "editor"].includes(session.role)) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  const ids = Array.isArray(req.body?.ids)
    ? req.body.ids.filter((id) => mongoose.Types.ObjectId.isValid(id)).slice(0, 100)
    : [];
  if (!ids.length) {
    return res.status(400).json({
      success: false,
      message: "A valid ordered project list is required.",
    });
  }

  await dbConnect();
  await FypProject.bulkWrite(
    ids.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { displayOrder: index } },
      },
    })),
  );

  await createAuditLog({
    session,
    action: "reorder",
    entity: "FypProject",
    details: `Reordered ${ids.length} FYP projects`,
  });

  return res.status(200).json({ success: true });
}


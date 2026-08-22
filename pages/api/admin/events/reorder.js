// pages/api/admin/events/reorder.js
import mongoose from "mongoose";
import { getToken } from "next-auth/jwt";
import dbConnect from "../../../../lib/mongoose";
import { createAuditLog } from "../../../../lib/auditLog";
import EventHighlight from "../../../../models/EventHighlight";

export default async function handler(req, res) {
  if (req.method !== "PUT" && req.method !== "POST") {
    res.setHeader("Allow", ["PUT", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!session || !["admin", "editor"].includes(session.role)) {
    return res.status(403).json({ success: false, message: "Forbidden: Unauthorized access" });
  }

  const body = req.body || {};
  let ops = [];

  if (Array.isArray(body.items)) {
    ops = body.items
      .filter((item) => item?.id && mongoose.Types.ObjectId.isValid(item.id))
      .map((item, index) => ({
        updateOne: {
          filter: { _id: item.id },
          update: { $set: { displayOrder: typeof item.displayOrder === "number" ? item.displayOrder : index } },
        },
      }));
  } else {
    const rawIds = Array.isArray(body)
      ? body
      : Array.isArray(body.ids)
      ? body.ids
      : Array.isArray(body.orderedIds)
      ? body.orderedIds
      : [];

    const validIds = rawIds.filter((id) => mongoose.Types.ObjectId.isValid(id)).slice(0, 500);

    ops = validIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { displayOrder: index } },
      },
    }));
  }

  if (!ops.length) {
    return res.status(400).json({
      success: false,
      message: "Valid list of items or event IDs is required for reordering.",
    });
  }

  try {
    await dbConnect();
    await EventHighlight.bulkWrite(ops, { ordered: false });

    await createAuditLog({
      session,
      action: "reorder",
      entity: "EventHighlight",
      details: `Reordered ${ops.length} events/news highlights`,
    });

    return res.status(200).json({ success: true, message: "Events reordered successfully" });
  } catch (error) {
    console.error("Events reorder error:", error);
    return res.status(500).json({ success: false, message: "Failed to reorder events" });
  }
}

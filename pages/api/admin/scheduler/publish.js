import { getSession } from "next-auth/react";
import dbConnect from "../../../../lib/mongoose";
import Project from "../../../../models/Project";
import { submitToIndexNow } from "../../../../lib/indexnow";

export default async function handler(req, res) {
  // Note: In a real-world scenario, this endpoint should be protected,
  // possibly by a secret key passed in the request header from a trusted source (like a cron job service),
  // rather than relying on a user session.
  const session = await getSession({ req });
  if (!session || !["admin", "editor"].includes(session.user?.role)) {
    // As a fallback for manual triggering, we check session. For automated, a different auth is needed.
    const apiKey = req.headers["x-api-key"];
    if (apiKey !== process.env.CRON_SECRET) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  try {
    await dbConnect();
    const now = new Date();
    const filter = { scheduledAt: { $ne: null, $lte: now }, published: false };

    const projectsToPublish = await Project.find(filter).select("_id title slug").lean();

    if (!projectsToPublish.length) {
      return res
        .status(200)
        .json({ success: true, publishedCount: 0, items: [] });
    }

    const projectIds = projectsToPublish.map((p) => p._id);

    const projectResult = await Project.updateMany(
        { _id: { $in: projectIds } },
        { $set: { published: true } },
    );

    const publishedCount = projectResult.modifiedCount || 0;
    const publishedItems = [
      ...projectsToPublish.map((p) => ({ ...p, type: "Project" })),
    ];

    // Notify Bing/Yandex via IndexNow for all newly published URLs
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://www.ssa-lab.tech";
    const newUrls = [
      ...projectsToPublish.map((p) => `${siteUrl}/research`),
    ];
    if (newUrls.length) submitToIndexNow(newUrls).catch(() => {});

    return res
      .status(200)
      .json({ success: true, publishedCount, items: publishedItems });
  } catch (err) {
    console.error("Scheduler publish error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}

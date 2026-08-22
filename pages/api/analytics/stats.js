import { getToken } from "next-auth/jwt";
import dbConnect from "../../../lib/mongoose";
import Project from "../../../models/Project";

const handler = async (req, res) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      await dbConnect();

      const projects = await Project.find({}, "title views slug").sort({
        views: -1,
      });

      const totalProjectViews = projects.reduce(
        (acc, project) => acc + (project.views || 0),
        0,
      );
      const totalViews = totalProjectViews;
      const mostViewedProject = projects.length > 0 ? projects[0] : null;

      res.status(200).json({
        totalViews,
        totalArticleViews: 0,
        totalProjectViews,
        mostViewedArticle: null,
        mostViewedProject,
        articles: [],
        projects,
      });
    } catch (error) {
      console.error("Error fetching analytics stats:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;

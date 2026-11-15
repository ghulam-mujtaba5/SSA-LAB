import { SupervisionPage } from "../components/AcademicSite/AcademicContentPage";
import { defaultFypProjects } from "../data/fypProjects";
import dbConnect from "../lib/mongoose";
import FypProject from "../models/FypProject";

export default SupervisionPage;

export async function getStaticProps() {
  try {
    await dbConnect();
    const projects = await FypProject.find({
      published: true,
      isOpportunity: { $ne: true },
      categoryType: { $ne: "future" },
    })
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    const sanitizedDefaults = defaultFypProjects.filter(
      (p) => !p.isOpportunity && p.categoryType !== "future"
    );

    return {
      props: {
        fypProjects: JSON.parse(
          JSON.stringify(projects.length ? projects : sanitizedDefaults),
        ),
      },
      revalidate: 60,
    };
  } catch (error) {
    console.warn("Supervision FYP static data fallback:", error?.message || error);
    const sanitizedDefaults = defaultFypProjects.filter(
      (p) => !p.isOpportunity && p.categoryType !== "future"
    );
    return {
      props: {
        fypProjects: sanitizedDefaults,
      },
      revalidate: 60,
    };
  }
}

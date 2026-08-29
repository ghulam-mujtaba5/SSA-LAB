import { SupervisionPage } from "../components/AcademicSite/AcademicContentPage";
import { defaultFypProjects } from "../data/fypProjects";
import dbConnect from "../lib/mongoose";
import FypProject from "../models/FypProject";

export default SupervisionPage;

export async function getStaticProps() {
  try {
    await dbConnect();
    const projects = await FypProject.find({ published: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    return {
      props: {
        fypProjects: JSON.parse(
          JSON.stringify(projects.length ? projects : defaultFypProjects),
        ),
      },
      revalidate: 60,
    };
  } catch (error) {
    console.warn("Supervision FYP static data fallback:", error?.message || error);
    return {
      props: {
        fypProjects: defaultFypProjects,
      },
      revalidate: 60,
    };
  }
}

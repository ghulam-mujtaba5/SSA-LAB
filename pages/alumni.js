import { SupervisionPage } from "../components/AcademicSite/AcademicContentPage";
import { defaultFypProjects } from "../data/fypProjects";
import dbConnect from "../lib/mongoose";
import FypProject from "../models/FypProject";

export default SupervisionPage;

export async function getServerSideProps() {
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
    };
  } catch (error) {
    console.error("Alumni fallback:", error?.message || error);
    return {
      props: {
        fypProjects: defaultFypProjects,
      },
    };
  }
}

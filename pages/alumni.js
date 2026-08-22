import { TeamPage } from "../components/AcademicSite/AcademicContentPage";

export default function AlumniRoutePage() {
  return <TeamPage />;
}

export async function getServerSideProps() {
  return {
    props: {},
  };
}

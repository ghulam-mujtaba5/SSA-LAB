export default function AlumniRoutePage() {
  return null;
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/team",
      permanent: true,
    },
  };
}

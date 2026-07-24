import { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import AdminLayout from "../../../../components/Admin/AdminLayout/AdminLayout";
import FypProjectForm from "../../../../components/Admin/FypProjectForm/FypProjectForm";
import dbConnect from "../../../../lib/mongoose";
import FypProject from "../../../../models/FypProject";
import styles from "../fyp-admin.module.css";

export default function EditFypProjectPage({ project }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (nextProject) => {
    setSubmitting(true);
    const toastId = toast.loading("Updating FYP project…");
    try {
      const response = await fetch(`/api/fyp-projects/${project._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextProject),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || "Failed to update FYP project");
      toast.success("FYP project updated", { id: toastId });
      router.push("/admin/fyp");
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout title={`Edit FYP: ${project.title}`}>
      <div className={styles.editorHeader}>
        <p>Academic content</p>
        <h1>Edit supervised FYP project</h1>
      </div>
      <FypProjectForm
        project={project}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </AdminLayout>
  );
}

export async function getServerSideProps({ params }) {
  await dbConnect();
  const project = await FypProject.findById(params.id).lean();
  if (!project) {
    return {
      redirect: {
        destination: "/admin/fyp?error=notfound",
        permanent: false,
      },
    };
  }

  return {
    props: {
      project: JSON.parse(JSON.stringify(project)),
    },
  };
}


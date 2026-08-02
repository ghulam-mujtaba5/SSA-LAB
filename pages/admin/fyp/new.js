import { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import AdminLayout from "../../../components/Admin/AdminLayout/AdminLayout";
import FypProjectForm from "../../../components/Admin/FypProjectForm/FypProjectForm";
import styles from "./fyp-admin.module.css";

export default function NewFypProjectPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (project) => {
    setSubmitting(true);
    const toastId = toast.loading("Creating FYP project…");
    try {
      const response = await fetch("/api/fyp-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || "Failed to create FYP project");
      toast.success("FYP project created", { id: toastId });
      router.push("/admin/fyp");
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout title="New FYP Project">
      <div className={styles.editorHeader}>
        <p>Academic content</p>
        <h1>Add supervised FYP project</h1>
      </div>
      <FypProjectForm onSubmit={handleSubmit} submitting={submitting} />
    </AdminLayout>
  );
}

export async function getServerSideProps() {
  return {
    props: {},
  };
}

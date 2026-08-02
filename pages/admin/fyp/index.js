import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Edit3, GripVertical, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import AdminLayout from "../../../components/Admin/AdminLayout/AdminLayout";
import Modal from "../../../components/Admin/Modal/Modal";
import styles from "./fyp-admin.module.css";

export default function FypAdminPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteProject, setDeleteProject] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const confirmRef = useRef(null);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/fyp-projects?admin=true");
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Failed to load FYP projects");
      setProjects(payload.data || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const saveOrder = async (orderedProjects) => {
    const toastId = toast.loading("Saving project order…");
    try {
      const response = await fetch("/api/admin/reorder-fyp-projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: orderedProjects.map((project) => project._id) }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || "Failed to save order");
      toast.success("Project order saved", { id: toastId });
    } catch (error) {
      toast.error(error.message, { id: toastId });
      loadProjects();
    }
  };

  const handleDrop = (index) => {
    if (
      draggedIndex === null ||
      draggedIndex === index ||
      draggedIndex < 0 ||
      draggedIndex >= projects.length
    ) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const next = [...projects];
    const [moved] = next.splice(draggedIndex, 1);
    next.splice(index, 0, moved);
    setProjects(next);
    setDraggedIndex(null);
    setDragOverIndex(null);
    saveOrder(next);
  };

  const confirmDelete = async () => {
    if (!deleteProject) return;
    const toastId = toast.loading("Deleting FYP project…");
    try {
      const response = await fetch(`/api/fyp-projects/${deleteProject._id}`, {
        method: "DELETE",
      });
      if (!response.ok && response.status !== 204) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || "Failed to delete FYP project");
      }
      setProjects((current) =>
        current.filter((project) => project._id !== deleteProject._id),
      );
      toast.success("FYP project deleted", { id: toastId });
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setDeleteProject(null);
    }
  };

  return (
    <AdminLayout title="FYP Supervision">
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <p>Academic content</p>
            <h1>FYP supervision</h1>
            <span>
              Publish research projects, maintain evidence, and order featured case studies.
            </span>
          </div>
          <Link href="/admin/fyp/new" className={styles.createButton}>
            <Plus size={18} />
            Add FYP project
          </Link>
        </header>

        {loading ? (
          <div className={styles.empty}>Loading supervised projects…</div>
        ) : projects.length === 0 ? (
          <div className={styles.empty}>
            <h2>No FYP records yet</h2>
            <p>Add the first supervised project to begin the academic archive.</p>
          </div>
        ) : (
          <div className={styles.list}>
            {projects.map((project, index) => (
              <article
                key={project._id}
                className={`${styles.card} ${
                  dragOverIndex === index ? styles.dragOver : ""
                }`}
                draggable
                onDragStart={() => setDraggedIndex(index)}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragOverIndex(index);
                }}
                onDragLeave={() => setDragOverIndex(null)}
                onDrop={() => handleDrop(index)}
                onDragEnd={() => {
                  setDraggedIndex(null);
                  setDragOverIndex(null);
                }}
              >
                <div className={styles.dragHandle} aria-label="Drag to reorder">
                  <GripVertical size={19} />
                  <span>{index + 1}</span>
                </div>
                <div className={styles.cover}>
                  {project.coverImage ? (
                    <Image
                      src={project.coverImage}
                      alt={project.coverAlt || project.title}
                      fill
                      sizes="120px"
                      unoptimized={/^https?:\/\//i.test(project.coverImage)}
                    />
                  ) : (
                    <span>No poster</span>
                  )}
                </div>
                <div className={styles.content}>
                  <div className={styles.meta}>
                    <span>{project.status}</span>
                    <span>{project.published ? "Published" : "Draft"}</span>
                    {project.featured ? <strong>Featured</strong> : null}
                  </div>
                  <h2>{project.title}</h2>
                  <p>{project.summary}</p>
                  <small>
                    {(project.students || []).map((student) => student.name).join(" · ") ||
                      "Students not added"}
                  </small>
                </div>
                <div className={styles.actions}>
                  <Link
                    href={`/admin/fyp/edit/${project._id}`}
                    aria-label={`Edit ${project.title}`}
                  >
                    <Edit3 size={17} />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteProject(project)}
                    aria-label={`Delete ${project.title}`}
                  >
                    <Trash2 size={17} />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={Boolean(deleteProject)}
        onClose={() => setDeleteProject(null)}
        title="Delete FYP project"
        onConfirm={confirmDelete}
        confirmText="Delete project"
        cancelText="Cancel"
        initialFocusRef={confirmRef}
      >
        <p>
          Delete “{deleteProject?.title}”? This removes the project record, but uploaded
          media remains available in the media library.
        </p>
      </Modal>
    </AdminLayout>
  );
}

export async function getServerSideProps() {
  return {
    props: {},
  };
}

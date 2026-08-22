import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Edit3, GripVertical, Plus, Trash2, Eye, EyeOff, Star, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import AdminLayout from "../../../components/Admin/AdminLayout/AdminLayout";
import Modal from "../../../components/Admin/Modal/Modal";
import InlineSpinner from "../../../components/LoadingAnimation/InlineSpinner";
import styles from "./fyp-admin.module.css";

export default function FypAdminPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteProject, setDeleteProject] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
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

  // Toggle Published
  const handleTogglePublished = async (project) => {
    const nextPublished = project.published === false ? true : false;
    try {
      const res = await fetch(`/api/fyp-projects/${project._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: nextPublished }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to update status");

      toast.success(nextPublished ? "Project published to website" : "Project set to draft");
      setProjects((prev) =>
        prev.map((item) => (item._id === project._id ? { ...item, published: nextPublished } : item))
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Toggle Featured
  const handleToggleFeatured = async (project) => {
    const nextFeatured = !project.featured;
    try {
      const res = await fetch(`/api/fyp-projects/${project._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: nextFeatured }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to update featured flag");

      toast.success(nextFeatured ? "Marked as Featured Case Study" : "Removed from Featured");
      setProjects((prev) =>
        prev.map((item) => (item._id === project._id ? { ...item, featured: nextFeatured } : item))
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

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

  const filteredProjects = projects.filter((project) => {
    if (statusFilter === "Published") {
      if (!project.published) return false;
    } else if (statusFilter === "Draft") {
      if (project.published) return false;
    } else if (statusFilter === "Running") {
      if (project.status !== "Running" && project.categoryType !== "running") return false;
    } else if (statusFilter === "Completed") {
      if (project.status !== "Completed" && project.categoryType !== "completed") return false;
    } else if (statusFilter === "Opportunities") {
      if (!project.isOpportunity && project.categoryType !== "future" && project.status !== "Available for Supervision") return false;
    } else if (statusFilter !== "All") {
      if (project.status !== statusFilter) return false;
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchTitle = project.title?.toLowerCase().includes(term);
      const matchSummary = project.summary?.toLowerCase().includes(term);
      const matchStudents = (project.students || []).some(
        (s) =>
          s.name?.toLowerCase().includes(term) ||
          s.registration?.toLowerCase().includes(term)
      );
      const matchTech = (project.technologies || []).some((t) =>
        t.toLowerCase().includes(term)
      );
      if (!matchTitle && !matchSummary && !matchStudents && !matchTech)
        return false;
    }
    return true;
  });

  const filterOptions = [
    "All",
    "Running",
    "Completed",
    "Opportunities",
    "In Progress",
    "Archived",
    "Published",
    "Draft",
  ];

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

        {/* Search & Filter Bar */}
        <div className={styles.filterBar}>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Search FYP projects by title, summary, student, technology..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className={styles.clearButton}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
          <div className={styles.filterChips}>
            {filterOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`${styles.chipBtn} ${
                  statusFilter === opt ? styles.activeChip : ""
                }`}
                onClick={() => setStatusFilter(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className={styles.empty} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "60px 20px" }}>
            <InlineSpinner sizePx={24} />
            <span>Loading supervised projects…</span>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className={styles.empty}>
            <h2>No FYP records found</h2>
            <p>
              {searchTerm || statusFilter !== "All"
                ? "No projects match your filter criteria."
                : "Add the first supervised project to begin the academic archive."}
            </p>
          </div>
        ) : (
          <div className={styles.list}>
            {filteredProjects.map((project, index) => (
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
                    {project.isOpportunity || project.categoryType === "future" ? (
                      <span style={{ background: "rgba(147, 51, 234, 0.12)", color: "#7e22ce" }}>
                        Opportunity
                      </span>
                    ) : null}
                  </div>
                  <h2>{project.title}</h2>
                  <p>{project.summary}</p>
                  <small>
                    {(project.students || []).map((student) => student.name).join(" · ") ||
                      "Students not added"}
                  </small>
                </div>
                <div className={styles.actions}>
                  {/* Quick Toggle Featured */}
                  <button
                    type="button"
                    className={styles.actionIconBtn}
                    onClick={() => handleToggleFeatured(project)}
                    title={project.featured ? "Remove from Featured" : "Mark as Featured"}
                    aria-label="Toggle Featured"
                  >
                    <Star
                      size={16}
                      color={project.featured ? "#eab308" : "currentColor"}
                      fill={project.featured ? "#eab308" : "none"}
                    />
                  </button>

                  {/* Quick Toggle Published */}
                  <button
                    type="button"
                    className={styles.actionIconBtn}
                    onClick={() => handleTogglePublished(project)}
                    title={project.published ? "Unpublish (Set to Draft)" : "Publish to Website"}
                    aria-label="Toggle Published"
                  >
                    {project.published ? (
                      <Eye size={16} color="#16a34a" />
                    ) : (
                      <EyeOff size={16} color="#dc2626" />
                    )}
                  </button>

                  {/* View on Live Site */}
                  <a
                    href={
                      project.isOpportunity || project.categoryType === "future"
                        ? `/supervision/opportunities/${project.slug}`
                        : `/supervision/projects/${project.slug}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className={styles.actionIconBtn}
                    title="View Case Study on Public Site"
                    aria-label="View on Public Site"
                  >
                    <ExternalLink size={16} />
                  </a>

                  <Link
                    href={`/admin/fyp/edit/${project._id}`}
                    aria-label={`Edit ${project.title}`}
                  >
                    <Edit3 size={16} />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteProject(project)}
                    aria-label={`Delete ${project.title}`}
                  >
                    <Trash2 size={16} />
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
        confirmVariant="danger"
        variant="danger"
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

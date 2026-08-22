import { useState, useEffect, useCallback, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pin,
  PinOff,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Edit3,
  ExternalLink,
  Search,
  BookOpen,
  FolderGit2,
  Sparkles,
  Save,
  RefreshCw,
  Plus,
} from "lucide-react";
import AdminLayout from "../../components/Admin/AdminLayout/AdminLayout";
import InlineSpinner from "../../components/LoadingAnimation/InlineSpinner";
import styles from "./pins.premium.module.css";

export default function AdminPinsPage() {
  const [items, setItems] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [stats, setStats] = useState({ total: 0, projects: 0 });
  const [loading, setLoading] = useState(true);
  const [savingOrder, setSavingOrder] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'projects' | 'discover'
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [isOrderModified, setIsOrderModified] = useState(false);

  const fetchPinnedItems = useCallback(async (includeCandidates = true) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/pinned-items?includeUnpinned=${includeCandidates ? "true" : "false"}`
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load pinned items");
      }
      setItems(data.data || []);
      setCandidates(data.candidates || []);
      if (data.stats) setStats(data.stats);
      setIsOrderModified(false);
    } catch (err) {
      toast.error(err.message || "Failed to load pinned items");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPinnedItems(true);
  }, [fetchPinnedItems]);

  // Handle Drag & Drop reordering
  const handleDrop = (index) => {
    if (
      draggedIndex === null ||
      draggedIndex === index ||
      draggedIndex < 0 ||
      draggedIndex >= items.length
    ) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const next = [...items];
    const [moved] = next.splice(draggedIndex, 1);
    next.splice(index, 0, moved);
    setItems(next);
    setDraggedIndex(null);
    setDragOverIndex(null);
    setIsOrderModified(true);
  };

  // Move up/down accessibility helper
  const moveItem = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const temp = next[index];
    next[index] = next[target];
    next[target] = temp;
    setItems(next);
    setIsOrderModified(true);
  };

  // Save new order to backend
  const saveOrder = async (customItems = items) => {
    setSavingOrder(true);
    const toastId = toast.loading("Saving pin order…");
    try {
      const payloadItems = customItems.map((item) => ({
        id: item._id,
        type: item.type,
      }));
      const res = await fetch("/api/admin/reorder-pins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payloadItems }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save order");
      }
      toast.success("Showcase order saved!", { id: toastId });
      setIsOrderModified(false);
    } catch (err) {
      toast.error(err.message || "Failed to save order", { id: toastId });
    } finally {
      setSavingOrder(false);
    }
  };

  // Toggle pin/unpin
  const togglePin = async (item, shouldPin) => {
    const toastId = toast.loading(
      shouldPin ? `Pinning "${item.title}"…` : `Unpinning "${item.title}"…`
    );
    try {
      const res = await fetch("/api/admin/pin-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item._id, type: item.type }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update pin");
      }

      toast.success(
        shouldPin ? `"${item.title}" pinned to showcase!` : `"${item.title}" unpinned.`,
        { id: toastId }
      );

      // Refresh list
      fetchPinnedItems(true);
    } catch (err) {
      toast.error(err.message || "Error updating pin", { id: toastId });
    }
  };

  // Filtered pinned items
  const filteredItems = useMemo(() => {
    let list = items;
    if (activeTab === "projects") {
      list = list.filter((i) => i.type === "project");
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (i) =>
          i.title?.toLowerCase().includes(q) ||
          i.slug?.toLowerCase().includes(q) ||
          (Array.isArray(i.tags) && i.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }
    return list;
  }, [items, activeTab, searchQuery]);

  // Filtered discover/candidates list
  const filteredCandidates = useMemo(() => {
    if (!searchQuery.trim()) return candidates;
    const q = searchQuery.toLowerCase();
    return candidates.filter(
      (c) =>
        c.title?.toLowerCase().includes(q) ||
        c.slug?.toLowerCase().includes(q) ||
        (Array.isArray(c.tags) && c.tags.some((t) => t.toLowerCase().includes(q)))
    );
  }, [candidates, searchQuery]);

  return (
    <AdminLayout title="Pinned Items Showcase">
      <div className={styles.pageWrapper}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>
              <Pin className={styles.pinIcon} size={28} />
              Pinned Showcase Manager
            </h1>
            <p className={styles.muted}>
              Curate and order featured research projects prominently highlighted on the public website.
            </p>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.actionBtn}
              onClick={() => fetchPinnedItems(true)}
              disabled={loading}
              title="Refresh pinned list"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            {isOrderModified && (
              <button
                className={styles.saveOrderBtn}
                onClick={() => saveOrder()}
                disabled={savingOrder}
              >
                {savingOrder ? <InlineSpinner sizePx={16} /> : <Save size={16} />}
                Save Order
              </button>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}>
              <Sparkles size={22} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Total Pinned</span>
              <span className={styles.statValue}>{stats.total}</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIconWrapper} ${styles.project}`}>
              <FolderGit2 size={22} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Pinned Projects</span>
              <span className={styles.statValue}>{stats.projects}</span>
            </div>
          </div>
        </div>

        {/* Control Bar: Tabs & Search */}
        <div className={styles.controlBar}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tabBtn} ${activeTab === "all" ? styles.active : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All Pinned ({items.length})
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === "projects" ? styles.active : ""}`}
              onClick={() => setActiveTab("projects")}
            >
              Projects ({stats.projects})
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === "discover" ? styles.active : ""}`}
              onClick={() => setActiveTab("discover")}
            >
              <Plus size={14} style={{ display: "inline", verticalAlign: "-2px", marginRight: 4 }} />
              Discover & Pin ({candidates.length})
            </button>
          </div>

          <div className={styles.searchBox}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder={
                activeTab === "discover"
                  ? "Search unpinned projects…"
                  : "Search pinned showcase items…"
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Order modification banner */}
        {isOrderModified && activeTab !== "discover" && (
          <div className={styles.orderStatusBanner}>
            <span>You have reordered items. Click Save Order to apply your new sequence to the live site.</span>
            <button
              className={styles.saveOrderBtn}
              onClick={() => saveOrder()}
              disabled={savingOrder}
            >
              {savingOrder ? <InlineSpinner sizePx={15} /> : <Save size={15} />}
              Save New Order
            </button>
          </div>
        )}

        {/* Main Content Area */}
        {loading ? (
          <div className={styles.emptyState}>
            <InlineSpinner sizePx={32} />
            <p className={styles.emptyText} style={{ marginTop: 14 }}>
              Loading showcase items…
            </p>
          </div>
        ) : activeTab === "discover" ? (
          /* DISCOVER & PIN NEW ITEMS TAB */
          <div>
            <h2 className={styles.sectionHeading}>
              <Plus size={20} />
              Available Content to Pin
            </h2>
            <p className={styles.sectionDesc}>
              Browse unpinned articles and projects. Click “Pin to Showcase” to highlight them immediately.
            </p>

            {filteredCandidates.length === 0 ? (
              <div className={styles.emptyState}>
                <PinOff size={42} className={styles.emptyIcon} />
                <h3 className={styles.emptyTitle}>No matching unpinned content found</h3>
                <p className={styles.emptyText}>
                  All current published articles and projects may already be pinned, or no items match your search.
                </p>
              </div>
            ) : (
              <div className={styles.itemsList}>
                {filteredCandidates.map((item) => {
                  const editUrl = `/admin/projects/edit/${item._id}`;
                  const thumbnail = item.coverImage || item.image;

                  return (
                    <div key={item._id} className={styles.itemCard} style={{ cursor: "default" }}>
                      <div className={styles.itemThumb}>
                        {thumbnail ? (
                          <img src={thumbnail} alt={item.title} />
                        ) : (
                          <div className={styles.thumbPlaceholder}>
                            <FolderGit2 size={20} />
                          </div>
                        )}
                      </div>

                      <div className={styles.itemDetails}>
                        <div className={styles.itemMeta}>
                          <span
                            className={`${styles.typeBadge} ${styles.project}`}
                          >
                            {item.type}
                          </span>
                          <span
                            className={`${styles.publishedBadge} ${
                              item.published ? styles.pub : styles.draft
                            }`}
                          >
                            {item.published ? "Published" : "Draft"}
                          </span>
                        </div>
                        <h3 className={styles.itemTitle}>{item.title}</h3>
                        <p className={styles.itemExcerpt}>
                          {item.excerpt || item.description || "No description provided."}
                        </p>
                      </div>

                      <div className={styles.itemActions}>
                        <Link href={editUrl} className={styles.actionBtn} title="Edit item">
                          <Edit3 size={14} />
                          Edit
                        </Link>
                        <button
                          type="button"
                          className={`${styles.actionBtn} ${styles.pinBtn}`}
                          onClick={() => togglePin(item, true)}
                        >
                          <Pin size={14} />
                          Pin to Showcase
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : filteredItems.length === 0 ? (
          /* EMPTY STATE FOR PINNED ITEMS */
          <div className={styles.emptyState}>
            <PinOff size={42} className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>No pinned items found</h3>
            <p className={styles.emptyText}>
              {searchQuery
                ? "No pinned items matched your search query."
                : "You haven’t pinned any projects to the showcase yet."}
            </p>
            <button
              className={styles.saveOrderBtn}
              style={{ margin: "0 auto" }}
              onClick={() => setActiveTab("discover")}
            >
              <Plus size={16} />
              Browse & Pin Content
            </button>
          </div>
        ) : (
          /* PINNED ITEMS LIST (DRAG & DROP) */
          <div className={styles.itemsList}>
            {filteredItems.map((item, index) => {
              const editUrl = `/admin/projects/edit/${item._id}`;
              const thumbnail = item.coverImage || item.image;

              return (
                <div
                  key={item._id}
                  className={`${styles.itemCard} ${
                    dragOverIndex === index ? styles.dragOver : ""
                  }`}
                  draggable
                  onDragStart={() => setDraggedIndex(index)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverIndex(index);
                  }}
                  onDragLeave={() => setDragOverIndex(null)}
                  onDrop={() => handleDrop(index)}
                  onDragEnd={() => {
                    setDraggedIndex(null);
                    setDragOverIndex(null);
                  }}
                >
                  {/* Drag Handle & Order Badge */}
                  <div className={styles.dragHandle} title="Drag to reorder">
                    <GripVertical size={18} />
                    <div className={styles.badgeIndex}>{index + 1}</div>
                  </div>

                  {/* Thumbnail */}
                  <div className={styles.itemThumb}>
                    {thumbnail ? (
                      <img src={thumbnail} alt={item.title} />
                    ) : (
                      <div className={styles.thumbPlaceholder}>
                        <FolderGit2 size={20} />
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className={styles.itemDetails}>
                    <div className={styles.itemMeta}>
                      <span
                        className={`${styles.typeBadge} ${styles.project}`}
                      >
                        {item.type}
                      </span>
                      <span
                        className={`${styles.publishedBadge} ${
                          item.published ? styles.pub : styles.draft
                        }`}
                      >
                        {item.published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <h3 className={styles.itemTitle}>{item.title}</h3>
                    <p className={styles.itemExcerpt}>
                      {item.excerpt || item.description || "No description provided."}
                    </p>
                  </div>

                  {/* Order & Management Actions */}
                  <div className={styles.itemActions}>
                    <button
                      type="button"
                      className={styles.actionBtn}
                      disabled={index === 0}
                      onClick={() => moveItem(index, -1)}
                      title="Move up"
                      style={{ padding: "6px 8px" }}
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      className={styles.actionBtn}
                      disabled={index === filteredItems.length - 1}
                      onClick={() => moveItem(index, 1)}
                      title="Move down"
                      style={{ padding: "6px 8px" }}
                    >
                      <ArrowDown size={14} />
                    </button>

                    <Link href={editUrl} className={styles.actionBtn} title="Edit item">
                      <Edit3 size={14} />
                      Edit
                    </Link>

                    <button
                      type="button"
                      className={`${styles.actionBtn} ${styles.unpinBtn}`}
                      onClick={() => togglePin(item, false)}
                      title="Remove from pinned showcase"
                    >
                      <PinOff size={14} />
                      Unpin
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}

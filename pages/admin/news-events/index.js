import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Calendar,
  Image as ImageIcon,
  ExternalLink,
  Star,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  MapPin,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../../components/Admin/AdminLayout/AdminLayout';
import Modal from '../../../components/Admin/Modal/Modal';
import styles from '../../../styles/academic-admin.module.css';

export default function NewsEventsAdminPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');

  // Modals state
  const [deleteItem, setDeleteItem] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/events');
      const json = await res.json();
      if (json.success) {
        setEvents(json.data || []);
      } else if (json.items) {
        setEvents(json.items || []);
      } else {
        toast.error(json.message || 'Failed to load news & events');
      }
    } catch (err) {
      toast.error('Network error loading events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Toggle Featured
  const handleToggleFeatured = async (ev) => {
    const nextFeatured = !ev.featured;
    try {
      const res = await fetch(`/api/news-events/${ev._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: nextFeatured }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to update feature');

      toast.success(nextFeatured ? 'Marked as Featured' : 'Removed from Featured');
      setEvents((prev) =>
        prev.map((item) => (item._id === ev._id ? { ...item, featured: nextFeatured } : item))
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Toggle Published
  const handleTogglePublished = async (ev) => {
    const nextPublished = ev.published === false ? true : false;
    try {
      const res = await fetch(`/api/news-events/${ev._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: nextPublished }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to update status');

      toast.success(nextPublished ? 'Item published' : 'Item set to draft');
      setEvents((prev) =>
        prev.map((item) => (item._id === ev._id ? { ...item, published: nextPublished } : item))
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Reorder Handler (Move item up/down)
  const handleMoveOrder = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= events.length) return;

    const reordered = [...events];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const itemsPayload = reordered.map((item, idx) => ({
      id: item._id,
      displayOrder: idx,
    }));

    setEvents(reordered);

    try {
      const res = await fetch('/api/admin/events/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsPayload }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to persist order');
      toast.success('Event order updated');
    } catch (err) {
      toast.error(err.message);
      fetchEvents();
    }
  };

  // Delete Handler
  const handleDelete = async () => {
    if (!deleteItem) return;
    const toastId = toast.loading('Deleting event...');
    try {
      const res = await fetch(`/api/news-events/${deleteItem._id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to delete');

      toast.success('Event deleted successfully', { id: toastId });
      setDeleteItem(null);
      fetchEvents();
    } catch (error) {
      toast.error(error.message, { id: toastId });
    }
  };

  const filtered = events.filter((ev) => {
    const matchesSearch =
      !searchTerm ||
      ev.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.venue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.caption?.toLowerCase().includes(searchTerm.toLowerCase());

    const cat = ev.category?.toLowerCase() || '';

    let matchesTab = true;
    if (selectedTab === 'news') {
      matchesTab = cat === 'news' || cat === 'announcement';
    } else if (selectedTab === 'workshops') {
      matchesTab = cat === 'workshop' || cat === 'conference' || cat === 'seminar';
    } else if (selectedTab === 'gallery') {
      matchesTab = Boolean(ev.isGalleryItem) || cat === 'gallery';
    }

    return matchesSearch && matchesTab;
  });

  return (
    <AdminLayout title="News, Events & Gallery Management">
      <Head>
        <title>News & Events | Admin</title>
      </Head>

      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <p>Academic CMS</p>
            <h1>News, Events & Photo Gallery</h1>
            <span>
              Manage news headlines, keynote talks, workshop announcements, symposium highlights,
              and lab photo gallery.
            </span>
          </div>
          <Link href="/admin/news-events/new" className={styles.actionButton}>
            <Plus size={18} /> Add News / Event
          </Link>
        </div>

        {/* Controls & Search */}
        <div className={styles.controls}>
          <div className={styles.searchBar}>
            <Search size={18} color="#64748b" />
            <input
              type="text"
              placeholder="Search news & events by title, location, or summary..."
              aria-label="Search news & events by title, location, or summary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: "1.1rem", padding: "0 4px" }}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className={styles.filterTabs}>
          {[
            { id: 'all', label: 'All Items' },
            { id: 'news', label: 'News & Announcements' },
            { id: 'workshops', label: 'Workshops & Talks' },
            { id: 'gallery', label: '📸 Photo Gallery' },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${selectedTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setSelectedTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <h2 className="sr-only">Events & Gallery Management List</h2>

        {loading ? (
          <div className={styles.loadingSpinner}>Loading events...</div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <Calendar size={48} style={{ opacity: 0.4, marginBottom: 12 }} />
            <h3>No events or gallery items found</h3>
            <p>
              {searchTerm || selectedTab !== 'all'
                ? "No events or gallery items match your current filter criteria."
                : "Add announcements, talk highlights, or photos to showcase lab activity."}
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "16px" }}>
              {(searchTerm || selectedTab !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedTab("all");
                  }}
                  className={styles.secondaryButton}
                >
                  Reset Filters
                </button>
              )}
              <Link href="/admin/news-events/new" className={styles.actionButton}>
                <Plus size={16} /> Add News or Event
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.list}>
            {filtered.map((ev, idx) => (
              <div key={ev._id} className={styles.card}>
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <span className={styles.badge}>{ev.category || 'News'}</span>
                    {ev.date && <span className={styles.badge}>{ev.date}</span>}
                    {ev.badge && (
                      <span className={styles.badge} style={{ background: '#fef08a', color: '#854d0e' }}>
                        {ev.badge}
                      </span>
                    )}
                    {ev.isGalleryItem && (
                      <span className={styles.badge} style={{ background: '#f3e8ff', color: '#7e22ce' }}>
                        📸 Gallery
                      </span>
                    )}
                    <span className={ev.published !== false ? styles.badgePublished : styles.badgeDraft}>
                      {ev.published !== false ? 'Published' : 'Draft'}
                    </span>
                    <h3 className={styles.cardTitle}>{ev.title}</h3>
                  </div>

                  <div className={styles.cardMeta}>
                    {ev.location && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={14} /> {ev.location}
                      </span>
                    )}
                    {ev.venue && <span><strong>Venue:</strong> {ev.venue}</span>}
                  </div>

                  {ev.summary && <p className={styles.cardDescription}>{ev.summary}</p>}
                  {ev.caption && (
                    <p className={styles.cardDescription} style={{ fontStyle: 'italic', color: '#64748b' }}>
                      Caption: {ev.caption}
                    </p>
                  )}
                </div>

                <div className={styles.cardActions}>
                  {/* Reorder Buttons */}
                  <button
                    onClick={() => handleMoveOrder(idx, -1)}
                    disabled={idx === 0}
                    className={styles.iconButton}
                    title="Move Up"
                  >
                    <ArrowUp size={15} />
                  </button>
                  <button
                    onClick={() => handleMoveOrder(idx, 1)}
                    disabled={idx === filtered.length - 1}
                    className={styles.iconButton}
                    title="Move Down"
                  >
                    <ArrowDown size={15} />
                  </button>

                  {/* Toggle Featured */}
                  <button
                    onClick={() => handleToggleFeatured(ev)}
                    className={styles.iconButton}
                    title={ev.featured ? 'Unfeature item' : 'Highlight as featured'}
                    style={{ color: ev.featured ? '#eab308' : undefined }}
                  >
                    <Star size={16} fill={ev.featured ? '#eab308' : 'none'} />
                  </button>

                  {/* Toggle Published */}
                  <button
                    onClick={() => handleTogglePublished(ev)}
                    className={styles.iconButton}
                    title={ev.published !== false ? 'Unpublish (Draft)' : 'Publish to website'}
                  >
                    {ev.published !== false ? (
                      <Eye size={16} color="#16a34a" />
                    ) : (
                      <EyeOff size={16} color="#dc2626" />
                    )}
                  </button>

                  {/* View on Public Website */}
                  <a
                    href="/events"
                    target="_blank"
                    rel="noreferrer"
                    className={styles.iconButton}
                    title="View News & Events on Live Website"
                  >
                    <ExternalLink size={16} />
                  </a>

                  {/* Edit */}
                  <Link
                    href={`/admin/news-events/edit/${ev._id}`}
                    className={styles.iconButton}
                    title="Edit Event"
                  >
                    <Edit3 size={16} />
                  </Link>

                  {/* Delete */}
                  <button
                    onClick={() => setDeleteItem(ev)}
                    className={`${styles.iconButton} ${styles.iconButtonDanger}`}
                    title="Delete Event"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteItem)}
        onClose={() => setDeleteItem(null)}
        title="Delete News / Event"
      >
        <div style={{ padding: '8px 0' }}>
          <p>
            Are you sure you want to delete <strong>{deleteItem?.title}</strong>? This action cannot
            be undone.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
            <button onClick={() => setDeleteItem(null)} className={styles.secondaryButton}>
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className={styles.actionButton}
              style={{ background: '#dc2626', borderColor: '#dc2626' }}
            >
              Delete Item
            </button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}

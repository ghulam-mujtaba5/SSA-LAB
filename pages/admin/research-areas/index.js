import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Cpu,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../../components/Admin/AdminLayout/AdminLayout';
import Modal from '../../../components/Admin/Modal/Modal';
import styles from '../../../styles/academic-admin.module.css';

export default function ResearchAreasAdminPage() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [deleteItem, setDeleteItem] = useState(null);

  const fetchDomains = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/research');
      const json = await res.json();
      if (json.success) {
        setDomains(json.data || []);
      } else if (json.items) {
        setDomains(json.items || []);
      } else {
        toast.error(json.message || 'Failed to load research domains');
      }
    } catch (err) {
      toast.error('Network error loading research domains');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  // Toggle Published
  const handleTogglePublished = async (domain) => {
    const nextPublished = domain.published === false ? true : false;
    try {
      const res = await fetch(`/api/research-domains/${domain._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: nextPublished }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to update status');

      toast.success(nextPublished ? 'Domain published' : 'Domain set to draft');
      setDomains((prev) =>
        prev.map((item) => (item._id === domain._id ? { ...item, published: nextPublished } : item))
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Reorder Handler (Move item up/down)
  const handleMoveOrder = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= domains.length) return;

    const reordered = [...domains];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const itemsPayload = reordered.map((item, idx) => ({
      id: item._id,
      displayOrder: idx,
    }));

    setDomains(reordered);

    try {
      const res = await fetch('/api/admin/research/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsPayload }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to persist order');
      toast.success('Domain order updated');
    } catch (err) {
      toast.error(err.message);
      fetchDomains();
    }
  };

  // Delete Handler
  const handleDelete = async () => {
    if (!deleteItem) return;
    const toastId = toast.loading('Deleting domain...');
    try {
      const res = await fetch(`/api/research-domains/${deleteItem._id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to delete');

      toast.success('Research domain deleted successfully', { id: toastId });
      setDeleteItem(null);
      fetchDomains();
    } catch (error) {
      toast.error(error.message, { id: toastId });
    }
  };

  const filtered = domains.filter((d) => {
    return (
      !searchTerm ||
      d.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.overview?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.graphicKey?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <AdminLayout title="Research Areas Management">
      <Head>
        <title>Research Areas | Admin</title>
      </Head>

      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <p>Academic CMS</p>
            <h1>Research Areas & Domains</h1>
            <span>
              Manage primary laboratory research focus areas, key problems, current directions, and
              tools/datasets.
            </span>
          </div>
          <Link href="/admin/research-areas/new" className={styles.actionButton}>
            <Plus size={18} /> Add Research Area
          </Link>
        </div>

        {/* Search */}
        <div className={styles.controls}>
          <div className={styles.searchBar}>
            <Search size={18} color="#64748b" />
            <input
              type="text"
              placeholder="Search research domains by title, key problem, or description..."
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

        {loading ? (
          <div className={styles.loadingSpinner}>Loading research domains...</div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <Cpu size={48} style={{ opacity: 0.4, marginBottom: 12 }} />
            <h3>No research domains found</h3>
            <p>
              {searchTerm
                ? "No research domains match your search query."
                : "Add a research focus area to showcase your lab's active scientific domains."}
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "16px" }}>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className={styles.secondaryButton}
                >
                  Clear Search
                </button>
              )}
              <Link href="/admin/research-areas/new" className={styles.actionButton}>
                <Plus size={16} /> Add Research Area
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.list}>
            {filtered.map((dom, idx) => (
              <div key={dom._id} className={styles.card}>
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <span className={styles.badge}>#{dom.number || '01'}</span>
                    {dom.graphicKey && (
                      <span className={styles.badge} style={{ background: '#f3e8ff', color: '#7e22ce' }}>
                        {dom.graphicKey}
                      </span>
                    )}
                    <span className={dom.published !== false ? styles.badgePublished : styles.badgeDraft}>
                      {dom.published !== false ? 'Published' : 'Draft'}
                    </span>
                    <h3 className={styles.cardTitle}>{dom.title}</h3>
                  </div>

                  <p className={styles.cardDescription}>{dom.description}</p>

                  <div className={styles.cardMeta} style={{ marginTop: 8 }}>
                    {Array.isArray(dom.keyProblems) && dom.keyProblems.length > 0 && (
                      <span>
                        <strong>Problems:</strong> {dom.keyProblems.length} addressed
                      </span>
                    )}
                    {Array.isArray(dom.currentDirections) && dom.currentDirections.length > 0 && (
                      <span>
                        <strong>Directions:</strong> {dom.currentDirections.length} active
                      </span>
                    )}
                    {dom.toolsAndDatasets?.items?.length > 0 && (
                      <span>
                        <strong>Tools:</strong> {dom.toolsAndDatasets.items.length} tools/datasets
                      </span>
                    )}
                  </div>
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

                  {/* Toggle Published */}
                  <button
                    onClick={() => handleTogglePublished(dom)}
                    className={styles.iconButton}
                    title={dom.published !== false ? 'Unpublish (Draft)' : 'Publish to website'}
                  >
                    {dom.published !== false ? (
                      <Eye size={16} color="#16a34a" />
                    ) : (
                      <EyeOff size={16} color="#dc2626" />
                    )}
                  </button>

                  {/* View on Live Site */}
                  <a
                    href={`/research#${dom.slug || dom.domainId || ''}`}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.iconButton}
                    title="View Domain on Public Website"
                  >
                    <ExternalLink size={16} />
                  </a>

                  {/* Edit */}
                  <Link
                    href={`/admin/research-areas/edit/${dom._id}`}
                    className={styles.iconButton}
                    title="Edit Research Domain"
                  >
                    <Edit3 size={16} />
                  </Link>

                  {/* Delete */}
                  <button
                    onClick={() => setDeleteItem(dom)}
                    className={`${styles.iconButton} ${styles.iconButtonDanger}`}
                    title="Delete Research Domain"
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
        title="Delete Research Domain"
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
              Delete Domain
            </button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}

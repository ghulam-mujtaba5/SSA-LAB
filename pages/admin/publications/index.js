import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  BookOpen,
  ExternalLink,
  Star,
  FileUp,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  Eye,
  EyeOff,
  Filter,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../../components/Admin/AdminLayout/AdminLayout';
import Modal from '../../../components/Admin/Modal/Modal';
import styles from '../../../styles/academic-admin.module.css';

export default function PublicationsAdminPage() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

  // Modals state
  const [deleteItem, setDeleteItem] = useState(null);
  const [isBibtexModalOpen, setIsBibtexModalOpen] = useState(false);
  const [bibtexInput, setBibtexInput] = useState('');
  const [importingBibtex, setImportingBibtex] = useState(false);

  const fetchPublications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/publications?limit=200');
      const json = await res.json();
      if (json.success) {
        setPublications(json.data || []);
      } else if (json.items) {
        setPublications(json.items || []);
      } else {
        toast.error(json.message || 'Failed to load publications');
      }
    } catch (err) {
      toast.error('Network error loading publications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);

  // Toggle Featured / Highlight
  const handleToggleHighlight = async (pub) => {
    const nextFeatured = !pub.featured;
    try {
      const res = await fetch(`/api/publications/${pub._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: nextFeatured }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to update highlight');

      toast.success(nextFeatured ? 'Marked as Featured' : 'Removed from Featured');
      setPublications((prev) =>
        prev.map((item) => (item._id === pub._id ? { ...item, featured: nextFeatured } : item))
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Toggle Published
  const handleTogglePublished = async (pub) => {
    const nextPublished = pub.published === false ? true : false;
    try {
      const res = await fetch(`/api/publications/${pub._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: nextPublished }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to update status');

      toast.success(nextPublished ? 'Published to website' : 'Moved to draft');
      setPublications((prev) =>
        prev.map((item) => (item._id === pub._id ? { ...item, published: nextPublished } : item))
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Reorder Handler (Move item up/down)
  const handleMoveOrder = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= publications.length) return;

    const reordered = [...publications];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    // Assign display orders
    const itemsPayload = reordered.map((item, idx) => ({
      id: item._id,
      displayOrder: idx,
    }));

    setPublications(reordered);

    try {
      const res = await fetch('/api/admin/publications/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsPayload }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to persist order');
      toast.success('Order updated');
    } catch (err) {
      toast.error(err.message);
      fetchPublications();
    }
  };

  // Delete Handler
  const handleDelete = async () => {
    if (!deleteItem) return;
    const toastId = toast.loading('Deleting publication...');
    try {
      const res = await fetch(`/api/publications/${deleteItem._id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to delete');

      toast.success('Publication deleted successfully', { id: toastId });
      setDeleteItem(null);
      fetchPublications();
    } catch (error) {
      toast.error(error.message, { id: toastId });
    }
  };

  // Import BibTeX Handler
  const handleImportBibtex = async (e) => {
    e.preventDefault();
    if (!bibtexInput.trim()) {
      toast.error('Please enter valid BibTeX entries');
      return;
    }

    setImportingBibtex(true);
    const toastId = toast.loading('Importing BibTeX entries...');
    try {
      const res = await fetch('/api/admin/publications/import-bibtex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bibtex: bibtexInput }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to import BibTeX');

      toast.success(`Successfully imported ${json.count || json.imported?.length || 1} publication(s)!`, { id: toastId });
      setIsBibtexModalOpen(false);
      setBibtexInput('');
      fetchPublications();
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setImportingBibtex(false);
    }
  };

  // Extract unique years for filtering
  const availableYears = Array.from(
    new Set(publications.map((p) => String(p.year || '')).filter(Boolean))
  ).sort((a, b) => Number(b) - Number(a));

  // Filter list
  const filtered = publications.filter((p) => {
    const matchesSearch =
      !searchTerm ||
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.authors?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.venue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesType = selectedType === 'all' || p.type?.toLowerCase() === selectedType.toLowerCase();
    const matchesYear = selectedYear === 'all' || String(p.year) === selectedYear;

    return matchesSearch && matchesType && matchesYear;
  });

  return (
    <AdminLayout title="Publications Management">
      <Head>
        <title>Publications Management | Admin</title>
      </Head>

      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <p>Academic CMS</p>
            <h1>Publications</h1>
            <span>
              Manage all peer-reviewed journals, conference proceedings, preprints, patents, and
              research outputs.
            </span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setIsBibtexModalOpen(true)}
              className={styles.secondaryButton}
              title="Batch import papers from BibTeX"
            >
              <FileUp size={18} /> Import BibTeX
            </button>
            <Link href="/admin/publications/new" className={styles.actionButton}>
              <Plus size={18} /> Add Publication
            </Link>
          </div>
        </div>

        {/* Controls & Filters */}
        <div className={styles.controls}>
          <div className={styles.searchBar}>
            <Search size={18} color="#64748b" />
            <input
              type="text"
              placeholder="Search publications by title, authors, venue, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <select
              className={styles.formSelect}
              style={{ minWidth: 130 }}
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="all">All Years</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.filterTabs}>
          {['all', 'Journal', 'Conference', 'Book Chapter', 'Preprint', 'Workshop', 'Patent'].map((type) => (
            <button
              key={type}
              className={`${styles.tab} ${selectedType === type ? styles.tabActive : ''}`}
              onClick={() => setSelectedType(type)}
            >
              {type === 'all' ? 'All Types' : type}
            </button>
          ))}
        </div>

        {loading ? (
          <div className={styles.loadingSpinner}>Loading publications...</div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <BookOpen size={48} style={{ opacity: 0.4, marginBottom: 12 }} />
            <h3>No publications found</h3>
            <p>Try adjusting your search filters or create a new publication record.</p>
          </div>
        ) : (
          <div className={styles.list}>
            {filtered.map((pub, idx) => (
              <div key={pub._id} className={styles.card}>
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <span className={styles.badge}>{pub.type || 'Publication'}</span>
                    <span className={styles.badge}>{pub.year}</span>
                    {pub.featured && (
                      <span
                        className={styles.badge}
                        style={{ background: '#fef08a', color: '#854d0e', display: 'inline-flex', alignItems: 'center', gap: 3 }}
                      >
                        <Star size={12} fill="#854d0e" /> Featured
                      </span>
                    )}
                    <span className={pub.published !== false ? styles.badgePublished : styles.badgeDraft}>
                      {pub.published !== false ? 'Published' : 'Draft'}
                    </span>
                    <h3 className={styles.cardTitle}>{pub.title}</h3>
                  </div>

                  <div className={styles.cardMeta}>
                    <span>
                      <strong>Authors:</strong> {pub.authors}
                    </span>
                    <span>
                      <strong>Venue:</strong> {pub.venue}
                    </span>
                    {Array.isArray(pub.tags) && pub.tags.length > 0 && (
                      <span>
                        <strong>Tags:</strong> {pub.tags.join(', ')}
                      </span>
                    )}
                  </div>

                  {pub.abstract && <p className={styles.cardDescription}>{pub.abstract}</p>}
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

                  {/* Toggle Highlight */}
                  <button
                    onClick={() => handleToggleHighlight(pub)}
                    className={styles.iconButton}
                    title={pub.featured ? 'Unfeature paper' : 'Highlight as featured'}
                    style={{ color: pub.featured ? '#eab308' : undefined }}
                  >
                    <Star size={16} fill={pub.featured ? '#eab308' : 'none'} />
                  </button>

                  {/* Toggle Published */}
                  <button
                    onClick={() => handleTogglePublished(pub)}
                    className={styles.iconButton}
                    title={pub.published !== false ? 'Unpublish (Draft)' : 'Publish to website'}
                  >
                    {pub.published !== false ? <Eye size={16} color="#16a34a" /> : <EyeOff size={16} color="#dc2626" />}
                  </button>

                  {/* View on Public Website */}
                  <a
                    href="/publications"
                    target="_blank"
                    rel="noreferrer"
                    className={styles.iconButton}
                    title="View Publications on Live Website"
                  >
                    <BookOpen size={16} />
                  </a>

                  {/* View Paper External Link */}
                  {pub.href && (
                    <a
                      href={pub.href}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.iconButton}
                      title="Open Paper DOI / URL"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}

                  {/* Edit */}
                  <Link
                    href={`/admin/publications/edit/${pub._id}`}
                    className={styles.iconButton}
                    title="Edit Publication"
                  >
                    <Edit3 size={16} />
                  </Link>

                  {/* Delete */}
                  <button
                    onClick={() => setDeleteItem(pub)}
                    className={`${styles.iconButton} ${styles.iconButtonDanger}`}
                    title="Delete Publication"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BibTeX Import Modal */}
      <Modal
        isOpen={isBibtexModalOpen}
        onClose={() => setIsBibtexModalOpen(false)}
        title="Batch Import Publications via BibTeX"
      >
        <form onSubmit={handleImportBibtex} className={styles.formGrid}>
          <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>
            Paste one or multiple BibTeX citations below. The system will parse authors, title,
            year, venue, DOI, and abstract automatically.
          </p>

          <textarea
            required
            rows={10}
            className={styles.formTextarea}
            style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
            placeholder={`@article{akram2026towards,\n  title={Towards AI-Driven Vulnerability Detection},\n  author={Akram, Junaid and Mujtaba, Ghulam},\n  journal={IEEE Transactions on Software Engineering},\n  year={2026},\n  doi={10.1109/TSE.2026.12345}\n}`}
            value={bibtexInput}
            onChange={(e) => setBibtexInput(e.target.value)}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
            <button
              type="button"
              onClick={() => setIsBibtexModalOpen(false)}
              className={styles.secondaryButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={importingBibtex}
              className={styles.actionButton}
            >
              {importingBibtex ? 'Importing...' : 'Parse & Import BibTeX'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteItem)}
        onClose={() => setDeleteItem(null)}
        title="Delete Publication"
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
              Delete Publication
            </button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}

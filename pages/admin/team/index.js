import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Users,
  Mail,
  Linkedin,
  Globe,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Briefcase,
  GraduationCap,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../../components/Admin/AdminLayout/AdminLayout';
import Modal from '../../../components/Admin/Modal/Modal';
import styles from '../../../styles/academic-admin.module.css';

export default function TeamAdminPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modals state
  const [deleteItem, setDeleteItem] = useState(null);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/team');
      const json = await res.json();
      if (json.success) {
        setMembers(json.data || []);
      } else if (json.items) {
        setMembers(json.items || []);
      } else {
        toast.error(json.message || 'Failed to load team members');
      }
    } catch (err) {
      toast.error('Network error loading team');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Toggle Published
  const handleTogglePublished = async (member) => {
    const nextPublished = member.published === false ? true : false;
    try {
      const res = await fetch(`/api/team-members/${member._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: nextPublished }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to update status');

      toast.success(nextPublished ? 'Member published' : 'Member set to draft');
      setMembers((prev) =>
        prev.map((item) => (item._id === member._id ? { ...item, published: nextPublished } : item))
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Reorder Handler (Move item up/down)
  const handleMoveOrder = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= members.length) return;

    const reordered = [...members];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const itemsPayload = reordered.map((item, idx) => ({
      id: item._id,
      displayOrder: idx,
    }));

    setMembers(reordered);

    try {
      const res = await fetch('/api/admin/team/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsPayload }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to persist order');
      toast.success('Team order updated');
    } catch (err) {
      toast.error(err.message);
      fetchMembers();
    }
  };

  // Delete Handler
  const handleDelete = async () => {
    if (!deleteItem) return;
    const toastId = toast.loading('Deleting member...');
    try {
      const res = await fetch(`/api/team-members/${deleteItem._id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to delete');

      toast.success('Team member deleted successfully', { id: toastId });
      setDeleteItem(null);
      fetchMembers();
    } catch (error) {
      toast.error(error.message, { id: toastId });
    }
  };

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'pg-researcher':
      case 'pg_researcher':
        return 'PG Researcher';
      case 'co-investigator':
      case 'co_investigator':
      case 'faculty':
        return 'Co-Investigator';
      case 'supervised-project':
      case 'supervisor':
        return 'Supervised Theses';
      case 'alumni':
      case 'alumnus':
        return 'Alumni Placement';
      case 'collaborator':
        return 'Collaborator';
      default:
        return 'Team Member';
    }
  };

  const filtered = members.filter((m) => {
    const matchesSearch =
      !searchTerm ||
      m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.topic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.affiliation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.institution?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.specialization?.toLowerCase().includes(searchTerm.toLowerCase());

    const cat = m.category?.toLowerCase();
    let matchesCat = true;

    if (selectedCategory === 'pg') {
      matchesCat = cat === 'pg-researcher' || cat === 'pg_researcher';
    } else if (selectedCategory === 'faculty') {
      matchesCat = cat === 'co-investigator' || cat === 'co_investigator' || cat === 'faculty';
    } else if (selectedCategory === 'theses') {
      matchesCat = cat === 'supervised-project' || cat === 'supervisor';
    } else if (selectedCategory === 'alumni') {
      matchesCat = cat === 'alumni' || cat === 'alumnus';
    } else if (selectedCategory === 'collaborator') {
      matchesCat = cat === 'collaborator';
    }

    return matchesSearch && matchesCat;
  });

  return (
    <AdminLayout title="Team & Personnel Management">
      <Head>
        <title>Team & Personnel | Admin</title>
      </Head>

      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <p>Academic CMS</p>
            <h1>Team & Personnel</h1>
            <span>
              Manage postgraduate researchers, faculty co-investigators, supervised theses, alumni
              placements, and international collaborators.
            </span>
          </div>
          <Link href="/admin/team/new" className={styles.actionButton}>
            <Plus size={18} /> Add Member
          </Link>
        </div>

        {/* Controls & Search */}
        <div className={styles.controls}>
          <div className={styles.searchBar}>
            <Search size={18} color="#64748b" />
            <input
              type="text"
              placeholder="Search by name, role, research topic, specialization, or affiliation..."
              aria-label="Search by name, role, research topic, specialization, or affiliation"
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
            { id: 'all', label: 'All Personnel' },
            { id: 'pg', label: 'PG Researchers' },
            { id: 'faculty', label: 'Faculty / Co-Investigators' },
            { id: 'theses', label: 'Supervised Theses' },
            { id: 'alumni', label: 'Alumni Placements' },
            { id: 'collaborator', label: 'Collaborators' },
          ].map((cat) => (
            <button
              key={cat.id}
              className={`${styles.tab} ${selectedCategory === cat.id ? styles.tabActive : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <h2 className="sr-only">Team Members Management List</h2>

        {loading ? (
          <div className={styles.loadingSpinner}>Loading team members...</div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <Users size={48} style={{ opacity: 0.4, marginBottom: 12 }} />
            <h3>No team members found</h3>
            <p>
              {searchTerm || selectedCategory !== 'all'
                ? "No team members match your current filter criteria."
                : "Add postgraduate students, faculty collaborators, or alumni to the roster."}
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "16px" }}>
              {(searchTerm || selectedCategory !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                  className={styles.secondaryButton}
                >
                  Reset Filters
                </button>
              )}
              <Link href="/admin/team/new" className={styles.actionButton}>
                <Plus size={16} /> Add Member
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.list}>
            {filtered.map((member, idx) => (
              <div key={member._id} className={styles.card}>
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <span className={styles.badge}>{getCategoryLabel(member.category)}</span>
                    {member.status && (
                      <span
                        className={styles.badge}
                        style={{
                          background: member.status === 'Active' ? '#dcfce7' : '#f1f5f9',
                          color: member.status === 'Active' ? '#15803d' : '#475569',
                        }}
                      >
                        {member.status}
                      </span>
                    )}
                    <span className={member.published !== false ? styles.badgePublished : styles.badgeDraft}>
                      {member.published !== false ? 'Published' : 'Draft'}
                    </span>
                    <h3 className={styles.cardTitle}>{member.name}</h3>
                  </div>

                  <div className={styles.cardMeta}>
                    {member.role && (
                      <span>
                        <strong>Role:</strong> {member.role}
                      </span>
                    )}
                    {member.degree && (
                      <span>
                        <strong>Degree:</strong> {member.degree}
                      </span>
                    )}
                    {(member.affiliation || member.institution) && (
                      <span>
                        <strong>Affiliation:</strong> {member.affiliation || member.institution}
                      </span>
                    )}
                    {(member.organization || member.placement) && (
                      <span>
                        <strong>Placement:</strong> {member.organization || member.placement}
                      </span>
                    )}
                    {(member.term || member.period) && (
                      <span>
                        <strong>Period:</strong> {member.term || member.period}
                      </span>
                    )}
                  </div>

                  {member.topic && (
                    <p className={styles.cardDescription}>
                      <strong>Topic:</strong> {member.topic}
                    </p>
                  )}
                  {member.bio && !member.topic && (
                    <p className={styles.cardDescription}>{member.bio}</p>
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

                  {/* Toggle Published */}
                  <button
                    onClick={() => handleTogglePublished(member)}
                    className={styles.iconButton}
                    title={member.published !== false ? 'Unpublish (Draft)' : 'Publish to website'}
                  >
                    {member.published !== false ? (
                      <Eye size={16} color="#16a34a" />
                    ) : (
                      <EyeOff size={16} color="#dc2626" />
                    )}
                  </button>

                  {/* Social links indicators */}
                  {(member.email || member.socialLinks?.email) && (
                    <a
                      href={`mailto:${member.email || member.socialLinks?.email}`}
                      className={styles.iconButton}
                      title="Send Email"
                    >
                      <Mail size={16} />
                    </a>
                  )}
                  {(member.linkedin || member.socialLinks?.linkedin) && (
                    <a
                      href={member.linkedin || member.socialLinks?.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.iconButton}
                      title="LinkedIn"
                    >
                      <Linkedin size={16} />
                    </a>
                  )}

                  {/* View on Public Website */}
                  <a
                    href="/team"
                    target="_blank"
                    rel="noreferrer"
                    className={styles.iconButton}
                    title="View Team on Live Website"
                  >
                    <ExternalLink size={16} />
                  </a>

                  {/* Edit */}
                  <Link
                    href={`/admin/team/edit/${member._id}`}
                    className={styles.iconButton}
                    title="Edit Member"
                  >
                    <Edit3 size={16} />
                  </Link>

                  {/* Delete */}
                  <button
                    onClick={() => setDeleteItem(member)}
                    className={`${styles.iconButton} ${styles.iconButtonDanger}`}
                    title="Delete Member"
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
        title="Delete Team Member"
      >
        <div style={{ padding: '8px 0' }}>
          <p>
            Are you sure you want to delete <strong>{deleteItem?.name}</strong>? This action cannot
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
              Delete Member
            </button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}

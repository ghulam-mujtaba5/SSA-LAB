import { useEffect, useState, useCallback } from "react";
import AdminLayout from "../../../components/Admin/AdminLayout/AdminLayout";
import Modal from "../../../components/Admin/Modal/Modal";
import InlineSpinner from "../../../components/LoadingAnimation/InlineSpinner";
import withAdminAuth from "../../../lib/withAdminAuth";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [stats, setStats] = useState({ total: 0, new: 0, read: 0, replied: 0, archived: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal / Drawer state
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [adminNotesInput, setAdminNotesInput] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "15",
      });

      if (search) params.append("search", search);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (typeFilter !== "all") params.append("enquiryType", typeFilter);

      const res = await fetch(`/api/admin/enquiries?${params.toString()}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setEnquiries(data.data || []);
        if (data.stats) setStats(data.stats);
        if (data.pagination) setTotalPages(data.pagination.totalPages || 1);
      } else {
        toast.error(data.message || "Failed to load enquiries");
      }
    } catch (err) {
      console.error("Fetch Enquiries Error:", err);
      toast.error("Network error while fetching enquiries");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, typeFilter]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const handleUpdateStatus = async (id, newStatus) => {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(`Enquiry marked as ${newStatus}`);
        if (selectedEnquiry && selectedEnquiry._id === id) {
          setSelectedEnquiry(data.data);
        }
        fetchEnquiries();
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (err) {
      toast.error("Error updating enquiry status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    setIsUpdating(true);
    try {
      const res = await fetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedEnquiry._id, adminNotes: adminNotesInput }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Admin notes saved");
        setSelectedEnquiry(data.data);
        fetchEnquiries();
      } else {
        toast.error(data.message || "Failed to save notes");
      }
    } catch (err) {
      toast.error("Error saving notes");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteEnquiry = async (id) => {
    try {
      const res = await fetch(`/api/admin/enquiries?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Enquiry deleted successfully");
        if (selectedEnquiry && selectedEnquiry._id === id) {
          setSelectedEnquiry(null);
        }
        setDeleteTarget(null);
        fetchEnquiries();
      } else {
        toast.error(data.message || "Failed to delete enquiry");
      }
    } catch (err) {
      toast.error("Error deleting enquiry");
    }
  };

  const openDetailModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setAdminNotesInput(enquiry.adminNotes || "");
    if (enquiry.status === "new") {
      handleUpdateStatus(enquiry._id, "read");
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "new":
        return { background: "rgba(2, 132, 199, 0.12)", color: "var(--primary)", border: "1px solid rgba(2, 132, 199, 0.3)" };
      case "read":
        return { background: "rgba(245, 158, 11, 0.12)", color: "var(--warning, #b45309)", border: "1px solid rgba(245, 158, 11, 0.3)" };
      case "replied":
        return { background: "rgba(16, 185, 129, 0.12)", color: "var(--success)", border: "1px solid rgba(16, 185, 129, 0.3)" };
      case "archived":
        return { background: "rgba(100, 116, 139, 0.12)", color: "var(--text-muted)", border: "1px solid var(--border)" };
      default:
        return { background: "var(--bg-elev-2)", color: "var(--text)" };
    }
  };

  return (
    <AdminLayout title="Enquiries & Messages">
      <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Page Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: "700", margin: "0 0 4px", color: "var(--text)" }}>Contact Form Enquiries</h1>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Manage student supervision requests, research collaborations, and visitor messages.
            </p>
          </div>
          <button
            onClick={fetchEnquiries}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--bg-elev-1)",
              color: "var(--text)",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: "500",
            }}
          >
            Refresh List
          </button>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          <div style={{ padding: "16px", borderRadius: "12px", background: "var(--surface, var(--bg-elev-1))", border: "1px solid var(--border)" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "600" }}>Total Enquiries</span>
            <div style={{ fontSize: "1.8rem", fontWeight: "700", marginTop: "4px", color: "var(--text)" }}>{stats.total}</div>
          </div>
          <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(2, 132, 199, 0.08)", border: "1px solid rgba(2, 132, 199, 0.25)" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--primary)", textTransform: "uppercase", fontWeight: "600" }}>New Messages</span>
            <div style={{ fontSize: "1.8rem", fontWeight: "700", color: "var(--primary)", marginTop: "4px" }}>{stats.new}</div>
          </div>
          <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.25)" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--warning, #b45309)", textTransform: "uppercase", fontWeight: "600" }}>Read / Pending</span>
            <div style={{ fontSize: "1.8rem", fontWeight: "700", color: "var(--warning, #b45309)", marginTop: "4px" }}>{stats.read}</div>
          </div>
          <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.25)" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--success)", textTransform: "uppercase", fontWeight: "600" }}>Replied</span>
            <div style={{ fontSize: "1.8rem", fontWeight: "700", color: "var(--success)", marginTop: "4px" }}>{stats.replied}</div>
          </div>
        </div>

        {/* Filter & Search Controls */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search by sender name, email, or topic..."
            aria-label="Search by sender name, email, or topic"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: "1 1 280px",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--surface, var(--bg-elev-1))",
              color: "var(--text)",
              fontSize: "0.9rem",
              outline: "none",
            }}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter enquiries by status"
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--surface, var(--bg-elev-1))",
              color: "var(--text)",
              fontSize: "0.9rem",
              outline: "none",
            }}
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            aria-label="Filter enquiries by type"
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--surface, var(--bg-elev-1))",
              color: "var(--text)",
              fontSize: "0.9rem",
              outline: "none",
            }}
          >
            <option value="all">All Types</option>
            <option value="FYP Supervision">BS FYP Supervision</option>
            <option value="Research Collaboration">Research Collaboration</option>
            <option value="MS/PhD Inquiry">MS/PhD Inquiry</option>
            <option value="General">General</option>
          </select>
        </div>

        {/* Table List */}
        <div style={{ borderRadius: "12px", border: "1px solid var(--border)", overflow: "hidden", background: "var(--surface, var(--bg-elev-1))" }}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "60px 20px", color: "var(--text-muted)" }}>
              <InlineSpinner sizePx={24} />
              <span>Loading enquiries...</span>
            </div>
          ) : enquiries.length === 0 ? (
            <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--text-muted)" }}>
              No contact form enquiries found matching criteria.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-elev-2)", color: "var(--text-muted)" }}>
                    <th style={{ padding: "12px 16px" }}>Sender Details</th>
                    <th style={{ padding: "12px 16px" }}>Enquiry Type</th>
                    <th style={{ padding: "12px 16px" }}>Topic / Program</th>
                    <th style={{ padding: "12px 16px" }}>Date Received</th>
                    <th style={{ padding: "12px 16px" }}>Status</th>
                    <th style={{ padding: "12px 16px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map((item) => (
                    <tr
                      key={item._id}
                      style={{
                        borderBottom: "1px solid var(--border)",
                        cursor: "pointer",
                        background: item.status === "new" ? "rgba(2, 132, 199, 0.04)" : "transparent",
                      }}
                      onClick={() => openDetailModal(item)}
                    >
                      <td style={{ padding: "14px 16px" }}>
                        <strong style={{ display: "block", color: "var(--text)" }}>{item.name}</strong>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{item.email}</span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ padding: "4px 8px", borderRadius: "6px", background: "var(--bg-elev-2)", color: "var(--text)", fontSize: "0.8rem" }}>
                          {item.enquiryType}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontWeight: "500", color: "var(--text)" }}>{item.topic || "—"}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{item.degree || ""}</div>
                      </td>
                      <td style={{ padding: "14px 16px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: "12px",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                            textTransform: "uppercase",
                            ...getStatusBadgeStyle(item.status),
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => openDetailModal(item)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "1px solid var(--border)",
                            background: "var(--bg-elev-2)",
                            color: "var(--text)",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            marginRight: "8px",
                          }}
                        >
                          View
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "6px",
                            border: "1px solid rgba(239,68,68,0.3)",
                            background: "rgba(239,68,68,0.1)",
                            color: "var(--danger, #ef4444)",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "20px" }}>
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              style={{ padding: "6px 14px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", cursor: page <= 1 ? "not-allowed" : "pointer" }}
            >
              Previous
            </button>
            <span style={{ alignSelf: "center", fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              style={{ padding: "6px 14px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", cursor: page >= totalPages ? "not-allowed" : "pointer" }}
            >
              Next
            </button>
          </div>
        )}

        {/* Enquiry Detail Modal */}
        {selectedEnquiry && (
          <Modal
            isOpen={Boolean(selectedEnquiry)}
            onClose={() => setSelectedEnquiry(null)}
            title={`Enquiry: ${selectedEnquiry.name}`}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <div>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      ...getStatusBadgeStyle(selectedEnquiry.status),
                    }}
                  >
                    {selectedEnquiry.status}
                  </span>
                  <h3 style={{ margin: "8px 0 2px", fontSize: "1.25rem", color: "var(--text)" }}>{selectedEnquiry.name}</h3>
                  <a href={`mailto:${selectedEnquiry.email}`} style={{ color: "var(--primary)", textDecoration: "none", fontSize: "0.9rem" }}>
                    {selectedEnquiry.email}
                  </a>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px", background: "var(--bg-elev-2)", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>ENQUIRY TYPE</span>
                  <strong style={{ color: "var(--text)" }}>{selectedEnquiry.enquiryType}</strong>
                </div>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>PROGRAMME / DEGREE</span>
                  <span style={{ color: "var(--text)" }}>{selectedEnquiry.degree || "Not specified"}</span>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>RESEARCH TOPIC</span>
                  <span style={{ color: "var(--text)" }}>{selectedEnquiry.topic || "Not specified"}</span>
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>MESSAGE BODY</span>
                <div
                  style={{
                    padding: "16px",
                    borderRadius: "8px",
                    background: "var(--bg-elev-2)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                    fontSize: "0.95rem",
                    lineHeight: "1.6",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {selectedEnquiry.message}
                </div>
              </div>

              {/* Status Change Buttons */}
              <div style={{ marginBottom: "20px" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>UPDATE STATUS</span>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {["new", "read", "replied", "archived"].map((st) => (
                    <button
                      key={st}
                      disabled={isUpdating || selectedEnquiry.status === st}
                      onClick={() => handleUpdateStatus(selectedEnquiry._id, st)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: selectedEnquiry.status === st ? "2px solid var(--primary)" : "1px solid var(--border)",
                        background: selectedEnquiry.status === st ? "rgba(2, 132, 199, 0.15)" : "var(--bg-elev-2)",
                        color: selectedEnquiry.status === st ? "var(--primary)" : "var(--text)",
                        cursor: selectedEnquiry.status === st ? "default" : "pointer",
                        fontSize: "0.8rem",
                        textTransform: "capitalize",
                        fontWeight: selectedEnquiry.status === st ? "700" : "500",
                      }}
                    >
                      Mark as {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin Notes Box */}
              <div style={{ marginBottom: "20px" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>ADMIN NOTES (INTERNAL ONLY)</span>
                <textarea
                  rows={3}
                  value={adminNotesInput}
                  onChange={(e) => setAdminNotesInput(e.target.value)}
                  placeholder="Add internal notes about supervision decision, meeting scheduled, etc..."
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid var(--border)",
                    background: "var(--bg-elev-2)",
                    color: "var(--text)",
                    fontSize: "0.85rem",
                    outline: "none",
                  }}
                />
                <button
                  onClick={handleSaveNotes}
                  disabled={isUpdating}
                  style={{
                    marginTop: "8px",
                    padding: "6px 14px",
                    borderRadius: "6px",
                    background: "var(--primary)",
                    border: "none",
                    color: "#ffffff",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: "600",
                  }}
                >
                  Save Internal Notes
                </button>
              </div>

              {/* Footer Actions */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
                <a
                  href={`mailto:${selectedEnquiry.email}?subject=Re: ${encodeURIComponent(selectedEnquiry.topic || selectedEnquiry.enquiryType || 'SSA Lab Enquiry')}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleUpdateStatus(selectedEnquiry._id, "replied")}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "8px",
                    background: "var(--primary)",
                    color: "#ffffff",
                    textDecoration: "none",
                    fontWeight: "600",
                    fontSize: "0.875rem",
                    display: "inline-block",
                  }}
                >
                  Reply via Email &rarr;
                </a>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    background: "var(--bg-elev-2)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        {deleteTarget && (
          <Modal
            isOpen={Boolean(deleteTarget)}
            onClose={() => setDeleteTarget(null)}
            title="Delete Enquiry"
            onConfirm={() => handleDeleteEnquiry(deleteTarget._id)}
            confirmText="Delete Permanently"
            confirmVariant="danger"
            variant="danger"
            cancelText="Cancel"
          >
            <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--text)", lineHeight: "1.5" }}>
              Are you sure you want to permanently delete the enquiry from <strong>{deleteTarget.name}</strong> ({deleteTarget.email})? This action cannot be undone.
            </p>
          </Modal>
        )}
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}

export default withAdminAuth(EnquiriesPage);

import { useEffect, useState, useCallback } from "react";
import AdminLayout from "../../../components/Admin/AdminLayout/AdminLayout";
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
        return { background: "rgba(59, 130, 246, 0.15)", color: "#3b82f6", border: "1px solid rgba(59, 130, 246, 0.3)" };
      case "read":
        return { background: "rgba(234, 179, 8, 0.15)", color: "#eab308", border: "1px solid rgba(234, 179, 8, 0.3)" };
      case "replied":
        return { background: "rgba(16, 185, 129, 0.15)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.3)" };
      case "archived":
        return { background: "rgba(148, 163, 184, 0.15)", color: "#94a3b8", border: "1px solid rgba(148, 163, 184, 0.3)" };
      default:
        return { background: "rgba(255, 255, 255, 0.1)", color: "inherit" };
    }
  };

  return (
    <AdminLayout title="Enquiries & Messages">
      <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Page Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: "700", margin: "0 0 4px" }}>Contact Form Enquiries</h1>
            <p style={{ margin: 0, color: "var(--text-muted, #94a3b8)", fontSize: "0.9rem" }}>
              Manage student supervision requests, research collaborations, and visitor messages.
            </p>
          </div>
          <button
            onClick={fetchEnquiries}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid var(--border-color, rgba(255,255,255,0.15))",
              background: "transparent",
              color: "inherit",
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
          <div style={{ padding: "16px", borderRadius: "12px", background: "var(--card-bg, rgba(255,255,255,0.04))", border: "1px solid var(--border-color, rgba(255,255,255,0.1))" }}>
            <span style={{ fontSize: "0.8rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: "600" }}>Total Enquiries</span>
            <div style={{ fontSize: "1.8rem", fontWeight: "700", marginTop: "4px" }}>{stats.total}</div>
          </div>
          <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(59, 130, 246, 0.08)", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
            <span style={{ fontSize: "0.8rem", color: "#3b82f6", textTransform: "uppercase", fontWeight: "600" }}>New Messages</span>
            <div style={{ fontSize: "1.8rem", fontWeight: "700", color: "#3b82f6", marginTop: "4px" }}>{stats.new}</div>
          </div>
          <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(234, 179, 8, 0.08)", border: "1px solid rgba(234, 179, 8, 0.2)" }}>
            <span style={{ fontSize: "0.8rem", color: "#eab308", textTransform: "uppercase", fontWeight: "600" }}>Read / Pending</span>
            <div style={{ fontSize: "1.8rem", fontWeight: "700", color: "#eab308", marginTop: "4px" }}>{stats.read}</div>
          </div>
          <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
            <span style={{ fontSize: "0.8rem", color: "#10b981", textTransform: "uppercase", fontWeight: "600" }}>Replied</span>
            <div style={{ fontSize: "1.8rem", fontWeight: "700", color: "#10b981", marginTop: "4px" }}>{stats.replied}</div>
          </div>
        </div>

        {/* Filter & Search Controls */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search by sender name, email, or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: "1 1 280px",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid var(--border-color, rgba(255,255,255,0.15))",
              background: "transparent",
              color: "inherit",
              fontSize: "0.9rem",
            }}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid var(--border-color, rgba(255,255,255,0.15))",
              background: "var(--card-bg, #1e293b)",
              color: "inherit",
              fontSize: "0.9rem",
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
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid var(--border-color, rgba(255,255,255,0.15))",
              background: "var(--card-bg, #1e293b)",
              color: "inherit",
              fontSize: "0.9rem",
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
        <div style={{ borderRadius: "12px", border: "1px solid var(--border-color, rgba(255,255,255,0.1))", overflow: "hidden", background: "var(--card-bg, rgba(255,255,255,0.02))" }}>
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>Loading enquiries...</div>
          ) : enquiries.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
              No contact form enquiries found matching criteria.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-color, rgba(255,255,255,0.1))", background: "rgba(255,255,255,0.03)", color: "#94a3b8" }}>
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
                        borderBottom: "1px solid var(--border-color, rgba(255,255,255,0.05))",
                        cursor: "pointer",
                        background: item.status === "new" ? "rgba(59, 130, 246, 0.04)" : "transparent",
                      }}
                      onClick={() => openDetailModal(item)}
                    >
                      <td style={{ padding: "14px 16px" }}>
                        <strong style={{ display: "block", color: "inherit" }}>{item.name}</strong>
                        <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{item.email}</span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ padding: "4px 8px", borderRadius: "6px", background: "rgba(255,255,255,0.08)", fontSize: "0.8rem" }}>
                          {item.enquiryType}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontWeight: "500" }}>{item.topic || "—"}</div>
                        <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{item.degree || ""}</div>
                      </td>
                      <td style={{ padding: "14px 16px", color: "#94a3b8", fontSize: "0.85rem" }}>
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
                            border: "1px solid var(--border-color, rgba(255,255,255,0.2))",
                            background: "transparent",
                            color: "inherit",
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
                            color: "#ef4444",
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
              style={{ padding: "6px 14px", borderRadius: "6px", cursor: page <= 1 ? "not-allowed" : "pointer" }}
            >
              Previous
            </button>
            <span style={{ alignSelf: "center", fontSize: "0.85rem", color: "#94a3b8" }}>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              style={{ padding: "6px 14px", borderRadius: "6px", cursor: page >= totalPages ? "not-allowed" : "pointer" }}
            >
              Next
            </button>
          </div>
        )}

        {/* Enquiry Detail Modal */}
        {selectedEnquiry && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1000,
              background: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
            onClick={() => setSelectedEnquiry(null)}
          >
            <div
              style={{
                background: "var(--card-bg, #0f172a)",
                color: "#f8fafc",
                border: "1px solid var(--border-color, rgba(255,255,255,0.15))",
                borderRadius: "16px",
                width: "100%",
                maxWidth: "640px",
                maxHeight: "90vh",
                overflowY: "auto",
                padding: "28px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
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
                  <h2 style={{ margin: "8px 0 2px", fontSize: "1.4rem" }}>{selectedEnquiry.name}</h2>
                  <a href={`mailto:${selectedEnquiry.email}`} style={{ color: "#38bdf8", textDecoration: "none", fontSize: "0.9rem" }}>
                    {selectedEnquiry.email}
                  </a>
                </div>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "1.5rem", cursor: "pointer" }}
                >
                  &times;
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px", background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "8px" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "#94a3b8", display: "block" }}>ENQUIRY TYPE</span>
                  <strong>{selectedEnquiry.enquiryType}</strong>
                </div>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "#94a3b8", display: "block" }}>PROGRAMME / DEGREE</span>
                  <span>{selectedEnquiry.degree || "Not specified"}</span>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <span style={{ fontSize: "0.75rem", color: "#94a3b8", display: "block" }}>RESEARCH TOPIC</span>
                  <span>{selectedEnquiry.topic || "Not specified"}</span>
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <span style={{ fontSize: "0.75rem", color: "#94a3b8", display: "block", marginBottom: "6px" }}>MESSAGE BODY</span>
                <div
                  style={{
                    padding: "16px",
                    borderRadius: "8px",
                    background: "rgba(0,0,0,0.3)",
                    border: "1px solid rgba(255,255,255,0.08)",
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
                <span style={{ fontSize: "0.75rem", color: "#94a3b8", display: "block", marginBottom: "8px" }}>UPDATE STATUS</span>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {["new", "read", "replied", "archived"].map((st) => (
                    <button
                      key={st}
                      disabled={isUpdating || selectedEnquiry.status === st}
                      onClick={() => handleUpdateStatus(selectedEnquiry._id, st)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: selectedEnquiry.status === st ? "2px solid #38bdf8" : "1px solid rgba(255,255,255,0.15)",
                        background: selectedEnquiry.status === st ? "rgba(56,189,248,0.15)" : "transparent",
                        color: "inherit",
                        cursor: selectedEnquiry.status === st ? "default" : "pointer",
                        fontSize: "0.8rem",
                        textTransform: "capitalize",
                      }}
                    >
                      Mark as {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin Notes Box */}
              <div style={{ marginBottom: "20px" }}>
                <span style={{ fontSize: "0.75rem", color: "#94a3b8", display: "block", marginBottom: "6px" }}>ADMIN NOTES (INTERNAL ONLY)</span>
                <textarea
                  rows={3}
                  value={adminNotesInput}
                  onChange={(e) => setAdminNotesInput(e.target.value)}
                  placeholder="Add internal notes about supervision decision, meeting scheduled, etc..."
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "transparent",
                    color: "inherit",
                    fontSize: "0.85rem",
                  }}
                />
                <button
                  onClick={handleSaveNotes}
                  disabled={isUpdating}
                  style={{
                    marginTop: "8px",
                    padding: "6px 14px",
                    borderRadius: "6px",
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "inherit",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                  }}
                >
                  Save Internal Notes
                </button>
              </div>

              {/* Footer Actions */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <a
                  href={`mailto:${selectedEnquiry.email}?subject=Re: ${encodeURIComponent(selectedEnquiry.topic || selectedEnquiry.enquiryType || 'SSA Lab Enquiry')}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleUpdateStatus(selectedEnquiry._id, "replied")}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "8px",
                    background: "#0284c7",
                    color: "#ffffff",
                    textDecoration: "none",
                    fontWeight: "600",
                    fontSize: "0.9rem",
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
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "inherit",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteTarget && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1100,
              background: "rgba(0, 0, 0, 0.75)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <div style={{ background: "#0f172a", border: "1px solid rgba(239,68,68,0.4)", borderRadius: "12px", padding: "24px", maxWidth: "420px", width: "100%" }}>
              <h3 style={{ margin: "0 0 8px", color: "#ef4444" }}>Delete Enquiry?</h3>
              <p style={{ margin: "0 0 20px", fontSize: "0.9rem", color: "#94a3b8" }}>
                Are you sure you want to permanently delete the enquiry from <strong>{deleteTarget.name}</strong>? This action cannot be undone.
              </p>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button onClick={() => setDeleteTarget(null)} style={{ padding: "8px 16px", borderRadius: "6px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "inherit", cursor: "pointer" }}>
                  Cancel
                </button>
                <button onClick={() => handleDeleteEnquiry(deleteTarget._id)} style={{ padding: "8px 16px", borderRadius: "6px", background: "#ef4444", border: "none", color: "#ffffff", fontWeight: "600", cursor: "pointer" }}>
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}

export default withAdminAuth(EnquiriesPage);

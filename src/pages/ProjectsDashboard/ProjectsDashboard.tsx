/**
 * Projects Dashboard Page
 * Displays all contracts for the logged-in user with:
 * - Summary stats (active, completed, total earnings, pending reviews)
 * - Searchable and filterable project cards
 * - Contract completion and review submission
 * Students also see their pending (not-yet-accepted) proposals here.
 */
import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import "./ProjectsDashboard.css";
import { useAuthStore } from "../../store/authStore";
import { get, patch } from "../../api/api";
import type { Contract, Proposal } from "../../types";

function ProjectsDashboard() {
  const { isAuthenticated, role } = useAuthStore();

  // Redirect unauthenticated users
  if (!isAuthenticated) {
    window.location.href = "/";
  }

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [showReviewModal, setShowReviewModal] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState("");

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  /** Fetch contracts and pending proposals from the backend */
  const fetchContracts = async () => {
    const data = (await get<Contract[]>("/contracts")) || [];
    let combined = [...data];

    // For students: also fetch and include their pending proposals
    if (role === "student") {
      const myProposals = (await get<Proposal[]>("/proposals/my")) || [];
      const pendingProposals: Contract[] = myProposals
        .filter((p) => p.status === "pending")
        .map((p) => ({
          _id: p._id,
          payment_status: "pending_approval" as const,
          proposal_id: p,
          end_date: "",
        }));
      combined = [...combined, ...pendingProposals];
    }
    setContracts(combined);
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  /** Mark a contract as completed (business role only) */
  const handleComplete = async (id: string) => {
    const res = await patch(`/contracts/${id}/complete`);
    if (res) {
      toast.success("Contract completed!");
      fetchContracts();
    }
  };

  /** Submit a rating and review for the other party */
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showReviewModal) return;

    const res = await patch(`/contracts/${showReviewModal}/review`, {
      rating,
      review: reviewText,
    });

    if (res) {
      toast.success("Review submitted successfully!");
      setShowReviewModal(null);
      setRating(5);
      setReviewText("");
      fetchContracts();
    }
  };

  // Derive filtered contracts from search term and status filter using useMemo
  const filteredContracts = useMemo(() => {
    return contracts.filter((contract) => {
      const job = (contract.proposal_id as any)?.job_id || {};
      const jobTitle = (job.title || "").toLowerCase();

      // Apply search filter: match against job title
      const matchesSearch = searchTerm
        ? jobTitle.includes(searchTerm.toLowerCase())
        : true;

      // Apply status filter
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && contract.payment_status === "pending") ||
        (statusFilter === "completed" &&
          contract.payment_status === "completed") ||
        (statusFilter === "pending_approval" &&
          contract.payment_status === "pending_approval");

      return matchesSearch && matchesStatus;
    });
  }, [contracts, searchTerm, statusFilter]);

  // Compute dashboard summary stats
  const activeContractsCount = contracts.filter(
    (c) => c.payment_status === "pending",
  ).length;
  const completedContractsCount = contracts.filter(
    (c) => c.payment_status === "completed",
  ).length;

  return (
    <div className="projects-dashboard-container">
      {/* Dashboard header with greeting */}
      <div className="dashboard-header" style={{ marginBottom: "30px" }}>
        <h1 style={{ margin: 0, fontSize: "2.5rem" }}>
          Welcome back,{" "}
          <span style={{ color: "#00f2fe" }}>
            {role === "business" ? "Partner" : "Freelancer"}
          </span>
        </h1>
        <p style={{ opacity: 0.7, marginTop: "5px" }}>
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Summary statistics cards */}
      <div className="projects-stats-row">
        <div
          className="stat-card"
          style={{
            background:
              "linear-gradient(135deg, rgba(0, 242, 254, 0.1), rgba(79, 172, 254, 0.1))",
          }}
        >
          <h3 style={{ color: "#00f2fe" }}>Active</h3>
          <span className="stat-value">{activeContractsCount}</span>
        </div>
        <div
          className="stat-card"
          style={{
            background:
              "linear-gradient(135deg, rgba(240, 147, 251, 0.1), rgba(245, 87, 108, 0.1))",
          }}
        >
          <h3 style={{ color: "#f093fb" }}>Completed</h3>
          <span className="stat-value">{completedContractsCount}</span>
        </div>
        <div
          className="stat-card"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))",
          }}
        >
          <h3 style={{ opacity: 0.8 }}>Total Earnings</h3>
          <span className="stat-value">
            $
            {contracts.reduce(
              (acc, curr) =>
                acc + ((curr.proposal_id as any)?.bid_amount || 0),
              0,
            )}
          </span>
        </div>
        <div
          className="stat-card"
          style={{
            background:
              "linear-gradient(135deg, rgba(0, 242, 254, 0.05), rgba(255, 255, 255, 0.02))",
          }}
        >
          <h3 style={{ opacity: 0.8 }}>Pending Reviews</h3>
          <span className="stat-value">
            {
              contracts.filter(
                (c) =>
                  c.payment_status === "completed" &&
                  (role === "business" ? !c.student_rating : !c.business_rating),
              ).length
            }
          </span>
        </div>
      </div>

      {/* Search and filter controls — now fully wired up */}
      <div className="projects-list-section">
        <div className="projects-controls">
          <input
            type="text"
            placeholder="Search projects by title..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Projects</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            {role === "student" && (
              <option value="pending_approval">Pending Proposals</option>
            )}
          </select>
        </div>

        {/* Contract cards grid — renders filtered results */}
        <div className="projects-grid">
          {filteredContracts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "50px", opacity: 0.5 }}>
              <p style={{ fontSize: "1.2rem" }}>
                No projects match your search criteria
              </p>
            </div>
          ) : (
            filteredContracts.map((contract) => {
              const job = (contract.proposal_id as any)?.job_id || {};
              const freelancer =
                (contract.proposal_id as any)?.freelancer_id || {};
              const client = job?.client_id || {};

              return (
                <div key={contract._id} className="project-card">
                  {/* Card header: status badge + budget */}
                  <div className="project-card-header">
                    <div>
                      <span
                        className={`status-badge ${contract.payment_status === "completed" ? "completed" : contract.payment_status === "pending_approval" ? "pending" : "active"}`}
                      >
                        {contract.payment_status === "pending_approval"
                          ? "Pending Approval"
                          : contract.payment_status}
                      </span>
                      <span className="project-type">
                        {job.type || "Fixed Price"}
                      </span>
                    </div>
                    <div className="project-budget">${job.budget}</div>
                  </div>

                  <h2 className="project-title">
                    {job.title || "Unknown Job"}
                  </h2>

                  <div
                    className="project-card-footer"
                    style={{
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "10px",
                    }}
                  >
                    <span className="proposals-count">
                      <strong>Agreed Bid:</strong> $
                      {(contract.proposal_id as any)?.bid_amount}
                    </span>

                    {/* Show freelancer name for business users */}
                    {role === "business" && (
                      <span className="posted-time">
                        Freelancer: {freelancer.firstName}{" "}
                        {freelancer.lastName}
                      </span>
                    )}

                    {/* Show client name for students */}
                    {role === "student" && (
                      <span className="posted-time">
                        Client: {client.firstName} {client.lastName}
                      </span>
                    )}

                    {/* Complete button — business users only, active contracts only */}
                    {role === "business" &&
                      contract.payment_status === "pending" && (
                        <button
                          onClick={() => handleComplete(contract._id)}
                          style={{
                            padding: "8px 16px",
                            background: "#00f2fe",
                            border: "none",
                            color: "#fff",
                            borderRadius: "4px",
                            cursor: "pointer",
                            marginTop: "10px",
                            width: "100%",
                          }}
                        >
                          Mark as Completed
                        </button>
                      )}

                    {/* Review section — shown after contract completion */}
                    {contract.payment_status === "completed" && (
                      <div
                        style={{
                          width: "100%",
                          marginTop: "10px",
                          borderTop: "1px solid #333",
                          paddingTop: "10px",
                        }}
                      >
                        {role === "business" ? (
                          contract.student_rating ? (
                            <p style={{ fontSize: "0.9em", color: "#ddd" }}>
                              <strong>You rated freelancer:</strong>{" "}
                              {contract.student_rating}/5 - "
                              {contract.student_review}"
                            </p>
                          ) : (
                            <button
                              onClick={() =>
                                setShowReviewModal(contract._id)
                              }
                              style={{
                                padding: "6px 12px",
                                background: "#4caf50",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                width: "100%",
                              }}
                            >
                              Leave Review for Freelancer
                            </button>
                          )
                        ) : contract.business_rating ? (
                          <p style={{ fontSize: "0.9em", color: "#ddd" }}>
                            <strong>You rated client:</strong>{" "}
                            {contract.business_rating}/5 - "
                            {contract.business_review}"
                          </p>
                        ) : (
                          <button
                            onClick={() =>
                              setShowReviewModal(contract._id)
                            }
                            style={{
                              padding: "6px 12px",
                              background: "#4caf50",
                              color: "#fff",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              width: "100%",
                            }}
                          >
                            Leave Review for Client
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Review submission modal */}
      {showReviewModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#1a1a2e",
              padding: "30px",
              borderRadius: "10px",
              width: "90%",
              maxWidth: "400px",
              border: "1px solid #333",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Leave a Review</h2>
            <form onSubmit={handleReviewSubmit}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Rating (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  required
                  style={{
                    padding: "8px",
                    width: "100%",
                    borderRadius: "4px",
                    border: "none",
                  }}
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Review
                </label>
                <textarea
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                  style={{
                    padding: "8px",
                    width: "100%",
                    borderRadius: "4px",
                    border: "none",
                  }}
                ></textarea>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowReviewModal(null)}
                  style={{
                    padding: "8px 16px",
                    background: "#555",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 16px",
                    background: "#00f2fe",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectsDashboard;

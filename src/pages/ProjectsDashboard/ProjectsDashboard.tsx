import { useEffect, useState } from "react";
import "./ProjectsDashboard.css";
import { useAuthStore } from "../../store/authStore";
import { get, patch } from "../../api/api";
// Interface for contract data
interface Contract {
  _id: string;
  payment_status: string;
  proposal_id: any;
  business_rating?: number;
  business_review?: string;
  student_rating?: number;
  student_review?: string;
}

function ProjectsDashboard() {
  const { isAuthenticated, role } = useAuthStore();
  if (!isAuthenticated) {
    window.location.href = "/";
  }

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [showReviewModal, setShowReviewModal] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState("");

  const fetchContracts = async () => {
    const data = await get<Contract[]>("/contracts");
    if (data) setContracts(data);
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const handleComplete = async (id: string) => {
    const res = await patch(`/contracts/${id}/complete`);
    if (res) {
      alert("Contract completed!");
      fetchContracts();
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showReviewModal) return;

    const res = await patch(`/contracts/${showReviewModal}/review`, {
      rating,
      review: reviewText,
    });

    if (res) {
      alert("Review submitted successfully!");
      setShowReviewModal(null);
      setRating(5);
      setReviewText("");
      fetchContracts();
    }
  };

  const activeContractsCount = contracts.filter(
    (c) => c.payment_status === "pending",
  ).length;
  const completedContractsCount = contracts.filter(
    (c) => c.payment_status === "completed",
  ).length;

  return (
    <div className="projects-dashboard-container">
      <div className="projects-stats-row">
        <div className="stat-card">
          <h3>Active Contracts</h3>
          <span className="stat-value">{activeContractsCount}</span>
        </div>
        <div className="stat-card">
          <h3>Completed Contracts</h3>
          <span className="stat-value">{completedContractsCount}</span>
        </div>
        <div className="stat-card">
          <h3>Total Contracts</h3>
          <span className="stat-value">{contracts.length}</span>
        </div>
      </div>

      <div className="projects-list-section">
        <div className="projects-controls">
          <input
            type="text"
            placeholder="Search projects..."
            className="search-input"
          />
          <select className="filter-select">
            <option value="all">All Projects</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="projects-grid">
          {contracts.map((contract) => {
            const job = contract.proposal_id?.job_id || {};
            const freelancer = contract.proposal_id?.freelancer_id || {};
            const client = job?.client_id || {};

            return (
              <div key={contract._id} className="project-card">
                <div className="project-card-header">
                  <div>
                    <span
                      className={`status-badge ${contract.payment_status === "completed" ? "completed" : "active"}`}
                    >
                      {contract.payment_status}
                    </span>
                    <span className="project-type">
                      {job.type || "Fixed Price"}
                    </span>
                  </div>
                  <div className="project-budget">${job.budget}</div>
                </div>

                <h2 className="project-title">{job.title || "Unknown Job"}</h2>

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
                    {contract.proposal_id?.bid_amount}
                  </span>
                  {role === "business" && (
                    <span className="posted-time">
                      Freelancer: {freelancer.firstName} {freelancer.lastName}
                    </span>
                  )}
                  {role === "student" && (
                    <span className="posted-time">
                      Client: {client.firstName} {client.lastName}
                    </span>
                  )}

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
                            onClick={() => setShowReviewModal(contract._id)}
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
                          onClick={() => setShowReviewModal(contract._id)}
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
          })}
        </div>
      </div>

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

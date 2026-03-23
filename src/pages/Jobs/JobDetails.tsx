import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { get, post, patch } from "../../api/api";
import { useAuthStore } from "../../store/authStore";

function JobPage() {
  const { isAuthenticated, role } = useAuthStore();
  const navigate = useNavigate();
  if (!isAuthenticated) {
    window.location.href = "/";
  }

  const { jobId } = useParams();
  const [job, setJob] = useState<any>({});
  const [proposals, setProposals] = useState<any[]>([]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [bidAmount, setBidAmount] = useState<number | string>("");
  const [coverLetter, setCoverLetter] = useState("");

  const handleApply = async () => {
    if (!bidAmount || !coverLetter) return;
    const res = await post("/proposals", {
      job_id: jobId,
      bid_amount: Number(bidAmount),
      cover_letter: coverLetter
    });
    if (res) {
      alert("Proposal submitted successfully!");
      setShowApplyModal(false);
      navigate("/projects");
    } else {
      alert("Failed to submit proposal");
    }
  };

  const fetchProposals = async () => {
    if (role === "business") {
      const p = await get<any[]>(`/proposals/job/${jobId}`);
      if (p) setProposals(p);
    }
  };

  useEffect(() => {
    const async = async () => {
      const data = await get<any>(`job/${jobId}`);
      setJob(data || {});
      await fetchProposals();
    };
    async();
  }, [jobId]);

  const handleUpdateProposalStatus = async (proposalId: string, status: string) => {
    const res = await patch(`/proposals/${proposalId}/status`, { status });
    if (res) {
      alert(`Proposal ${status} successfully!`);
      await fetchProposals(); // Refresh list
    }
  };
  return (
    <div>
      <h1>{job.title}</h1>
      <p>{job.description}</p>
      <p>Budget: ${job.budget}</p>
      
      {role === "business" && (
        <div style={{marginTop: "30px"}}>
          <h2>Proposals ({proposals.length})</h2>
          {proposals.length === 0 ? <p>No proposals yet.</p> : (
            <div style={{display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px"}}>
              {proposals.map(p => (
                <div key={p._id} style={{background: "#1a1a2e", padding: "15px", borderRadius: "8px", border: "1px solid #333"}}>
                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <Link to={`/freelancer/${p.freelancer_id?._id}`} style={{color: "#00f2fe", textDecoration: "none"}}>
                      <h4 style={{margin: 0, display: "inline-block"}}>{p.freelancer_id?.firstName} {p.freelancer_id?.lastName}</h4>
                    </Link>
                    <span style={{color: p.status === 'pending' ? 'orange' : p.status === 'accepted' ? 'green' : 'red'}}>{p.status}</span>
                  </div>
                  <p><strong>Bid Amount:</strong> ${p.bid_amount}</p>
                  <p><strong>Cover Letter:</strong> {p.cover_letter}</p>
                  
                  {p.status === "pending" && (
                    <div style={{display: "flex", gap: "10px", marginTop: "10px"}}>
                      <button onClick={() => handleUpdateProposalStatus(p._id, "accepted")} style={{padding: "8px 16px", background: "green", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer"}}>Accept</button>
                      <button onClick={() => handleUpdateProposalStatus(p._id, "rejected")} style={{padding: "8px 16px", background: "red", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer"}}>Reject</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {role === "student" && (
        <button 
          onClick={() => setShowApplyModal(true)}
          style={{marginTop: "20px", padding: "10px 20px", cursor: "pointer", background: "#00f2fe", border: "none", color: "#fff", borderRadius: "5px", fontWeight: "bold"}}
        >
          Apply for Job
        </button>
      )}

      {showApplyModal && (
        <div style={{marginTop: "20px", padding: "20px", background: "#1a1a2e", borderRadius: "8px", border: "1px solid #333"}}>
          <h3>Submit a Proposal</h3>
          <div style={{marginBottom: "10px"}}>
            <label style={{display: "block", marginBottom: "5px"}}>Bid Amount ($):</label>
            <input 
              type="number" 
              value={bidAmount} 
              onChange={(e) => setBidAmount(e.target.value)} 
              style={{width: "100%", padding: "8px", borderRadius: "4px", border: "none"}} 
            />
          </div>
          <div style={{marginBottom: "10px"}}>
            <label style={{display: "block", marginBottom: "5px"}}>Cover Letter:</label>
            <textarea 
              value={coverLetter} 
              onChange={(e) => setCoverLetter(e.target.value)} 
              rows={4} 
              style={{width: "100%", padding: "8px", borderRadius: "4px", border: "none"}} 
            />
          </div>
          <div style={{display: "flex", gap: "10px"}}>
            <button onClick={handleApply} style={{padding: "8px 16px", background: "#00f2fe", border: "none", color: "#fff", borderRadius: "4px", cursor: "pointer"}}>Submit</button>
            <button onClick={() => setShowApplyModal(false)} style={{padding: "8px 16px", background: "#555", border: "none", color: "#fff", borderRadius: "4px", cursor: "pointer"}}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobPage;

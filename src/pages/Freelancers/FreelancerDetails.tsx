import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get } from "../../api/api";
import "./FreelancerDetails.css";

function FreelancersPage() {
  const { freelancerId } = useParams();
  const [freelancer, setFreelancer] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await get<any>(`freelancers/${freelancerId}`);
      setFreelancer(data);
    };
    fetchData();
  }, [freelancerId]);

  if (!freelancer || !freelancer.user_id) {
    return <div className="loading">Loading freelancer details...</div>;
  }

  const avatarUrl = freelancer.avatar || `https://ui-avatars.com/api/?name=${freelancer.user_id?.firstName}+${freelancer.user_id?.lastName}&background=1b1a3a&color=00f2fe&size=150`;

  return (
    <div className="freelancer-details-container">
      <div className="freelancer-header">
        <div className="freelancer-avatar-wrapper">
          <img src={avatarUrl} alt="Freelancer Avatar" className="freelancer-avatar" />
        </div>
        <div className="freelancer-title-info">
          <h1>{freelancer.user_id?.firstName} {freelancer.user_id?.lastName}</h1>
          <p className="freelancer-course-label">{freelancer.course || "Student"}</p>
          <div className="freelancer-badges">
            <span className="badge university-badge">{freelancer.university || "Not specified"}</span>
            <span className="badge status-badge available">Available</span>
          </div>
        </div>
      </div>

      <div className="freelancer-content-grid">
        <div className="freelancer-main-info card">
          <h2 className="section-title">About Me</h2>
          <p className="freelancer-description">
            {freelancer.description || "No description provided yet. This student is ready to take on exciting projects and demonstrate their skills."}
          </p>
          
          <h2 className="section-title" style={{ marginTop: "30px" }}>Skills</h2>
          <div className="skills-list">
            {freelancer.skills && freelancer.skills.length > 0 ? (
              freelancer.skills.map((skill: string, index: number) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))
            ) : (
              <p className="empty-state">No skills listed yet.</p>
            )}
          </div>
        </div>

        <div className="freelancer-sidebar card">
          <h2 className="section-title">Contact & Portfolio</h2>
          <div className="contact-item">
            <label>Email</label>
            <p>{freelancer.user_id?.email}</p>
          </div>
          <div className="contact-item">
            <label>University</label>
            <p>{freelancer.university || "Not provided"}</p>
          </div>
          <div className="contact-item">
            <label>Portfolio</label>
            <p>
              {freelancer.portfolio_link && freelancer.portfolio_link.length > 0 ? (
                freelancer.portfolio_link.map((link: string, i: number) => (
                  <a key={i} href={link} target="_blank" rel="noreferrer" className="portfolio-link">{link}</a>
                ))
              ) : "No portfolio links provided"}
            </p>
          </div>
          <button className="primary-btn full-width" style={{ marginTop: "20px" }}>
            Contact Freelancer
          </button>
        </div>
      </div>
    </div>
  );
}

export default FreelancersPage;

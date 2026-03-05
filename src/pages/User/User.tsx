import { Navigate } from "react-router-dom";
import "./User.css";
import { useAuthStore } from "../../store/authStore";

function UserPage() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="user-page">
      <h1>User Profile</h1>

      <div className="profile-sidebar user-card">
        <div className="avatar-glow-container">
          <img
            src="https://ui-avatars.com/api/?name=Alex+Chen&background=1b1a3a&color=00f2fe&size=150"
            alt="Avatar"
          />
        </div>
        <h2 className="profile-name">
          {user?.userInfo?.firstName} {user?.userInfo?.lastName}
        </h2>
        {user?.userInfo?.role === "student" &&
          (user?.userProfile?.course ? (
            <p className="profile-role">{user?.userProfile?.course}</p>
          ) : (
            <>
              <p className="profile-role">Student</p>
              <button
                className="add-skill-btn"
                style={{
                  background: "linear-gradient(45deg, #00f2fe, #4facfe)",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                }}
                onClick={() => alert("Add skill functionality coming soon!")}
              >
                + Add Course
              </button>
            </>
          ))}
        {user?.userInfo?.role === "employer" && (
          <p className="profile-role">Employer</p>
        )}
        {user?.userInfo?.role === "student" &&
          (user?.userProfile?.skills && user.userProfile.skills.length > 0 ? (
            <div className="skills-container">
              <span className="skill-badge skill-python">Python</span>
              <span className="skill-badge skill-react">React</span>
              <span className="skill-badge skill-ux">UX Design</span>
              <span className="skill-badge skill-figma">Figma</span>
            </div>
          ) : (
            <div className="skills-container">
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#a0a0b0",
                  marginBottom: "10px",
                }}
              >
                No skills added yet.
              </p>
              <button
                className="add-skill-btn"
                style={{
                  background: "linear-gradient(45deg, #00f2fe, #4facfe)",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                }}
                onClick={() => alert("Add skill functionality coming soon!")}
              >
                + Add Skill
              </button>
            </div>
          ))}
      </div>

      <div className="profile-main user-card">
        <h2 className="section-title">Contact Information</h2>

        <div className="info-grid">
          <div className="info-item">
            <label>Name</label>
            <p>
              {user?.userInfo?.firstName} {user?.userInfo?.lastName}
            </p>
          </div>
          <div className="info-item">
            <label>Email</label>
            <p>{user?.userInfo?.email}</p>
          </div>
          <div className="info-item">
            <label>Phone</label>
            <p>+1 (555) 123-4567</p>
          </div>
          <div className="info-item">
            <label>Address</label>
            <p>123 Neon Street</p>
          </div>
          <div className="info-item">
            <label>City</label>
            <p>Cyber City</p>
          </div>
          <div className="info-item">
            <label>State</label>
            <p>NY</p>
          </div>
          <div className="info-item">
            <label>Zip</label>
            <p>10001</p>
          </div>
          <div className="info-item">
            <label>Country</label>
            <p>USA</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPage;

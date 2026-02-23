import { Navigate } from "react-router-dom";
import "./user.css";

function UserPage() {
  const userLogedIn = true;

  if (!userLogedIn) {
    return <Navigate to="/login" />;
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
        <h2 className="profile-name">Alex Chen</h2>
        <p className="profile-role">Computer Science Student</p>

        <div className="skills-container">
          <span className="skill-badge skill-python">Python</span>
          <span className="skill-badge skill-react">React</span>
          <span className="skill-badge skill-ux">UX Design</span>
          <span className="skill-badge skill-figma">Figma</span>
        </div>
      </div>

      <div className="profile-main user-card">
        <h2 className="section-title">Contact Information</h2>

        <div className="info-grid">
          <div className="info-item">
            <label>Name</label>
            <p>Alex Chen</p>
          </div>
          <div className="info-item">
            <label>Email</label>
            <p>alex.chen@example.com</p>
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

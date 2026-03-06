import { Navigate } from "react-router-dom";
import "./User.css";
import { useAuthStore } from "../../store/authStore";
import { useEffect, useState } from "react";
import { get } from "../../api/api";
interface user {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  userProfile: {
    course: string;
    skills: string[];
  };
}
function UserPage() {
  const { role, isAuthenticated } = useAuthStore();
  const [user, setUser] = useState<user | null>(null);
  useEffect(() => {
    const async = async () => {
      const user = await get<any>(`/users`);
      console.log(user);
      setUser(user);
    };
    async();
  }, []);

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
          {user?.user?.firstName} {user?.user?.lastName}
        </h2>
        {role === "student" &&
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
        {role === "business" && (
          <>
            <p className="profile-role">Business</p>
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
              + Add Company
            </button>
          </>
        )}
        {role === "student" &&
          (user?.userProfile?.skills && user.userProfile.skills.length > 0 ? (
            <div className="skills-container">
              {user?.userProfile?.skills.map((skill: string) => (
                <span className="skill-badge skill-python">{skill}</span>
              ))}
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
              {user?.user?.firstName} {user?.user?.lastName}
            </p>
          </div>
          <div className="info-item">
            <label>Email</label>
            <p>{user?.user?.email}</p>
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

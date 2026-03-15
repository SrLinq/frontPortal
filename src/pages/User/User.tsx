import { Navigate } from "react-router-dom";
import "./User.css";
import { useAuthStore } from "../../store/authStore";
import { useEffect, useState, useRef } from "react";
import { get, post, patch } from "../../api/api";
import SkillsModal from "./SkillsModal";
interface user {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  userProfile: {
    course?: string;
    skills?: string[];
    avatar?: string;
    university?: string;
    portfolio_link?: string[];
    company_logo?: string;
    company_name?: string;
    company_description?: string;
  };
}
function UserPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const { role, isAuthenticated } = useAuthStore();
  const [user, setUser] = useState<user | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const async = async () => {
      const userData = await get<any>(`/users`);
      setUser(userData);
      if (userData) {
        setEditForm({
          firstName: userData.user?.firstName || "",
          lastName: userData.user?.lastName || "",
          university: userData.userProfile?.university || "",
          course: userData.userProfile?.course || "",
          company_name: userData.userProfile?.company_name || "",
          company_description: userData.userProfile?.company_description || "",
        });
      }
    };
    async();
  }, []);

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const uploadRes = await post<any>("/minio/upload/avatars", formData);
    if (uploadRes && uploadRes.url) {
      const backendUrl = "http://localhost:3000"; // Assuming backend is on port 3000
      const fullUrl = backendUrl + uploadRes.url;
      const updateData =
        role === "student" ? { avatar: fullUrl } : { company_logo: fullUrl };
      await patch("/users/profile", updateData);

      setUser((prev: any) => ({
        ...prev,
        userProfile: {
          ...prev.userProfile,
          ...updateData,
        },
      }));
    }
  };

  const handeEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    let updateProfileData: any = {};
    if (role === "student") {
      updateProfileData = {
        university: editForm.university,
        course: editForm.course,
      };
    } else {
      updateProfileData = {
        company_name: editForm.company_name,
        company_description: editForm.company_description,
      };
    }

    await patch("/users/profile", updateProfileData);

    setUser((prev: any) => ({
      ...prev,
      user: {
        ...prev.user,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
      },
      userProfile: {
        ...prev.userProfile,
        ...updateProfileData,
      },
    }));

    setIsEditingProfile(false);
  };

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="user-page">
      <h1>User Profile</h1>

      <div className="profile-sidebar user-card">
        <div
          className="avatar-glow-container"
          onClick={() => fileInputRef.current?.click()}
          style={{ cursor: "pointer" }}
        >
          <img
            src={
              user?.userProfile?.avatar ||
              user?.userProfile?.company_logo ||
              `https://ui-avatars.com/api/?name=${user?.user?.firstName}+${user?.user?.lastName}&background=1b1a3a&color=00f2fe&size=150`
            }
            alt="Avatar"
          />
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleAvatarUpload}
          />
        </div>
        <h2 className="profile-name">
          {user?.user?.firstName} {user?.user?.lastName}
        </h2>
        {role === "student" &&
          !isEditing &&
          (user?.userProfile?.course ? (
            <p className="profile-role">{user?.userProfile?.course}</p>
          ) : (
            <>
              <p className="profile-role">Student</p>
            </>
          ))}
        {role === "student" && (
          <div className="skills-container">
            {user?.userProfile?.skills && user.userProfile.skills.length > 0 ? (
              user.userProfile.skills.map((skill: string, index: number) => (
                <span key={index} className="skill-badge skill-python">
                  {skill}
                </span>
              ))
            ) : (
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#a0a0b0",
                  marginBottom: "10px",
                }}
              >
                No skills added yet.
              </p>
            )}
          </div>
        )}

        <div className="profile-action-buttons">
          {role === "student" && (
            <button
              className="add-action-btn"
              onClick={() => setIsEditing(true)}
            >
              + Add Course / Skill
            </button>
          )}

          {role === "business" && (
            <button
              className="add-action-btn"
              onClick={() => alert("Add skill functionality coming soon!")}
            >
              + Add Company Info
            </button>
          )}
        </div>
        
        <SkillsModal 
          isOpen={isEditing && role === "student"} 
          onClose={() => setIsEditing(false)} 
          existingSkills={user?.userProfile?.skills || []}
          onAdd={async (newSkill) => {
            const currentSkills = user?.userProfile?.skills || [];
            const updatedSkills = [...currentSkills, newSkill];
            
            await patch("/users/profile", { skills: updatedSkills });
            
            setUser((prev: any) => ({
              ...prev,
              userProfile: {
                ...prev.userProfile,
                skills: updatedSkills
              }
            }));
            
            setIsEditing(false);
          }}
        />
      </div>

      <div className="profile-main user-card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 className="section-title">Profile Information</h2>
          {isEditingProfile ? (
            <button
              onClick={handleSaveProfile}
              style={{
                padding: "8px 16px",
                background: "#00f2fe",
                border: "none",
                color: "#fff",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditingProfile(true)}
              style={{
                padding: "8px 16px",
                background: "transparent",
                border: "1px solid #00f2fe",
                color: "#00f2fe",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="info-grid">
          <div className="info-item">
            <label>First Name</label>
            {isEditingProfile ? (
              <input
                name="firstName"
                value={editForm.firstName}
                onChange={handeEditChange}
                style={{
                  width: "100%",
                  padding: "5px",
                  background: "#1a1a2e",
                  border: "1px solid #333",
                  color: "white",
                  borderRadius: "4px",
                }}
              />
            ) : (
              <p>{user?.user?.firstName}</p>
            )}
          </div>
          <div className="info-item">
            <label>Last Name</label>
            {isEditingProfile ? (
              <input
                name="lastName"
                value={editForm.lastName}
                onChange={handeEditChange}
                style={{
                  width: "100%",
                  padding: "5px",
                  background: "#1a1a2e",
                  border: "1px solid #333",
                  color: "white",
                  borderRadius: "4px",
                }}
              />
            ) : (
              <p>{user?.user?.lastName}</p>
            )}
          </div>
          <div className="info-item">
            <label>Email</label>
            <p>{user?.user?.email}</p>
          </div>

          {role === "student" && (
            <>
              <div className="info-item">
                <label>University</label>
                {isEditingProfile ? (
                  <input
                    name="university"
                    value={editForm.university}
                    onChange={handeEditChange}
                    style={{
                      width: "100%",
                      padding: "5px",
                      background: "#1a1a2e",
                      border: "1px solid #333",
                      color: "white",
                      borderRadius: "4px",
                    }}
                  />
                ) : (
                  <p>{user?.userProfile?.university || "Not provided"}</p>
                )}
              </div>
              <div className="info-item">
                <label>Course</label>
                {isEditingProfile ? (
                  <input
                    name="course"
                    value={editForm.course}
                    onChange={handeEditChange}
                    style={{
                      width: "100%",
                      padding: "5px",
                      background: "#1a1a2e",
                      border: "1px solid #333",
                      color: "white",
                      borderRadius: "4px",
                    }}
                  />
                ) : (
                  <p>{user?.userProfile?.course || "Not provided"}</p>
                )}
              </div>
            </>
          )}

          {role === "business" && (
            <>
              <div className="info-item">
                <label>Company Name</label>
                {isEditingProfile ? (
                  <input
                    name="company_name"
                    value={editForm.company_name}
                    onChange={handeEditChange}
                    style={{
                      width: "100%",
                      padding: "5px",
                      background: "#1a1a2e",
                      border: "1px solid #333",
                      color: "white",
                      borderRadius: "4px",
                    }}
                  />
                ) : (
                  <p>{user?.userProfile?.company_name || "Not provided"}</p>
                )}
              </div>
              <div className="info-item" style={{ gridColumn: "1 / -1" }}>
                <label>Company Description</label>
                {isEditingProfile ? (
                  <textarea
                    name="company_description"
                    value={editForm.company_description}
                    onChange={handeEditChange}
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "5px",
                      background: "#1a1a2e",
                      border: "1px solid #333",
                      color: "white",
                      borderRadius: "4px",
                      resize: "vertical",
                    }}
                  />
                ) : (
                  <p>
                    {user?.userProfile?.company_description || "Not provided"}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserPage;

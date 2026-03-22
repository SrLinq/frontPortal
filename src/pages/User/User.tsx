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
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await get<any>(`/users`);
        setUser(userData);
        if (userData) {
          setEditForm({
            firstName: userData.user?.firstName || "",
            lastName: userData.user?.lastName || "",
            university: userData.userProfile?.university || "",
            course: userData.userProfile?.course || "",
            portfolio_link:
              userData.userProfile?.portfolio_link?.join(", ") || "",
            company_name: userData.userProfile?.company_name || "",
            company_description: userData.userProfile?.company_description || "",
          });
        }
      } catch (error) {
        showNotification("Failed to fetch profile data", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await post<any>("/minio/upload/avatars", formData);
      if (uploadRes && uploadRes.url) {
        const backendUrl = "http://89.167.66.23:9000";
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
        showNotification("Avatar updated successfully!");
      }
    } catch (error) {
      showNotification("Failed to upload avatar", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handeEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    try {
      let updateProfileData: any = {};
      if (role === "student") {
        updateProfileData = {
          university: editForm.university,
          course: editForm.course,
          portfolio_link: editForm.portfolio_link
            ? editForm.portfolio_link
                .split(",")
                .map((l: string) => l.trim())
                .filter((l: string) => l !== "")
            : [],
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
      showNotification("Profile saved successfully!");
    } catch (error) {
      showNotification("Failed to save profile", "error");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (isLoading) {
    return (
      <div className="user-page">
        <h1 className="skeleton skeleton-text" style={{ width: '200px' }}></h1>
        <div className="profile-sidebar user-card">
          <div className="avatar-glow-container skeleton-avatar skeleton"></div>
          <div className="skeleton skeleton-text" style={{ width: '150px', margin: '20px auto' }}></div>
          <div className="skeleton skeleton-text" style={{ width: '100px', margin: '10px auto' }}></div>
          <div className="skills-container">
            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ width: '60px', height: '25px', borderRadius: '20px' }}></div>)}
          </div>
        </div>
        <div className="profile-main user-card">
          <div className="skeleton skeleton-text" style={{ width: '200px', marginBottom: '30px' }}></div>
          <div className="info-grid">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="info-item">
                <div className="skeleton skeleton-text" style={{ width: '50px' }}></div>
                <div className="skeleton skeleton-text"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-page">
      {notification && (
        <div className={`notification ${notification.type}`} style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '10px 20px',
          borderRadius: '8px',
          background: notification.type === 'success' ? '#00f2fe' : '#f5576c',
          color: '#fff',
          zIndex: 1000,
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          animation: 'slideIn 0.3s ease-out'
        }}>
          {notification.message}
        </div>
      )}
      <h1>User Profile</h1>

      <div className="profile-sidebar user-card">
        <div
          className="avatar-glow-container"
          onClick={() => fileInputRef.current?.click()}
          style={{ cursor: "pointer" }}
        >
          {isUploading && (
            <div className="uploading-spinner">
              <div className="spinner"></div>
            </div>
          )}
          {user?.userProfile?.avatar || user?.userProfile?.company_logo ? (
            <img
              src={user?.userProfile?.avatar || user?.userProfile?.company_logo}
              alt="Avatar"
            />
          ) : (
            <div className="avatar-placeholder">
              {user?.user?.firstName?.[0]}{user?.user?.lastName?.[0]}
            </div>
          )}
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
                <span key={index} className="skill-badge">
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
              onClick={() => setIsEditingProfile(true)}
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
            if (currentSkills.includes(newSkill)) return;
            const updatedSkills = [...currentSkills, newSkill];

            try {
              await patch("/users/profile", { skills: updatedSkills });
              setUser((prev: any) => ({
                ...prev,
                userProfile: {
                  ...prev.userProfile,
                  skills: updatedSkills,
                },
              }));
              showNotification("Skill added!");
            } catch (error) {
              showNotification("Failed to add skill", "error");
            }

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
              className="add-action-btn"
              style={{ borderRadius: '4px' }}
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
                className="edit-input"
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
                className="edit-input"
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
                    className="edit-input"
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
                    className="edit-input"
                  />
                ) : (
                  <p>{user?.userProfile?.course || "Not provided"}</p>
                )}
              </div>
              <div className="info-item">
                <label>Portfolio Links</label>
                {isEditingProfile ? (
                  <input
                    name="portfolio_link"
                    value={editForm.portfolio_link || ""}
                    onChange={handeEditChange}
                    placeholder="https://github.com/..., https://linkedin.com/..."
                    className="edit-input"
                  />
                ) : (
                  <p>
                    {user?.userProfile?.portfolio_link &&
                    user.userProfile.portfolio_link.length > 0
                      ? user.userProfile.portfolio_link.map(
                          (link: string, i: number) => (
                            <span key={i}>
                              <a
                                href={link}
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: "#00f2fe" }}
                              >
                                {link}
                              </a>
                              {i < user.userProfile!.portfolio_link!.length - 1
                                ? ", "
                                : ""}
                            </span>
                          ),
                        )
                      : "Not provided"}
                  </p>
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
                    className="edit-input"
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
                    className="edit-input"
                    style={{ resize: "vertical" }}
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

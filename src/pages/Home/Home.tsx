/**
 * Home / Landing Page
 * Displays login form and registration modal.
 * Redirects authenticated users to their profile page.
 */
import { useState } from "react";
import toast from "react-hot-toast";
import { post } from "../../api/api";
import { useAuthStore } from "../../store/authStore";
import type { AuthResponse } from "../../types";
import "./Home.css";

function FirstPage() {
  const { isAuthenticated, login } = useAuthStore();

  // Redirect if already logged in
  if (isAuthenticated) {
    window.location.href = "/user";
  }

  // Modal visibility state
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [userType, setUserType] = useState<"student" | "business">("student");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Registration form state
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  /** Submit login credentials and store JWT token on success */
  const handleLogin = async () => {
    const data = await post<AuthResponse>("/auth/login", {
      email: loginEmail,
      password: loginPassword,
    });

    if (data) {
      toast.success("Welcome back!");
      login(data.role, data.access_token);
      window.location.href = "/user";
    }
  };

  /** Validate and submit registration form */
  const handleRegister = async () => {
    if (regPassword !== regConfirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const data = await post<AuthResponse>("/auth/register", {
      email: regEmail,
      password: regPassword,
      role: userType,
      firstName: regFirstName,
      lastName: regLastName,
    });

    if (data) {
      toast.success("Account created successfully!");
      login(data.role, data.access_token);
      window.location.href = "/user";
    }
  };

  const openSignUp = () => setIsSignUpOpen(true);
  const closeSignUp = () => setIsSignUpOpen(false);

  return (
    <div className="first-page">
      <div className="hero-section">
        <h1>Welcome to the Student Freelance Platform</h1>
        <p className="hero-subtitle">
          Connect, collaborate, and build your portfolio with real-world
          projects.
        </p>

        <div className="hero-actions">
          <div className="login-card">
            <h3>Sign In</h3>

            <input
              type="email"
              placeholder="Email address"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button className="primary-btn" onClick={handleLogin}>
              Login
            </button>
            <p className="toggle-text">
              Don't have an account?{" "}
              <span onClick={openSignUp} className="text-link">
                Sign Up
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Registration modal overlay */}
      {isSignUpOpen && (
        <div className="modal-overlay" onClick={closeSignUp}>
          <div
            className="modal-content bubble-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={closeSignUp}>
              &times;
            </button>
            <div className="modal-header">
              <h2>Join the Network</h2>
              <p>Create your {userType} account</p>
            </div>

            <div className="modal-body">
              {/* Role selection toggle */}
              <div className="type-toggle">
                <button
                  className={`toggle-option ${userType === "student" ? "active" : ""}`}
                  onClick={() => setUserType("student")}
                >
                  Student
                </button>
                <button
                  className={`toggle-option ${userType === "business" ? "active" : ""}`}
                  onClick={() => setUserType("business")}
                >
                  Business
                </button>
              </div>

              <div className="input-group">
                <input
                  type="text"
                  placeholder="First Name"
                  value={regFirstName}
                  onChange={(e) => setRegFirstName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={regLastName}
                  onChange={(e) => setRegLastName(e.target.value)}
                />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
              />
              <button
                className="primary-btn full-width"
                onClick={handleRegister}
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FirstPage;

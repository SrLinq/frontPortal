import { useState } from "react";
import { post } from "../api/api";
import "./Home.css";

function FirstPage() {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [userType, setUserType] = useState<"student" | "business">("student");

  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register State
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  const handleLogin = async () => {
    const data = (await post("/auth/login", {
      email: loginEmail,
      password: loginPassword,
    })) as { access_token?: string; token?: string };

    if (data) {
      console.log("Login success:", data);
      localStorage.setItem(
        "authToken",
        data.access_token || data.token || "dummy_token",
      );
      window.location.href = "/jobs";
    }
  };

  const handleRegister = async () => {
    if (regPassword !== regConfirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const data = await post("/auth/register", {
      email: regEmail,
      password: regPassword,
      role: userType,
      firstName: regFirstName,
      lastName: regLastName,
    });
    if (data) {
      console.log("Register success:", data);
      closeSignUp();
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

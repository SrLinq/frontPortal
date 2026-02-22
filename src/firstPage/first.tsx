import { useState } from "react";
import "./first.css";

function FirstPage() {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

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
            <input type="email" placeholder="Email address" />
            <input type="password" placeholder="Password" />
            <button className="primary-btn">Login</button>
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
              <p>Create your student freelancer account</p>
            </div>

            <div className="modal-body">
              <div className="input-group">
                <input type="text" placeholder="First Name" />
                <input type="text" placeholder="Last Name" />
              </div>
              <input type="email" placeholder="University Email" />
              <input type="password" placeholder="Password" />
              <input type="password" placeholder="Confirm Password" />
              <button className="primary-btn full-width">Create Account</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FirstPage;

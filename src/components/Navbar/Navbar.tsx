import { useAuthStore } from "../../store/authStore";
import Navigate from "../NavigationButton/NavigationButton";
import "./Navbar.css";

function Navbar() {
  const { isAuthenticated, role, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  if (isAuthenticated) {
    return (
      <div className="navbar">
        {role === "student" && (
          <>
            <Navigate button="Jobs" path="/jobs" />
            <Navigate button="Projects" path="/projects" />
          </>
        )}

        {role === "business" && (
          <>
            <Navigate button="Jobs" path="/jobs" />
            <Navigate button="Freelancers" path="/freelancers" />
            <Navigate button="My Projects" path="/projects" />
            <Navigate button="Post a Job" path="/post-job" />
          </>
        )}

        <Navigate button="Profile" path="/user" />
        <div className="logout-btn">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    );
  }
  return (
    <div className="navbar">
      <Navigate button="Home" path="/" />
      <Navigate button="Jobs" path="/jobs" />
      <Navigate button="Freelancers" path="/freelancers" />
    </div>
  );
}

export default Navbar;

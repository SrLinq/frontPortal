import Navigate from "../NavigationButton/NavigationButton";
import "./Navbar.css";

function Navbar() {
  const userLogedIn = !!localStorage.getItem("authToken");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };

  if (userLogedIn) {
    return (
      <div className="navbar">
        <Navigate button="Jobs" path="/jobs" />
        <Navigate button="Freelancers" path="/freelancers" />
        <Navigate button="Projects" path="/projects" />
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

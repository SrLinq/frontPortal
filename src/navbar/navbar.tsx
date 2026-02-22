import Navigate from "../navigate";
import "./navbar.css";

function Navbar() {
  return (
    <div>
      <Navigate button="Home" path="/" />
      <Navigate button="Jobs" path="/jobs" />
      <Navigate button="Freelancers" path="/freelancers" />
      <Navigate button="Projects" path="/projects" />
      <Navigate button="Profile" path="/user" />
    </div>
  );
}

export default Navbar;

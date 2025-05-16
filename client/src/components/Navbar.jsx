import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom"; // ✅ Added Link
import { auth } from "../firebase/firebase";
import "./Navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#111",
    color: "#fff",
    padding: "10px 30px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.8)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  };

  const navLeft = {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  };

  const profileImg = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "2px solid #00ffaa",
    cursor: "pointer",
  };

  const navRight = {
    display: "flex",
    alignItems: "center",
    gap: "30px",
  };

  const titleStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#00ffaa",
    marginLeft: "40px",
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={navStyle}>
      <div style={navLeft}>
        <div style={titleStyle}>Deepfake Detection</div>
      </div>

      <div style={navRight}>
        <Link to="/" className={`nav-link ${isActive("/") ? "active-link" : ""}`}>Home</Link>
        <Link to="/ai-engine" className={`nav-link ${isActive("/ai-engine") ? "active-link" : ""}`}>AI Engine</Link>
        <Link to="/project" className={`nav-link ${isActive("/project") ? "active-link" : ""}`}>Project</Link>
        <Link to="/contact" className={`nav-link ${isActive("/contact") ? "active-link" : ""}`}>Contact</Link>

        {user && (
          <div onClick={() => navigate("/dashboard")}>
            <img
              src={user?.photoURL}
              alt="Profile"
              style={profileImg}
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

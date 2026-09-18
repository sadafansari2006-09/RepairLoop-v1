import { NavLink, Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Button from "./Button";

export default function Navbar() {
  const { role, logout } = useApp();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <svg className="brand-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M3 12l7-8 4 4-7 8-4-4z" />
            <path d="M13 8l4-4 4 4-4 4" />
            <path d="M6 18l3-3" />
          </svg>
          RepairLoop
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>Home</NavLink>
          <NavLink to="/how-it-works" className={({ isActive }) => (isActive ? "active" : "")}>How it works</NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>About</NavLink>
          {role === "customer" && <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>Dashboard</NavLink>}
          {role === "repairer" && <NavLink to="/repairer/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>Dashboard</NavLink>}
        </nav>

        <div className="nav-actions">
          {role ? (
            <Button variant="ghost" onClick={handleLogout}>Log out</Button>
          ) : (
            <>
              <Button as={Link} to="/login" variant="ghost">Log in</Button>
              <Button as={Link} to="/register" variant="primary">Get started</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
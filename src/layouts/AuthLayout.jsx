import { Outlet } from "react-router-dom";
import { heroImg } from "../data/mockData";

export default function AuthLayout() {
  return (
    <div className="auth-shell">
      <div className="auth-visual" style={{ backgroundImage: `url(${heroImg})` }}>
        <div className="auth-visual-overlay" />
        <div className="auth-visual-text">
          <h2>Every repair is a second chance.</h2>
          <p style={{ color: "rgba(251,246,236,0.9)" }}>
            Join a community of owners and repairers keeping good things in use.
          </p>
        </div>
      </div>
      <div className="auth-panel">
        <Outlet />
      </div>
    </div>
  );
}
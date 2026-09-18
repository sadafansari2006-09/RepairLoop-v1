import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Button from "../components/Button";

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    login(role);
    navigate(role === "repairer" ? "/repairer/dashboard" : "/dashboard");
  }

  return (
    <div className="auth-form">
      <div className="brand">RepairLoop</div>
      <h2>Welcome back</h2>
      <p style={{ color: "var(--bark-soft)", marginBottom: 32 }}>Log in to track your items and repairs.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">I am logging in as</label>
          <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="customer">An owner with items to repair</option>
            <option value="repairer">A repairer</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
        </div>
        <Button type="submit" variant="primary" block>Log in</Button>
      </form>

      <div className="auth-switch">
        New to RepairLoop? <Link to="/register">Create an account</Link>
      </div>
    </div>
  );
}
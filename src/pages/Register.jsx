import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Button from "../components/Button";

export default function Register() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [role, setRole] = useState("customer");
  const [name, setName] = useState("");
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
      <h2>Create your account</h2>
      <p style={{ color: "var(--bark-soft)", marginBottom: 32 }}>Start giving broken things another life.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">I want to join as</label>
          <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="customer">An owner with items to repair</option>
            <option value="repairer">A repairer</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Full name</label>
          <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" required />
        </div>
        <Button type="submit" variant="primary" block>Create account</Button>
      </form>

      <div className="auth-switch">
        Already have an account? <Link to="/login">Log in</Link>
      </div>
    </div>
  );
}
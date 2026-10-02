import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Button from "../components/Button";
import { supabase } from "../lib/supabase";

export default function Register() {
  const { login } = useApp();
  const navigate = useNavigate();

  const [role, setRole] = useState("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // 1. Create the Supabase Auth account
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        throw signUpError;
      }

      const user = data.user;

      if (!user) {
        throw new Error("Account could not be created.");
      }

      // 2. Save additional user information in profiles
      const profileRole = role === "repairer" ? "repairer" : "owner";

      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: user.id,
            name,
            email,
            role: profileRole,
          },
        ]);

      if (profileError) {
        throw profileError;
      }

      // 3. Keep your existing app login state
      login(role);

      // 4. Go to the correct dashboard
      navigate(
        role === "repairer"
          ? "/repairer/dashboard"
          : "/dashboard"
      );
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-form">
      <div className="brand">RepairLoop</div>

      <h2>Create your account</h2>

      <p style={{ color: "var(--bark-soft)", marginBottom: 32 }}>
        Start giving broken things another life.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">I want to join as</label>

          <select
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="customer">
              An owner with items to repair
            </option>

            <option value="repairer">
              A repairer
            </option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Full name</label>

          <input
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>

          <input
            className="form-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>

          <input
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
          />
        </div>

        {error && (
          <p style={{ color: "#c94c4c", marginBottom: 16 }}>
            {error}
          </p>
        )}

        {success && (
          <p style={{ color: "#4c8c5a", marginBottom: 16 }}>
            {success}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          block
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <div className="auth-switch">
        Already have an account?{" "}
        <Link to="/login">Log in</Link>
      </div>
    </div>
  );
}
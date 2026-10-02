import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Button from "../components/Button";
import { supabase } from "../lib/supabase";

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();

  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      // 1. Login with Supabase Auth
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) {
        throw loginError;
      }

      const user = data.user;

      if (!user) {
        throw new Error("Login failed. User not found.");
      }

      // 2. Get the user's profile
      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

      if (profileError) {
        throw profileError;
      }

      // 3. Use the actual role from the database
      const userRole =
        profile.role === "repairer" ? "repairer" : "customer";

      // Keep frontend AppContext in sync for now
      login(userRole);

      // 4. Redirect based on actual database role
      if (userRole === "repairer") {
        navigate("/repairer/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.message || "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-form">
      <div className="brand">RepairLoop</div>

      <h2>Welcome back</h2>

      <p
        style={{
          color: "var(--bark-soft)",
          marginBottom: 32,
        }}
      >
        Log in to track your items and repairs.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            I am logging in as
          </label>

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
            placeholder="••••••••"
            required
          />
        </div>

        {error && (
          <p
            style={{
              color: "#c94c4c",
              marginBottom: 16,
            }}
          >
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          block
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log in"}
        </Button>
      </form>

      <div className="auth-switch">
        New to RepairLoop?{" "}
        <Link to="/register">Create an account</Link>
      </div>
    </div>
  );
}
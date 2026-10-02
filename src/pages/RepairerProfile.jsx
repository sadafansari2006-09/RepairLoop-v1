import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function RepairerProfile() {
  const [profile, setProfile] = useState(null);
  const [completedJobs, setCompletedJobs] = useState(0);
  const [activeJobs, setActiveJobs] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (!user) {
          throw new Error("You must be logged in.");
        }

        // Load repairer profile
        const { data: profileData, error: profileError } =
          await supabase
            .from("profiles")
            .select(
              "name, email, role, location, shop_name, specialty, member_since, avatar_url, rating"
            )
            .eq("id", user.id)
            .single();

        if (profileError) throw profileError;

        setProfile(profileData);

        // Load this repairer's jobs
        const { data: jobs, error: jobsError } =
          await supabase
            .from("repair_jobs")
            .select("id, status")
            .eq("repairer_id", user.id);

        if (jobsError) throw jobsError;

        const completed =
          jobs?.filter(
            (job) => job.status === "completed"
          ).length || 0;

        const active =
          jobs?.filter(
            (job) =>
              job.status === "assigned" ||
              job.status === "in_progress"
          ).length || 0;

        setCompletedJobs(completed);
        setActiveJobs(active);
      } catch (err) {
        console.error(
          "Error loading repairer profile:",
          err
        );

        setError(
          err.message ||
            "Could not load repairer profile."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="empty-state">
        <h3>Loading profile...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <h3>Could not load profile</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="page-head">
        <div>
          <h1>Repairer profile</h1>
          <p>
            How owners see you on RepairLoop.
          </p>
        </div>
      </div>

      <div className="profile-header">
        <div className="avatar-upload">
          <div
            className="avatar"
            style={
              profile.avatar_url
                ? {
                    backgroundImage: `url(${profile.avatar_url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : {}
            }
          />

          <button
            type="button"
            className="avatar-edit-btn"
            disabled
          >
            Change photo
          </button>
        </div>

        <div>
          <h3 style={{ marginBottom: 2 }}>
            {profile.shop_name ||
              "Repair Shop"}
          </h3>

          <p
            style={{
              margin: 0,
              color: "var(--bark-soft)",
            }}
          >
            {profile.name || "Repairer"}
            {profile.specialty
              ? ` · ${profile.specialty}`
              : ""}
          </p>
        </div>
      </div>

      <div
        className="card"
        style={{ marginBottom: 20 }}
      >
        <div className="form-group">
          <label className="form-label">
            Location
          </label>

          <p style={{ margin: 0 }}>
            {profile.location ||
              "Location not added"}
          </p>
        </div>

        <div
          className="form-group"
          style={{ marginBottom: 0 }}
        >
          <label className="form-label">
            Repairing since
          </label>

          <p style={{ margin: 0 }}>
            {profile.member_since ||
              "Not specified"}
          </p>
        </div>
      </div>

      <div
        className="stat-grid"
        style={{
          gridTemplateColumns:
            "1fr 1fr 1fr",
        }}
      >
        <div className="stat-card">
          <div className="num">
            {profile.rating || 0}
          </div>

          <div className="label">
            Rating
          </div>
        </div>

        <div className="stat-card">
          <div className="num">
            {completedJobs}
          </div>

          <div className="label">
            Jobs completed
          </div>
        </div>

        <div className="stat-card">
          <div className="num">
            {activeJobs}
          </div>

          <div className="label">
            Active on RepairLoop
          </div>
        </div>
      </div>
    </div>
  );
}
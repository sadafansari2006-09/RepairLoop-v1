import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import Photo from "../components/Photo";
import { supabase } from "../lib/supabase";

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadJobs() {
      try {
        setLoading(true);
        setError("");

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          throw new Error("You must be logged in.");
        }

        const response = await fetch(
          "https://repairloop-v1.onrender.com/api/repairer/jobs",
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load jobs."
          );
        }

        setJobs(data.jobs || []);
      } catch (err) {
        console.error("Error loading repairer jobs:", err);

        setError(
          err.message || "Could not load your jobs."
        );
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  if (loading) {
    return (
      <div className="empty-state">
        <h3>Loading your jobs...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <h3>Could not load jobs</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>My jobs</h1>
          <p>Repairs owners have chosen you for.</p>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="empty-state">
          <h3>No jobs yet</h3>
          <p>
            Once an owner chooses your estimate, the job will
            appear here.
          </p>
        </div>
      ) : (
        <div className="row-list">
          {jobs.map((job) => (
            <Link
              key={job.id}
              to={`/repairer/jobs/${job.id}`}
              className="row-card"
            >
              <div className="row-card-main">
                <Photo
                  src={job.image}
                  alt={job.itemName}
                  className="row-thumb"
                />

                <div>
                  <div className="row-title">
                    {job.itemName}
                  </div>

                  <div className="row-sub">
                    {job.category} · Since {job.createdAt}
                  </div>
                </div>
              </div>

              <StatusBadge status={job.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
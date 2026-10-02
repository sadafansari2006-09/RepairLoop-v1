import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import Button from "../components/Button";
import Photo from "../components/Photo";
import { supabase } from "../lib/supabase";

export default function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [request, setRequest] = useState(null);
  const [item, setItem] = useState(null);
  const [estimate, setEstimate] = useState(null);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadJob() {
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
          `http://localhost:5000/api/repairer/jobs/${id}`,
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load job."
          );
        }

        setJob(data.job);
        setRequest(data.request);
        setItem(data.item);
        setEstimate(data.estimate);
      } catch (err) {
        console.error("Error loading job:", err);

        setError(
          err.message || "Could not load this job."
        );
      } finally {
        setLoading(false);
      }
    }

    loadJob();
  }, [id]);

  async function updateStatus(status, notes) {
    try {
      setUpdating(true);
      setError("");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("You must be logged in.");
      }

      const response = await fetch(
        `http://localhost:5000/api/repairer/jobs/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            status,
            notes,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update job."
        );
      }

      setJob(data.job);

      if (request) {
        setRequest({
          ...request,
          status:
            status === "completed"
              ? "completed"
              : "in_progress",
        });
      }
    } catch (err) {
      console.error("Error updating job:", err);

      setError(
        err.message || "Could not update job status."
      );
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="empty-state">
        <h3>Loading job...</h3>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="section container">
        <div className="empty-state">
          <h3>Job not found</h3>
          <p>{error}</p>

          <Link to="/repairer/jobs">
            <Button variant="secondary">
              Back to my jobs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!job || !item) {
    return null;
  }

  const createdDate = new Date(
    job.created_at
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div style={{ maxWidth: 900 }}>
      <div className="page-head">
        <div>
          <div style={{ marginBottom: 8 }}>
            <StatusBadge status={job.status} />
          </div>

          <h1>{item.item_name}</h1>

          <p>
            {item.category} · Since {createdDate}
          </p>
        </div>
      </div>

      {error && (
        <p
          style={{
            color: "#b4533c",
            marginBottom: 24,
          }}
        >
          {error}
        </p>
      )}

      <div
        className="hero-grid"
        style={{
          gap: 40,
          marginBottom: 40,
          gridTemplateColumns: "0.8fr 1.2fr",
        }}
      >
        <Photo
          src={item.image_url}
          alt={item.item_name}
        />

        <div>
          <h3>The problem</h3>

          <p>
            {item.description ||
              "No description provided."}
          </p>

          {estimate && (
            <>
              <h4 style={{ marginTop: 20 }}>
                Your estimate
              </h4>

              <p>
                ₹
                {Number(
                  estimate.amount
                ).toLocaleString("en-IN")}
              </p>

              <p>
                {estimate.message ||
                  "No note provided."}
              </p>
            </>
          )}
        </div>
      </div>

      <h2>Update status</h2>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 40,
        }}
      >
        <Button
          variant="secondary"
          disabled={
            updating ||
            job.status === "in_progress" ||
            job.status === "completed"
          }
          onClick={() =>
            updateStatus(
              "in_progress",
              "Repair is now in progress."
            )
          }
        >
          {updating
            ? "Updating..."
            : "Start repair"}
        </Button>

        <Button
          variant="sage"
          disabled={
            updating ||
            job.status === "completed"
          }
          onClick={() =>
            updateStatus(
              "completed",
              "Repair completed — ready for pickup."
            )
          }
        >
          {job.status === "completed"
            ? "Completed"
            : "Mark completed"}
        </Button>
      </div>

      <h2>Progress</h2>

      <div className="timeline">
        <div
          className={`timeline-step ${
            job.status === "assigned" ||
            job.status === "in_progress" ||
            job.status === "completed"
              ? "done"
              : ""
          }`}
        >
          <h4>Job assigned</h4>

          <div className="ts-date">
            {createdDate}
          </div>
        </div>

        <div
          className={`timeline-step ${
            job.status === "in_progress"
              ? "current"
              : job.status === "completed"
              ? "done"
              : ""
          }`}
        >
          <h4>Repair in progress</h4>
        </div>

        <div
          className={`timeline-step ${
            job.status === "completed"
              ? "done"
              : ""
          }`}
        >
          <h4>Repair completed</h4>
        </div>
      </div>
    </div>
  );
}
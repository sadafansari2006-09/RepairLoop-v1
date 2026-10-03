import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import Button from "../components/Button";
import Photo from "../components/Photo";
import { supabase } from "../lib/supabase";

export default function RepairerDashboard() {
  const [profile, setProfile] = useState(null);
  const [available, setAvailable] = useState([]);
  const [myJobs, setMyJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          throw new Error("You must be logged in.");
        }

        const user = session.user;

        // Get repairer profile
        const { data: profileData, error: profileError } =
          await supabase
            .from("profiles")
            .select("name, email, role")
            .eq("id", user.id)
            .single();

        if (profileError) throw profileError;

        setProfile(profileData);

        // Get open repair requests
        const { data: requestData, error: requestError } =
          await supabase
            .from("repair_requests")
            .select("*")
            .eq("status", "open")
            .order("created_at", { ascending: false });

        if (requestError) throw requestError;

        if (requestData && requestData.length > 0) {
          const itemIds = requestData.map(
            (request) => request.item_id
          );

          const { data: itemData, error: itemError } =
            await supabase
              .from("items")
              .select("*")
              .in("id", itemIds);

          if (itemError) throw itemError;

          const formattedRequests = requestData.map(
            (request) => {
              const item = itemData?.find(
                (item) => item.id === request.item_id
              );

              return {
                id: request.id,
                itemName:
                  item?.item_name || "Unknown item",
                category:
                  item?.category || "Other",
                description:
                  item?.description || "",
                image:
                  item?.image_url || undefined,
                status: request.status,
                createdAt: new Date(
                  request.created_at
                ).toLocaleDateString("en-IN"),
              };
            }
          );

          setAvailable(formattedRequests);
        } else {
          setAvailable([]);
        }

        // Get repairer's assigned jobs
        const jobsResponse = await fetch(
          "https://repairloop-v1.onrender.com/api/repairer/jobs",
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );

        const jobsData = await jobsResponse.json();

        if (!jobsResponse.ok) {
          throw new Error(
            jobsData.message ||
              "Failed to load repairer jobs."
          );
        }

        setMyJobs(jobsData.jobs || []);
      } catch (err) {
        console.error(
          "Repairer dashboard error:",
          err
        );

        setError(
          err.message ||
            "Could not load repairer dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="empty-state">
        <h3>Loading your dashboard...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <h3>Could not load dashboard</h3>
        <p>{error}</p>
      </div>
    );
  }

  const active = myJobs.filter(
    (job) => job.status === "in_progress"
  );

  const completed = myJobs.filter(
    (job) => job.status === "completed"
  );

  const firstName =
    profile?.name?.split(" ")[0] || "there";

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Welcome back, {firstName}</h1>

          <p>
            Repairer dashboard ·{" "}
            {profile?.email || ""}
          </p>
        </div>

        <Button
          as={Link}
          to="/repairer/requests"
          variant="primary"
        >
          View available requests
        </Button>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="num">
            {available.length}
          </div>
          <div className="label">
            Requests open
          </div>
        </div>

        <div className="stat-card">
          <div className="num">
            {active.length}
          </div>
          <div className="label">
            Jobs in progress
          </div>
        </div>

        <div className="stat-card">
          <div className="num">
            {completed.length}
          </div>
          <div className="label">
            Jobs completed
          </div>
        </div>

        <div className="stat-card">
          <div className="num">—</div>
          <div className="label">
            Average rating
          </div>
        </div>
      </div>

      <div
        className="section-head"
        style={{ marginBottom: 24 }}
      >
        <h2>New requests near you</h2>
      </div>

      {available.length === 0 ? (
        <div className="empty-state">
          <h3>No open requests right now</h3>

          <p>
            New repair requests will show up
            here as owners submit them.
          </p>
        </div>
      ) : (
        <div className="row-list">
          {available.slice(0, 4).map((req) => (
            <Link
              key={req.id}
              to="/repairer/requests"
              className="row-card"
            >
              <div className="row-card-main">
                <Photo
                  src={req.image}
                  alt={req.itemName}
                  className="row-thumb"
                />

                <div>
                  <div className="row-title">
                    {req.itemName}
                  </div>

                  <div className="row-sub">
                    {req.category} · Submitted{" "}
                    {req.createdAt}
                  </div>
                </div>
              </div>

              <StatusBadge status={req.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
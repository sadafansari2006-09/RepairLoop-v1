import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import Button from "../components/Button";
import Photo from "../components/Photo";
import { supabase } from "../lib/supabase";

export default function RepairRequestDetails() {
  const { id } = useParams();

  const [request, setRequest] = useState(null);
  const [item, setItem] = useState(null);
  const [estimates, setEstimates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectingEstimate, setSelectingEstimate] = useState(null);

  useEffect(() => {
    async function loadRequest() {
      try {
        setLoading(true);
        setError("");

        // Get logged-in user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          throw new Error("You must be logged in.");
        }

        // Get this user's repair request
        const { data: requestData, error: requestError } =
          await supabase
            .from("repair_requests")
            .select("*")
            .eq("id", id)
            .eq("owner_id", user.id)
            .single();

        if (requestError) {
          throw requestError;
        }

        setRequest(requestData);

        // Get the item connected to this request
        const { data: itemData, error: itemError } =
          await supabase
            .from("items")
            .select("*")
            .eq("id", requestData.item_id)
            .single();

        if (itemError) {
          throw itemError;
        }

        setItem(itemData);

        // Get estimates for this request
        const { data: estimateData, error: estimateError } =
          await supabase
            .from("estimates")
            .select("*")
            .eq("request_id", id)
            .order("created_at", { ascending: true });

        if (estimateError) {
          throw estimateError;
        }

        setEstimates(estimateData || []);
      } catch (err) {
        console.error("Error loading repair request:", err);

        setError(
          err.message || "Could not load repair request."
        );
      } finally {
        setLoading(false);
      }
    }

    loadRequest();
  }, [id]);

async function chooseRepairer(estimateId) {
  try {
    setSelectingEstimate(estimateId);
    setError("");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("You must be logged in.");
    }

    const response = await fetch(
      "https://repairloop-v1.onrender.com/api/repair-jobs",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          requestId: request.id,
          estimateId,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to choose repairer."
      );
    }

    console.log("Repairer selected:", data);

    // Update the page immediately
    setRequest((current) => ({
      ...current,
      status: "in_progress",
    }));

    setEstimates((currentEstimates) =>
      currentEstimates.map((estimate) => ({
        ...estimate,
        status:
          estimate.id === estimateId
            ? "accepted"
            : "rejected",
      }))
    );
  } catch (err) {
    console.error("Error choosing repairer:", err);

    setError(
      err.message || "Could not choose repairer."
    );
  } finally {
    setSelectingEstimate(null);
  }
}

  if (loading) {
    return (
      <div className="section container">
        <div className="empty-state">
          <h3>Loading repair request...</h3>
        </div>
      </div>
    );
  }

  if (error || !request || !item) {
    return (
      <div className="section container">
        <div className="empty-state">
          <h3>Request not found</h3>

          <p>
            {error || "This repair request could not be found."}
          </p>

          <Link to="/repair-requests">
            <Button variant="secondary">
              Back to requests
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const submittedDate = new Date(
    request.created_at
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className="section container"
      style={{ maxWidth: 900 }}
    >
      {/* Header */}
      <div className="page-head">
        <div>
          <div style={{ marginBottom: 8 }}>
            <StatusBadge status={request.status} />
          </div>

          <h1>{item.item_name}</h1>

          <p>
            {item.category} · Submitted {submittedDate}
          </p>
        </div>
      </div>

      {/* Item details */}
      <div
        className="hero-grid"
        style={{
          gap: 40,
          marginBottom: 48,
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
            {item.description || "No description provided."}
          </p>
        </div>
      </div>

      {/* Estimates */}
      <h2>Estimates</h2>

      {estimates.length === 0 ? (
        <div
          className="empty-state"
          style={{ marginBottom: 40 }}
        >
          <h3>Waiting on estimates</h3>

          <p>
            Repairers nearby have been notified and will
            respond soon.
          </p>
        </div>
      ) : (
        <div style={{ marginBottom: 48 }}>
          {estimates.map((estimate) => (
            <div
              key={estimate.id}
              className="estimate-card"
            >
              <div>
                <div className="row-title">
                  Repairer
                </div>

                <div className="row-sub">
                  Estimate submitted{" "}
                  {new Date(
                    estimate.created_at
                  ).toLocaleDateString("en-IN")}
                </div>

                <p
                  style={{
                    margin: "8px 0 0",
                    maxWidth: "50ch",
                  }}
                >
                  {estimate.message ||
                    "No message provided."}
                </p>
              </div>

              <div
                style={{
                  textAlign: "right",
                  flexShrink: 0,
                }}
              >
                <div className="estimate-price">
                  ₹
                  {Number(
                    estimate.amount
                  ).toLocaleString("en-IN")}
                </div>

                <span
                  className={`badge badge-${estimate.status}`}
                  style={{ marginTop: 8 }}
                >
                  {estimate.status}
                </span>
                {estimate.status === "pending" &&
  request.status === "open" && (
    <div style={{ marginTop: 16 }}>
      <Button
        variant="primary"
        size="sm"
        onClick={() =>
          chooseRepairer(estimate.id)
        }
        disabled={selectingEstimate === estimate.id}
      >
        {selectingEstimate === estimate.id
          ? "Choosing..."
          : "Choose this repairer"}
      </Button>
    </div>
  )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Progress */}
      <h2>Progress</h2>

      <div className="timeline">
        {/* Submitted */}
        <div className="timeline-step done">
          <h4>Repair request submitted</h4>

          <div className="ts-date">
            {submittedDate}
          </div>
        </div>

        {/* Waiting */}
        <div
          className={`timeline-step ${
            request.status === "open"
              ? "current"
              : request.status === "in_progress" ||
                request.status === "completed"
              ? "done"
              : ""
          }`}
        >
          <h4>Waiting for estimates</h4>
        </div>

        {/* In progress */}
        <div
          className={`timeline-step ${
            request.status === "in_progress"
              ? "current"
              : request.status === "completed"
              ? "done"
              : ""
          }`}
        >
          <h4>Repair in progress</h4>
        </div>

        {/* Completed */}
        <div
          className={`timeline-step ${
            request.status === "completed"
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
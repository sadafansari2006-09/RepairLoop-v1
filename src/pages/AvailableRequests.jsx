import { useEffect, useState } from "react";
import Button from "../components/Button";
import Photo from "../components/Photo";
import { supabase } from "../lib/supabase";

export default function AvailableRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openForm, setOpenForm] = useState(null);
  const [price, setPrice] = useState("");
  const [days, setDays] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadAvailableRequests() {
      try {
        setLoading(true);
        setError("");

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (!user) {
          setRequests([]);
          return;
        }

        /*
          Get repair requests that are still open.
        */
        const { data: requestData, error: requestError } =
          await supabase
            .from("repair_requests")
            .select("*")
            .eq("status", "open")
            .order("created_at", { ascending: false });

        if (requestError) throw requestError;

        if (!requestData || requestData.length === 0) {
          setRequests([]);
          return;
        }

        /*
          Get the items belonging to those requests.
        */
        const itemIds = requestData.map(
          (request) => request.item_id
        );

        const { data: itemData, error: itemError } =
          await supabase
            .from("items")
            .select("*")
            .in("id", itemIds);

        if (itemError) throw itemError;

        /*
          Convert database data into the shape
          our existing UI expects.
        */
        const formattedRequests = requestData.map((request) => {
          const item = itemData?.find(
            (item) => item.id === request.item_id
          );

          return {
            id: request.id,
            itemName: item?.item_name || "Unknown item",
            category: item?.category || "Other",
            description: item?.description || "",
            image: item?.image_url || undefined,
            status: request.status,
            createdAt: new Date(
              request.created_at
            ).toLocaleDateString("en-IN"),
          };
        });

        setRequests(formattedRequests);
      } catch (err) {
        console.error(
          "Error loading available requests:",
          err
        );

        setError(
          err.message || "Could not load available requests."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAvailableRequests();
  }, []);

async function handleSubmit(requestId) {
  if (!price || !days) {
    return;
  }

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("You must be logged in.");
    }

    const response = await fetch(
      "https://repairloop-v1.onrender.com/api/estimates",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          requestId,
          amount: Number(price),
          message: `${message} Turnaround: ${days} days.`,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to submit estimate."
      );
    }

    console.log("Estimate submitted:", data);

    setOpenForm(null);
    setPrice("");
    setDays("");
    setMessage("");

    setRequests((currentRequests) =>
      currentRequests.filter(
        (request) => request.id !== requestId
      )
    );
  } catch (err) {
    console.error("Error submitting estimate:", err);

    setError(
      err.message || "Could not submit estimate."
    );
  }
}

  if (loading) {
    return (
      <div className="empty-state">
        <h3>Loading available requests...</h3>
      </div>
    );
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Available requests</h1>
          <p>
            Repair requests from owners nearby, waiting on an
            estimate.
          </p>
        </div>
      </div>

      {error && (
        <p
          style={{
            color: "#b4533c",
            marginBottom: "24px",
          }}
        >
          {error}
        </p>
      )}

      {requests.length === 0 ? (
        <div className="empty-state">
          <h3>Nothing open right now</h3>
          <p>
            Check back soon. New requests appear here as owners
            submit them.
          </p>
        </div>
      ) : (
        <div className="row-list">
          {requests.map((req) => (
            <div key={req.id} className="card">
              <div
                className="row-card-main"
                style={{
                  marginBottom:
                    openForm === req.id ? 20 : 0,
                }}
              >
                <Photo
                  src={req.image}
                  alt={req.itemName}
                  className="row-thumb"
                />

                <div style={{ flex: 1 }}>
                  <div className="row-title">
                    {req.itemName}
                  </div>

                  <div className="row-sub">
                    {req.category} · Submitted{" "}
                    {req.createdAt}
                  </div>

                  <p
                    style={{
                      margin: "8px 0 0",
                      fontSize: "0.92rem",
                    }}
                  >
                    {req.description}
                  </p>
                </div>

                {openForm !== req.id && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() =>
                      setOpenForm(req.id)
                    }
                  >
                    Submit estimate
                  </Button>
                )}
              </div>

              {openForm === req.id && (
                <div
                  style={{
                    borderTop:
                      "1px solid var(--border)",
                    paddingTop: 20,
                  }}
                >
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        Price (₹)
                      </label>

                      <input
                        className="form-input"
                        type="number"
                        value={price}
                        onChange={(e) =>
                          setPrice(e.target.value)
                        }
                        placeholder="2400"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Turnaround (days)
                      </label>

                      <input
                        className="form-input"
                        type="number"
                        value={days}
                        onChange={(e) =>
                          setDays(e.target.value)
                        }
                        placeholder="3"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Note to owner
                    </label>

                    <textarea
                      className="form-textarea"
                      value={message}
                      onChange={(e) =>
                        setMessage(e.target.value)
                      }
                      placeholder="What you'll do and why"
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                    }}
                  >
                    <Button
                      variant="primary"
                      onClick={() =>
                        handleSubmit(req.id)
                      }
                    >
                      Send estimate
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() =>
                        setOpenForm(null)
                      }
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
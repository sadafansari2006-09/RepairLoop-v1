import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import StatusBadge from "../components/StatusBadge";
import Button from "../components/Button";
import Photo from "../components/Photo";

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [relatedRequest, setRelatedRequest] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadItem() {
      try {
        setLoading(true);
        setError("");

        // Get logged-in user
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          throw new Error("You must be logged in.");
        }

        // Get the real item from Supabase
        const { data: itemData, error: itemError } =
          await supabase
            .from("items")
            .select("*")
            .eq("id", id)
            .eq("owner_id", session.user.id)
            .single();

        if (itemError) {
          throw itemError;
        }

        setItem(itemData);

        // Get related repair request, if one exists
        const {
          data: requestData,
          error: requestError,
        } = await supabase
          .from("repair_requests")
          .select("*")
          .eq("item_id", id)
          .eq("owner_id", session.user.id)
          .maybeSingle();

        if (requestError) {
          console.error(
            "Error loading repair request:",
            requestError
          );
        }

        setRelatedRequest(requestData || null);
      } catch (err) {
        console.error("Error loading item:", err);

        setError(
          err.message || "Unable to load this item."
        );
      } finally {
        setLoading(false);
      }
    }

    loadItem();
  }, [id]);

  async function handleRequestRepair() {
    try {
      setError("");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("You must be logged in.");
      }

      const response = await fetch(
        "http://localhost:5000/api/repair-requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            itemId: item.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create repair request."
        );
      }

      const createdRequest = data.request;

      if (!createdRequest) {
        throw new Error(
          "Repair request was created but no request data was returned."
        );
      }

      navigate(
        `/repair-requests/${createdRequest.id}`
      );
    } catch (err) {
      console.error(
        "Create repair request error:",
        err
      );

      setError(
        err.message ||
          "Failed to create repair request."
      );
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="section container">
        <div className="empty-state">
          <h3>Loading item...</h3>
        </div>
      </div>
    );
  }

  // Item not found
  if (!item) {
    return (
      <div className="section container">
        <div className="empty-state">
          <h3>Item not found</h3>

          <Link to="/my-items">
            <Button variant="secondary">
              Back to my items
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="section container"
      style={{ maxWidth: 900 }}
    >
      <div
        className="hero-grid"
        style={{
          gap: 40,
          marginBottom: 40,
        }}
      >
        <Photo
          src={item.image_url}
          alt={item.item_name}
        />

        <div>
          <StatusBadge status={item.status} />

          <h1 style={{ marginTop: 12 }}>
            {item.item_name}
          </h1>

          <p
            style={{
              color: "var(--bark-soft)",
            }}
          >
            {item.category}
          </p>

          <p>{item.description}</p>

          {error && (
            <p
              style={{
                color: "#b4533c",
                marginBottom: 16,
              }}
            >
              {error}
            </p>
          )}

          {relatedRequest ? (
            <Button
              as={Link}
              to={`/repair-requests/${relatedRequest.id}`}
              variant="primary"
            >
              View repair request
            </Button>
          ) : (
            <Button
              onClick={handleRequestRepair}
              variant="primary"
            >
              Create repair request
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}